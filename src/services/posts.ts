import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { collections, getDb } from "./firebase";
import type { Post, PostStatus, PostType, SeoMeta } from "../core/types";

const postsCollection = () => collection(getDb(), collections.posts);
const postDoc = (id: string) => doc(getDb(), collections.posts, id);

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// NOTE: the legacy `subscribeToPosts` global subscription was
// removed in favor of `subscribeToPostsPaginated` (display use) +
// `fetchAllPosts` (publish use). See the bottom of this file.

export interface CreatePostInput {
  type: PostType;
  title: string;
  slug: string;
  contentMarkdown?: string;
  excerpt?: string;
  heroMediaId?: string;
  authorId: string;
  termIds?: string[];
  primaryTermId?: string;
  seo?: SeoMeta;
}

export async function createPost(input: CreatePostInput): Promise<string> {
  const id = newId();
  const data: Record<string, unknown> = {
    type: input.type,
    title: input.title,
    slug: input.slug,
    contentMarkdown: input.contentMarkdown ?? "",
    authorId: input.authorId,
    termIds: input.termIds ?? [],
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (input.excerpt) data.excerpt = input.excerpt;
  if (input.heroMediaId) data.heroMediaId = input.heroMediaId;
  if (input.primaryTermId) data.primaryTermId = input.primaryTermId;
  if (input.seo) data.seo = input.seo;
  await setDoc(postDoc(id), data);
  invalidateAllPostsCache();
  return id;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  contentMarkdown?: string;
  excerpt?: string | null;
  heroMediaId?: string | null;
  termIds?: string[];
  primaryTermId?: string | null;
  seo?: SeoMeta;
}

export async function updatePost(id: string, patch: UpdatePostInput): Promise<void> {
  const update: Record<string, unknown> = { updatedAt: serverTimestamp() };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    update[key] = value;
  }
  await updateDoc(postDoc(id), update);
  invalidateAllPostsCache();
}

// Used by the publisher to record where the page was uploaded and the hash
// of its rendered HTML. Status transitions are also done here so all
// publish-related fields are written together. `previousPublishedPaths`
// carries historical paths whose deletion failed during this publish —
// they get retried on the next publish.
export async function markPostOnline(
  id: string,
  fields: {
    lastPublishedPath: string;
    lastPublishedHash: string;
    previousPublishedPaths?: string[];
  },
): Promise<void> {
  await updateDoc(postDoc(id), {
    status: "online",
    publishedAt: serverTimestamp(),
    lastPublishedPath: fields.lastPublishedPath,
    lastPublishedHash: fields.lastPublishedHash,
    previousPublishedPaths: fields.previousPublishedPaths ?? [],
    updatedAt: serverTimestamp(),
  });
  invalidateAllPostsCache();
}

export async function markPostDraft(id: string): Promise<void> {
  await updateDoc(postDoc(id), {
    status: "draft",
    lastPublishedPath: null,
    lastPublishedHash: null,
    previousPublishedPaths: [],
    updatedAt: serverTimestamp(),
  });
  invalidateAllPostsCache();
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(postDoc(id));
  invalidateAllPostsCache(); // any cached fetchAllPosts result is now stale
}

// ─── Server-side paginated query API ───────────────────────────────
//
// Used by the post / page list pages so the admin doesn't pull the
// entire corpus into memory on mount. The publish pipeline still
// needs the full set; for that, see fetchAllPosts() below.
//
// All sorting is server-side on `createdAt desc` — stable (a post's
// position in the list doesn't shuffle when its content is edited)
// and matches a single composite index `(type, createdAt)` for the
// "all" filter and `(type, status, createdAt)` for the "draft" /
// "online" filters. See README "Firestore indexes" for the gcloud
// commands to create these.

export interface PaginatedQueryOpts {
  type: PostType;
  // Optional status filter. When unset, the query covers all
  // statuses ("all" tab in the list page).
  status?: PostStatus;
  // Max docs in a single page. The list pages pass 100.
  pageSize: number;
  // Cursor returned by the previous page. Pass undefined for the
  // first page; pass `result.nextCursor` for subsequent pages.
  cursor?: QueryDocumentSnapshot<DocumentData>;
}

export interface PaginatedQueryResult {
  posts: Post[];
  // Snapshot of the last doc on this page. Feed back into a
  // subsequent call to get the next page. Undefined when the page
  // is the last (or empty).
  nextCursor?: QueryDocumentSnapshot<DocumentData>;
}

function buildPaginatedQuery(opts: PaginatedQueryOpts) {
  const constraints: QueryConstraint[] = [where("type", "==", opts.type)];
  if (opts.status) constraints.push(where("status", "==", opts.status));
  constraints.push(orderBy("createdAt", "desc"));
  if (opts.cursor) constraints.push(startAfter(opts.cursor));
  constraints.push(fsLimit(opts.pageSize));
  return query(postsCollection(), ...constraints);
}

// Real-time subscription to a paginated slice. The callback fires
// initially with the page's data, then again whenever a doc on this
// page changes (edit / delete) or a doc upstream of the cursor
// changes (which can shift this page's contents).
export function subscribeToPostsPaginated(
  opts: PaginatedQueryOpts,
  onChange: (result: PaginatedQueryResult) => void,
  onError?: (err: Error) => void,
): () => void {
  return onSnapshot(
    buildPaginatedQuery(opts),
    (snap) => {
      const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
      const nextCursor =
        snap.docs.length === opts.pageSize ? snap.docs[snap.docs.length - 1] : undefined;
      onChange({ posts, nextCursor });
    },
    onError,
  );
}

// ─── One-shot full-corpus fetch with cache ─────────────────────────
//
// The publisher pipeline + the "force regenerate" buttons in plugins
// + the various pickers (menu items, hero featured post, static-page
// home selector) need all posts at once. With the global subscription
// gone, they call this on demand. Results are cached for 30 s so a
// burst of operations (publish 5 posts in a row, force regenerate
// triggers cascading regen) doesn't fan out into 5 fetches.
//
// Cache invalidates on every write (createPost / updatePost /
// markPostOnline / markPostDraft / deletePost) so the next caller
// sees fresh data. The 30 s TTL is the bound for staleness from
// other admins' writes; for a single-admin site that's effectively
// "fresh while the user is interacting".

interface CacheEntry {
  posts: Post[];
  expiresAt: number;
}

const CACHE_TTL_MS = 30_000;
const allPostsCache = new Map<PostType, CacheEntry>();
// In-flight promise dedup: if 5 callers ask for fetchAllPosts in the
// same tick, they all await the same Firestore read.
const inFlight = new Map<PostType, Promise<Post[]>>();

export async function fetchAllPosts(opts: { type: PostType }): Promise<Post[]> {
  const now = Date.now();
  const cached = allPostsCache.get(opts.type);
  if (cached && cached.expiresAt > now) {
    return cached.posts;
  }
  const existing = inFlight.get(opts.type);
  if (existing) return existing;
  const promise = (async () => {
    try {
      const snap = await getDocs(
        query(
          postsCollection(),
          where("type", "==", opts.type),
          orderBy("createdAt", "desc"),
        ),
      );
      const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
      allPostsCache.set(opts.type, { posts, expiresAt: Date.now() + CACHE_TTL_MS });
      return posts;
    } finally {
      inFlight.delete(opts.type);
    }
  })();
  inFlight.set(opts.type, promise);
  return promise;
}

// Invalidates both type caches. Called from every mutation in this
// module; exposed so the import plugin / migration scripts can also
// flush after a batch.
export function invalidateAllPostsCache(): void {
  allPostsCache.clear();
}

// ─── Aggregation: count without reading the docs ───────────────────
//
// Firestore aggregation queries return a single number per query,
// billed at 1 read each. Used for dashboard stats and sidebar
// badges so the admin doesn't fetch entire collections just to
// display a count.

export async function countPosts(opts: {
  type: PostType;
  status?: PostStatus;
}): Promise<number> {
  const constraints: QueryConstraint[] = [where("type", "==", opts.type)];
  if (opts.status) constraints.push(where("status", "==", opts.status));
  const snap = await getCountFromServer(query(postsCollection(), ...constraints));
  return snap.data().count;
}
