import type { ThemeManifest } from "@flexweg/cms-runtime";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";
// Vite resolves the `?inline` suffix to a string export. The file
// itself is produced by scripts/build-theme-tailwind.mjs (wired into
// `prebuild` and `predev` in package.json) before Vite runs, so the
// import always succeeds.
import cssText from "./theme.compiled.css?inline";
// Runtime menu loader — populates the burger overlay and the brand
// wordmark from /data/menu.json. Embedded in the bundle and uploaded
// to /theme-assets/magazine-menu.js by the build script.
import jsText from "./menu-loader.js?raw";
// Runtime sidebar loader — populates [data-cms-related] +
// [data-cms-author-bio] hosts from /data/posts.json + /data/authors.json.
// Uploaded to /theme-assets/magazine-posts.js. Same path conventions
// as the default theme.
import jsTextPosts from "./posts-loader.js?raw";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import type { MagazineThemeConfig } from "./config";
import { DEFAULT_MAGAZINE_CONFIG } from "./config";
import { buildCustomCss } from "./style";
import { MagazineSettingsPage } from "./SettingsPage";
import { magazineHeroBlock } from "./blocks/magazineHero/manifest";
import { mostReadBlock } from "./blocks/mostRead/manifest";
import { promoCardBlock } from "./blocks/promoCard/manifest";
import { transformBodyHtml } from "./blocks/transforms";

export const manifest: ThemeManifest<MagazineThemeConfig> = {
  id: "magazine",
  name: "Magazine",
  version: "0.1.0",
  description:
    "Editorial magazine theme inspired by long-form journalism — Tailwind-based, with an editable Material 3 palette.",
  // Convention name used by build-themes.mjs only as a fallback when
  // `theme.compiled.css` is missing. The magazine theme uses Tailwind
  // (compiled by build-theme-tailwind.mjs), so this entry is never
  // reached in practice.
  scssEntry: "theme.css",
  cssText,
  jsText,
  jsTextPosts,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_MAGAZINE_CONFIG,
    component: MagazineSettingsPage,
  },
  // Bakes the user's Style overrides (color palette, fonts) into the
  // CSS uploaded by `Sync theme assets`. Without this hook, syncing
  // would push the bundled CSS verbatim and erase the customizations
  // until the next Save & apply from Theme Settings.
  compileCss: (config) => buildCustomCss(cssText, config.style),
  // Image catalog used by the upload pipeline. Mirrors the default
  // theme so a site switching from default → magazine doesn't have to
  // re-process its media library.
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormat: "webp",
    quality: 80,
    formats: {
      small: { width: 480, height: 480, fit: "cover" },
      medium: { width: 800, height: 800, fit: "cover" },
      large: { width: 1600, height: 900, fit: "cover" },
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
  // Editor blocks contributed by the magazine theme. Each ships a
  // Tiptap node + inspector + render.ts producer. The post.html.body
  // filter below glues them together at publish time — see
  // blocks/transforms.ts for the two-pass dedup pipeline (mirrors
  // the default theme's pattern).
  blocks: [
    magazineHeroBlock,
    mostReadBlock,
    promoCardBlock,
  ] as ThemeManifest["blocks"],
  register(api) {
    api.addFilter<string>("post.html.body", (html, ...rest) =>
      transformBodyHtml(html, rest[0] as Parameters<typeof transformBodyHtml>[1]),
    );
  },
  // Settings page + compileCss hook land in phase 6.
};
