import type {
  Post,
  SiteSettings,
  Term,
  SitemapExtraUrl,
  SitemapIndexExtraEntry,
  NewsLocaleEntry,
  SitemapEntity,
  SitemapsConfig,
} from "@flexweg/cms-runtime";
import { getMultilangConfig, isPrimaryLanguage } from "../core/config";
import {
  buildSitemapAlternatesXml,
  postAlternates,
  resolveBaseUrl,
} from "../core/hreflang";
import {
  buildLocalizedPostUrl,
  getPostTranslation,
  getTermTranslation,
} from "../core/urls";

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
// references to `sitemap-index.xml`, ONE per enabled secondary
// language. Coordinates with flexweg-sitemaps: gated on
// `newsEnabled` so disabling News in the sitemaps plugin settings
// removes both the file (via flexweg-sitemaps cleanup) AND the
// index reference (via this check). Without the gate, the index
// would point at non-existent `sitemap-news-<lang>.xml` files.
//
// The actual files are written by flexweg-sitemaps' `regenerateSitemaps`
// after applying the `sitemap.news.locales` filter (see below) —
// this index handler is the "advertising" half of the pair.
export function indexExtra(
  existing: SitemapIndexExtraEntry[],
  args: { settings: SiteSettings },
): SitemapIndexExtraEntry[] {
  const sitemapsCfg = args.settings.pluginConfigs?.["flexweg-sitemaps"] as
    | { newsEnabled?: boolean }
    | undefined;
  if (!sitemapsCfg?.newsEnabled) return existing;
  const config = getMultilangConfig(args.settings);
  if (config.enabledLanguages.length === 0) return existing;
  const out: SitemapIndexExtraEntry[] = [...existing];
  for (const language of config.enabledLanguages) {
    if (isPrimaryLanguage(config, language)) continue;
    out.push({ path: `sitemaps/sitemap-news-${language}.xml` });
  }
  return out;
}

// `sitemap.news.locales` handler. For each enabled secondary
// language, computes the list of recent posts that have a
// translation in that locale and returns a `NewsLocaleEntry` —
// flexweg-sitemaps' `regenerateSitemaps` builds + uploads one
// `sitemap-news-<lang>.xml` file from each entry.
//
// "Recent" matches flexweg-sitemaps' own definition: any post whose
// `updatedAt` (with `publishedAt` / `createdAt` fallbacks) is within
// the last `config.newsWindowDays` days. Posts without a translation
// in the target locale are skipped — orphan `<url>` entries would
// 404 in production.
export function newsLocales(
  existing: NewsLocaleEntry[],
  args: {
    posts: Post[];
    pages: Post[];
    terms: Term[];
    settings: SiteSettings;
    config: SitemapsConfig;
  },
): NewsLocaleEntry[] {
  const mlConfig = getMultilangConfig(args.settings);
  if (mlConfig.enabledLanguages.length === 0) return existing;
  const baseUrl = resolveBaseUrl(args.settings);
  if (!baseUrl) return existing;
  const windowDays = args.config.newsWindowDays || 2;
  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;

  const out: NewsLocaleEntry[] = [...existing];
  for (const language of mlConfig.enabledLanguages) {
    if (isPrimaryLanguage(mlConfig, language)) continue;
    const entities: SitemapEntity[] = [];
    for (const post of [...args.posts, ...args.pages]) {
      if (post.status !== "online") continue;
      const updatedMs =
        post.updatedAt?.toMillis?.() ??
        post.publishedAt?.toMillis?.() ??
        post.createdAt?.toMillis?.() ??
        Date.now();
      if (updatedMs < cutoff) continue;
      const trans = getPostTranslation(post, language);
      if (!trans) continue;
      // Build the localized URL using the same helper the per-post
      // publishAdditional path uses — keeps the `<loc>` in lock-step
      // with the actual file path on Flexweg.
      const primaryTerm = post.primaryTermId
        ? args.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
        : undefined;
      const primaryTermTrans =
        primaryTerm ? getTermTranslation(primaryTerm, language) ?? undefined : undefined;
      const path = buildLocalizedPostUrl({
        post,
        trans,
        primaryTermTrans,
        primaryTermSlug: primaryTerm?.slug,
        language,
        config: mlConfig,
      });
      entities.push({
        path,
        title: trans.title,
        createdAtMs: post.createdAt?.toMillis?.() ?? updatedMs,
        updatedAtMs: updatedMs,
      });
    }
    out.push({
      language,
      path: `sitemaps/sitemap-news-${language}.xml`,
      entities,
    });
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
