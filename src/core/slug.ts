import type { Post, Term } from "./types";

// Lower-case ASCII slug. Flexweg URLs are case-sensitive — keeping every slug
// lower-case avoids "Hero.jpg vs hero.jpg" style 404s. Diacritics are
// stripped via NFD decomposition (é → e), and any remaining non-alphanumeric
// run becomes a single dash. Empty input returns an empty string so callers
// can decide whether to fall back to a generated id.
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

// True if the slug is non-empty and matches the canonical lower-case format.
// We don't auto-correct silently in setters: invalid slugs should fail
// validation in the admin UI so the user notices.
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export interface BuildPostUrlInput {
  post: Pick<Post, "type" | "slug">;
  primaryTerm?: Pick<Term, "type" | "slug"> | null;
}

// URL strategy decided in the plan:
//   - Page (top-level static page):   /<slug>.html
//   - Post without category:          /<slug>.html
//   - Post with category:             /<category-slug>/<post-slug>.html
//
// Tags never become URL prefixes — only categories do. Leading slash is
// omitted because Flexweg's upload paths are rooted (no leading slash).
export function buildPostUrl({ post, primaryTerm }: BuildPostUrlInput): string {
  const postSlug = post.slug.trim();
  if (!postSlug) throw new Error("Post slug is required to build its URL.");

  if (post.type === "page") {
    return `${postSlug}.html`;
  }
  if (primaryTerm && primaryTerm.type === "category") {
    const termSlug = primaryTerm.slug.trim();
    if (!termSlug) throw new Error("Primary category slug is required to build the post URL.");
    return `${termSlug}/${postSlug}.html`;
  }
  return `${postSlug}.html`;
}

// Term archives are folder index files: /<term-slug>/index.html.
// Only categories produce an archive in the MVP — tag pages can be added
// later via a plugin without changing this function.
export function buildTermUrl(term: Pick<Term, "type" | "slug">): string {
  const slug = term.slug.trim();
  if (!slug) throw new Error("Term slug is required to build its URL.");
  if (term.type !== "category") {
    throw new Error("Only categories produce a public archive URL.");
  }
  return `${slug}/index.html`;
}

// Home page lives at /index.html regardless of whether the home is a static
// page or the latest-posts feed.
export const HOME_PATH = "index.html";

// 404 fallback served by browsers when Flexweg returns its default 404. We
// upload a `404.html` to the root so visitors see themed content; whether
// Flexweg actually serves it on misses depends on hosting config.
export const NOT_FOUND_PATH = "404.html";

// Sitemap path. Plugins can override or extend this if they add multiple
// sitemaps (e.g. images, news), but the default sitemap lives here.
export const SITEMAP_PATH = "sitemap.xml";

// Convert a Flexweg path (e.g. "rubrique/article.html") to a public URL by
// joining with the base URL (without trailing slash).
export function pathToPublicUrl(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  return `${cleanBase}/${cleanPath}`;
}

// Returns the lowest available slug given a base and a predicate. We try
// the base verbatim first; if taken we increment a numeric suffix until
// `isUsed` returns false. Used by the auto-slug code path on new posts /
// pages / terms so duplicate titles don't silently overwrite each other.
//
// `isUsed("hello-world")` returning true on the very first call means the
// caller should also try `hello-world-2`, `hello-world-3`, … We cap at
// 1000 attempts purely as a safety net — collisions of that magnitude
// signal something else is wrong.
export function findAvailableSlug(base: string, isUsed: (slug: string) => boolean): string {
  if (!base) base = "untitled";
  if (!isUsed(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (!isUsed(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

// Anything that owns a public path on Flexweg. Used by detectPathCollision
// to compare candidate paths across post / page / term collections.
export interface PathOwner {
  kind: "post" | "page" | "category";
  id: string;
  // Human-readable label so collision messages can name the conflicting
  // entity ("This URL is already used by post: Hello world").
  label: string;
  path: string;
}

// Detects whether `candidatePath` is already taken by another post, page
// or category. Returns the conflicting owner or `null` when the path is
// free. `ignoreId` lets the caller exclude the entity being edited (so a
// post doesn't collide with itself).
//
// Comparison is case-sensitive and trailing-slash-naive — Flexweg URLs
// are case-sensitive so two paths only collide when their string form is
// identical.
export function detectPathCollision(
  candidatePath: string,
  posts: Array<Pick<Post, "id" | "type" | "title" | "slug" | "primaryTermId">>,
  pages: Array<Pick<Post, "id" | "type" | "title" | "slug">>,
  terms: Array<Pick<Term, "id" | "type" | "name" | "slug">>,
  ignoreId?: string,
): PathOwner | null {
  for (const post of posts) {
    if (post.id === ignoreId) continue;
    const term = post.primaryTermId
      ? terms.find((t) => t.id === post.primaryTermId)
      : undefined;
    let p: string;
    try {
      p = buildPostUrl({ post, primaryTerm: term });
    } catch {
      continue;
    }
    if (p === candidatePath) {
      return { kind: "post", id: post.id, label: post.title || post.slug, path: p };
    }
  }
  for (const page of pages) {
    if (page.id === ignoreId) continue;
    let p: string;
    try {
      p = buildPostUrl({ post: page });
    } catch {
      continue;
    }
    if (p === candidatePath) {
      return { kind: "page", id: page.id, label: page.title || page.slug, path: p };
    }
  }
  for (const term of terms) {
    if (term.id === ignoreId) continue;
    if (term.type !== "category") continue;
    let p: string;
    try {
      p = buildTermUrl(term);
    } catch {
      continue;
    }
    if (p === candidatePath) {
      return { kind: "category", id: term.id, label: term.name || term.slug, path: p };
    }
  }
  return null;
}

// Detects whether two terms of the same type would share a slug. Term
// uniqueness is per-type (a tag and a category named "news" can co-exist
// — only the category produces a /news/ archive URL).
export function detectTermSlugCollision(
  candidate: Pick<Term, "type" | "slug">,
  terms: Array<Pick<Term, "id" | "type" | "name" | "slug">>,
  ignoreId?: string,
): PathOwner | null {
  for (const term of terms) {
    if (term.id === ignoreId) continue;
    if (term.type !== candidate.type) continue;
    if (term.slug !== candidate.slug) continue;
    return {
      kind: "category",
      id: term.id,
      label: term.name || term.slug,
      path: term.slug,
    };
  }
  return null;
}

// Normalizes a media filename into a path-safe slug, then appends a short
// random hex suffix to guarantee uniqueness. Uniqueness matters because we
// store every asset in its own folder (`media/yyyy/mm/<slug>/`) and a
// duplicate slug would silently overwrite another asset's variants.
//
// Strips the file extension before slugifying, since the variant filenames
// are produced by the image pipeline (e.g. `medium.webp`) — the original
// extension only mattered for input validation.
export function normalizeMediaSlug(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  const stem = lastDot > 0 ? filename.slice(0, lastDot) : filename;
  const base = slugify(stem) || "media";
  return `${base}-${randomHexSuffix(6)}`;
}

function randomHexSuffix(length: number): string {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, length);
  }
  // Fallback for environments without WebCrypto (test envs without jsdom).
  return Math.random().toString(16).slice(2, 2 + length);
}
