import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import {
  DEFAULT_STOREFRONT_CATALOG,
  type StorefrontThemeConfig,
} from "../config";

// Catalog system page — published at the configurable slug
// (default `catalog.html`). The page is a SHELL: filters live in the
// sidebar, the grid is empty on render and gets filled by
// /theme-assets/storefront-catalog.js fetching /data/products.json
// at load time. FLIP animation reorders cards on filter change.
//
// This template is rendered by services/catalogPublisher (Phase 6 hook
// in publisher.ts) — never by the regular post / page pipeline. It
// receives a synthetic site / settings snapshot built from the
// publish context. The catalog config is read from
// site.themeConfig.catalog.
export interface CatalogTemplateProps {
  site: SiteContext;
}

export function CatalogTemplate({ site }: CatalogTemplateProps) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-storefront");
  const themeConfig = site.themeConfig as StorefrontThemeConfig | undefined;
  const catalog = {
    ...DEFAULT_STOREFRONT_CATALOG,
    ...(themeConfig?.catalog ?? {}),
    filters: {
      ...DEFAULT_STOREFRONT_CATALOG.filters,
      ...(themeConfig?.catalog?.filters ?? {}),
    },
  };

  // Encode filter visibility flags on the grid host so the loader
  // knows which sidebar widgets were rendered server-side and can
  // wire their listeners.
  const flagsAttr = JSON.stringify({
    search: catalog.filters.showSearch,
    category: catalog.filters.showCategoryFilter,
    tag: catalog.filters.showTagFilter,
    price: catalog.filters.showPriceRange,
    stock: catalog.filters.showStockFilter,
    sort: catalog.filters.showSortBy,
  });

  // Translated UI strings the loader needs at runtime (stock pill
  // labels, "X products" count, empty message). Encoded as JSON on
  // the grid host so the loader stays language-agnostic.
  const i18nAttr = JSON.stringify({
    inStock: t("publicBaked.inStock"),
    lowStock: t("publicBaked.lowStock"),
    outOfStock: t("publicBaked.outOfStock"),
    onOrder: t("publicBaked.onOrder"),
    productCountOne: t("publicBaked.productCountOne"),
    productCount: t("publicBaked.productCount", { count: 0 }).replace(
      "0",
      "{count}",
    ),
    empty: t("publicBaked.catalogEmpty"),
  });

  return (
    <main className="max-w-container-max mx-auto px-gutter md:px-gutter-desktop py-stack-lg pb-section-gap-desktop">
      <nav className="flex items-center gap-2 mb-stack-lg text-on-surface-variant text-label-caps font-semibold uppercase tracking-widest">
        <a className="hover:text-primary transition-colors" href="/index.html">
          {t("publicBaked.home")}
        </a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary">{catalog.pageTitle || t("publicBaked.catalogHeading")}</span>
      </nav>

      <header className="mb-stack-lg">
        <h1 className="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-sm leading-tight">
          {catalog.pageHeading || t("publicBaked.catalogHeading")}
        </h1>
        {catalog.pageSubtitle && (
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {catalog.pageSubtitle}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        <aside className="lg:col-span-3" data-cms-catalog-sidebar>
          <div className="lg:sticky lg:top-24 space-y-stack-lg">
            {catalog.filters.showSearch && (
              <div>
                <label className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-sm block">
                  {t("publicBaked.catalogSearchPlaceholder")}
                </label>
                <input
                  type="search"
                  data-cms-catalog-search
                  placeholder={t("publicBaked.catalogSearchPlaceholder")}
                  className="w-full bg-surface border border-outline-variant rounded-full px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            )}

            {catalog.filters.showCategoryFilter && (
              <div data-cms-catalog-categories>
                <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">
                  {t("publicBaked.catalogFilterCategories")}
                </h3>
                {/* Loader fills in <label><input type=checkbox> rows */}
                <div className="space-y-2 text-body-md text-on-surface-variant" data-cms-catalog-categories-host />
              </div>
            )}

            {catalog.filters.showTagFilter && (
              <div data-cms-catalog-tags>
                <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">
                  {t("publicBaked.catalogFilterTags")}
                </h3>
                <div className="flex flex-wrap gap-2" data-cms-catalog-tags-host />
              </div>
            )}

            {catalog.filters.showPriceRange && (
              <div data-cms-catalog-price>
                <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">
                  {t("publicBaked.catalogFilterPrice")}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-body-md text-on-surface-variant">
                    <span data-cms-catalog-price-min>—</span>
                    <span data-cms-catalog-price-max>—</span>
                  </div>
                  <input
                    type="range"
                    data-cms-catalog-price-slider
                    min="0"
                    max="0"
                    step="1"
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            )}

            {catalog.filters.showStockFilter && (
              <div data-cms-catalog-stock>
                <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">
                  {t("publicBaked.catalogFilterStock")}
                </h3>
                <div className="space-y-2 text-body-md" data-cms-catalog-stock-host />
              </div>
            )}
          </div>
        </aside>

        <section className="lg:col-span-9">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-stack-md mb-stack-md">
            <p className="text-body-md text-on-surface-variant" data-cms-catalog-count>
              {t("publicBaked.catalogLoading")}
            </p>
            {catalog.filters.showSortBy && (
              <select
                data-cms-catalog-sort
                className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary outline-none"
              >
                <option value="newest">{t("publicBaked.catalogSortNewest")}</option>
                <option value="price-asc">{t("publicBaked.catalogSortPriceAsc")}</option>
                <option value="price-desc">{t("publicBaked.catalogSortPriceDesc")}</option>
              </select>
            )}
          </div>
          <div
            data-cms-catalog-grid
            data-cms-catalog-flags={flagsAttr}
            data-cms-catalog-i18n={i18nAttr}
            data-cms-catalog-cols={String(catalog.initialColumns)}
            className={`storefront-catalog-grid is-cols-${catalog.initialColumns}`}
          >
            <p className="storefront-catalog-empty">{t("publicBaked.catalogLoading")}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
