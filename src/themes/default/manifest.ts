import type { ThemeManifest } from "../types";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";
// Vite compiles the SCSS at build time and the `?inline` suffix returns the
// resulting CSS as a string instead of injecting a <style> tag. This is what
// the "Sync theme assets" button uploads to Flexweg.
import cssText from "./theme.scss?inline";
// `?raw` imports return the file contents verbatim. Used here to embed
// the runtime scripts (menu loader + posts loader) inside the admin
// bundle so they ship with the theme assets — written to
// dist/theme-assets/<id>-{menu,posts}.js by the build script and
// uploaded via the same "Sync theme assets" flow as the CSS.
import jsText from "./menu-loader.js?raw";
import jsTextPosts from "./posts-loader.js?raw";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import { DEFAULT_THEME_CONFIG, type DefaultThemeConfig } from "./config";
import { DefaultThemeSettingsPage } from "./SettingsPage";
import { buildCustomCss } from "./style";
import { heroBlock } from "./blocks/hero/manifest";
import { postsListBlock } from "./blocks/postsList/manifest";
import { categoryPostsBlock } from "./blocks/categoryPosts/manifest";
import { ctaBlock } from "./blocks/cta/manifest";
import { categoriesPillsBlock } from "./blocks/categoriesPills/manifest";
import { spacerBlock } from "./blocks/spacer/manifest";
import { transformBodyHtml } from "./blocks/transforms";

export const manifest: ThemeManifest<DefaultThemeConfig> = {
  id: "default",
  name: "Default",
  version: "1.0.0",
  description: "Minimal blog/site theme that ships with Flexweg CMS.",
  scssEntry: "theme.scss",
  cssText,
  jsText,
  jsTextPosts,
  i18n: { en, fr, de, es, nl, pt, ko },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_THEME_CONFIG,
    component: DefaultThemeSettingsPage,
  },
  // Bakes the user's Style overrides (color palette, fonts, spacing,
  // radius) into the CSS uploaded by `Sync theme assets`. Without
  // this hook, syncing would push the bundled CSS verbatim and erase
  // the customizations until the next Save & apply from Theme Settings.
  compileCss: (config) => buildCustomCss(cssText, config.style),
  // Image catalog used by the upload pipeline. WebP at 80 strikes a fair
  // balance between weight and quality for blog imagery; raise the quality
  // here (or override per-format) if your site is photo-heavy.
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormat: "webp",
    quality: 80,
    formats: {
      // Square teaser used in listings (home + category + author).
      small: { width: 480, height: 480, fit: "cover" },
      // Default size — used by Card.tsx and any template that calls
      // pickFormat(view) without a specific name.
      medium: { width: 800, height: 800, fit: "cover" },
      // Wide hero shown at the top of single posts.
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
  // Layout blocks the editor exposes when this theme is active. Each
  // block ships its own Tiptap node + NodeView + inspector and a
  // pure publish-time renderer in blocks/<id>/render.ts. The
  // post.html.body filter below glues them together — see
  // blocks/transforms.ts for the two-pass dedup pipeline.
  blocks: [
    heroBlock,
    postsListBlock,
    categoryPostsBlock,
    ctaBlock,
    categoriesPillsBlock,
    spacerBlock,
  ] as ThemeManifest["blocks"],
  register(api) {
    // Single filter: scans the rendered post body for our block
    // markers and replaces each with its publish-time HTML. Reads
    // the full PublishContext via setCurrentPublishContext (set by
    // services/publisher.ts) so blocks can resolve queries against
    // posts / terms / media without widening the filter signature.
    api.addFilter<string>("post.html.body", (html, ...rest) =>
      transformBodyHtml(html, rest[0] as Parameters<typeof transformBodyHtml>[1]),
    );
  },
};
