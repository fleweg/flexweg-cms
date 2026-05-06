import type { ThemeManifest } from "../types";
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
// Runtime menu loader — populates inline + burger menu containers
// from /menu.json. Embedded in the bundle and uploaded to
// /theme-assets/corporate-menu.js by the build script.
import jsText from "./menu-loader.js?raw";
// Runtime sidebar loader — populates [data-cms-related] +
// [data-cms-author-bio] hosts from /data/posts.json + /data/authors.json.
// Uploaded to /theme-assets/corporate-posts.js. Same path conventions
// as the magazine + default themes.
import jsTextPosts from "./posts-loader.js?raw";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import type { CorporateThemeConfig } from "./config";
import { DEFAULT_CORPORATE_CONFIG } from "./config";
import { buildCustomCss } from "./style";
import { CorporateSettingsPage } from "./SettingsPage";
import { heroOverlayBlock } from "./blocks/heroOverlay/manifest";
import { heroSplitBlock } from "./blocks/heroSplit/manifest";
import { servicesGridBlock } from "./blocks/servicesGrid/manifest";
import { ctaBannerBlock } from "./blocks/ctaBanner/manifest";
import { testimonialsBlock } from "./blocks/testimonials/manifest";
import { trustBarBlock } from "./blocks/trustBar/manifest";
import { statsGridBlock } from "./blocks/statsGrid/manifest";
import { featureStackBlock } from "./blocks/featureStack/manifest";
import { contactInfoBlock } from "./blocks/contactInfo/manifest";
import { contactFormBlock } from "./blocks/contactForm/manifest";
import { transformBodyHtml } from "./blocks/transforms";

export const manifest: ThemeManifest<CorporateThemeConfig> = {
  id: "corporate",
  name: "Corporate",
  version: "0.1.0",
  description:
    "Modern corporate / SaaS showcase theme — Tailwind-based, navy + indigo Material 3 palette, Inter typography. Built for vitrine sites, lead-gen, and content marketing.",
  // Convention name used by build-themes.mjs only as a fallback when
  // `theme.compiled.css` is missing. The corporate theme uses
  // Tailwind (compiled by build-theme-tailwind.mjs), so this entry is
  // never reached in practice.
  scssEntry: "theme.css",
  cssText,
  jsText,
  jsTextPosts,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_CORPORATE_CONFIG,
    component: CorporateSettingsPage,
  },
  // Bakes the user's Style overrides (color palette, font) into the
  // CSS uploaded by `Sync theme assets`. Without this hook, syncing
  // would push the bundled CSS verbatim and erase the customizations
  // until the next Save & apply from Theme Settings.
  compileCss: (config) => buildCustomCss(cssText, config.style),
  // Image catalog used by the upload pipeline. Mirrors the magazine
  // theme so a site switching between corporate and magazine doesn't
  // have to re-process its media library.
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
  // Editor blocks contributed by the corporate theme. Each ships a
  // Tiptap node + inspector + render.ts producer. The post.html.body
  // filter below glues them together at publish time — see
  // blocks/transforms.ts for the marker → HTML pipeline.
  // Phase 4 (testimonials, trust-bar, stats-grid, feature-stack) and
  // phase 5 (contact-info, contact-form) will append to this list.
  blocks: [
    heroOverlayBlock,
    heroSplitBlock,
    servicesGridBlock,
    ctaBannerBlock,
    testimonialsBlock,
    trustBarBlock,
    statsGridBlock,
    featureStackBlock,
    contactInfoBlock,
    contactFormBlock,
  ] as ThemeManifest["blocks"],
  register(api) {
    api.addFilter<string>("post.html.body", (html, ...rest) =>
      transformBodyHtml(html, rest[0] as Parameters<typeof transformBodyHtml>[1]),
    );
  },
};
