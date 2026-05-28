import { canonicalUrl, type Post, type SiteSettings, type Term } from "@flexweg/cms-runtime";
import type { MultilangConfig } from "../types";
import {
  buildLocalizedHomePath,
  buildLocalizedPostUrl,
  buildLocalizedTermUrl,
  getPostTranslation,
  getTermTranslation,
  postToPrimaryTranslation,
  termToPrimaryTranslation,
} from "./urls";
import { isPrimaryLanguage } from "./config";

// Maps a BCP-47-ish language code to its full hreflang attribute.
// We pass the language through as-is — admins can configure region
// variants like "en-US" in their MultilangConfig and they flow into
// the markup unchanged.
function hreflangValue(lang: string): string {
  return lang;
}

function ogLocaleValue(lang: string): string {
  // Convert "fr" → "fr_FR", "en" → "en_US", "es-MX" → "es_MX",
  // "pt-BR" → "pt_BR". For two-letter codes we default to the
  // common region; admins can override by using the full code.
  const norm = lang.replace("-", "_");
  if (norm.includes("_")) return norm;
  const REGION: Record<string, string> = {
    en: "en_US",
    fr: "fr_FR",
    es: "es_ES",
    de: "de_DE",
    nl: "nl_NL",
    pt: "pt_PT",
    ko: "ko_KR",
    it: "it_IT",
    ja: "ja_JP",
  };
  return REGION[norm] ?? `${norm}_${norm.toUpperCase()}`;
}

function escapeHtml(value: string): string {
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

export interface PathAlternates {
  // `<currentPath, language>` of the page being augmented. Used to
  // emit canonical = self.
  current: { path: string; language: string };
  // Every available alternate, including the primary language and
  // the current one (Google requires self-referential hreflang).
  alternates: Array<{ language: string; path: string }>;
}

// Serialises the alternates set to the `<head>` block markup Google
// expects: `<link rel="alternate" hreflang="">` per language +
// x-default → primary + og:locale (primary) + og:locale:alternate
// (others).
//
// NOTE: we deliberately do NOT emit `<link rel="canonical">` here.
// The active theme's BaseLayout already emits one (`${baseUrl}/
// ${currentPath}`) for every page, and the publisher passes the
// localised `currentPath` (e.g. `fr/soins/bonjour.html`), so the
// theme's canonical already points at the right per-locale URL.
// Emitting a second canonical would produce a duplicate that
// Google reports as a soft SEO issue.
export function buildHreflangHtml(
  args: PathAlternates,
  baseUrl: string,
  config: MultilangConfig,
): string {
  const trimmedBase = baseUrl.replace(/\/+$/, "");
  if (!trimmedBase) return "";
  const lines: string[] = [];
  for (const alt of args.alternates) {
    const href = canonicalUrl(trimmedBase, alt.path);
    lines.push(
      `<link rel="alternate" hreflang="${escapeHtml(hreflangValue(alt.language))}" href="${escapeHtml(href)}" />`,
    );
  }
  // x-default → primary language. Always emitted, points at the
  // primary-language variant of the current entity.
  const primary = args.alternates.find((a) => a.language === config.primaryLanguage);
  if (primary) {
    const href = canonicalUrl(trimmedBase, primary.path);
    lines.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(href)}" />`);
  }
  // og:locale — current language as primary, others as alternates.
  lines.push(
    `<meta property="og:locale" content="${escapeHtml(ogLocaleValue(args.current.language))}" />`,
  );
  for (const alt of args.alternates) {
    if (alt.language === args.current.language) continue;
    lines.push(
      `<meta property="og:locale:alternate" content="${escapeHtml(ogLocaleValue(alt.language))}" />`,
    );
  }
  return lines.join("\n");
}

// Builds the inner XML for a sitemap <url> entry — the same set of
// alternates as the HTML hreflang block, but in the xhtml:link sitemap
// dialect required by Google.
//
//   <xhtml:link rel="alternate" hreflang="en" href="…"/>
//   <xhtml:link rel="alternate" hreflang="fr" href="…"/>
//   <xhtml:link rel="alternate" hreflang="x-default" href="…"/>
export function buildSitemapAlternatesXml(
  args: PathAlternates,
  baseUrl: string,
  config: MultilangConfig,
): string {
  const trimmedBase = baseUrl.replace(/\/+$/, "");
  if (!trimmedBase || args.alternates.length === 0) return "";
  const lines: string[] = [];
  for (const alt of args.alternates) {
    const href = canonicalUrl(trimmedBase, alt.path);
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="${escapeHtml(hreflangValue(alt.language))}" href="${escapeHtml(href)}"/>`,
    );
  }
  const primary = args.alternates.find((a) => a.language === config.primaryLanguage);
  if (primary) {
    const href = canonicalUrl(trimmedBase, primary.path);
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(href)}"/>`,
    );
  }
  return lines.join("\n");
}

// Computes the alternates set for a single post — every language
// where a usable translation exists. The primary language always
// counts (the post's core fields ARE its primary translation).
export function postAlternates(
  post: Post,
  terms: Term[],
  config: MultilangConfig,
): PathAlternates["alternates"] {
  const out: PathAlternates["alternates"] = [];
  for (const lang of [config.primaryLanguage, ...config.enabledLanguages]) {
    if (out.some((a) => a.language === lang)) continue;
    const trans =
      lang === config.primaryLanguage
        ? postToPrimaryTranslation(post)
        : getPostTranslation(post, lang);
    if (!trans) continue;
    const term = post.primaryTermId
      ? terms.find((t) => t.id === post.primaryTermId)
      : undefined;
    const termTrans = term
      ? lang === config.primaryLanguage
        ? termToPrimaryTranslation(term)
        : getTermTranslation(term, lang) ?? undefined
      : undefined;
    // If a category is set but missing translation for this language,
    // skip — don't fall back to the primary slug (would mix locales in
    // the URL).
    if (term && !termTrans && !isPrimaryLanguage(config, lang)) continue;
    const path = buildLocalizedPostUrl({
      post,
      trans,
      primaryTermTrans: termTrans,
      primaryTermSlug: term?.slug,
      language: lang,
      config,
    });
    out.push({ language: lang, path });
  }
  return out;
}

// Same as postAlternates but for category archives.
export function termAlternates(
  term: Term,
  config: MultilangConfig,
): PathAlternates["alternates"] {
  const out: PathAlternates["alternates"] = [];
  for (const lang of [config.primaryLanguage, ...config.enabledLanguages]) {
    if (out.some((a) => a.language === lang)) continue;
    const trans =
      lang === config.primaryLanguage
        ? termToPrimaryTranslation(term)
        : getTermTranslation(term, lang);
    if (!trans) continue;
    if (term.type !== "category") continue;
    out.push({ language: lang, path: buildLocalizedTermUrl(term, trans, lang, config) });
  }
  return out;
}

// Home alternates — always one per active language (the primary home
// is always at /index.html). The plugin doesn't skip a language when
// it has no static home page; it falls back to a basic latest-posts
// rendering, so the URL is always valid.
export function homeAlternates(config: MultilangConfig): PathAlternates["alternates"] {
  const out: PathAlternates["alternates"] = [];
  for (const lang of [config.primaryLanguage, ...config.enabledLanguages]) {
    if (out.some((a) => a.language === lang)) continue;
    out.push({ language: lang, path: buildLocalizedHomePath(lang, config) });
  }
  return out;
}

// Resolves the site's effective baseUrl from settings (stripping trailing slash).
export function resolveBaseUrl(settings: SiteSettings): string {
  return (settings.baseUrl || "").replace(/\/+$/, "");
}
