import {
  publishAuthorsJson,
  publishPostsJson,
  type Post,
  type PublishContext,
  type Term,
} from "@flexweg/cms-runtime";
import type { MultilangConfig } from "../types";
import { getMultilangConfig, isPrimaryLanguage } from "../core/config";
import {
  getPostTranslation,
  getTermTranslation,
  postToPrimaryTranslation,
  termToPrimaryTranslation,
} from "../core/urls";

// Builds the shadow posts + terms used to feed the publisher's
// `publishPostsJson` (and authors version) for a non-primary locale.
// Same trick as renderHome's shadow ctx: pre-prefix term slugs with
// `<lang>/` so the internal `buildPostUrl` produces correctly-prefixed
// URLs in the JSON output.
function buildLocalizedDataCtx(
  ctx: PublishContext,
  language: string,
  config: MultilangConfig,
): { posts: Post[]; pages: Post[]; terms: Term[] } {
  const isPrimary = isPrimaryLanguage(config, language);
  const langPrefix = isPrimary ? "" : `${language}/`;

  const shadowTerms: Term[] = ctx.terms.map((term) => {
    if (term.type !== "category") return term;
    const trans = isPrimary
      ? termToPrimaryTranslation(term)
      : getTermTranslation(term, language);
    if (!trans) return term;
    return {
      ...term,
      name: trans.name,
      slug: `${langPrefix}${trans.slug}`,
      description: trans.description,
    };
  });

  const transformPost = (p: Post): Post | null => {
    const trans = isPrimary
      ? postToPrimaryTranslation(p)
      : getPostTranslation(p, language);
    if (!trans) return null;
    const isUncategorized = p.type !== "post" || !p.primaryTermId;
    return {
      ...p,
      title: trans.title,
      slug: isUncategorized ? `${langPrefix}${trans.slug}` : trans.slug,
      contentMarkdown: trans.contentMarkdown,
      excerpt: trans.excerpt,
      seo: trans.seo,
    };
  };

  return {
    posts: ctx.posts.map(transformPost).filter((p): p is Post => p !== null),
    pages: ctx.pages.map(transformPost).filter((p): p is Post => p !== null),
    terms: shadowTerms,
  };
}

// Publishes per-language `data/posts.json` + `data/authors.json` at
// `<lang>/data/posts.json` for every enabled secondary language. The
// default theme's posts-loader.js detects the locale prefix from the
// URL and fetches the matching file, so the sidebar widgets reflect
// localised titles + categories on FR pages without us touching the
// theme's runtime fetch path beyond the prefix detection.
export async function publishLocalizedDataJson(ctx: PublishContext): Promise<void> {
  const config = getMultilangConfig(ctx.settings);
  if (config.enabledLanguages.length === 0) return;

  for (const language of config.enabledLanguages) {
    if (isPrimaryLanguage(config, language)) continue;
    const shadow = buildLocalizedDataCtx(ctx, language, config);
    const localisedSettings = { ...ctx.settings, language };
    const postsPath = `${language}/data/posts.json`;
    const authorsPath = `${language}/data/authors.json`;
    try {
      await publishPostsJson(
        localisedSettings,
        shadow.posts,
        shadow.pages,
        shadow.terms,
        ctx.media,
        postsPath,
      );
    } catch {
      // best-effort
    }
    try {
      await publishAuthorsJson(
        ctx.users,
        ctx.media,
        shadow.posts,
        shadow.pages,
        authorsPath,
      );
    } catch {
      // best-effort
    }
  }
}
