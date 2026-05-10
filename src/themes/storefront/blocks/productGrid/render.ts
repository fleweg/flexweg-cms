import { escapeAttr, escapeText } from "../util";

// Data shape supplied by HomeTemplate. Each card carries the
// resolved post URL, hero image URL, and optional pricing extracted
// from the post's product-info block (Phase 4) — the renderer is
// purely presentational.
export interface ProductCardData {
  url: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  priceLabel: string;
  promoLabel: string;
  badge: string;
}

export interface ProductGridAttrs {
  eyebrow?: string;
  title?: string;
  // Optional "View all" link rendered next to the title (right-side).
  // Used by the per-category rows to surface a link to the matching
  // category archive. Empty hides the link.
  viewAllLabel?: string;
  viewAllHref?: string;
  // Layout — 4-col grid (default) or horizontal slider with chevron
  // arrows. Slider auto-fits 1 card per row on mobile, 2 on tablet,
  // 4 on desktop and snaps card-by-card.
  layout?: "grid" | "slider";
  // Section background — the trending row uses a soft surface band;
  // category rows use the page background by default. Set to "plain"
  // to skip the band.
  variant?: "band" | "plain";
}

export interface ProductGridRenderArgs {
  attrs: ProductGridAttrs;
  cards: ProductCardData[];
  quickAddLabel: string;
  // Localised aria-labels for the slider chevrons. Required when
  // layout === "slider".
  prevAriaLabel?: string;
  nextAriaLabel?: string;
}

export interface ProductGridRenderResult {
  html: string;
}

function renderHeader(attrs: ProductGridAttrs): string {
  if (!attrs.eyebrow && !attrs.title && !attrs.viewAllLabel) return "";
  const eyebrow = attrs.eyebrow
    ? `<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${escapeText(attrs.eyebrow)}</p>`
    : "";
  const title = attrs.title
    ? `<h2 class="display-serif text-headline-md md:text-display-md text-on-surface">${escapeText(attrs.title)}</h2>`
    : "";
  const viewAll =
    attrs.viewAllLabel && attrs.viewAllHref
      ? `<a class="font-label-caps text-label-caps text-primary border-b border-primary pb-1 uppercase tracking-widest hover:text-primary-container transition-colors shrink-0" href="${escapeAttr(attrs.viewAllHref)}">${escapeText(attrs.viewAllLabel)}</a>`
      : "";
  // When neither title nor view-all link is set we fall back to a
  // centered eyebrow-only layout (the original "Trending now" mode).
  if (!attrs.title && !attrs.viewAllLabel) {
    return `<div class="text-center mb-stack-lg">${eyebrow}${title}</div>`;
  }
  return `<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-stack-md mb-stack-lg">
<div>${eyebrow}${title}</div>${viewAll}</div>`;
}

function renderCard(card: ProductCardData, quickAddLabel: string): string {
  const badgeHtml = card.badge
    ? `<span class="absolute top-3 left-3 bg-secondary/90 text-on-secondary text-label-caps font-semibold px-3 py-1 rounded-full backdrop-blur uppercase tracking-widest">${escapeText(card.badge)}</span>`
    : "";
  const quickAddHtml = quickAddLabel
    ? `<a href="${escapeAttr(card.url)}" class="absolute bottom-0 left-0 right-0 bg-primary/90 text-on-primary text-center py-3 font-label-caps text-label-caps uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">${escapeText(quickAddLabel)}</a>`
    : "";
  const priceHtml = card.priceLabel
    ? card.promoLabel
      ? `<p class="font-label-caps text-label-caps"><span class="storefront-price-promo">${escapeText(card.promoLabel)}</span><span class="storefront-price-strike">${escapeText(card.priceLabel)}</span></p>`
      : `<p class="font-label-caps text-label-caps text-primary font-bold">${escapeText(card.priceLabel)}</p>`
    : "";
  return `<article class="storefront-product-card flex flex-col group">
<div class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-lowest mb-stack-md shadow-sm">
<a href="${escapeAttr(card.url)}" class="block w-full h-full">${
    card.imageUrl
      ? `<img src="${escapeAttr(card.imageUrl)}" alt="${escapeAttr(card.imageAlt ?? card.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />`
      : ""
  }</a>${badgeHtml}${quickAddHtml}</div>
<h3 class="display-serif text-[1.125rem] text-on-surface leading-tight mb-1"><a href="${escapeAttr(card.url)}" class="hover:text-primary transition-colors">${escapeText(card.title)}</a></h3>${
    card.subtitle
      ? `<p class="font-body-md text-body-md text-on-surface-variant mb-stack-sm">${escapeText(card.subtitle)}</p>`
      : ""
  }${priceHtml}</article>`;
}

// Trending / per-category products section.
//
// Two layouts:
//   - "grid": responsive 2/4-col grid (default — matches the
//     "Trending now" hero block from the mockup).
//   - "slider": horizontal scroll with snap and chevron arrows.
//     Wires up via posts-loader.js's wireCategoryRowChevrons (data-
//     cms-row-track / -prev / -next attributes).
//
// Two background variants:
//   - "band" (default for trending): soft surface band.
//   - "plain": page background (used by per-category rows so
//     stacking 3-4 rows doesn't repeat the same band texture).
export function renderProductGrid(
  args: ProductGridRenderArgs,
): ProductGridRenderResult {
  const { attrs, cards, quickAddLabel } = args;
  if (cards.length === 0) return { html: "" };

  const layout = attrs.layout ?? "grid";
  const variant = attrs.variant ?? "band";
  const sectionClass =
    variant === "band"
      ? "bg-surface-container-low py-section-gap-mobile md:py-section-gap-desktop"
      : "py-section-gap-mobile md:py-section-gap-desktop";

  const cardsHtml = cards
    .map((c) => renderCard(c, quickAddLabel))
    .join("");

  const body =
    layout === "slider"
      ? `<div class="relative">
<div data-cms-row-track class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-stack-md md:gap-stack-lg storefront-no-scrollbar pb-2">${cardsHtml.replace(
          /<article class="storefront-product-card/g,
          '<article class="storefront-product-card storefront-row-slide snap-start',
        )}</div>
<button type="button" data-cms-row-prev aria-label="${escapeAttr(args.prevAriaLabel ?? "Previous")}" class="hidden md:flex absolute top-1/3 -left-4 w-10 h-10 rounded-full bg-surface shadow-lg border border-outline-variant text-primary items-center justify-center hover:bg-surface-container transition-colors z-10"><span class="material-symbols-outlined">chevron_left</span></button>
<button type="button" data-cms-row-next aria-label="${escapeAttr(args.nextAriaLabel ?? "Next")}" class="hidden md:flex absolute top-1/3 -right-4 w-10 h-10 rounded-full bg-surface shadow-lg border border-outline-variant text-primary items-center justify-center hover:bg-surface-container transition-colors z-10"><span class="material-symbols-outlined">chevron_right</span></button>
</div>`
      : `<div class="grid grid-cols-2 md:grid-cols-4 gap-stack-md md:gap-stack-lg">${cardsHtml}</div>`;

  return {
    html: `<section class="${sectionClass}">
<div class="max-w-container-max mx-auto px-gutter md:px-gutter-desktop">${renderHeader(attrs)}${body}</div>
</section>`,
  };
}
