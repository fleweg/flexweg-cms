import { escapeAttr, escapeText } from "../util";

export interface BentoCard {
  imageUrl: string;
  imageAlt: string;
  label: string;
  ctaLabel: string;
  ctaHref: string;
  size: "large" | "small";
}

export interface CategoriesBentoAttrs {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  cards?: BentoCard[];
}

export interface CategoriesBentoRenderResult {
  html: string;
}

// Curated collections — bento grid of 4 cards. Large cards span 8
// columns, small cards span 4. Two of each per row delivers the
// alternating rhythm from the catalog mockup. Each card has an image
// background, a gradient overlay for legibility, and a label + CTA
// in the bottom-left.
export function renderCategoriesBento(
  attrs: CategoriesBentoAttrs,
): CategoriesBentoRenderResult {
  const cards = Array.isArray(attrs.cards) ? attrs.cards : [];
  if (cards.length === 0) return { html: "" };

  const headerHtml = (attrs.title || attrs.subtitle || attrs.viewAllLabel)
    ? `<div class="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-stack-md">
<div>${
        attrs.eyebrow
          ? `<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${escapeText(attrs.eyebrow)}</p>`
          : ""
      }${
        attrs.title
          ? `<h2 class="display-serif text-headline-md md:text-display-md text-on-surface mb-2">${escapeText(attrs.title)}</h2>`
          : ""
      }${
        attrs.subtitle
          ? `<p class="font-body-md text-body-md text-on-surface-variant max-w-xl">${escapeText(attrs.subtitle)}</p>`
          : ""
      }</div>${
        attrs.viewAllLabel && attrs.viewAllHref
          ? `<a class="font-label-caps text-label-caps text-primary border-b border-primary pb-1 uppercase tracking-widest hover:text-primary-container transition-colors" href="${escapeAttr(attrs.viewAllHref)}">${escapeText(attrs.viewAllLabel)}</a>`
          : ""
      }</div>`
    : "";

  const cardsHtml = cards
    .map((card) => {
      const span = card.size === "large" ? "md:col-span-8" : "md:col-span-4";
      const ctaHtml =
        card.ctaLabel && card.ctaHref
          ? `<a href="${escapeAttr(card.ctaHref)}" class="font-label-caps text-label-caps text-on-primary inline-flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest">${escapeText(card.ctaLabel)}<span class="material-symbols-outlined text-sm">arrow_forward</span></a>`
          : "";
      return `<div class="${span} group relative overflow-hidden rounded-3xl bg-surface-container shadow-sm hover:shadow-xl transition-all duration-500 min-h-[280px] md:min-h-0">
<img alt="${escapeAttr(card.imageAlt ?? "")}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${escapeAttr(card.imageUrl)}" loading="lazy" />
<div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"></div>
<div class="absolute bottom-6 left-6 right-6 text-on-primary">${
        card.label
          ? `<h3 class="display-serif text-headline-sm mb-2">${escapeText(card.label)}</h3>`
          : ""
      }${ctaHtml}</div>
</div>`;
    })
    .join("");

  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">${headerHtml}<div class="grid grid-cols-1 md:grid-cols-12 gap-stack-md md:gap-stack-lg auto-rows-[280px] md:auto-rows-[300px]">${cardsHtml}</div></section>`,
  };
}
