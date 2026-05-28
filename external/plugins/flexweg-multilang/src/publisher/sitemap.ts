import type {
  Post,
  SiteSettings,
  Term,
  SitemapExtraUrl,
  SitemapIndexExtraEntry,
} from "@flexweg/cms-runtime";
import { getMultilangConfig, isPrimaryLanguage } from "../core/config";
import {
  buildSitemapAlternatesXml,
  postAlternates,
  resolveBaseUrl,
} from "../core/hreflang";

// `sitemap.urlset.namespaces` handler. Adds `xmlns:xhtml` so the
// `<xhtml:link>` entries we inject parse correctly.
export function urlsetNamespaces(
  ns: Record<string, string>,
): Record<string, string> {
  return { ...ns, "xmlns:xhtml": "http://www.w3.org/1999/xhtml" };
}

// `sitemap.url.entry` handler. For each existing `<url>` entry, return
// the alternate-link block (xhtml:link tags) corresponding to the
// entity. The sitemap builder concatenates this just before `</url>`.
export function urlEntry(
  current: string,
  args: { entity?: Post; baseUrl: string; path: string },
): string {
  if (!args.entity) return current;
  // We don't know which Term list / SiteSettings the sitemap builder
  // is using — it doesn't expose them in this filter's args. But the
  // entity carries its `translations` directly, and the path tells
  // us its language (always the primary for the core sitemap), so
  // we can compute alternates inline if we have a global config
  // snapshot. The plugin keeps a reference to the live config via
  // setLatestConfig() called on every publish; below is a soft
  // dependency on that helper.
  const config = getLatestConfig();
  const terms = getLatestTerms();
  if (!config || !terms) return current;
  const alternates = postAlternates(args.entity, terms, config);
  if (alternates.length === 0) return current;
  const baseUrl = args.baseUrl.replace(/\/+$/, "");
  return (
    current +
    buildSitemapAlternatesXml(
      { current: { path: args.path, language: config.primaryLanguage }, alternates },
      baseUrl,
      config,
    ) +
    "\n"
  );
}

// `sitemap.urls.extra` handler. For each year, returns one extra
// `<url>` per translation that lives in that year. The core year
// sitemap then contains both the primary-language `<url>` entries
// (with xhtml:link inside) AND the translated `<url>` entries (also
// with their own xhtml:link blocks).
export function urlsExtra(
  existing: SitemapExtraUrl[],
  args: { posts: Post[]; pages: Post[]; terms: Term[]; settings: SiteSettings; year: number },
): SitemapExtraUrl[] {
  const config = getMultilangConfig(args.settings);
  if (config.enabledLanguages.length === 0) return existing;
  const baseUrl = resolveBaseUrl(args.settings);
  if (!baseUrl) return existing;

  const out: SitemapExtraUrl[] = [...existing];
  for (const post of [...args.posts, ...args.pages]) {
    if (post.status !== "online") continue;
    const createdMs =
      post.createdAt?.toMillis?.() ??
      post.publishedAt?.toMillis?.() ??
      Date.now();
    if (new Date(createdMs).getUTCFullYear() !== args.year) continue;
    const alternates = postAlternates(post, args.terms, config);
    if (alternates.length === 0) continue;
    for (const alt of alternates) {
      // The primary-language URL is already in the core sitemap.
      if (isPrimaryLanguage(config, alt.language)) continue;
      out.push({
        path: alt.path,
        lastmodMs: post.updatedAt?.toMillis?.() ?? createdMs,
        extraInnerXml: buildSitemapAlternatesXml(
          { current: { path: alt.path, language: alt.language }, alternates },
          baseUrl,
          config,
        ),
      });
    }
  }
  return out;
}

// `sitemap.index.extra` handler. Adds per-language news sitemap
// references to sitemap-index.xml. Google News doesn't support
// xhtml:link in news sitemaps, so the recommended pattern is one
// news sitemap per language section.
export function indexExtra(
  existing: SitemapIndexExtraEntry[],
  args: { settings: SiteSettings },
): SitemapIndexExtraEntry[] {
  const config = getMultilangConfig(args.settings);
  if (config.enabledLanguages.length === 0) return existing;
  const out: SitemapIndexExtraEntry[] = [...existing];
  for (const language of config.enabledLanguages) {
    if (isPrimaryLanguage(config, language)) continue;
    out.push({ path: `sitemaps/sitemap-news-${language}.xml` });
  }
  return out;
}

// Module-level config + terms snapshot consumed by `urlEntry` (which
// doesn't get them via filter args). Refreshed by the plugin's
// publish lifecycle handlers.
let latestConfig: ReturnType<typeof getMultilangConfig> | null = null;
let latestTerms: Term[] | null = null;
export function setLatestConfig(c: ReturnType<typeof getMultilangConfig>): void {
  latestConfig = c;
}
export function setLatestTerms(t: Term[]): void {
  latestTerms = t;
}
function getLatestConfig() {
  return latestConfig;
}
function getLatestTerms() {
  return latestTerms;
}
