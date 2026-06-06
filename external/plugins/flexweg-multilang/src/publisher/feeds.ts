import {
  deleteFile,
  markdownToPlainText,
  pathToPublicUrl,
  type Post,
  type PublishContext,
  type RssItem,
  type RssLocaleEntry,
  type Term,
} from "@flexweg/cms-runtime";
import { getMultilangConfig, isPrimaryLanguage } from "../core/config";
import {
  buildLocalizedHomePath,
  buildLocalizedPostUrl,
  getPostTranslation,
  getTermTranslation,
} from "../core/urls";

const ITEM_COUNT = 20;

// The path of the per-language site feed file. Symmetric with the
// primary `/rss.xml` produced by flexweg-rss.
function feedPath(language: string): string {
  return `${language}/rss.xml`;
}

// Legacy paths from multilang ≤ 1.6.1 — the standalone feed generator
// shipped before the `rss.site.locales` filter wrote files at these
// locations. Cleaned up best-effort on the next publish (idempotent,
// 404 silent) so deployments upgrading to ≥ 1.6.2 don't leave orphan
// files on the public site.
function legacyFeedPath(language: string): string {
  return `${language}/feed.xml`;
}
function legacyCategoryFeedPath(language: string, termSlug: string): string {
  return `${language}/${termSlug}/${termSlug}.xml`;
}

// Filter handler for `rss.site.locales` fired by flexweg-rss inside
// regenerateSiteFeed. Returns one entry per non-primary enabled language
// describing where to upload the localised feed and which items it
// should contain. flexweg-rss handles XML serialization + upload +
// orphan cleanup (via lastLocalePaths). The handler short-circuits when
// multilang is configured with no secondary language so a unilingual
// install pays no cost.
export function buildLocalizedSiteEntries(args: {
  posts: Post[];
  terms: Term[];
  settings: PublishContext["settings"];
  baseUrl: string;
}): RssLocaleEntry[] {
  const config = getMultilangConfig(args.settings);
  if (config.enabledLanguages.length === 0) return [];

  const entries: RssLocaleEntry[] = [];
  for (const language of config.enabledLanguages) {
    if (isPrimaryLanguage(config, language)) continue;
    const items = collectSiteItems(args.posts, args.terms, language, config, args.baseUrl);
    entries.push({
      language,
      path: feedPath(language),
      channelTitle: `${args.settings.title || "Site"} — ${language.toUpperCase()}`,
      channelLink: pathToPublicUrl(args.baseUrl, buildLocalizedHomePath(language, config)),
      channelDescription: args.settings.description || args.settings.title || "",
      items,
    });
  }
  return entries;
}

// Best-effort sweep of files written by the standalone generator that
// shipped in multilang ≤ 1.6.1. Safe to call on every publish — 404 is
// silent inside deleteFile so once the legacy files are gone the sweep
// is free. Two file shapes existed:
//   - <lang>/feed.xml              (per-language site feed)
//   - <lang>/<term-slug>/<term-slug>.xml  (per-language category feed)
//
// We can't enumerate which (language, term) combinations were actually
// written without the previous run's bookkeeping, so we sweep the
// obvious candidates: every enabled language × every category with a
// translation for that language.
export async function cleanupLegacyLocalizedFeeds(ctx: PublishContext): Promise<void> {
  const config = getMultilangConfig(ctx.settings);
  for (const language of config.enabledLanguages) {
    if (isPrimaryLanguage(config, language)) continue;
    try {
      await deleteFile(legacyFeedPath(language));
    } catch {
      // ignore
    }
    for (const term of ctx.terms) {
      if (term.type !== "category") continue;
      const termTrans = getTermTranslation(term, language);
      if (!termTrans) continue;
      try {
        await deleteFile(legacyCategoryFeedPath(language, termTrans.slug));
      } catch {
        // ignore
      }
    }
  }
}

function collectSiteItems(
  posts: Post[],
  terms: Term[],
  language: string,
  config: ReturnType<typeof getMultilangConfig>,
  baseUrl: string,
): RssItem[] {
  return posts
    .filter((p) => p.status === "online")
    .map((p) => postToRssItem(p, terms, language, config, baseUrl))
    .filter((i): i is RssItem => i !== null)
    .sort((a, b) => b.pubDateMs - a.pubDateMs)
    .slice(0, ITEM_COUNT);
}

function postToRssItem(
  post: Post,
  terms: Term[],
  language: string,
  config: ReturnType<typeof getMultilangConfig>,
  baseUrl: string,
): RssItem | null {
  const trans = getPostTranslation(post, language);
  if (!trans) return null;
  const term = post.primaryTermId
    ? terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const termTrans = term ? getTermTranslation(term, language) : undefined;
  if (term && !termTrans) return null;

  const path = buildLocalizedPostUrl({
    post,
    trans,
    primaryTermTrans: termTrans ?? undefined,
    primaryTermSlug: term?.slug,
    language,
    config,
  });
  const url = pathToPublicUrl(baseUrl, path);
  const description = (
    trans.excerpt && trans.excerpt.trim().length > 0
      ? trans.excerpt
      : markdownToPlainText(trans.contentMarkdown, 300)
  ).trim();
  const pubDateMs =
    post.publishedAt?.toMillis?.() ??
    post.updatedAt?.toMillis?.() ??
    post.createdAt?.toMillis?.() ??
    Date.now();
  return {
    title: trans.title,
    link: url,
    guid: url,
    description,
    pubDateMs,
    category: termTrans?.name,
  };
}
