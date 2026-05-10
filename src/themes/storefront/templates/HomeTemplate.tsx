import type { HomeTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { pickFormat } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import { renderHeroOverlay } from "../blocks/heroOverlay/render";
import { renderCategoriesBento } from "../blocks/categoriesBento/render";
import { renderJournalFeature } from "../blocks/journalFeature/render";
import { renderStoreInfo } from "../blocks/storeInfo/render";
import {
  renderProductGrid,
  type ProductCardData,
} from "../blocks/productGrid/render";
import { extractProductCardLabels } from "../blocks/productInfo/render";
import {
  DEFAULT_STOREFRONT_HOME,
  DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
  type StorefrontCategoryRow,
  type StorefrontHomeConfig,
  type StorefrontThemeConfig,
} from "../config";

// Storefront home — same two-mode pattern as corporate:
//   1. Static-page mode: when `staticPage` is provided, dump the
//      page body verbatim (block markers already resolved).
//   2. Default mode: render hero + categories bento + trending
//      products grid + journal feature, all configurable from
//      /theme-settings → Home tab. Each section can be toggled off
//      independently. Defaults seed credible content for first run.
export function HomeTemplate({
  posts,
  staticPage,
  site,
}: HomeTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-storefront");

  if (staticPage) {
    return (
      <div
        className="storefront-static-home"
        dangerouslySetInnerHTML={{ __html: staticPage.bodyHtml }}
      />
    );
  }

  const themeConfig = site.themeConfig as StorefrontThemeConfig | undefined;
  const productDefaults = {
    ...DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
    ...(themeConfig?.productDefaults ?? {}),
  };
  const locale = site.settings.language || "en";
  const home: StorefrontHomeConfig = {
    ...DEFAULT_STOREFRONT_HOME,
    ...(themeConfig?.home ?? {}),
    hero: { ...DEFAULT_STOREFRONT_HOME.hero, ...(themeConfig?.home?.hero ?? {}) },
    bento: { ...DEFAULT_STOREFRONT_HOME.bento, ...(themeConfig?.home?.bento ?? {}) },
    trending: {
      ...DEFAULT_STOREFRONT_HOME.trending,
      ...(themeConfig?.home?.trending ?? {}),
    },
    journal: {
      ...DEFAULT_STOREFRONT_HOME.journal,
      ...(themeConfig?.home?.journal ?? {}),
    },
    reviews: {
      ...DEFAULT_STOREFRONT_HOME.reviews,
      ...(themeConfig?.home?.reviews ?? {}),
    },
  };

  const heroHtml = home.showHero ? renderHeroOverlay(home.hero).html : "";
  const bentoHtml = home.bento.enabled
    ? renderCategoriesBento({
        eyebrow: home.bento.eyebrow,
        title: home.bento.title,
        subtitle: home.bento.subtitle,
        viewAllLabel: home.bento.viewAllLabel,
        viewAllHref: home.bento.viewAllHref,
        cards: home.bento.cards,
      }).html
    : "";

  // Resolve trending products. When `mode === "category"` filter by
  // primaryTermId. Empty / unmatched silently falls back to "all".
  let trendingPosts = posts;
  if (
    home.trending.enabled &&
    home.trending.mode === "category" &&
    home.trending.categoryId
  ) {
    const filtered = posts.filter((p) => p.primaryTermId === home.trending.categoryId);
    if (filtered.length > 0) trendingPosts = filtered;
  }
  trendingPosts = trendingPosts.slice(0, Math.max(1, home.trending.count));

  // Build ProductCardData for every trending post. Pulls price /
  // promo / badge from the post's product-info block when present —
  // posts without one render as image + name + subtitle only.
  const trendingCards: ProductCardData[] = trendingPosts.map((post) => {
    const labels = extractProductCardLabels(
      post.contentMarkdown ?? "",
      locale,
      productDefaults.currency,
      productDefaults.inquiryOnly,
    );
    return {
      url: `/${post.url}`,
      title: post.title,
      subtitle: post.excerpt ?? "",
      imageUrl: post.hero ? pickFormat(post.hero, "medium") : "",
      imageAlt: post.hero?.alt ?? post.title,
      priceLabel: labels.priceLabel,
      promoLabel: labels.promoLabel,
      badge: labels.badge,
    };
  });

  const trendingHtml =
    home.trending.enabled && trendingCards.length > 0
      ? renderProductGrid({
          attrs: {
            eyebrow: home.trending.eyebrow,
            title: home.trending.title,
            variant: "band",
          },
          cards: trendingCards,
          quickAddLabel: t("publicBaked.quickAdd"),
        }).html
      : "";

  // Per-category rows — render each enabled row after trending.
  // Each row filters posts by primaryTermId (empty => all) and
  // takes the first `count`. View-all href falls back to the
  // matching post's category URL when categoryId is set and the
  // editor didn't fill viewAllHref explicitly.
  const categoryRows: StorefrontCategoryRow[] = Array.isArray(home.categoryRows)
    ? home.categoryRows
    : [];
  const categoryRowsHtml = categoryRows
    .filter((row) => row.enabled)
    .map((row) => {
      const filtered = row.categoryId
        ? posts.filter((p) => p.primaryTermId === row.categoryId)
        : posts;
      const rowPosts = filtered.slice(0, Math.max(1, row.count));
      if (rowPosts.length === 0) return "";

      const cards: ProductCardData[] = rowPosts.map((post) => {
        const labels = extractProductCardLabels(
          post.contentMarkdown ?? "",
          locale,
          productDefaults.currency,
          productDefaults.inquiryOnly,
        );
        return {
          url: `/${post.url}`,
          title: post.title,
          subtitle: post.excerpt ?? "",
          imageUrl: post.hero ? pickFormat(post.hero, "medium") : "",
          imageAlt: post.hero?.alt ?? post.title,
          priceLabel: labels.priceLabel,
          promoLabel: labels.promoLabel,
          badge: labels.badge,
        };
      });

      // Auto-resolve viewAllHref from the first matching post's
      // category URL when the editor didn't provide one explicitly.
      const autoHref = rowPosts.find((p) => p.category)?.category?.url;
      const viewAllHref =
        row.viewAllHref || (autoHref ? `/${autoHref}` : "");
      const viewAllLabel = row.viewAllLabel || "";

      return renderProductGrid({
        attrs: {
          eyebrow: row.eyebrow,
          title: row.title,
          viewAllLabel,
          viewAllHref,
          layout: row.layout,
          variant: "plain",
        },
        cards,
        quickAddLabel: t("publicBaked.quickAdd"),
        prevAriaLabel: t("publicBaked.previous"),
        nextAriaLabel: t("publicBaked.next"),
      }).html;
    })
    .filter(Boolean)
    .join("");

  const storeInfo = home.storeInfo;
  const storeInfoHtml = storeInfo?.enabled
    ? renderStoreInfo({
        eyebrow: storeInfo.eyebrow,
        title: storeInfo.title,
        imageUrl: storeInfo.imageUrl,
        imageAlt: storeInfo.imageAlt,
        addressLabel: storeInfo.addressLabel,
        address: storeInfo.address,
        hoursLabel: storeInfo.hoursLabel,
        hours: storeInfo.hours,
        ctaLabel: storeInfo.ctaLabel,
        ctaHref: storeInfo.ctaHref,
      }).html
    : "";

  const journalHtml = home.journal.enabled
    ? renderJournalFeature({
        imageUrl: home.journal.imageUrl,
        imageAlt: home.journal.imageAlt,
        eyebrow: home.journal.eyebrow,
        title: home.journal.title,
        titleItalicTail: home.journal.titleItalicTail,
        subtitle: home.journal.subtitle,
        ctaLabel: home.journal.ctaLabel,
        ctaHref: home.journal.ctaHref,
      }).html
    : "";

  return (
    <>
      {heroHtml && <div dangerouslySetInnerHTML={{ __html: heroHtml }} />}
      {bentoHtml && <div dangerouslySetInnerHTML={{ __html: bentoHtml }} />}
      {trendingHtml && <div dangerouslySetInnerHTML={{ __html: trendingHtml }} />}
      {categoryRowsHtml && (
        <div dangerouslySetInnerHTML={{ __html: categoryRowsHtml }} />
      )}
      {storeInfoHtml && (
        <div dangerouslySetInnerHTML={{ __html: storeInfoHtml }} />
      )}
      {journalHtml && <div dangerouslySetInnerHTML={{ __html: journalHtml }} />}
    </>
  );
}
