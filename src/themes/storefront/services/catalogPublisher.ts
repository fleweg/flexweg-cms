// Storefront-side catalog page publisher.
//
// services/catalogPublisher.ts (in src/services/) handles the
// JSON building (products.json) — that's theme-agnostic in shape and
// reusable by any theme. The HTML page rendering is theme-specific
// because it depends on the storefront's CatalogTemplate, so it
// lives here. Both pieces are wired into the publisher cascade by
// the action hooks registered from manifest.ts.

import {
  buildSiteContext,
  deleteFile,
  deleteProductsJson,
  publishProductsJson,
  renderPageToHtml,
  toast,
  uploadFile,
} from "@flexweg/cms-runtime";
import type { PublishContext, SiteSettings } from "@flexweg/cms-runtime";
import { BaseLayout } from "../templates/BaseLayout";
import { CatalogTemplate } from "../templates/CatalogTemplate";
import {
  DEFAULT_STOREFRONT_CATALOG,
  DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
  type StorefrontThemeConfig,
} from "../config";

const THEME_ID = "storefront";

// Helper — pulls the live storefront config out of the publish-context
// settings, merged with defaults so unset fields don't trip the
// publisher.
function readThemeConfig(settings: SiteSettings): StorefrontThemeConfig | null {
  if (settings.activeThemeId !== THEME_ID) return null;
  const stored = (settings.themeConfigs as Record<string, unknown> | undefined)?.[THEME_ID];
  if (!stored) return null;
  // The full default tree merge happens in HomeTemplate / SingleTemplate.
  // Here we just need top-level fields (catalog + productDefaults).
  return stored as StorefrontThemeConfig;
}

// Renders the CatalogTemplate via renderPageToHtml + uploads to the
// configured slug. Idempotent — uploads even when the page hasn't
// changed (the file is small and Flexweg dedupes).
export async function publishCatalogPage(ctx: PublishContext): Promise<void> {
  const themeConfig = readThemeConfig(ctx.settings);
  const catalog = {
    ...DEFAULT_STOREFRONT_CATALOG,
    ...(themeConfig?.catalog ?? {}),
  };
  if (!catalog.enabled) return;

  const slug = (catalog.slug || DEFAULT_STOREFRONT_CATALOG.slug).replace(/^\/+/, "");
  const site = buildSiteContext(ctx);

  const html = renderPageToHtml({
    base: BaseLayout,
    baseProps: {
      site,
      pageTitle: catalog.pageTitle,
      pageDescription: catalog.pageSubtitle,
      ogImage: undefined,
      currentPath: slug,
    },
    template: CatalogTemplate,
    templateProps: { site },
  });

  await uploadFile({
    path: slug,
    content: html,
    encoding: "utf-8",
  });
}

// Cleanup helper — when the user changes the catalog slug from
// /old.html to /new.html, delete the old path. Called by the
// SettingsPage save handler. 404 is silent.
export async function cleanupOldCatalogPath(
  oldPath: string,
  newPath: string,
): Promise<void> {
  if (!oldPath || oldPath === newPath) return;
  try {
    await deleteFile(oldPath);
  } catch {
    /* swallow — already absent */
  }
}

// Combined publish — JSON + page. Called from action hooks
// (publish.complete / post.unpublished / post.deleted) and from the
// "Force regenerate" button on the settings page.
//
// Best-effort: failures are logged + surfaced via the existing
// flexwegApi toast funnel; never aborts the parent operation.
export async function republishCatalog(ctx: PublishContext): Promise<void> {
  const themeConfig = readThemeConfig(ctx.settings);
  if (!themeConfig?.catalog) return;
  if (!themeConfig.catalog.enabled) return;

  const productDefaults = {
    ...DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
    ...(themeConfig.productDefaults ?? {}),
  };
  try {
    await publishProductsJson(
      ctx.settings,
      ctx.posts,
      ctx.pages,
      ctx.terms,
      ctx.media,
      { currency: productDefaults.currency },
    );
    await publishCatalogPage(ctx);
  } catch (err) {
    console.warn("[storefront] catalog republish failed:", err);
  }
}

// Disabling the catalog feature: tear down the JSON + page so the
// public site doesn't keep serving a stale catalog.
export async function teardownCatalog(slug: string): Promise<void> {
  await deleteProductsJson();
  if (slug) {
    try {
      await deleteFile(slug.replace(/^\/+/, ""));
    } catch {
      /* swallow — already absent */
    }
  }
  // Toast is purely informative; the actual deletes are silent on
  // failure (404 == desired state).
  void toast;
}
