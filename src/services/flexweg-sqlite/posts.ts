// SQLite implementation of the posts service. Mirrors the function
// signatures of services/firebase/posts.ts so the top-level dispatcher
// can swap impls based on backend.
//
// CMS posts table covers BOTH posts and pages (discriminated by the
// `type` column). Domain types use camelCase; SQLite columns use
// snake_case. rowToPost / postToRow translate the boundary. JSON
// columns (term_ids, seo, previous_published_paths) are
// stringified/parsed at the boundary.

import { Timestamp } from "firebase/firestore";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { sqlExec, sqlQuery } from "./client";
import { notifyPotentialChange, subscribeWithPolling } from "./subscriptions";
import type { Post, PostStatus, PostType, SeoMeta } from "../../core/types";

interface PostRow {
  id: string;
  type: string;
  title: string;
  slug: string;
  content_markdown: string;
  excerpt: string | null;
  hero_media_id: string | null;
  author_id: string | null;
  term_ids: string | null;
  primary_term_id: string | null;
  status: string;
  seo: string | null;
  created_at: number;
  updated_at: number;
  published_at: number | null;
  last_published_path: string | null;
  previous_published_paths: string | null;
  last_published_hash: string | null;
  legacy_url: string | null;
}

function parseJsonArray<T>(s: string | null | undefined): T[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

function parseJsonObject<T>(s: string | null | undefined): T | undefined {
  if (!s) return undefined;
  try {
    return JSON.parse(s) as T;
  } catch {
    return undefined;
  }
}

function rowToPost(r: PostRow): Post {
  const termIds = parseJsonArray<string>(r.term_ids);
  const previousPublishedPaths = parseJsonArray<string>(r.previous_published_paths);
  const seo = parseJsonObject<SeoMeta>(r.seo);
  const post: Post = {
    id: r.id,
    type: r.type as PostType,
    title: r.title,
    slug: r.slug,
    contentMarkdown: r.content_markdown ?? "",
    authorId: r.author_id ?? "",
    termIds,
    status: (r.status as PostStatus) ?? "draft",
    createdAt: Timestamp.fromMillis(r.created_at),
    updatedAt: Timestamp.fromMillis(r.updated_at),
  };
  if (r.excerpt) post.excerpt = r.excerpt;
  if (r.hero_media_id) post.heroMediaId = r.hero_media_id;
  if (r.primary_term_id) post.primaryTermId = r.primary_term_id;
  if (seo) post.seo = seo;
  if (r.published_at) post.publishedAt = Timestamp.fromMillis(r.published_at);
  if (r.last_published_path) post.lastPublishedPath = r.last_published_path;
  if (previousPublishedPaths.length > 0) post.previousPublishedPaths = previousPublishedPaths;
  if (r.last_published_hash) post.lastPublishedHash = r.last_published_hash;
  if (r.legacy_url) post.legacyUrl = r.legacy_url;
  return post;
}

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Global subscription (paginationMode = "global") ─────────────────
//
// Subscribes to the entire `posts` table ordered by `createdAt` desc —
// matches the Firebase shape (returns both posts and pages; consumers
// filter by `type` in memory).
export function subscribeToPosts(
  onChange: (posts: Post[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeWithPolling(
    async () => {
      const { rows } = await sqlQuery<PostRow>(
        "SELECT * FROM posts ORDER BY created_at DESC",
        [],
      );
      const posts = rows.map(rowToPost);
      primeAllPostsCache(posts);
      return posts;
    },
    onChange,
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
  createdAt?: Date;
  publishedAt?: Date;
}

export async function createPost(input: CreatePostInput): Promise<string> {
  const id = genId();
  const now = Date.now();
  const createdAt = input.createdAt ? input.createdAt.getTime() : now;
  await sqlExec(
    `INSERT INTO posts (
      id, type, title, slug, content_markdown,
      excerpt, hero_media_id, author_id, term_ids, primary_term_id,
      status, seo, created_at, updated_at, published_at,
      last_published_path, previous_published_paths, last_published_hash, legacy_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.type,
      input.title,
      input.slug,
      input.contentMarkdown ?? "",
      input.excerpt ?? null,
      input.heroMediaId ?? null,
      input.authorId,
      JSON.stringify(input.termIds ?? []),
      input.primaryTermId ?? null,
      "draft",
      input.seo ? JSON.stringify(input.seo) : null,
      createdAt,
      now,
      input.publishedAt ? input.publishedAt.getTime() : null,
      null,
      null,
      null,
      null,
    ],
  );
  invalidateAllPostsCache();
  notifyPotentialChange();
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
  createdAt?: Date;
  publishedAt?: Date;
}

// Map domain field → SQL column + value transformer. Used to build a
// dynamic `SET col = ?` clause from a partial UpdatePostInput.
const POST_FIELD_MAP: Record<
  keyof UpdatePostInput,
  { col: string; transform: (v: unknown) => unknown }
> = {
  title: { col: "title", transform: (v) => v },
  slug: { col: "slug", transform: (v) => v },
  contentMarkdown: { col: "content_markdown", transform: (v) => v },
  excerpt: { col: "excerpt", transform: (v) => v ?? null },
  heroMediaId: { col: "hero_media_id", transform: (v) => v ?? null },
  termIds: { col: "term_ids", transform: (v) => JSON.stringify(v ?? []) },
  primaryTermId: { col: "primary_term_id", transform: (v) => v ?? null },
  seo: { col: "seo", transform: (v) => (v ? JSON.stringify(v) : null) },
  createdAt: {
    col: "created_at",
    transform: (v) => (v instanceof Date ? v.getTime() : v),
  },
  publishedAt: {
    col: "published_at",
    transform: (v) => (v instanceof Date ? v.getTime() : v),
  },
};

export async function updatePost(id: string, patch: UpdatePostInput): Promise<void> {
  const sets: string[] = [];
  const params: unknown[] = [];
  for (const [key, value] of Object.entries(patch) as Array<[keyof UpdatePostInput, unknown]>) {
    if (value === undefined) continue;
    const map = POST_FIELD_MAP[key];
    if (!map) continue;
    sets.push(`${map.col} = ?`);
    params.push(map.transform(value));
  }
  sets.push("updated_at = ?");
  params.push(Date.now());
  if (sets.length === 1) {
    // Only updated_at — still bump it so callers can rely on it.
  }
  params.push(id);
  await sqlExec(`UPDATE posts SET ${sets.join(", ")} WHERE id = ?`, params);
  invalidateAllPostsCache();
  notifyPotentialChange();
}

export async function markPostOnline(
  id: string,
  fields: {
    lastPublishedPath: string;
    lastPublishedHash: string;
    previousPublishedPaths?: string[];
    publishedAt?: Date;
  },
): Promise<void> {
  const now = Date.now();
  await sqlExec(
    `UPDATE posts SET
      status = ?,
      published_at = ?,
      last_published_path = ?,
      last_published_hash = ?,
      previous_published_paths = ?,
      updated_at = ?
     WHERE id = ?`,
    [
      "online",
      fields.publishedAt ? fields.publishedAt.getTime() : now,
      fields.lastPublishedPath,
      fields.lastPublishedHash,
      JSON.stringify(fields.previousPublishedPaths ?? []),
      now,
      id,
    ],
  );
  invalidateAllPostsCache();
  notifyPotentialChange();
}

export async function markPostDraft(id: string): Promise<void> {
  const now = Date.now();
  await sqlExec(
    `UPDATE posts SET
      status = ?,
      last_published_path = NULL,
      last_published_hash = NULL,
      previous_published_paths = ?,
      updated_at = ?
     WHERE id = ?`,
    ["draft", JSON.stringify([]), now, id],
  );
  invalidateAllPostsCache();
  notifyPotentialChange();
}

export async function deletePost(id: string): Promise<void> {
  await sqlExec("DELETE FROM posts WHERE id = ?", [id]);
  invalidateAllPostsCache();
  notifyPotentialChange();
}

// ─── Server-side paginated query API ─────────────────────────────────
//
// Mirrors firebase/posts.ts's subscribeToPostsPaginated. Cursors are a
// `QueryDocumentSnapshot<DocumentData>` in the Firebase impl — we use
// the same TypeScript type for source-compat, but in SQLite mode the
// cursor we hand back is actually a synthetic wrapper around the
// `created_at` millis of the last row on the previous page (used as
// the `WHERE created_at < ?` boundary for the next query).

export interface PaginatedQueryOpts {
  type: PostType;
  status?: PostStatus;
  pageSize: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
}

export interface PaginatedQueryResult {
  posts: Post[];
  nextCursor?: QueryDocumentSnapshot<DocumentData>;
}

// Cursor implementation: we stash the createdAt millis under a
// well-known field. The QueryDocumentSnapshot type has many methods
// the SDK provides; the consuming hook only ever passes the cursor
// straight back, never calling its methods, so a minimal stub suffices.
interface SqliteCursor {
  __sqliteCursor: true;
  createdAtMillis: number;
}

function makeCursor(createdAtMillis: number): QueryDocumentSnapshot<DocumentData> {
  const stub: SqliteCursor = { __sqliteCursor: true, createdAtMillis };
  return stub as unknown as QueryDocumentSnapshot<DocumentData>;
}

function cursorMillis(cursor: QueryDocumentSnapshot<DocumentData>): number | null {
  const stub = cursor as unknown as Partial<SqliteCursor>;
  return stub.__sqliteCursor && typeof stub.createdAtMillis === "number"
    ? stub.createdAtMillis
    : null;
}

async function fetchPaginatedPage(opts: PaginatedQueryOpts): Promise<PaginatedQueryResult> {
  const where: string[] = ["type = ?"];
  const params: unknown[] = [opts.type];
  if (opts.status) {
    where.push("status = ?");
    params.push(opts.status);
  }
  const cursorBoundary = opts.cursor ? cursorMillis(opts.cursor) : null;
  if (cursorBoundary !== null) {
    where.push("created_at < ?");
    params.push(cursorBoundary);
  }
  // Fetch pageSize + 1 so we can detect whether there's another page
  // without a separate COUNT.
  params.push(opts.pageSize + 1);
  const { rows } = await sqlQuery<PostRow>(
    `SELECT * FROM posts WHERE ${where.join(" AND ")} ORDER BY created_at DESC LIMIT ?`,
    params,
  );
  const hasNext = rows.length > opts.pageSize;
  const pageRows = hasNext ? rows.slice(0, opts.pageSize) : rows;
  const posts = pageRows.map(rowToPost);
  const nextCursor =
    hasNext && pageRows.length > 0
      ? makeCursor(pageRows[pageRows.length - 1].created_at)
      : undefined;
  return { posts, nextCursor };
}

export function subscribeToPostsPaginated(
  opts: PaginatedQueryOpts,
  onChange: (result: PaginatedQueryResult) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeWithPolling(
    () => fetchPaginatedPage(opts),
    onChange,
    onError,
  );
}

// ─── One-shot full-corpus fetch with cache ───────────────────────────
//
// Same contract as firebase/posts.ts.fetchAllPosts: returns just the
// requested `type` (post or page), ordered createdAt desc, cached for
// 30 s with in-flight dedup, invalidated on every write.

interface CacheEntry {
  corpus: Post[];
  expiresAt: number;
  fromSubscription: boolean;
}

const CACHE_TTL_MS = 30_000;
let cache: CacheEntry | null = null;
let inFlight: Promise<Post[]> | null = null;

function filterFromCorpus(corpus: Post[], type: PostType): Post[] {
  return corpus
    .filter((p) => p.type === type)
    .sort((a, b) => {
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
      const { rows } = await sqlQuery<PostRow>(
        "SELECT * FROM posts ORDER BY created_at DESC",
        [],
      );
      const corpus = rows.map(rowToPost);
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
// the TTL is effectively infinite — the polling poller owns freshness.
export function primeAllPostsCache(corpus: Post[]): void {
  cache = {
    corpus,
    expiresAt: Number.POSITIVE_INFINITY,
    fromSubscription: true,
  };
}

export function invalidateAllPostsCache(): void {
  cache = null;
}

// ─── Aggregation: count without reading the docs ─────────────────────

export async function countPosts(opts: {
  type: PostType;
  status?: PostStatus;
}): Promise<number> {
  const where: string[] = ["type = ?"];
  const params: unknown[] = [opts.type];
  if (opts.status) {
    where.push("status = ?");
    params.push(opts.status);
  }
  const { rows } = await sqlQuery<{ n: number }>(
    `SELECT COUNT(*) AS n FROM posts WHERE ${where.join(" AND ")}`,
    params,
  );
  return rows[0]?.n ?? 0;
}
