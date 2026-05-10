import type { CategoryTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { pickFormat } from "@flexweg/cms-runtime";
import { buildTermUrl } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import { extractProductCardLabels } from "../blocks/productInfo/render";
import {
  DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
  type StorefrontThemeConfig,
} from "../config";

// Storefront category archive — sidebar = clickable category list
// (per Phase 3 plan, the facet filters from the mockup are replaced
// with a categories list since static-host CMS can't run server-side
// filtering). The actual filterable catalog lives on /catalog.html
// (Phase 6).
//
// Layout:
//   - Breadcrumb + h1 + description at the top
//   - 12-col grid below: 3-col sidebar (category list + RSS link),
//     9-col product grid (3 cols on lg, 2 on md, 1 on mobile)
//   - Product cards mirror the productGrid block — image with hover
//     wishlist + quick-add, name, price (Phase 4 wires real price)
export function CategoryTemplate({
  term,
  posts,
  allCategories,
  categoryRssUrl,
  archivesLink,
  site,
}: CategoryTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-storefront");
  const themeConfig = site.themeConfig as StorefrontThemeConfig | undefined;
  const productDefaults = {
    ...DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
    ...(themeConfig?.productDefaults ?? {}),
  };
  const locale = site.settings.language || "en";

  return (
    <main className="max-w-container-max mx-auto px-gutter md:px-gutter-desktop py-stack-lg md:py-stack-lg pb-section-gap-desktop">
      <nav className="flex items-center gap-2 mb-stack-lg text-on-surface-variant text-label-caps font-semibold uppercase tracking-widest">
        <a className="hover:text-primary transition-colors" href="/index.html">
          {t("publicBaked.home")}
        </a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary">{term.name}</span>
      </nav>

      <header className="mb-stack-lg">
        <h1 className="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-sm leading-tight">
          {term.name}
        </h1>
        {term.description && (
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {term.description}
          </p>
        )}
        <p className="text-on-surface-variant text-body-md mt-stack-md">
          {posts.length === 1
            ? t("publicBaked.productCountOne")
            : t("publicBaked.productCount", { count: posts.length })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 space-y-stack-lg">
            {allCategories && allCategories.length > 0 && (
              <div>
                <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">
                  {t("publicBaked.allCategories")}
                </h3>
                <ul className="space-y-stack-sm">
                  {allCategories.map((cat) => {
                    const isActive = cat.id === term.id;
                    return (
                      <li key={cat.id}>
                        <a
                          href={`/${buildTermUrl(cat)}`}
                          className={
                            isActive
                              ? "block py-1 text-primary font-bold border-l-2 border-primary pl-3"
                              : "block py-1 text-on-surface-variant hover:text-primary transition-colors pl-3 border-l-2 border-transparent"
                          }
                        >
                          {cat.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {categoryRssUrl && (
              <a
                href={categoryRssUrl}
                className="inline-flex items-center gap-stack-sm text-primary hover:text-secondary transition-colors text-label-caps uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-base">rss_feed</span>
                {t("publicBaked.follow")}
              </a>
            )}
          </div>
        </aside>

        <section className="lg:col-span-9">
          {posts.length === 0 ? (
            <p className="text-on-surface-variant italic py-section-gap-mobile text-center">
              {t("publicBaked.noPostsCategory")}
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-stack-md md:gap-stack-lg">
              {posts.map((post) => {
                const labels = extractProductCardLabels(
                  post.contentMarkdown ?? "",
                  locale,
                  productDefaults.currency,
                  productDefaults.inquiryOnly,
                );
                return (
                  <article
                    key={post.id}
                    className="storefront-product-card flex flex-col group"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-lowest mb-stack-md shadow-sm">
                      <a href={`/${post.url}`} className="block w-full h-full">
                        {post.hero && (
                          <img
                            src={pickFormat(post.hero, "medium")}
                            alt={post.hero.alt ?? post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        )}
                      </a>
                      {labels.badge && (
                        <span className="absolute top-3 left-3 bg-secondary/90 text-on-secondary text-label-caps font-semibold px-3 py-1 rounded-full backdrop-blur uppercase tracking-widest">
                          {labels.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="display-serif text-[1.125rem] text-on-surface leading-tight mb-1">
                      <a
                        href={`/${post.url}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </a>
                    </h3>
                    {post.excerpt && (
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-1">
                        {post.excerpt}
                      </p>
                    )}
                    {labels.priceLabel && (
                      <p className="font-label-caps text-label-caps">
                        {labels.promoLabel ? (
                          <>
                            <span className="storefront-price-promo">
                              {labels.promoLabel}
                            </span>
                            <span className="storefront-price-strike">
                              {labels.priceLabel}
                            </span>
                          </>
                        ) : (
                          <span className="text-primary font-bold">
                            {labels.priceLabel}
                          </span>
                        )}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
          {archivesLink && (
            <div className="mt-stack-lg flex justify-center">
              <a className="archives-link" href={archivesLink.href}>
                {archivesLink.label}
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
