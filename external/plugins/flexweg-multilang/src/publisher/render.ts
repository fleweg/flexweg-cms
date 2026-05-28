import {
  getActiveTheme,
  renderHome,
  renderMarkdown,
  renderPageToHtml,
  markdownToPlainText,
  type Post,
  type PublishContext,
  type Term,
  type BaseLayoutProps,
} from "@flexweg/cms-runtime";
import type { MultilangConfig, PostTranslation, TermTranslation } from "../types";
import {
  buildLocalizedHomePath,
  buildLocalizedPostUrl,
  buildLocalizedTermUrl,
  getPostTranslation,
  getTermTranslation,
  postToPrimaryTranslation,
  termToPrimaryTranslation,
} from "../core/urls";
import { isPrimaryLanguage } from "../core/config";

// Builds a SHADOW PublishContext for a given language. Each post + term
// is replaced with a "translated view" whose title / slug / content
// are the localised values. Critically, the term.slug is PREFIXED with
// the language code (e.g. "fr/actualites") so the publisher's standard
// `buildPostUrl` produces the right URL (`fr/actualites/bonjour.html`)
// without us having to monkey-patch URL generation. Pages get the
// prefix on their own slug for the same reason.
function buildLocalizedShadowCtx(
  ctx: PublishContext,
  language: string,
  config: MultilangConfig,
): PublishContext {
  const isPrimary = isPrimaryLanguage(config, language);
  const langPrefix = isPrimary ? "" : `${language}/`;

  // Override `settings.language` to the target locale so theme
  // templates that read `pickPublicLocale(site.settings.language)`
  // (e.g. for i18n strings or Intl.DateTimeFormat) pick the FR
  // bundle on FR pages. The original site language stays unchanged
  // outside this shadow ctx.
  const localizedSettings = { ...ctx.settings, language };

  // Shadow terms — only categories carry slug prefixing. Tags stay
  // as-is because they don't drive URLs.
  const shadowTerms: Term[] = ctx.terms.map((term) => {
    if (term.type !== "category") return term;
    const trans = isPrimary
      ? termToPrimaryTranslation(term)
      : getTermTranslation(term, language);
    if (!trans) return term;
    return {
      ...term,
      name: trans.name,
      // Prefix with language code so buildPostUrl produces
      // <lang>/<term-slug>/<post-slug>.html for posts and
      // <lang>/<term-slug>/index.html for the archive itself.
      slug: `${langPrefix}${trans.slug}`,
      description: trans.description,
    };
  });

  // Shadow posts — keep only entities that have a translation for
  // this language (primary keeps everything). Replace title, slug,
  // content, excerpt with the translated values. For pages we also
  // prefix the slug with `<lang>/` because pages live at root.
  const transformPost = (p: Post): Post | null => {
    const trans = isPrimary
      ? postToPrimaryTranslation(p)
      : getPostTranslation(p, language);
    if (!trans) return null;
    // For posts with a category we leave post.slug as the localised
    // post slug; the category's `<lang>/<term-slug>` already carries
    // the prefix. For pages (or posts without category) we must
    // prefix the post.slug directly since buildPostUrl emits just
    // `<slug>.html`.
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

  const shadowPosts = ctx.posts.map(transformPost).filter((p): p is Post => p !== null);
  const shadowPages = ctx.pages.map(transformPost).filter((p): p is Post => p !== null);

  return {
    ...ctx,
    settings: localizedSettings,
    posts: shadowPosts,
    pages: shadowPages,
    terms: shadowTerms,
  };
}

// Renders the localised home by delegating to the publisher's
// renderHome with a shadow ctx. The active theme renders exactly as
// for the primary home — hero variants, magazine sidebar widgets,
// static-page mode, all of it — but with translated content and
// `<html lang>` set per locale.
export async function renderLocalizedHome(args: {
  language: string;
  ctx: PublishContext;
  config: MultilangConfig;
}): Promise<string> {
  const { language, ctx, config } = args;

  // Per-language static-page home — when configured via
  // settings.pluginConfigs.flexweg-multilang.homePages[lang], we wire
  // it into the shadow ctx as the homePageId so the theme's normal
  // static-page mode kicks in.
  const homePageId = config.homePages?.[language];
  const settings =
    homePageId
      ? { ...ctx.settings, homeMode: "static-page" as const, homePageId }
      : ctx.settings;

  const shadowCtx = buildLocalizedShadowCtx({ ...ctx, settings }, language, config);
  return renderHome(shadowCtx, {
    homePath: buildLocalizedHomePath(language, config),
    currentLocale: language,
  });
}

// Renders a localised single-post page. Each post variant is published
// independently (cleanup + bookkeeping handled by the publisher's
// `publish.additional` hook), so this only renders ONE post at a time.
export function renderLocalizedSingle(args: {
  post: Post;
  trans: PostTranslation;
  termTrans: TermTranslation | undefined;
  language: string;
  ctx: PublishContext;
  config: MultilangConfig;
}): string {
  const { post, trans, termTrans, language, ctx, config } = args;
  const theme = getActiveTheme(ctx.settings.activeThemeId);

  // Build a minimal SiteContext clone for the translated render —
  // settings.language is the target locale (drives theme i18n +
  // Intl.DateTimeFormat) and homePath points at the localised home
  // (drives the Header logo href). Menus stay empty: the runtime
  // menu-loader.js fetches /menu.json client-side.
  const site = {
    settings: { ...ctx.settings, language },
    resolvedMenus: { header: [], footer: [] },
    themeCssPath: `theme-assets/${ctx.settings.activeThemeId}.css`,
    themeConfig: undefined,
    homePath: isPrimaryLanguage(config, language)
      ? "/index.html"
      : `/${language}/index.html`,
  };

  const bodyHtml = renderMarkdown(trans.contentMarkdown);
  const tags = ctx.terms.filter((t) => post.termIds.includes(t.id) && t.type === "tag");
  const primaryTerm = post.primaryTermId
    ? ctx.terms.find((t) => t.id === post.primaryTermId && t.type === "category")
    : undefined;
  const author = ctx.authorLookup(post.authorId);
  const hero = post.heroMediaId ? ctx.media.get(post.heroMediaId) : undefined;
  const description = trans.seo?.description ?? markdownToPlainText(trans.contentMarkdown, 160);

  // The term we hand to the theme drives the breadcrumb's category
  // link (via buildTermUrl on the theme side) and any other URL the
  // template builds from the primaryTerm. Prefix the slug with
  // `<lang>/` for non-primary languages so the resulting href is
  // `/fr/<localised>/index.html` instead of `/<localised>/index.html`
  // (which would 404). Same trick as buildLocalizedShadowCtx.
  let localisedTerm: Term | undefined = primaryTerm;
  if (primaryTerm && termTrans) {
    const isPrimary = isPrimaryLanguage(config, language);
    const langPrefix = isPrimary ? "" : `${language}/`;
    localisedTerm = {
      ...primaryTerm,
      name: termTrans.name,
      slug: `${langPrefix}${termTrans.slug}`,
      description: termTrans.description,
    };
  }

  const currentPath = buildLocalizedPostUrl({
    post,
    trans,
    primaryTermTrans: termTrans,
    primaryTermSlug: primaryTerm?.slug,
    language,
    config,
  });

  const templateProps = {
    site,
    post: {
      ...post,
      title: trans.title,
      slug: trans.slug,
      contentMarkdown: trans.contentMarkdown,
      excerpt: trans.excerpt,
      seo: trans.seo,
    },
    bodyHtml,
    author,
    hero: hero
      ? {
          alt: hero.alt,
          caption: hero.caption,
          default: hero.formats?.[hero.defaultFormat ?? ""]?.url ?? hero.url ?? "",
          formats: hero.formats ?? {},
        }
      : undefined,
    primaryTerm: localisedTerm,
    tags,
  };

  const baseProps: Omit<BaseLayoutProps, "children" | "extraHead"> = {
    site,
    pageTitle: trans.seo?.title ?? trans.title,
    pageDescription: description || undefined,
    ogImage: trans.seo?.ogImage,
    currentPath,
    currentLocale: language,
  };

  return renderPageToHtml({
    base: theme.templates.base,
    baseProps,
    template: theme.templates.single,
    templateProps,
  });
}

// Renders a localised category archive. Same delegation trick as the
// home: build a shadow ctx with localised terms + filtered posts, and
// reuse the active theme's category template via renderPageToHtml.
export function renderLocalizedCategory(args: {
  term: Term;
  termTrans: TermTranslation;
  language: string;
  ctx: PublishContext;
  config: MultilangConfig;
}): string {
  const { term, termTrans, language, ctx, config } = args;
  const theme = getActiveTheme(ctx.settings.activeThemeId);
  const site = {
    settings: { ...ctx.settings, language },
    resolvedMenus: { header: [], footer: [] },
    themeCssPath: `theme-assets/${ctx.settings.activeThemeId}.css`,
    themeConfig: undefined,
    homePath: isPrimaryLanguage(config, language)
      ? "/index.html"
      : `/${language}/index.html`,
  };

  const localisedTerm: Term = {
    ...term,
    name: termTrans.name,
    slug: termTrans.slug,
    description: termTrans.description,
  };

  // Build CardPost-like entries for the template. Each post in this
  // category gets its localised title + URL.
  const isPrimary = isPrimaryLanguage(config, language);
  const langPrefix = isPrimary ? "" : `${language}/`;
  const cards = ctx.posts
    .filter((p) => p.status === "online" && p.primaryTermId === term.id)
    .filter((p) => (isPrimary ? true : getPostTranslation(p, language) !== null))
    .map((p) => {
      const trans = isPrimary
        ? postToPrimaryTranslation(p)
        : getPostTranslation(p, language)!;
      const url = buildLocalizedPostUrl({
        post: p,
        trans,
        primaryTermTrans: termTrans,
        primaryTermSlug: term.slug,
        language,
        config,
      });
      const hero = p.heroMediaId ? ctx.media.get(p.heroMediaId) : undefined;
      return {
        ...p,
        title: trans.title,
        slug: trans.slug,
        excerpt: trans.excerpt,
        url,
        hero: hero
          ? {
              alt: hero.alt,
              caption: hero.caption,
              default: hero.formats?.[hero.defaultFormat ?? ""]?.url ?? hero.url ?? "",
              formats: hero.formats ?? {},
            }
          : undefined,
        category: {
          name: termTrans.name,
          url: `/${langPrefix}${termTrans.slug}/index.html`,
        },
      };
    });

  const templateProps = {
    site,
    term: localisedTerm,
    posts: cards,
    categoryRssUrl: undefined,
    archivesLink: undefined,
    allCategories: [],
    popularTags: [],
  };
  const currentPath = buildLocalizedTermUrl(term, termTrans, language, config);
  const baseProps: Omit<BaseLayoutProps, "children" | "extraHead"> = {
    site,
    pageTitle: termTrans.seo?.title || termTrans.name,
    pageDescription: termTrans.seo?.description || termTrans.description,
    ogImage: termTrans.seo?.ogImage,
    currentPath,
    currentLocale: language,
  };
  return renderPageToHtml({
    base: theme.templates.base,
    baseProps,
    template: theme.templates.category,
    templateProps,
  });
}
