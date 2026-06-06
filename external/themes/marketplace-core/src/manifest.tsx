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
import { i18n as runtimeI18n } from "@flexweg/cms-runtime";
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
import { landingHeroBlock } from "./blocks/landingHero/manifest";
import { featureGridBlock } from "./blocks/featureGrid/manifest";
import { featureRowBlock } from "./blocks/featureRow/manifest";
import { statsBarBlock } from "./blocks/statsBar/manifest";
import { ctaBannerBlock } from "./blocks/ctaBanner/manifest";
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
  version: "1.3.2",
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
  blocks: [
    // Product blocks — used on single product pages.
    headerButtonsBlock,
    galleryBlock,
    specsBlock,
    featuresBlock,
    // Landing blocks — used on home / about / marketing pages
    // (added in v1.3.0).
    landingHeroBlock,
    featureGridBlock,
    featureRowBlock,
    statsBarBlock,
    ctaBannerBlock,
  ],
  register(api) {
    // Transform marketplace-core/* block markers into rich HTML at
    // publish time. Other themes' markers pass through untouched.
    // The (post, ctx) tail args carry the current locale via
    // ctx.settings.language — multilang's shadow ctx swaps it to "fr"
    // for FR renders, so the code-block "Copy" / "Copier" label
    // ships per-locale in the published HTML.
    api.addFilter<string>("post.html.body", (html, _post, ctxRaw) => {
      const ctx = ctxRaw as { settings?: { language?: string } } | undefined;
      const lang = (ctx?.settings?.language || "en").toLowerCase().split("-")[0];
      const copyLabel =
        (runtimeI18n.getResource(lang, "theme-marketplace-core", "publicBaked.codeBlock.copy") as
          | string
          | undefined) ?? "Copy";
      const copiedLabel =
        (runtimeI18n.getResource(lang, "theme-marketplace-core", "publicBaked.codeBlock.copied") as
          | string
          | undefined) ?? "Copied";
      return transformBodyHtml(html, copyLabel, copiedLabel);
    });
    // Resolve doc-page siblings (prev/next pager) on the publisher
    // side so the DocSingle template doesn't have to call
    // `getCurrentPublishContext()` — which the in-tree publisher
    // clears BEFORE renderPageToHtml runs, leaving template code
    // looking at a null context. The `post.template.props` filter
    // receives the live ctx as third arg and runs while it's still
    // valid, so this is the right place to enrich props.
    api.addFilter<unknown>("post.template.props", (props, _post, ctxRaw) => {
      const ctx = ctxRaw as TemplatePropsCtx;
      const post = _post as TemplatePropsPost;
      // Doc layout is only triggered when the post has no hero — skip
      // the work for product posts that won't use siblings. The check
      // matches the dispatch logic in SingleTemplate.tsx.
      if (post.heroMediaId || !post.primaryTermId) return props;
      const siblings = resolveDocSiblings(ctx, post.id, post.primaryTermId);
      return {
        ...(props as Record<string, unknown>),
        docSiblings: siblings,
      };
    });
  },
};

// Local minimal shape of the filter arguments. We avoid importing
// PublishContext / Post types from the runtime because the
// `post.template.props` filter signature in the runtime stubs is
// already (props, post, ...) and the third arg is loose `unknown[]`.
// The narrower interfaces below capture exactly what resolveDocSiblings
// needs — defensive against shadow ctxs (multilang) that may carry
// fewer fields.
interface TemplatePropsCtx {
  posts: Array<{
    id: string;
    type: "post" | "page";
    title: string;
    slug: string;
    status: "draft" | "online";
    primaryTermId?: string;
    createdAt?: { toMillis?: () => number };
  }>;
  terms: Array<{ id: string; slug: string; type: "category" | "tag" }>;
}
interface TemplatePropsPost {
  id: string;
  heroMediaId?: string;
  primaryTermId?: string;
}

function resolveDocSiblings(
  ctx: TemplatePropsCtx,
  currentPostId: string,
  primaryTermId: string,
): Array<{ id: string; title: string; url: string }> {
  if (!ctx?.posts) return [];
  const primaryTerm = ctx.terms.find((t) => t.id === primaryTermId);
  if (!primaryTerm) return [];
  // Include the current post even if its status is still "draft" —
  // covers first-publish renders where markPostOnline runs after the
  // template render. All other siblings must be online so drafts
  // don't surface as prev/next.
  return ctx.posts
    .filter(
      (p) =>
        p.type === "post" &&
        p.primaryTermId === primaryTermId &&
        (p.id === currentPostId || p.status === "online"),
    )
    .sort((a, b) => {
      const ams = a.createdAt?.toMillis?.() ?? 0;
      const bms = b.createdAt?.toMillis?.() ?? 0;
      return ams - bms;
    })
    .map((p) => {
      // Posts without a category live at the site root
      // (`<slug>.html`); doc posts always have a primary category,
      // hence the `<term.slug>/<post.slug>.html` join. Multilang's
      // shadow ctx already carries localized term + post slugs, so
      // FR pages produce `/fr/demarrer/welcome.html` via the same
      // logic.
      return {
        id: p.id,
        title: p.title,
        url: `${primaryTerm.slug}/${p.slug}.html`,
      };
    });
}

export default manifest;
