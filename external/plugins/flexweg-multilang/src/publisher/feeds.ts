import {
  buildRssFeedXml,
  deleteFile,
  markdownToPlainText,
  pathToPublicUrl,
  uploadFile,
  type Post,
  type PublishContext,
  type RssItem,
  type Term,
} from "@flexweg/cms-runtime";
import { getMultilangConfig, isPrimaryLanguage } from "../core/config";
import {
  buildLocalizedHomePath,
  buildLocalizedPostUrl,
  buildLocalizedTermUrl,
  getPostTranslation,
  getTermTranslation,
} from "../core/urls";

const ITEM_COUNT = 20;

function feedPath(language: string): string {
  return `${language}/feed.xml`;
}

function categoryFeedPath(language: string, termSlug: string): string {
  return `${language}/${termSlug}/${termSlug}.xml`;
}

// Generates the per-language site + per-category feeds. Called from
// the plugin's `publish.complete` action after the primary RSS plugin
// has already run. Safe to call multiple times — uploads overwrite
// the previous version.
export async function regenerateLocalizedFeeds(ctx: PublishContext): Promise<void> {
  const config = getMultilangConfig(ctx.settings);
  if (config.enabledLanguages.length === 0) return;
  const baseUrl = (ctx.settings.baseUrl || "").replace(/\/+$/, "");
  if (!baseUrl) return;

  for (const language of config.enabledLanguages) {
    if (isPrimaryLanguage(config, language)) continue;

    // Site feed for this language.
    const items = collectSiteItems(ctx.posts, ctx.terms, language, config, baseUrl);
    const xml = buildRssFeedXml({
      title: `${ctx.settings.title || "Site"} — ${language.toUpperCase()}`,
      link: pathToPublicUrl(baseUrl, buildLocalizedHomePath(language, config)),
      description: ctx.settings.description || ctx.settings.title || "",
      feedUrl: pathToPublicUrl(baseUrl, feedPath(language)),
      language,
      items,
    });
    try {
      await uploadFile({ path: feedPath(language), content: xml });
    } catch {
      // best-effort
    }

    // Category feeds for this language.
    for (const term of ctx.terms) {
      if (term.type !== "category") continue;
      const termTrans = getTermTranslation(term, language);
      if (!termTrans) continue;
      const catItems = collectCategoryItems(
        ctx.posts,
        ctx.terms,
        term,
        language,
        config,
        baseUrl,
      );
      const catXml = buildRssFeedXml({
        title: `${ctx.settings.title || "Site"} — ${termTrans.name}`,
        link: pathToPublicUrl(baseUrl, buildLocalizedTermUrl(term, termTrans, language, config)),
        description: termTrans.description || termTrans.name,
        feedUrl: pathToPublicUrl(baseUrl, categoryFeedPath(language, termTrans.slug)),
        language,
        items: catItems,
      });
      try {
        await uploadFile({
          path: categoryFeedPath(language, termTrans.slug),
          content: catXml,
        });
      } catch {
        // best-effort
      }
    }
  }
}

// Best-effort cleanup of all per-language feed files. Called when a
// language is removed from the config or a post is fully deleted.
// Doesn't track exact paths — we just attempt the obvious locations.
// 404s are silent (deleteFile already swallows them).
export async function cleanupLocalizedFeeds(
  prevLanguages: string[],
  ctx: PublishContext,
): Promise<void> {
  for (const language of prevLanguages) {
    try {
      await deleteFile(feedPath(language));
    } catch {
      // ignore
    }
    for (const term of ctx.terms) {
      if (term.type !== "category") continue;
      const termTrans = getTermTranslation(term, language);
      if (!termTrans) continue;
      try {
        await deleteFile(categoryFeedPath(language, termTrans.slug));
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

function collectCategoryItems(
  posts: Post[],
  terms: Term[],
  term: Term,
  language: string,
  config: ReturnType<typeof getMultilangConfig>,
  baseUrl: string,
): RssItem[] {
  return posts
    .filter((p) => p.status === "online" && p.primaryTermId === term.id)
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
