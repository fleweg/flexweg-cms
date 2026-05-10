import type { ThemeManifest } from "@flexweg/cms-runtime";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";
// Vite resolves the `?inline` suffix to a string export. The file
// itself is produced by scripts/build-theme-tailwind.mjs (wired into
// `prebuild` and `predev` in package.json) before Vite runs.
import cssText from "./theme.compiled.css?inline";
// Runtime menu loader — populates inline + burger menu containers
// from /menu.json and marks the bottom-nav active link.
import jsText from "./menu-loader.js?raw";
// Sidebar / form loader — related products + author bio + newsletter.
import jsTextPosts from "./posts-loader.js?raw";
// Catalog filter loader — Phase 6 fills it; Phase 1 ships a stub
// that no-ops when the catalog page isn't on the document.
import jsTextCatalog from "./catalog-loader.js?raw";
import { en, fr, de, es, nl, pt, ko } from "./i18n";
import type { StorefrontThemeConfig } from "./config";
import { DEFAULT_STOREFRONT_CONFIG } from "./config";
import { buildCustomCss } from "./style";
import { StorefrontSettingsPage } from "./SettingsPage";
import { transformBodyHtml } from "./blocks/transforms";
import { encodeAttrs } from "./blocks/util";
import { DEFAULT_PRODUCT_INFO_ATTRS } from "./blocks/productInfo/render";
import { heroOverlayBlock } from "./blocks/heroOverlay/manifest";
import { categoriesBentoBlock } from "./blocks/categoriesBento/manifest";
import { journalFeatureBlock } from "./blocks/journalFeature/manifest";
import { newsletterBlock } from "./blocks/newsletter/manifest";
import { productInfoBlock } from "./blocks/productInfo/manifest";
import { productGalleryBlock } from "./blocks/productGallery/manifest";
import { productFeaturesBlock } from "./blocks/productFeatures/manifest";
import { reviewsListBlock } from "./blocks/reviewsList/manifest";
import { republishCatalog } from "./services/catalogPublisher";
import type {
  MenuFilterContext,
  MenuJson,
  PublishContext,
  ResolvedMenuItem,
} from "@flexweg/cms-runtime";

// Extra runtime asset registered on the manifest so the build script
// (scripts/build-themes.mjs) writes it to the public theme-assets
// folder alongside `<id>-menu.js` and `<id>-posts.js`. The contract
// is the same: declare a `?raw` import and reference it in
// BaseLayout via a deterministic path.
//
// We only have two slots on ThemeManifest today (`jsText`,
// `jsTextPosts`). Carrying jsTextCatalog directly on the manifest
// would require widening the type. As a minimal change, we attach
// it via an extension hook — the build script picks it up if
// present, and existing themes are unaffected. See
// scripts/build-themes.mjs for the consumer side.
//
// Declared as `unknown` so this file typechecks today; the build
// script's reflection picks it up at the symbol name.
type ManifestWithCatalogJs = ThemeManifest<StorefrontThemeConfig> & {
  jsTextCatalog?: string;
};

// Seed markdown for new posts. The storefront theme inserts an empty
// product-info block at the top of every new post so editors don't
// have to remember to add it. The marker mirrors what the Tiptap
// node would emit at renderHTML time (an empty <div> with the block
// id + base64-encoded default attrs). tiptap-markdown's `html: true`
// re-parses this raw HTML back into the live block on first render —
// the user can edit attrs from the inspector or delete the block
// entirely if the post isn't a product. Pages stay empty (no seed)
// since they're typically about / contact / static pages.
const DEFAULT_PRODUCT_INFO_MARKER = `<div data-cms-block="storefront/product-info" data-attrs="${encodeAttrs(
  DEFAULT_PRODUCT_INFO_ATTRS,
)}"></div>\n\n`;

export const manifest: ManifestWithCatalogJs = {
  id: "storefront",
  name: "Storefront",
  version: "0.1.0",
  description:
    "Storefront theme for storefront / e-commerce sites — Tailwind-based, sage + terracotta Material 3 palette, Playfair Display + Inter typography. Built for product catalogs with optional client-side filtering.",
  scssEntry: "theme.css",
  cssText,
  jsText,
  jsTextPosts,
  jsTextCatalog,
  i18n: { en, fr, de, es, nl, pt, ko },
  defaultPostMarkdown: {
    post: DEFAULT_PRODUCT_INFO_MARKER,
  },
  settings: {
    navLabelKey: "title",
    defaultConfig: DEFAULT_STOREFRONT_CONFIG,
    component: StorefrontSettingsPage,
  },
  // Bakes the user's Style overrides (palette + font pair) into the
  // CSS uploaded by `Sync theme assets`.
  compileCss: (config) => buildCustomCss(cssText, config.style),
  // Image catalog used by the upload pipeline. Mirrors corporate +
  // magazine so a site switching between themes doesn't have to
  // re-process its media library.
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormat: "webp",
    quality: 80,
    formats: {
      small: { width: 480, height: 600, fit: "cover" },
      medium: { width: 800, height: 1000, fit: "cover" },
      large: { width: 1600, height: 1200, fit: "cover" },
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
  // Editor blocks. Phase 2 wires the four user-insertable home
  // blocks. Phase 4 will append productInfo, productGallery,
  // productFeatures, reviewsList. (productGrid is a render helper
  // called by HomeTemplate, not a user-insertable block.)
  blocks: [
    heroOverlayBlock,
    categoriesBentoBlock,
    journalFeatureBlock,
    newsletterBlock,
    productInfoBlock,
    productGalleryBlock,
    productFeaturesBlock,
    reviewsListBlock,
  ] as ThemeManifest["blocks"],
  register(api) {
    api.addFilter<string>("post.html.body", (html, ...rest) =>
      transformBodyHtml(html, rest[0] as Parameters<typeof transformBodyHtml>[1]),
    );

    // Catalog feature — when enabled in theme settings, regenerate
    // /data/products.json + the catalog HTML page on every
    // publish/unpublish/delete. Best-effort: failures are logged and
    // toasted via flexwegApi but never abort the parent publish.
    const onCatalogTouch = (_post: unknown, ...rest: unknown[]) => {
      const ctx = rest[0] as PublishContext | undefined;
      if (!ctx) return;
      void republishCatalog(ctx);
    };
    api.addAction("publish.complete", onCatalogTouch);
    api.addAction("post.unpublished", onCatalogTouch);
    api.addAction("post.deleted", onCatalogTouch);

    // Menu auto-link — when catalog.addToMenu is on, append a header
    // entry pointing at the catalog slug. Same pattern flexweg-rss
    // uses for footer feed entries. Skipped silently when the
    // active theme isn't storefront (the filter still fires for
    // every theme).
    api.addFilter<MenuJson>("menu.json.resolved", (menu, ...rest) => {
      const ctx = rest[0] as MenuFilterContext | undefined;
      if (!ctx) return menu;
      if (ctx.settings.activeThemeId !== "storefront") return menu;
      const themeConfig = (ctx.settings.themeConfigs as Record<string, unknown> | undefined)?.["storefront"] as
        | StorefrontThemeConfig
        | undefined;
      const catalog = themeConfig?.catalog;
      if (!catalog?.enabled || !catalog.addToMenu) return menu;
      const label = catalog.menuLabel || "Catalog";
      const href = `/${(catalog.slug || "catalog.html").replace(/^\/+/, "")}`;
      const entry: ResolvedMenuItem = {
        id: `storefront-catalog-${href}`,
        label,
        href,
        children: [],
      };
      // Append at the end of the existing header. Avoid duplicates
      // when the user has manually added the same href in MenusPage.
      const existing = menu.header.find(
        (i) => i.href === href || (i.label && i.label === label),
      );
      if (existing) return menu;
      return { ...menu, header: [...menu.header, entry] };
    });
  },
};
