import type { SingleTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { pickFormat } from "@flexweg/cms-runtime";
import { buildTermUrl } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import {
  DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
  DEFAULT_STOREFRONT_SINGLE,
  type StorefrontThemeConfig,
} from "../config";
import {
  extractProductInfo,
  renderProductInfoCard,
  stripProductInfoMarker,
} from "../blocks/productInfo/render";

// Storefront single (= product fiche).
//
// Layout:
//   1. Breadcrumb at the top (home › category › product).
//   2. 2-col hero: large image left (post.hero), right column with
//      title + product-info card extracted from the body's
//      product-info marker (price, stock, variants, CTAs).
//   3. Body markdown below — full-width sections (productGallery,
//      productFeatures, reviewsList resolved by transformBodyHtml).
//   4. Sidebar with care-kit (when enabled) sits next to the body.
//   5. Related products row at the bottom (populated at runtime by
//      posts-loader.js).
//
// Pages (post.type === "page") bypass the hero/sidebar entirely so
// admins can compose them freely with theme blocks.
export function SingleTemplate({
  post,
  bodyHtml,
  hero,
  primaryTerm,
  tags,
  site,
}: SingleTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-storefront");
  const themeConfig = site.themeConfig as StorefrontThemeConfig | undefined;
  const single = { ...DEFAULT_STOREFRONT_SINGLE, ...(themeConfig?.single ?? {}) };
  const productDefaults = {
    ...DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
    ...(themeConfig?.productDefaults ?? {}),
  };
  const isPage = post.type === "page";

  if (isPage) {
    return (
      <article className="pt-stack-md pb-section-gap-desktop">
        <div
          className="storefront-page-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
    );
  }

  // Pull product-info attrs out of the body, then strip the marker
  // so it never renders as an empty <div> later in the body.
  const extracted = extractProductInfo(bodyHtml);
  const cleanBodyHtml = extracted ? stripProductInfoMarker(bodyHtml) : bodyHtml;

  // Build the right-column card. When no product-info block is
  // present, the right column shows just the title + excerpt + tags
  // (no commerce card) — useful for editorial posts that aren't
  // shoppable.
  const productCardHtml = extracted
    ? renderProductInfoCard({
        attrs: extracted.attrs,
        labels: {
          inStock: t("publicBaked.inStock"),
          lowStock: t("publicBaked.lowStock"),
          outOfStock: t("publicBaked.outOfStock"),
          onOrder: t("publicBaked.onOrder"),
          promoBadge: t("publicBaked.promoBadge"),
          priceHT: t("publicBaked.priceHT"),
          priceTTC: t("publicBaked.priceTTC"),
        },
        locale: site.settings.language || "en",
        defaults: {
          currency: productDefaults.currency,
          ctaLabel: productDefaults.ctaLabel,
          ctaHref: productDefaults.ctaHref,
          inquiryOnly: productDefaults.inquiryOnly,
        },
      })
    : "";

  return (
    <article className="max-w-container-max mx-auto px-gutter md:px-gutter-desktop pt-stack-lg pb-section-gap-desktop">
      <nav className="flex items-center gap-2 mb-stack-lg text-on-surface-variant text-label-caps font-semibold uppercase tracking-widest">
        <a className="hover:text-primary transition-colors" href="/index.html">
          {t("publicBaked.home")}
        </a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        {primaryTerm ? (
          <>
            <a
              className="hover:text-primary transition-colors"
              href={`/${buildTermUrl(primaryTerm)}`}
            >
              {primaryTerm.name}
            </a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </>
        ) : null}
        <span className="text-primary">{post.title}</span>
      </nav>

      {/* Hero — 2-col grid: image left, info right. Single column on
          mobile so the image hits full bleed and the info stacks. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg mb-section-gap-mobile lg:mb-section-gap-desktop">
        <div className="lg:col-span-7">
          {hero && (
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-surface-container-low shadow-sm sticky top-24">
              <img
                src={pickFormat(hero, "large")}
                alt={hero.alt ?? post.title}
                className="w-full h-full object-cover"
                fetchPriority="high"
              />
            </div>
          )}
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <h1 className="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-sm leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-body-lg text-on-surface-variant leading-relaxed mb-stack-lg">
              {post.excerpt}
            </p>
          )}
          {productCardHtml && (
            <div dangerouslySetInnerHTML={{ __html: productCardHtml }} />
          )}
        </div>
      </div>

      {/* Body markdown + sidebar. The body resolves productGallery /
          productFeatures / reviewsList markers inline; the sidebar
          carries the care-kit card when enabled. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        <div className={single.showCareKit ? "lg:col-span-8" : "lg:col-span-12"}>
          <div
            className="storefront-prose"
            dangerouslySetInnerHTML={{ __html: cleanBodyHtml }}
          />
          {tags.length > 0 && (
            <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/30 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-surface-container-high rounded-full text-label-caps font-semibold text-primary uppercase tracking-widest"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {single.showCareKit && (
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 p-6 md:p-8 bg-surface-container-highest/40 rounded-3xl border border-outline-variant/30">
              <h4 className="display-serif text-headline-sm text-primary mb-stack-sm">
                {single.careKitTitle}
              </h4>
              {single.careKitDescription && (
                <p className="font-body-md text-on-surface-variant mb-stack-md">
                  {single.careKitDescription}
                </p>
              )}
              {single.careKitItems && single.careKitItems.length > 0 && (
                <ul className="space-y-stack-sm">
                  {single.careKitItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-stack-sm text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary text-base">
                        check_circle
                      </span>
                      <span className="text-body-md">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        )}
      </div>

      {single.showAuthorBio && post.authorId && (
        <section
          className="mt-section-gap-mobile lg:mt-section-gap-desktop"
          data-cms-author-bio
          data-cms-author-id={post.authorId}
          data-cms-bio-label={t("publicBaked.aboutFlorist")}
          hidden
        />
      )}

      {single.showRelatedProducts && (
        <section
          className="mt-section-gap-mobile lg:mt-section-gap-desktop"
          data-cms-related
          data-cms-current-id={post.id}
          data-cms-term-id={post.primaryTermId ?? ""}
          data-cms-limit="4"
          data-cms-label={single.relatedTitle.trim() || t("publicBaked.curatedPairings")}
          data-cms-fallback-label={
            single.relatedTitle.trim() || t("publicBaked.curatedPairings")
          }
        />
      )}
    </article>
  );
}
