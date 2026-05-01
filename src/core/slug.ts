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
