import type { ThemeManifest } from "@flexweg/cms-runtime";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";
// Vite resolves the `?inline` suffix to a string. theme.compiled.css
// is produced by scripts/build-theme-tailwind.mjs before Vite runs.
import cssText from "./theme.compiled.css?inline";
import jsText from "./menu-loader.js?raw";
import jsTextPosts from "./posts-loader.js?raw";
// Project-filter loader. Picked up by build-themes.mjs via the
// jsTextFilters extension property + uploaded to
// /theme-assets/portfolio-filters.js by themeSync.ts. Same mechanism
// storefront uses for jsTextCatalog.
import jsTextFilters from "./filters-loader.js?raw";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import type { PortfolioThemeConfig } from "./config";
import { DEFAULT_PORTFOLIO_CONFIG } from "./config";
import { buildCustomCss } from "./style";
import { PortfolioSettingsPage } from "./SettingsPage";
import { transformBodyHtml } from "./blocks/transforms";
import { projectMetaBlock } from "./blocks/projectMeta/manifest";
import { storytellingBlock } from "./blocks/storytelling/manifest";
import { bentoGalleryBlock } from "./blocks/bentoGallery/manifest";
import { nextProjectBlock } from "./blocks/nextProject/manifest";

// Extension property — narrow the type locally so the manifest
// typechecks without widening ThemeManifest for a single consumer.
type ManifestWithFilters = ThemeManifest<PortfolioThemeConfig> & {
  jsTextFilters?: string;
};

export const manifest: ManifestWithFilters = {
  id: "portfolio",
  name: "Portfolio",
  version: "0.1.0",
  description:
    "The Minimalist Portfolio System — editorial canvas for designers, photographers and artists. Charcoal-on-warm-white, Playfair Display + Inter, sharp corners, zero shadows, rose accent for active state only.",
  // Tailwind pipeline — the Sass entry isn't reached because
  // theme.compiled.css exists.
  scssEntry: "theme.css",
  cssText,
  jsText,
  jsTextPosts,
  jsTextFilters,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_PORTFOLIO_CONFIG,
    component: PortfolioSettingsPage,
  },
  compileCss: (config) => buildCustomCss(cssText, config.style),
  // Image catalog tuned for photography/portfolio work — higher
  // quality (85 vs 80 default) because the audience is artists who
  // care about fidelity. Portrait 4:5 is the canonical card aspect;
  // square 1:1 covers bento sub-images; wide / hero cover full-bleed
  // sections.
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormat: "webp",
    quality: 85,
    formats: {
      portrait: { width: 800, height: 1000, fit: "cover" },
      square: { width: 800, height: 800, fit: "cover" },
      wide: { width: 1600, height: 900, fit: "cover" },
      hero: { width: 2400, height: 1500, fit: "cover" },
    },
    defaultFormat: "portrait",
  },
  templates: {
    base: BaseLayout,
    home: HomeTemplate,
    single: SingleTemplate,
    category: CategoryTemplate,
    author: AuthorTemplate,
    notFound: NotFoundTemplate,
  },
  blocks: [
    projectMetaBlock,
    storytellingBlock,
    bentoGalleryBlock,
    nextProjectBlock,
  ] as ThemeManifest["blocks"],
  register(api) {
    // Transform every portfolio/* marker emitted by the editor into
    // proper HTML at publish time. Markers from other themes pass
    // through untouched — the regex in each block's render.ts is
    // namespaced.
    api.addFilter<string>("post.html.body", (html) => transformBodyHtml(html));
  },
};
