// Marketplace Core — Flexweg CMS external theme.
//
// Build: `npm install --legacy-peer-deps && npm run build` produces
// `dist/bundle.js` + `marketplace-core.zip`. Upload the ZIP via
// /admin/#/themes → "Install theme" to register the theme.

import cssText from "./theme.css?raw";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import { transformBodyHtml } from "./blocks/transforms";
import { encodeAttrs } from "./blocks/util";
import type { MarketplaceThemeConfig } from "./config";
import { DEFAULT_MARKETPLACE_CONFIG } from "./config";
import { buildCustomCss } from "./style";
import { MarketplaceSettingsPage } from "./SettingsPage";
import { headerButtonsBlock } from "./blocks/headerButtons/manifest";
import { DEFAULT_HEADER_BUTTONS } from "./blocks/headerButtons/render";
import { galleryBlock } from "./blocks/gallery/manifest";
import { DEFAULT_GALLERY } from "./blocks/gallery/render";
import { specsBlock } from "./blocks/specs/manifest";
import { DEFAULT_SPECS } from "./blocks/specs/render";
import { featuresBlock } from "./blocks/features/manifest";
import { DEFAULT_FEATURES } from "./blocks/features/render";
import type { ThemeManifest } from "@flexweg/cms-runtime";

// Seed markdown auto-inserted at the top of every new POST (not
// pages — pages stay empty). User opens a new product post and sees
// 4 placeholder cards: Download buttons, Gallery, Specs, Features.
// They can edit them via the Block inspector or delete any block
// they don't need. Slash-command re-inserts a deleted block later.
const DEFAULT_POST_MARKDOWN = [
  `<div data-cms-block="marketplace-core/header-buttons" data-attrs="${encodeAttrs(DEFAULT_HEADER_BUTTONS)}"></div>`,
  `<div data-cms-block="marketplace-core/gallery" data-attrs="${encodeAttrs(DEFAULT_GALLERY)}"></div>`,
  `<div data-cms-block="marketplace-core/specs" data-attrs="${encodeAttrs(DEFAULT_SPECS)}"></div>`,
  `<div data-cms-block="marketplace-core/features" data-attrs="${encodeAttrs(DEFAULT_FEATURES)}"></div>`,
  "",
  "## Description",
  "",
  "Write the long-form description of your theme or plugin here. Markdown is supported.",
  "",
].join("\n\n");

// Theme manifest with an extension property for the per-post default
// markdown — same convention as storefront's defaultPostMarkdown.
type ManifestWithSeed = ThemeManifest<MarketplaceThemeConfig> & {
  defaultPostMarkdown?: { post?: string; page?: string };
};

const manifest: ManifestWithSeed = {
  id: "marketplace-core",
  name: "Marketplace Core",
  version: "1.1.1",
  description:
    "App-store style theme for listing themes / plugins. Modern Corporate aesthetic with ambient shadows and rounded XL corners.",
  scssEntry: "theme.css",
  cssText,
  i18n: { en, fr, de, es, nl, pt, ko },
  defaultPostMarkdown: { post: DEFAULT_POST_MARKDOWN },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_MARKETPLACE_CONFIG,
    component: MarketplaceSettingsPage,
  },
  compileCss: (config) => buildCustomCss(cssText, config.style),
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormat: "webp",
    quality: 82,
    formats: {
      small: { width: 480, height: 300, fit: "cover" },
      medium: { width: 800, height: 500, fit: "cover" },
      large: { width: 1600, height: 1000, fit: "cover" },
    },
    defaultFormat: "medium",
  },
  templates: {
    base: BaseLayout,
    home: HomeTemplate,
    single: SingleTemplate,
    category: CategoryTemplate,
    author: AuthorTemplate,
    notFound: NotFoundTemplate,
  },
  blocks: [headerButtonsBlock, galleryBlock, specsBlock, featuresBlock],
  register(api) {
    // Transform marketplace-core/* block markers into rich HTML at
    // publish time. Other themes' markers pass through untouched.
    api.addFilter<string>("post.html.body", (html) => transformBodyHtml(html));
  },
};

export default manifest;
