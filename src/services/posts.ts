import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type WhereFilterOp,
} from "firebase/firestore";
import { collections, getDb } from "./firebase";
import type { Post, PostStatus, PostType, SeoMeta } from "../core/types";

const postsCollection = () => collection(getDb(), collections.posts);
const postDoc = (id: string) => doc(getDb(), collections.posts, id);

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface PostFilter {
  type?: PostType;
  status?: PostStatus;
}

// Subscribes to all posts/pages matching a filter, sorted client-side by
// `updatedAt` descending. We deliberately avoid an `orderBy(updatedAt)` in
// the query because combining it with the equality filter on `type` would
// require a composite Firestore index — the query would silently fail with
// FAILED_PRECONDITION if the index isn't deployed. Sorting in JS keeps the
// MVP setup zero-config; revisit once a single site holds thousands of
// posts.
export function subscribeToPosts(
  filter: PostFilter,
  onChange: (posts: Post[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const constraints: Array<[string, WhereFilterOp, unknown]> = [];
  if (filter.type) constraints.push(["type", "==", filter.type]);
  if (filter.status) constraints.push(["status", "==", filter.status]);

  const q = query(
    postsCollection(),
    ...constraints.map(([field, op, value]) => where(field, op, value)),
  );

  return onSnapshot(
    q,
    (snap) => {
      const posts = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Post)
        .sort((a, b) => {
          const ta = a.updatedAt?.toMillis?.() ?? 0;
          const tb = b.updatedAt?.toMillis?.() ?? 0;
          return tb - ta;
        });
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
}

export async function markPostDraft(id: string): Promise<void> {
  await updateDoc(postDoc(id), {
    status: "draft",
    lastPublishedPath: null,
    lastPublishedHash: null,
    previousPublishedPaths: [],
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(postDoc(id));
}
