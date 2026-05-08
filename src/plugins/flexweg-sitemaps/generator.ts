// Sitemap and robots.txt generation for the flexweg-sitemaps plugin.
//
// Produces three kinds of files on the public Flexweg site:
//   - sitemap-<year>.xml: standard urlset of every online post (and page,
//     when configured) whose creation year matches.
//   - sitemap-index.xml:  index referencing every yearly sitemap plus the
//     news sitemap when enabled.
//   - sitemap-news.xml:   Google News urlset of articles modified within
//     the configured rolling window (default 2 days).
//
// The plugin also owns robots.txt — when the user-supplied content is
// blank, a sensible default is generated that points to sitemap-index.xml
// (and sitemap-news.xml if News is enabled).

import {
  buildPostUrl,
  pathToPublicUrl,
  deleteFile,
  uploadFile,
  type Post,
  type SiteSettings,
  type Term,
} from "@flexweg/cms-runtime";
import {
  buildNewsSitemapXsl,
  buildSitemapXsl,
  SITEMAP_NEWS_XSL_PATH,
  SITEMAP_XSL_PATH,
} from "./xsl";

export interface SitemapsConfig {
  // Whether sitemap-news.xml is generated and linked from the index.
  newsEnabled: boolean;
  // Lookback window for sitemap-news.xml entries, in days.
  newsWindowDays: number;
  // Which content types are included in regular sitemaps. Pages always
  // bypass the news sitemap regardless of this flag — News is for
  // article-style content only.
  contentTypes: "posts" | "posts-pages";
  // User-supplied robots.txt body. Blank means "use the generated default".
  robotsTxt: string;
}

export const DEFAULT_SITEMAPS_CONFIG: SitemapsConfig = {
  newsEnabled: false,
  newsWindowDays: 2,
  contentTypes: "posts-pages",
  robotsTxt: "",
};

// All sitemap files live under /sitemaps/ so they're easy to find on
// the Flexweg file manager (and out of the way of crawler-facing
// page URLs at the root). robots.txt stays at the root because that's
// where every web crawler expects it. URLs inside robots.txt point
// to the new sitemaps/ location automatically via pathToPublicUrl.
const SITEMAPS_FOLDER = "sitemaps";
export const SITEMAP_INDEX_PATH = `${SITEMAPS_FOLDER}/sitemap-index.xml`;
export const SITEMAP_NEWS_PATH = `${SITEMAPS_FOLDER}/sitemap-news.xml`;
export const ROBOTS_PATH = "robots.txt";

function yearlySitemapPath(year: number): string {
  return `${SITEMAPS_FOLDER}/sitemap-${year}.xml`;
}

// Legacy root-level filenames left over from an earlier version of
// the plugin that uploaded sitemaps at the site root. The migration
// sweep below tries to delete them on every regen so a one-off click
// of "Force regenerate" is enough to cleanly transition. 404s are
// silent so the sweep is idempotent.
const LEGACY_ROOT_STATIC = [
  "sitemap-index.xml",
  "sitemap-news.xml",
  "sitemap.xsl",
  "sitemap-news.xsl",
];
function legacyYearlyPath(year: number): string {
  return `sitemap-${year}.xml`;
}

export function defaultRobotsTxt(baseUrl: string, newsEnabled: boolean): string {
  // Disallow /admin/ so crawlers that honour robots.txt don't index the
  // admin SPA, its config.js, or its asset bundle. The admin's index.html
  // also carries `<meta name="robots" content="noindex">` for crawlers
  // that ignore robots.txt — belt + braces.
  const lines = ["User-agent: *", "Allow: /", "Disallow: /admin/", ""];
  if (baseUrl) {
    lines.push(`Sitemap: ${pathToPublicUrl(baseUrl, SITEMAP_INDEX_PATH)}`);
    if (newsEnabled) lines.push(`Sitemap: ${pathToPublicUrl(baseUrl, SITEMAP_NEWS_PATH)}`);
  }
  return lines.join("\n") + "\n";
}

// Internal flat shape: a single online post or page projected into the
// fields the XML builder needs. Cuts out the rest of the Post type so the
// builders are easy to read and unit-test in isolation.
interface SitemapEntity {
  path: string;
  createdAtMs: number;
  updatedAtMs: number;
  title: string;
}

function entityFromPost(post: Post, terms: Term[]): SitemapEntity | null {
  let path: string;
  try {
    const term = post.primaryTermId ? terms.find((t) => t.id === post.primaryTermId) : undefined;
    path = buildPostUrl({ post, primaryTerm: term });
  } catch {
    return null;
  }
  const created = post.createdAt?.toMillis?.() ?? post.publishedAt?.toMillis?.() ?? Date.now();
  const updated = post.updatedAt?.toMillis?.() ?? created;
  return {
    path,
    createdAtMs: created,
    updatedAtMs: updated,
    title: post.title || post.slug,
  };
}

function gatherEntities(
  posts: Post[],
  pages: Post[],
  terms: Term[],
  config: SitemapsConfig,
): SitemapEntity[] {
  const out: SitemapEntity[] = [];
  for (const p of posts) {
    if (p.status !== "online") continue;
    const e = entityFromPost(p, terms);
    if (e) out.push(e);
  }
  if (config.contentTypes === "posts-pages") {
    for (const p of pages) {
      if (p.status !== "online") continue;
      const e = entityFromPost(p, terms);
      if (e) out.push(e);
    }
  }
  return out;
}

function groupByYear(entities: SitemapEntity[]): Map<number, SitemapEntity[]> {
  const map = new Map<number, SitemapEntity[]>();
  for (const e of entities) {
    const year = new Date(e.createdAtMs).getUTCFullYear();
    const list = map.get(year) ?? [];
    list.push(e);
    map.set(year, list);
  }
  return map;
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&apos;";
    }
  });
}

function isoDate(ms: number): string {
  return new Date(ms).toISOString();
}

function isoDateOnly(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

// Standard XML preamble + xml-stylesheet PI. The PI tells browsers to
// transform the XML through our XSL when navigating to the file —
// produces a styled HTML table instead of raw XML. Crawlers ignore the
// PI entirely, so SEO is unaffected.
function preamble(xslHref: string): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<?xml-stylesheet type="text/xsl" href="${escapeXml(xslHref)}"?>`,
  ].join("\n");
}

function buildYearSitemap(
  entities: SitemapEntity[],
  baseUrl: string,
  xslHref: string,
): string {
  const lines = [
    preamble(xslHref),
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const e of entities) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(pathToPublicUrl(baseUrl, e.path))}</loc>`);
    lines.push(`    <lastmod>${isoDateOnly(e.updatedAtMs)}</lastmod>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n");
}

function buildSitemapIndex(
  years: number[],
  includeNews: boolean,
  baseUrl: string,
  lastmodMs: number,
  xslHref: string,
): string {
  const lines = [
    preamble(xslHref),
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  const date = isoDateOnly(lastmodMs);
  for (const year of [...years].sort((a, b) => a - b)) {
    lines.push("  <sitemap>");
    lines.push(`    <loc>${escapeXml(pathToPublicUrl(baseUrl, yearlySitemapPath(year)))}</loc>`);
    lines.push(`    <lastmod>${date}</lastmod>`);
    lines.push("  </sitemap>");
  }
  if (includeNews) {
    lines.push("  <sitemap>");
    lines.push(`    <loc>${escapeXml(pathToPublicUrl(baseUrl, SITEMAP_NEWS_PATH))}</loc>`);
    lines.push(`    <lastmod>${date}</lastmod>`);
    lines.push("  </sitemap>");
  }
  lines.push("</sitemapindex>");
  return lines.join("\n");
}

function buildNewsSitemap(
  entities: SitemapEntity[],
  siteName: string,
  siteLanguage: string,
  baseUrl: string,
  windowDays: number,
  xslHref: string,
): string {
  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const recent = entities
    .filter((e) => e.updatedAtMs >= cutoff)
    .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  const lines = [
    preamble(xslHref),
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
  ];
  const safeSiteName = escapeXml(siteName || "Site");
  const safeLanguage = escapeXml((siteLanguage || "en").split("-")[0] || "en");
  for (const e of recent) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(pathToPublicUrl(baseUrl, e.path))}</loc>`);
    lines.push("    <news:news>");
    lines.push("      <news:publication>");
    lines.push(`        <news:name>${safeSiteName}</news:name>`);
    lines.push(`        <news:language>${safeLanguage}</news:language>`);
    lines.push("      </news:publication>");
    lines.push(`      <news:publication_date>${isoDate(e.updatedAtMs)}</news:publication_date>`);
    lines.push(`      <news:title>${escapeXml(e.title)}</news:title>`);
    lines.push("    </news:news>");
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n");
}

// Optional restriction of what regenerateSitemaps will write. Used by the
// per-post action hooks so a single publish only regenerates the year that
// changed plus the index and news file — not every yearly sitemap.
export interface RegenerateScope {
  years?: number[];
  index?: boolean;
  news?: boolean;
}

export interface RegenerateResult {
  uploaded: string[];
  deleted: string[];
}

export async function regenerateSitemaps(args: {
  posts: Post[];
  pages: Post[];
  terms: Term[];
  settings: SiteSettings;
  config: SitemapsConfig;
  scope?: RegenerateScope;
}): Promise<RegenerateResult> {
  const { posts, pages, terms, settings, config, scope } = args;
  const baseUrl = (settings.baseUrl || "").replace(/\/+$/, "");
  if (!baseUrl) throw new Error("baseUrl is empty — cannot build sitemap URLs.");

  const entities = gatherEntities(posts, pages, terms, config);
  const yearMap = groupByYear(entities);
  const allYears = [...yearMap.keys()];
  const targetYears = scope?.years ?? allYears;

  const uploaded: string[] = [];
  const deleted: string[] = [];

  // Migration sweep — clean up legacy root-level files left by an
  // earlier version of the plugin that uploaded sitemaps at the site
  // root. 404s are silent so this is idempotent (free to run on
  // every full regen). Skipped on per-post incremental regens
  // (`scope` truthy) so the lifecycle hooks don't pay the deleteFile
  // overhead on every publish.
  if (!scope) {
    const legacyPaths = [
      ...LEGACY_ROOT_STATIC,
      ...allYears.map((y) => legacyYearlyPath(y)),
    ];
    for (const path of legacyPaths) {
      try {
        await deleteFile(path);
        deleted.push(path);
      } catch {
        // 404 / not-present — swallow, idempotent.
      }
    }
  }

  // Stylesheet hrefs are absolute (baseUrl-rooted) so the rendered HTML
  // works the same way crawlers and humans see the file. Both yearly
  // sitemaps and the index reference the same generic XSL — the XSL's
  // xsl:choose handles either root.
  const xslHref = pathToPublicUrl(baseUrl, SITEMAP_XSL_PATH);
  const newsXslHref = pathToPublicUrl(baseUrl, SITEMAP_NEWS_XSL_PATH);

  // Per-year sitemaps. A year that has zero online entities (because every
  // post in that year was unpublished/deleted) gets its file deleted so we
  // don't leave a stale sitemap pointing at nothing.
  for (const year of targetYears) {
    const list = yearMap.get(year) ?? [];
    const path = yearlySitemapPath(year);
    if (list.length === 0) {
      try {
        await deleteFile(path);
        deleted.push(path);
      } catch {
        // Already-gone or transient — sitemap-index will simply not list
        // this year next time it regenerates.
      }
      continue;
    }
    const xml = buildYearSitemap(list, baseUrl, xslHref);
    await uploadFile({ path, content: xml });
    uploaded.push(path);
  }

  if (scope?.index !== false) {
    // Index always reflects the *full* set of populated years, not just
    // the years we re-rendered above. Re-derive `allYears` from the live
    // entity list so a year emptied this round disappears from the index.
    const livingYears = [...yearMap.entries()]
      .filter(([, list]) => list.length > 0)
      .map(([year]) => year);
    const xml = buildSitemapIndex(
      livingYears,
      config.newsEnabled,
      baseUrl,
      Date.now(),
      xslHref,
    );
    await uploadFile({ path: SITEMAP_INDEX_PATH, content: xml });
    uploaded.push(SITEMAP_INDEX_PATH);
  }

  if (scope?.news !== false) {
    if (config.newsEnabled) {
      const xml = buildNewsSitemap(
        entities,
        settings.title,
        settings.language,
        baseUrl,
        config.newsWindowDays,
        newsXslHref,
      );
      await uploadFile({ path: SITEMAP_NEWS_PATH, content: xml });
      uploaded.push(SITEMAP_NEWS_PATH);
    } else {
      // News disabled: delete any leftover file from a previous run.
      try {
        await deleteFile(SITEMAP_NEWS_PATH);
        deleted.push(SITEMAP_NEWS_PATH);
      } catch {
        // Already-gone is fine.
      }
    }
  }

  return { uploaded, deleted };
}

export async function regenerateRobotsTxt(args: {
  config: SitemapsConfig;
  baseUrl: string;
}): Promise<void> {
  const baseUrl = (args.baseUrl || "").replace(/\/+$/, "");
  const content =
    args.config.robotsTxt && args.config.robotsTxt.trim().length > 0
      ? args.config.robotsTxt
      : defaultRobotsTxt(baseUrl, args.config.newsEnabled);
  await uploadFile({ path: ROBOTS_PATH, content });
}

// Uploads the XSL stylesheets referenced by every sitemap file's
// xml-stylesheet PI. Labels are localized using settings.language. Called
// from the plugin's "Upload stylesheets" button and from "Force regenerate"
// — never from the lifecycle hooks (XSL changes rarely; saving 2 uploads
// on every publish/unpublish is worth requiring an explicit refresh).
//
// When News is disabled the news XSL is best-effort deleted so we don't
// leave a stale stylesheet referenced by nothing.
export async function regenerateStylesheets(args: {
  settings: SiteSettings;
  config: SitemapsConfig;
}): Promise<RegenerateResult> {
  const uploaded: string[] = [];
  const deleted: string[] = [];

  // Migration sweep — see regenerateSitemaps for the rationale.
  // Limited to the static legacy filenames (sitemap.xsl /
  // sitemap-news.xsl at root); the yearly sweep happens inside
  // regenerateSitemaps where the corpus year set is available.
  for (const path of LEGACY_ROOT_STATIC) {
    try {
      await deleteFile(path);
      deleted.push(path);
    } catch {
      // 404 / not-present — swallow, idempotent.
    }
  }

  await uploadFile({
    path: SITEMAP_XSL_PATH,
    content: buildSitemapXsl(args.settings.language),
  });
  uploaded.push(SITEMAP_XSL_PATH);

  if (args.config.newsEnabled) {
    await uploadFile({
      path: SITEMAP_NEWS_XSL_PATH,
      content: buildNewsSitemapXsl(args.settings.language),
    });
    uploaded.push(SITEMAP_NEWS_XSL_PATH);
  } else {
    try {
      await deleteFile(SITEMAP_NEWS_XSL_PATH);
      deleted.push(SITEMAP_NEWS_XSL_PATH);
    } catch {
      // 404 fine; deleteFile already swallows it but the catch covers any
      // non-404 error too — losing the stylesheet on news-disable isn't
      // worth surfacing a hard failure.
    }
  }

  return { uploaded, deleted };
}

// Convenience used by the action-hook callbacks. Computes the year the
// touched post belongs to from its createdAt and regenerates that single
// year's sitemap plus the index. The news file is always rebuilt because
// any change to the corpus (publish, unpublish, delete, edit) can move
// the sliding-window membership.
export async function regenerateForPost(args: {
  post: Post;
  posts: Post[];
  pages: Post[];
  terms: Term[];
  settings: SiteSettings;
  config: SitemapsConfig;
}): Promise<RegenerateResult> {
  const created =
    args.post.createdAt?.toMillis?.() ??
    args.post.publishedAt?.toMillis?.() ??
    args.post.updatedAt?.toMillis?.() ??
    Date.now();
  const year = new Date(created).getUTCFullYear();
  return regenerateSitemaps({
    posts: args.posts,
    pages: args.pages,
    terms: args.terms,
    settings: args.settings,
    config: args.config,
    scope: { years: [year] },
  });
}
