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

// ─── Global subscription (paginationMode = "global") ──────────────
//
// Subscribes to the entire `posts` collection ordered by `createdAt`.
// Single-field orderBy ⇒ covered by Firestore's automatic single-field
// index, so this works on a fresh project with NO admin index setup.
// Returns BOTH posts and pages — the caller filters by `type` in
// memory; the trade-off is one extra read of the page docs (cheap
// because pages are typically a handful of docs).
//
// The "paginated" mode bypasses this and uses subscribeToPostsPaginated
// per filtered tab; that mode requires composite indexes (see below).
export function subscribeToPosts(
  onChange: (posts: Post[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return onSnapshot(
    query(postsCollection(), orderBy("createdAt", "desc")),
    (snap) => {
      const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
      // Keep fetchAllPosts's cache in sync so non-React consumers
      // (publisher, plugin generators) read fresh data without an
      // extra fetch while the global subscription is active.
      primeAllPostsCache(posts);
      onChange(posts);
    },
    onError,
  );
}

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
  // Optional creation timestamp override. Used by the import plugin
  // to preserve the original publication date from the source file
  // (markdown frontmatter `publishedAt:` or WP `<wp:post_date>`).
  // When omitted, Firestore stamps the current server time.
  createdAt?: Date;
  publishedAt?: Date;
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
    createdAt: input.createdAt ?? serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (input.excerpt) data.excerpt = input.excerpt;
  if (input.heroMediaId) data.heroMediaId = input.heroMediaId;
  if (input.primaryTermId) data.primaryTermId = input.primaryTermId;
  if (input.seo) data.seo = input.seo;
  if (input.publishedAt) data.publishedAt = input.publishedAt;
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
  // Manual overrides for the timestamp fields. Firestore accepts JS
  // Dates and stamps them as Timestamps. Skipped when undefined so the
  // existing value remains untouched.
  createdAt?: Date;
  publishedAt?: Date;
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
    // When provided, used instead of serverTimestamp() so the import
    // plugin can preserve the original `<wp:post_date>` /
    // frontmatter `publishedAt` through the publish step.
    publishedAt?: Date;
  },
): Promise<void> {
  await updateDoc(postDoc(id), {
    status: "online",
    publishedAt: fields.publishedAt ?? serverTimestamp(),
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
// home selector) need all posts at once. They call this on demand;
// results are cached for 30 s so a burst of operations (publish 5
// posts in a row, force regenerate triggers cascading regen) doesn't
// fan out into 5 fetches.
//
// IMPORTANT: this query is intentionally INDEX-FREE. We fetch the
// entire `posts` collection without a `where`/`orderBy` clause and
// filter+sort in memory. That removes the composite index requirement
// (`(type, createdAt)`) so this function works on a fresh project
// regardless of paginationMode.
//
// Cache invalidates on every write (createPost / updatePost /
// markPostOnline / markPostDraft / deletePost) so the next caller
// sees fresh data. The 30 s TTL is the bound for staleness from
// other admins' writes; for a single-admin site that's effectively
// "fresh while the user is interacting".

interface CacheEntry {
  // Full corpus (both posts and pages). filterFromCorpus splits per
  // type on access — cheaper than maintaining two caches that can
  // drift out of sync.
  corpus: Post[];
  expiresAt: number;
  // When fed by the global subscription (subscribeToPosts), the cache
  // never expires — the live snapshot is always fresh. The mutation
  // hooks still invalidate normally so post-write reads see the
  // outgoing state without waiting for the snapshot to echo.
  fromSubscription: boolean;
}

const CACHE_TTL_MS = 30_000;
let cache: CacheEntry | null = null;
// In-flight promise dedup: if 5 callers ask for fetchAllPosts in the
// same tick, they all await the same Firestore read.
let inFlight: Promise<Post[]> | null = null;

function filterFromCorpus(corpus: Post[], type: PostType): Post[] {
  return corpus
    .filter((p) => p.type === type)
    .sort((a, b) => {
      // Sort by createdAt desc, with millisecond resolution. Both Date
      // and Firestore Timestamp expose toMillis()/getTime(); we coerce
      // through `+new Date(...)` for the rare doc that lacks the field.
      const am = a.createdAt?.toMillis?.() ?? 0;
      const bm = b.createdAt?.toMillis?.() ?? 0;
      return bm - am;
    });
}

export async function fetchAllPosts(opts: { type: PostType }): Promise<Post[]> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return filterFromCorpus(cache.corpus, opts.type);
  }
  if (inFlight) {
    const corpus = await inFlight;
    return filterFromCorpus(corpus, opts.type);
  }
  inFlight = (async () => {
    try {
      // No where/orderBy on purpose — works without composite indexes.
      // Sorting + filtering happen in filterFromCorpus on each access.
      const snap = await getDocs(query(postsCollection()));
      const corpus = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
      cache = {
        corpus,
        expiresAt: Date.now() + CACHE_TTL_MS,
        fromSubscription: false,
      };
      return corpus;
    } finally {
      inFlight = null;
    }
  })();
  const corpus = await inFlight;
  return filterFromCorpus(corpus, opts.type);
}

// Called from subscribeToPosts to keep the cache fresh while a global
// subscription is active. Marks the cache as "from subscription" so
// the TTL is effectively infinite — the snapshot itself is the source
// of truth.
export function primeAllPostsCache(corpus: Post[]): void {
  cache = {
    corpus,
    // Far-future expiry — the subscription itself owns freshness.
    expiresAt: Number.POSITIVE_INFINITY,
    fromSubscription: true,
  };
}

// Invalidates the cache. Called from every mutation in this module;
// exposed so the import plugin / migration scripts can also flush
// after a batch. When the global subscription is active, the next
// snapshot will re-prime the cache on its own.
export function invalidateAllPostsCache(): void {
  cache = null;
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
