// flexweg-multilang — adds per-language translations to posts, pages,
// categories and tags. Publishes each translation under /<lang>/...
// and injects hreflang + canonical + og:locale + sitemap xhtml:link
// alternates following Google's international SEO best practices.
//
// Architecture overview (read in this order):
//   - types.ts                       — config + translation shapes
//   - core/config.ts                 — read MultilangConfig
//   - core/urls.ts                   — buildLocalizedPostUrl etc.
//   - core/hreflang.ts               — build alternates per entity
//   - core/pathRegistry.ts           — module cache for sync hooks
//   - publisher/computeAdditional.ts — `publish.additional` handler
//   - publisher/computeExtraListings.ts — `publish.extraListings` handler
//   - publisher/sitemap.ts           — 4 sitemap hook handlers
//   - publisher/feeds.ts             — per-language RSS feeds
//   - editor/TranslationsTab.tsx     — inspector tab
//   - editor/TermTranslationsSection.tsx — categories/tags edit row
//   - settings/SettingsPage.tsx      — /settings/plugin/flexweg-multilang

import { fetchAllPosts, type PluginManifest, type PublishContext, type Post } from "@flexweg/cms-runtime";
import en from "./i18n/en.json";
import fr from "./i18n/fr.json";

import { DEFAULT_MULTILANG_CONFIG, type MultilangConfig } from "./types";
import { getMultilangConfig } from "./core/config";
import {
  refreshAlternatesCache,
  refreshPathRegistry,
  lookupHreflangHtml,
} from "./core/pathRegistry";
import { computeAdditional } from "./publisher/computeAdditional";
import { computeExtraListings } from "./publisher/computeExtraListings";
import {
  indexExtra,
  newsLocales,
  setLatestConfig,
  setLatestTerms,
  urlEntry,
  urlsetNamespaces,
  urlsExtra,
} from "./publisher/sitemap";
import {
  buildLocalizedSiteEntries,
  cleanupLegacyLocalizedFeeds,
} from "./publisher/feeds";
import { publishLocalizedDataJson } from "./publisher/localizedJson";
import { SettingsPage } from "./settings/SettingsPage";
import { TermTranslationsSection } from "./editor/TermTranslationsSection";
import { variantProvider } from "./editor/variantProvider";
import { buildSwitcherScript } from "./core/switcher";

// `publish.complete` handler. Refreshes the hreflang cache + the
// alternates cache so the next page render picks up any changes
// (e.g. a translation was added/removed). Per-language RSS feeds are
// no longer written standalone here — they ride on the `rss.site.locales`
// filter so flexweg-rss's enable toggle (and orphan cleanup) controls
// them. We still sweep the ≤ 1.6.1 legacy paths once per publish so an
// upgrading deployment can clean up its old `/<lang>/feed.xml` files.
async function onPublishComplete(_post: Post, ctx: PublishContext): Promise<void> {
  const config = getMultilangConfig(ctx.settings);
  // Keep sitemap module-level state hot for filters that don't
  // receive terms/config via args.
  setLatestConfig(config);
  setLatestTerms(ctx.terms);
  refreshPathRegistry(ctx.posts, ctx.pages, ctx.terms, ctx.settings, config);
  refreshAlternatesCache(ctx.posts, ctx.pages, ctx.terms, config);
  await cleanupLegacyLocalizedFeeds(ctx);
  await publishLocalizedDataJson(ctx);
}

async function onPostUnpublishedOrDeleted(_post: Post, ctx: PublishContext): Promise<void> {
  const config = getMultilangConfig(ctx.settings);
  setLatestConfig(config);
  setLatestTerms(ctx.terms);
  refreshPathRegistry(ctx.posts, ctx.pages, ctx.terms, ctx.settings, config);
  refreshAlternatesCache(ctx.posts, ctx.pages, ctx.terms, config);
  await cleanupLegacyLocalizedFeeds(ctx);
  await publishLocalizedDataJson(ctx);
}

// Best-effort initial cache warm-up: at plugin registration we don't
// have ctx, but we can fetch directly. This makes the first page
// render after admin boot already carry hreflang tags even if no
// publish has happened yet. Also primes setCurrentSettings so the
// variant provider returns the right list of languages on the very
// first editor mount.
async function warmRegistry(): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const settings = w?.__FLEXWEG_LIVE_SETTINGS__ as unknown;
    if (!settings) return;
    const cfg = getMultilangConfig(settings as never);
    if (cfg.enabledLanguages.length === 0) return;
    const [posts, pages] = await Promise.all([
      fetchAllPosts({ type: "post" }),
      fetchAllPosts({ type: "page" }),
    ]);
    refreshPathRegistry(posts, pages, [], settings as never, cfg);
    refreshAlternatesCache(posts, pages, [], cfg);
  } catch {
    // best-effort
  }
}

const manifest: PluginManifest<MultilangConfig> = {
  id: "flexweg-multilang",
  name: "Multi-language",
  version: "1.0.0",
  description:
    "Multi-language site support — translated posts/pages/terms, hreflang SEO, per-language sitemap entries, per-language RSS feeds.",
  author: "Flexweg",
  i18n: { en, fr },
  settings: {
    navLabelKey: "settings.title",
    defaultConfig: DEFAULT_MULTILANG_CONFIG,
    component: SettingsPage,
  },
  register(api) {
    // ── Publisher hooks ──────────────────────────────────────────
    api.addFilter<unknown[]>("publish.additional", async (existing, post, ctx) => {
      return computeAdditional(
        existing as Parameters<typeof computeAdditional>[0],
        post as Post,
        ctx as PublishContext,
      );
    });
    api.addFilter<unknown[]>("publish.extraListings", async (existing, ctx) => {
      return computeExtraListings(
        existing as Parameters<typeof computeExtraListings>[0],
        ctx as PublishContext,
      );
    });

    // ── Lifecycle: keep caches + feeds hot ───────────────────────
    // `publish.before` fires BEFORE renderSingle (and therefore
    // before page.head.extra) so we refresh the pathRegistry +
    // alternates cache here. Without this, the primary-language
    // page is rendered against a stale registry and ends up
    // without `<link rel="alternate" hreflang>` tags — breaking
    // hreflang reciprocity (Google ignores the cluster if pages
    // don't all link back). The localised variants rendered later
    // would still have hreflang because computeAdditional also
    // refreshes, but only the primary suffers from the timing gap
    // without this hook.
    api.addAction("publish.before", async (_post, ctx) => {
      const c = ctx as PublishContext;
      const config = getMultilangConfig(c.settings);
      refreshPathRegistry(c.posts, c.pages, c.terms, c.settings, config);
      refreshAlternatesCache(c.posts, c.pages, c.terms, config);
    });
    // Stand-alone listings regeneration (theme menu → "Regenerate
    // home" / "Regenerate all listings" without a publish ahead).
    // Same refresh as `publish.before` so the home + category
    // archives carry hreflang on their first render too.
    api.addAction("regenerate.listings.before", async (ctx) => {
      const c = ctx as PublishContext;
      const config = getMultilangConfig(c.settings);
      refreshPathRegistry(c.posts, c.pages, c.terms, c.settings, config);
      refreshAlternatesCache(c.posts, c.pages, c.terms, config);
    });
    api.addAction("publish.complete", async (post, ctx) => {
      await onPublishComplete(post as Post, ctx as PublishContext);
    });
    api.addAction("post.unpublished", async (post, ctx) => {
      await onPostUnpublishedOrDeleted(post as Post, ctx as PublishContext);
    });
    api.addAction("post.deleted", async (post, ctx) => {
      await onPostUnpublishedOrDeleted(post as Post, ctx as PublishContext);
    });

    // ── SEO head injection ───────────────────────────────────────
    api.addFilter<string>("page.head.extra", (current, ...rest) => {
      const baseProps = rest[0] as { currentPath?: string } | undefined;
      if (!baseProps?.currentPath) return current;
      const block = lookupHreflangHtml(baseProps.currentPath);
      return block ? current + (current ? "\n" : "") + block : current;
    });

    // ── Language switcher (public side) ─────────────────────────
    // Emits a script just before `</body>` that populates
    // `[data-cms-langswitch="header"]` and `[data-cms-langswitch="footer"]`
    // containers with anchors for each alternate locale. The script
    // is per-page (alternates differ from page to page); only fires
    // when at least one secondary language is enabled AND the
    // current page has an alternate set. The toggle to show / hide
    // each container lives in the plugin settings page.
    api.addFilter<string>("page.body.end", (current, ...rest) => {
      const baseProps = rest[0] as
        | { currentPath?: string; site?: { settings?: import("@flexweg/cms-runtime").SiteSettings } }
        | undefined;
      if (!baseProps?.currentPath || !baseProps?.site?.settings) return current;
      const config = getMultilangConfig(baseProps.site.settings);
      const block = buildSwitcherScript({
        config,
        settings: baseProps.site.settings,
        currentPath: baseProps.currentPath,
      });
      return block ? current + (current ? "\n" : "") + block : current;
    });

    // ── Sitemap hooks ────────────────────────────────────────────
    api.addFilter<Record<string, string>>("sitemap.urlset.namespaces", (ns) =>
      urlsetNamespaces(ns),
    );
    api.addFilter<string>("sitemap.url.entry", (cur, ...rest) => {
      const args = rest[0] as Parameters<typeof urlEntry>[1];
      return urlEntry(cur, args);
    });
    api.addFilter<unknown[]>("sitemap.urls.extra", (existing, ...rest) => {
      const args = rest[0] as Parameters<typeof urlsExtra>[1];
      return urlsExtra(
        existing as Parameters<typeof urlsExtra>[0],
        args,
      );
    });
    api.addFilter<unknown[]>("sitemap.index.extra", (existing, ...rest) => {
      const args = rest[0] as Parameters<typeof indexExtra>[1];
      return indexExtra(
        existing as Parameters<typeof indexExtra>[0],
        args,
      );
    });
    // Per-locale news sitemap generation — paired with the
    // `sitemap.index.extra` handler above so the file references
    // and the actual file payloads stay in lock-step.
    api.addFilter<unknown[]>("sitemap.news.locales", (existing, ...rest) => {
      const args = rest[0] as Parameters<typeof newsLocales>[1];
      return newsLocales(
        existing as Parameters<typeof newsLocales>[0],
        args,
      );
    });
    // Per-locale RSS feeds — fired by flexweg-rss inside
    // regenerateSiteFeed when `site.enabled === true`. Each returned
    // entry is uploaded as `<lang>/rss.xml`; flexweg-rss tracks the
    // paths in `pluginConfigs["flexweg-rss"].site.lastLocalePaths` so a
    // later disable or language removal cleans the files up.
    api.addFilter<unknown[]>("rss.site.locales", (existing, ...rest) => {
      const args = rest[0] as Parameters<typeof buildLocalizedSiteEntries>[0];
      if (!args) return existing;
      return [
        ...(existing as Array<ReturnType<typeof buildLocalizedSiteEntries>[number]>),
        ...buildLocalizedSiteEntries(args),
      ];
    });

    // ── Editor extensibility ─────────────────────────────────────
    // Variant provider — renders language tabs above the main editor.
    // Switching tabs swaps the whole editor state (title, slug,
    // WYSIWYG, excerpt, SEO) so each language gets the full
    // identical authoring experience: blocks, drag-and-drop, image
    // picker, Tiptap inspector — all reused.
    api.registerEditorVariantProvider(variantProvider);
    // Inline section in the Categories / Tags edit modal.
    api.registerTermEditorSection({
      id: "flexweg-multilang/term-translations",
      termType: "all",
      priority: 50,
      component: TermTranslationsSection,
    });

    // ── Best-effort warm-up so hreflang appears on the first render
    //    after admin boot (before any publish fires). ──────────────
    void warmRegistry();
  },
};

export default manifest;
