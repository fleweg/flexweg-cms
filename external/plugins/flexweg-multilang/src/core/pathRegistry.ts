import type { Post, SiteSettings, Term } from "@flexweg/cms-runtime";
import type { MultilangConfig } from "../types";
import {
  buildHreflangHtml,
  homeAlternates,
  postAlternates,
  resolveBaseUrl,
  termAlternates,
} from "./hreflang";

// Module-level cache: `currentPath` → ready-to-inject `<link>` HTML
// block. Refreshed whenever posts / terms / config / settings change.
//
// Why a synchronous cache? `page.head.extra` is a sync filter — by
// the time React's renderToStaticMarkup runs, there's no way to await
// a Firestore fetch to compute the right alternates. The publisher
// orchestration always rebuilds the cache before calling the filter
// chain (see refreshPathRegistry below).
const cache = new Map<string, string>();

export function refreshPathRegistry(
  posts: Post[],
  pages: Post[],
  terms: Term[],
  settings: SiteSettings,
  config: MultilangConfig,
): void {
  cache.clear();
  const baseUrl = resolveBaseUrl(settings);
  if (!baseUrl) return;

  // Per-post alternates: each path the post is published at gets an
  // entry pointing to the full set of alternates.
  for (const post of [...posts, ...pages]) {
    if (post.status !== "online") continue;
    const alternates = postAlternates(post, terms, config);
    if (alternates.length === 0) continue;
    for (const alt of alternates) {
      const html = buildHreflangHtml(
        { current: { path: alt.path, language: alt.language }, alternates },
        baseUrl,
        config,
      );
      cache.set(alt.path, html);
    }
  }

  // Per-category archives.
  for (const term of terms) {
    if (term.type !== "category") continue;
    const alternates = termAlternates(term, config);
    if (alternates.length === 0) continue;
    for (const alt of alternates) {
      const html = buildHreflangHtml(
        { current: { path: alt.path, language: alt.language }, alternates },
        baseUrl,
        config,
      );
      cache.set(alt.path, html);
    }
  }

  // Home pages — always one per active language.
  const homes = homeAlternates(config);
  for (const alt of homes) {
    const html = buildHreflangHtml(
      { current: { path: alt.path, language: alt.language }, alternates: homes },
      baseUrl,
      config,
    );
    cache.set(alt.path, html);
  }
}

// Sync lookup used by the `page.head.extra` filter.
export function lookupHreflangHtml(currentPath: string): string {
  // Normalise — sometimes the publisher hands us "fr/foo.html" but a
  // refresh wrote "/fr/foo.html". Strip leading slashes both ways for
  // matching.
  const norm = currentPath.replace(/^\/+/, "");
  return cache.get(norm) ?? cache.get(`/${norm}`) ?? "";
}

// For sitemap alternates we need the alternates list (not the HTML).
// Same cache lifecycle — store both at refresh time.
const alternatesByPath = new Map<
  string,
  { language: string; alternates: Array<{ language: string; path: string }> }
>();

export function refreshAlternatesCache(
  posts: Post[],
  pages: Post[],
  terms: Term[],
  config: MultilangConfig,
): void {
  alternatesByPath.clear();
  for (const post of [...posts, ...pages]) {
    if (post.status !== "online") continue;
    const alts = postAlternates(post, terms, config);
    if (alts.length === 0) continue;
    for (const alt of alts) {
      alternatesByPath.set(alt.path, { language: alt.language, alternates: alts });
    }
  }
  for (const term of terms) {
    if (term.type !== "category") continue;
    const alts = termAlternates(term, config);
    if (alts.length === 0) continue;
    for (const alt of alts) {
      alternatesByPath.set(alt.path, { language: alt.language, alternates: alts });
    }
  }
  const homes = homeAlternates(config);
  for (const alt of homes) {
    alternatesByPath.set(alt.path, { language: alt.language, alternates: homes });
  }
}

export function lookupAlternates(
  path: string,
): { language: string; alternates: Array<{ language: string; path: string }> } | null {
  const norm = path.replace(/^\/+/, "");
  return alternatesByPath.get(norm) ?? alternatesByPath.get(`/${norm}`) ?? null;
}
