import type { Post, Term } from "@flexweg/cms-runtime";
import type { MultilangConfig, PostTranslation, TermTranslation } from "../types";
import { isPrimaryLanguage } from "./config";

// Localised post URL — `<lang>/<term>/<slug>.html` for secondary
// languages, `<term>/<slug>.html` for the primary. Tag-only posts
// don't go through here (categories drive URLs).
export interface BuildLocalizedPostUrlInput {
  post: Pick<Post, "type">;
  trans: PostTranslation;
  primaryTermTrans?: TermTranslation;
  // The category's primary-language slug. Used as a fallback when the
  // category has no translation in the target language.
  primaryTermSlug?: string;
  language: string;
  config: MultilangConfig;
}

export function buildLocalizedPostUrl(input: BuildLocalizedPostUrlInput): string {
  const { post, trans, primaryTermTrans, primaryTermSlug, language, config } = input;
  const prefix = isPrimaryLanguage(config, language) ? "" : `${language}/`;
  if (post.type === "page") {
    return `${prefix}${trans.slug}.html`;
  }
  const categorySlug = primaryTermTrans?.slug ?? primaryTermSlug;
  if (!categorySlug) {
    return `${prefix}${trans.slug}.html`;
  }
  return `${prefix}${categorySlug}/${trans.slug}.html`;
}

// Localised category archive URL — `<lang>/<term-slug>/index.html`
// for secondary, `<term-slug>/index.html` for primary.
export function buildLocalizedTermUrl(
  term: Pick<Term, "type">,
  trans: TermTranslation,
  language: string,
  config: MultilangConfig,
): string {
  if (term.type !== "category") {
    throw new Error(`buildLocalizedTermUrl: term type "${term.type}" is not supported (categories only).`);
  }
  const prefix = isPrimaryLanguage(config, language) ? "" : `${language}/`;
  return `${prefix}${trans.slug}/index.html`;
}

// Localised home URL — `<lang>/index.html` for secondary, `index.html`
// for primary.
export function buildLocalizedHomePath(language: string, config: MultilangConfig): string {
  return isPrimaryLanguage(config, language) ? "index.html" : `${language}/index.html`;
}

// Parses the leading language segment off a public path. Returns the
// language code + remaining path (without leading slash). Used to map
// a `currentPath` (handed to `page.head.extra`) back to the post +
// language combo that owns it.
//
//   parsePathLocale("fr/news/hello.html", config) → { language: "fr", rest: "news/hello.html" }
//   parsePathLocale("news/hello.html",    config) → { language: <primary>, rest: "news/hello.html" }
export function parsePathLocale(
  path: string,
  config: MultilangConfig,
): { language: string; rest: string } {
  const clean = path.replace(/^\/+/, "");
  const slash = clean.indexOf("/");
  if (slash > 0) {
    const head = clean.slice(0, slash);
    if (config.enabledLanguages.includes(head)) {
      return { language: head, rest: clean.slice(slash + 1) };
    }
  }
  return { language: config.primaryLanguage, rest: clean };
}

// Get the translation entry for a specific language. Returns null if
// no translation exists. The opaque `translations` field on Post/Term
// is a plain JSON map populated by this plugin's UI.
export function getPostTranslation(post: Post, language: string): PostTranslation | null {
  const map = post.translations as Record<string, PostTranslation> | undefined;
  const t = map?.[language];
  if (!t || !t.slug || !t.title) return null;
  return t;
}

export function getTermTranslation(term: Term, language: string): TermTranslation | null {
  const map = term.translations as Record<string, TermTranslation> | undefined;
  const t = map?.[language];
  if (!t || !t.slug || !t.name) return null;
  return t;
}

// For convenience: produce a synthetic "primary language" PostTranslation
// from the post's main fields. Used to feed the hreflang map with the
// primary language alongside the secondary translations.
export function postToPrimaryTranslation(post: Post): PostTranslation {
  return {
    slug: post.slug,
    title: post.title,
    contentMarkdown: post.contentMarkdown,
    excerpt: post.excerpt,
    seo: post.seo,
  };
}

export function termToPrimaryTranslation(term: Term): TermTranslation {
  return {
    slug: term.slug,
    name: term.name,
    description: term.description,
    seo: term.seo,
  };
}
