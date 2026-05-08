// RSS feed generation for the flexweg-rss plugin. Produces an RSS 2.0
// channel for the whole site (/rss.xml) and one per configured category
// (/<slug>/<slug>.xml). Each feed file references rss.xsl in an
// xml-stylesheet PI for browser-friendly viewing — RSS readers ignore
// the PI and parse the XML normally.
//
// Public regeneration entry points:
//   - regenerateForPost   — called from action hooks; updates only the
//                           feeds touched by a given post.
//   - regenerateAllFeeds  — called from the settings page Force button.
//   - regenerateStylesheet — uploads rss.xsl alone.
//   - cleanupRemovedFeeds  — deletes feed files removed from config.
//
// All regeneration helpers take the live config and return a possibly
// mutated copy reflecting any path bookkeeping (lastPublishedPath
// updates after a slug rename, orphan feed entries dropped, etc). The
// caller decides whether to persist the new config back to Firestore;
// the manifest's action handlers always do, so slug renames clean up
// orphans on the very next post publish.

import {
  buildPostUrl,
  buildTermUrl,
  pathToPublicUrl,
  markdownToPlainText,
  deleteFile,
  uploadFile,
  type Media,
  type Post,
  type SiteSettings,
  type Term,
} from "@flexweg/cms-runtime";
import { buildRssXsl, RSS_XSL_PATH } from "./xsl";

export const SITE_RSS_PATH = "rss.xml";

export interface CategoryFeedConfig {
  termId: string;
  // Per-feed item count override. Default 20 when adding via the UI.
  itemCount: number;
  // Toggle: append the feed URL as a footer entry in menu.json.
  addToFooter: boolean;
  // Last path the feed was uploaded to. Populated after each successful
  // upload so a later slug rename can delete the old file before
  // uploading at the new path.
  lastPublishedPath?: string;
}

export interface SiteFeedConfig {
  enabled: boolean;
  itemCount: number;
  // Categories to skip from the site feed. Empty = include everything.
  excludedTermIds: string[];
  addToFooter: boolean;
  // Same role as on category feeds: track the previously uploaded path so
  // we can clean it up when the feed is disabled.
  lastPublishedPath?: string;
}

export interface RssConfig {
  site: SiteFeedConfig;
  categoryFeeds: CategoryFeedConfig[];
}

export const DEFAULT_RSS_CONFIG: RssConfig = {
  site: {
    enabled: false,
    itemCount: 20,
    excludedTermIds: [],
    addToFooter: false,
  },
  categoryFeeds: [],
};

// Path on Flexweg for a category feed. Mirrors the term's archive URL
// folder (`<slug>/index.html`) but with `<slug>.xml` as the leaf so a
// reader can subscribe at a stable, predictable URL.
export function categoryFeedPath(slug: string): string {
  return `${slug}/${slug}.xml`;
}

// ─────────────────────────────────────────────────────────────────────
// XML builder
// ─────────────────────────────────────────────────────────────────────

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

// CDATA blocks can't contain "]]>" — split any occurrence so the closing
// sequence appears outside CDATA. Standard pattern used by every RSS
// generator that embeds rich content.
function escapeCdata(value: string): string {
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

function rfc822(ms: number): string {
  return new Date(ms).toUTCString();
}

// Optional cover image for an item — emitted as an RSS 2.0
// <enclosure>. `length` of 0 means "size unknown" (legacy uploads
// without per-variant byte counts); modern readers tolerate that.
interface RssEnclosure {
  url: string;
  length: number;
  type: string;
}

interface RssItem {
  title: string;
  link: string;
  guid: string;
  description: string;
  pubDateMs: number;
  category?: string;
  enclosure?: RssEnclosure;
}

// Returns the cover image enclosure for a post (using its heroMediaId)
// or null when there's nothing usable. Prefers the `large` variant for
// reader-friendly sizing, then the asset's defaultFormat, then any
// available variant — same fallback chain as the publisher's og:image.
function postEnclosure(post: Post, mediaMap: Map<string, Media>): RssEnclosure | null {
  if (!post.heroMediaId) return null;
  const media = mediaMap.get(post.heroMediaId);
  if (!media) return null;

  // Multi-variant pipeline — pick the best variant we have.
  if (media.formats && Object.keys(media.formats).length > 0) {
    const variant =
      media.formats["large"] ??
      (media.defaultFormat ? media.formats[media.defaultFormat] : undefined) ??
      Object.values(media.formats)[0];
    if (variant?.url) {
      return {
        url: variant.url,
        length: variant.bytes ?? 0,
        type: media.contentType || guessImageType(variant.url),
      };
    }
  }

  // Legacy single-URL shape.
  if (media.url) {
    return {
      url: media.url,
      length: media.size ?? 0,
      type: media.contentType || guessImageType(media.url),
    };
  }

  return null;
}

function guessImageType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".avif")) return "image/avif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  // Safe default — wrong type still leads most readers to display via
  // the URL alone.
  return "image/jpeg";
}

interface RssChannel {
  title: string;
  link: string;
  description: string;
  feedUrl: string;
  language: string;
  items: RssItem[];
  xslHref: string;
}

function buildRssXml(channel: RssChannel): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<?xml-stylesheet type="text/xsl" href="${escapeXml(channel.xslHref)}"?>`,
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(channel.title)}</title>`,
    `    <link>${escapeXml(channel.link)}</link>`,
    `    <description>${escapeXml(channel.description)}</description>`,
    `    <language>${escapeXml(channel.language)}</language>`,
    `    <lastBuildDate>${rfc822(Date.now())}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml"/>`,
  ];
  for (const item of channel.items) {
    lines.push("    <item>");
    lines.push(`      <title>${escapeXml(item.title)}</title>`);
    lines.push(`      <link>${escapeXml(item.link)}</link>`);
    lines.push(`      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>`);
    if (item.category) lines.push(`      <category>${escapeXml(item.category)}</category>`);
    lines.push(`      <description><![CDATA[${escapeCdata(item.description)}]]></description>`);
    lines.push(`      <pubDate>${rfc822(item.pubDateMs)}</pubDate>`);
    if (item.enclosure) {
      lines.push(
        `      <enclosure url="${escapeXml(item.enclosure.url)}" length="${item.enclosure.length}" type="${escapeXml(item.enclosure.type)}"/>`,
      );
    }
    lines.push("    </item>");
  }
  lines.push("  </channel>");
  lines.push("</rss>");
  return lines.join("\n");
}

// Convert a Post to a RSS item. Returns null if the URL can't be built
// (missing slug etc.) — caller skips silently to keep a single
// problematic post from breaking the whole feed.
function postToRssItem(
  post: Post,
  terms: Term[],
  mediaMap: Map<string, Media>,
  baseUrl: string,
): RssItem | null {
  const term = post.primaryTermId
    ? terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  let path: string;
  try {
    path = buildPostUrl({ post, primaryTerm: term });
  } catch {
    return null;
  }
  const url = pathToPublicUrl(baseUrl, path);
  // Excerpt wins; fallback to a 300-char plaintext snippet of the body.
  // markdownToPlainText already strips images, links, code fences etc.
  const description = (
    post.excerpt && post.excerpt.trim().length > 0
      ? post.excerpt
      : markdownToPlainText(post.contentMarkdown, 300)
  ).trim();
  const pubDateMs =
    post.publishedAt?.toMillis?.() ??
    post.updatedAt?.toMillis?.() ??
    post.createdAt?.toMillis?.() ??
    Date.now();
  return {
    title: post.title || post.slug,
    link: url,
    guid: url,
    description,
    pubDateMs,
    category: term?.name,
    enclosure: postEnclosure(post, mediaMap) ?? undefined,
  };
}

function gatherSiteItems(
  posts: Post[],
  terms: Term[],
  mediaMap: Map<string, Media>,
  config: RssConfig,
  baseUrl: string,
): RssItem[] {
  const excluded = new Set(config.site.excludedTermIds);
  return posts
    .filter((p) => p.status === "online")
    .filter((p) => !p.primaryTermId || !excluded.has(p.primaryTermId))
    .map((p) => postToRssItem(p, terms, mediaMap, baseUrl))
    .filter((i): i is RssItem => i !== null)
    .sort((a, b) => b.pubDateMs - a.pubDateMs)
    .slice(0, Math.max(1, Math.min(100, config.site.itemCount)));
}

function gatherCategoryItems(
  posts: Post[],
  terms: Term[],
  mediaMap: Map<string, Media>,
  feed: CategoryFeedConfig,
  baseUrl: string,
): RssItem[] {
  return posts
    .filter((p) => p.status === "online" && p.primaryTermId === feed.termId)
    .map((p) => postToRssItem(p, terms, mediaMap, baseUrl))
    .filter((i): i is RssItem => i !== null)
    .sort((a, b) => b.pubDateMs - a.pubDateMs)
    .slice(0, Math.max(1, Math.min(100, feed.itemCount)));
}

// ─────────────────────────────────────────────────────────────────────
// Regeneration entry points. All return both an upload/delete summary
// and the (possibly mutated) config so the caller can persist.
// ─────────────────────────────────────────────────────────────────────

export interface RegenerateResult {
  uploaded: string[];
  deleted: string[];
}

interface RegenerateContext {
  posts: Post[];
  terms: Term[];
  mediaMap: Map<string, Media>;
  settings: SiteSettings;
  baseUrl: string;
  xslHref: string;
}

// Normalizes whatever shape the caller has handy (array from useCmsData
// or Map from PublishContext) into the internal lookup map.
function buildMediaMap(media: Media[] | Map<string, Media>): Map<string, Media> {
  if (media instanceof Map) return media;
  return new Map(media.map((m) => [m.id, m]));
}

function buildRegenerateContext(args: {
  posts: Post[];
  terms: Term[];
  media: Media[] | Map<string, Media>;
  settings: SiteSettings;
}): RegenerateContext {
  const baseUrl = (args.settings.baseUrl || "").replace(/\/+$/, "");
  if (!baseUrl) throw new Error("baseUrl is empty — cannot build feed URLs.");
  return {
    posts: args.posts,
    terms: args.terms,
    mediaMap: buildMediaMap(args.media),
    settings: args.settings,
    baseUrl,
    xslHref: pathToPublicUrl(baseUrl, RSS_XSL_PATH),
  };
}

// Regenerates the site-wide /rss.xml. Returns the new site config (with
// lastPublishedPath updated) so the caller can persist.
async function regenerateSiteFeed(
  ctx: RegenerateContext,
  config: RssConfig,
): Promise<{ uploaded: string[]; deleted: string[]; nextSite: SiteFeedConfig }> {
  const uploaded: string[] = [];
  const deleted: string[] = [];

  if (!config.site.enabled) {
    // Disabled: clean up any previously uploaded file.
    if (config.site.lastPublishedPath) {
      try {
        await deleteFile(config.site.lastPublishedPath);
        deleted.push(config.site.lastPublishedPath);
      } catch {
        // 404 is silent inside flexwegApi already; non-404 surfaces a
        // toast — either way disabling shouldn't fail loudly.
      }
    }
    return {
      uploaded,
      deleted,
      nextSite: { ...config.site, lastPublishedPath: undefined },
    };
  }

  const items = gatherSiteItems(ctx.posts, ctx.terms, ctx.mediaMap, config, ctx.baseUrl);
  const xml = buildRssXml({
    title: ctx.settings.title || "Site",
    link: pathToPublicUrl(ctx.baseUrl, ""),
    description: ctx.settings.description || ctx.settings.title || "",
    feedUrl: pathToPublicUrl(ctx.baseUrl, SITE_RSS_PATH),
    language: ctx.settings.language || "en",
    items,
    xslHref: ctx.xslHref,
  });
  await uploadFile({ path: SITE_RSS_PATH, content: xml });
  uploaded.push(SITE_RSS_PATH);
  return {
    uploaded,
    deleted,
    nextSite: { ...config.site, lastPublishedPath: SITE_RSS_PATH },
  };
}

// Regenerates a single category feed. If the category referenced by the
// feed config no longer exists, the feed entry is dropped (returned
// `nextFeed` is null) and any orphaned file is deleted.
async function regenerateCategoryFeed(
  ctx: RegenerateContext,
  feed: CategoryFeedConfig,
): Promise<{ uploaded: string[]; deleted: string[]; nextFeed: CategoryFeedConfig | null }> {
  const uploaded: string[] = [];
  const deleted: string[] = [];

  const term = ctx.terms.find((t) => t.id === feed.termId && t.type === "category");
  if (!term) {
    // Term gone — drop the feed entry and clean up the file if any.
    if (feed.lastPublishedPath) {
      try {
        await deleteFile(feed.lastPublishedPath);
        deleted.push(feed.lastPublishedPath);
      } catch {
        // ignore
      }
    }
    return { uploaded, deleted, nextFeed: null };
  }

  const newPath = categoryFeedPath(term.slug);
  // Slug rename: clean up the previous path before uploading the new one.
  if (feed.lastPublishedPath && feed.lastPublishedPath !== newPath) {
    try {
      await deleteFile(feed.lastPublishedPath);
      deleted.push(feed.lastPublishedPath);
    } catch {
      // ignore
    }
  }

  const items = gatherCategoryItems(ctx.posts, ctx.terms, ctx.mediaMap, feed, ctx.baseUrl);
  const archiveLink = pathToPublicUrl(ctx.baseUrl, buildTermUrl(term));
  const channelTitle = `${ctx.settings.title || "Site"} — ${term.name}`;
  const xml = buildRssXml({
    title: channelTitle,
    link: archiveLink,
    description: term.description || term.name,
    feedUrl: pathToPublicUrl(ctx.baseUrl, newPath),
    language: ctx.settings.language || "en",
    items,
    xslHref: ctx.xslHref,
  });
  await uploadFile({ path: newPath, content: xml });
  uploaded.push(newPath);
  return {
    uploaded,
    deleted,
    nextFeed: { ...feed, lastPublishedPath: newPath },
  };
}

// Regenerate every feed (site + every category). Used by the Force
// regenerate button and as a safe fallback when the user wants to make
// sure the public site matches the config exactly.
export async function regenerateAllFeeds(args: {
  posts: Post[];
  terms: Term[];
  media: Media[] | Map<string, Media>;
  settings: SiteSettings;
  config: RssConfig;
}): Promise<{ result: RegenerateResult; nextConfig: RssConfig }> {
  const ctx = buildRegenerateContext(args);
  const uploaded: string[] = [];
  const deleted: string[] = [];

  const siteOut = await regenerateSiteFeed(ctx, args.config);
  uploaded.push(...siteOut.uploaded);
  deleted.push(...siteOut.deleted);

  const nextCategory: CategoryFeedConfig[] = [];
  for (const feed of args.config.categoryFeeds) {
    const out = await regenerateCategoryFeed(ctx, feed);
    uploaded.push(...out.uploaded);
    deleted.push(...out.deleted);
    if (out.nextFeed) nextCategory.push(out.nextFeed);
  }

  return {
    result: { uploaded, deleted },
    nextConfig: { site: siteOut.nextSite, categoryFeeds: nextCategory },
  };
}

// Used by lifecycle hooks. Regen only the feeds impacted by a single
// post: the site feed (when enabled and the post's category isn't
// excluded) and the matching category feed (when one exists for the
// post's primaryTermId). Returns the (possibly mutated) config so the
// action handler can persist updated lastPublishedPath fields.
export async function regenerateForPost(args: {
  post: Post;
  posts: Post[];
  terms: Term[];
  media: Media[] | Map<string, Media>;
  settings: SiteSettings;
  config: RssConfig;
}): Promise<{ result: RegenerateResult; nextConfig: RssConfig }> {
  const ctx = buildRegenerateContext(args);
  const uploaded: string[] = [];
  const deleted: string[] = [];
  let nextSite = args.config.site;
  const nextCategory = [...args.config.categoryFeeds];

  // Site feed
  if (args.config.site.enabled) {
    const excluded = new Set(args.config.site.excludedTermIds);
    if (!args.post.primaryTermId || !excluded.has(args.post.primaryTermId)) {
      const siteOut = await regenerateSiteFeed(ctx, args.config);
      uploaded.push(...siteOut.uploaded);
      deleted.push(...siteOut.deleted);
      nextSite = siteOut.nextSite;
    }
  }

  // Matching category feed
  if (args.post.primaryTermId) {
    const idx = nextCategory.findIndex((f) => f.termId === args.post.primaryTermId);
    if (idx >= 0) {
      const out = await regenerateCategoryFeed(ctx, nextCategory[idx]!);
      uploaded.push(...out.uploaded);
      deleted.push(...out.deleted);
      if (out.nextFeed) {
        nextCategory[idx] = out.nextFeed;
      } else {
        // Term gone — remove from config.
        nextCategory.splice(idx, 1);
      }
    }
  }

  return {
    result: { uploaded, deleted },
    nextConfig: { site: nextSite, categoryFeeds: nextCategory },
  };
}

export async function regenerateStylesheet(args: { settings: SiteSettings }): Promise<void> {
  await uploadFile({
    path: RSS_XSL_PATH,
    content: buildRssXsl(args.settings.language),
  });
}

// Save-flow cleanup: delete files for feeds disabled or removed in the
// new config. Mutates lastPublishedPath fields on the next config so a
// disabled feed re-enabled later can no longer point at a stale file.
export async function cleanupRemovedFeeds(args: {
  prevConfig: RssConfig;
  nextConfig: RssConfig;
}): Promise<{ deleted: string[]; nextConfig: RssConfig }> {
  const deleted: string[] = [];
  let nextSite = args.nextConfig.site;

  // Site RSS toggled off (or already off but lastPublishedPath leftover
  // from a previous on-state — best-effort delete in that case too).
  if (args.prevConfig.site.enabled && !args.nextConfig.site.enabled) {
    const stale = args.prevConfig.site.lastPublishedPath ?? SITE_RSS_PATH;
    try {
      await deleteFile(stale);
      deleted.push(stale);
    } catch {
      // ignore
    }
    nextSite = { ...nextSite, lastPublishedPath: undefined };
  }

  // Category feeds removed entirely from the list.
  const nextIds = new Set(args.nextConfig.categoryFeeds.map((f) => f.termId));
  for (const prev of args.prevConfig.categoryFeeds) {
    if (nextIds.has(prev.termId)) continue;
    if (prev.lastPublishedPath) {
      try {
        await deleteFile(prev.lastPublishedPath);
        deleted.push(prev.lastPublishedPath);
      } catch {
        // ignore
      }
    }
  }

  return {
    deleted,
    nextConfig: { site: nextSite, categoryFeeds: args.nextConfig.categoryFeeds },
  };
}
