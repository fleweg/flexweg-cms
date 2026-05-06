import { escapeAttr, escapeText } from "../util";

export interface HeroOverlayAttrs {
  // Background image. Without it, falls back to a primary-colored
  // surface so the block still renders cleanly during editing.
  imageUrl?: string;
  imageAlt?: string;
  // Small uppercase label above the headline.
  eyebrow?: string;
  // Main headline + subtitle paragraph.
  title?: string;
  subtitle?: string;
  // Two CTAs. Each can be left empty to hide that button.
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export interface HeroOverlayRenderResult {
  html: string;
}

// Big home hero — full-width image background with a navy-to-transparent
// gradient and a left-aligned content block. Faithful to the
// home_desktop mockup. On mobile the gradient stays put; the image is
// hidden behind the gradient on very small screens for legibility.
export function renderHeroOverlay(attrs: HeroOverlayAttrs): HeroOverlayRenderResult {
  // Without title AND subtitle the block has nothing to communicate;
  // emit nothing to keep the page cleaner during initial setup.
  if (!attrs.title && !attrs.subtitle && !attrs.imageUrl) {
    return { html: "" };
  }

  const imageHtml = attrs.imageUrl
    ? `<img class="w-full h-full object-cover" src="${escapeAttr(attrs.imageUrl)}" alt="${escapeAttr(attrs.imageAlt ?? "")}" loading="eager" fetchpriority="high" />`
    : "";

  // When no image is configured, the right-side gradient stop must
  // be opaque too — otherwise the page body's bg-background bleeds
  // through and the hero looks empty on the right.
  const gradientClass = attrs.imageUrl
    ? "absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/30 md:to-transparent"
    : "absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary-container";

  const eyebrowHtml = attrs.eyebrow
    ? `<span class="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary-fixed text-label-caps font-semibold uppercase tracking-wider mb-6 border border-secondary/30">${escapeText(attrs.eyebrow)}</span>`
    : "";

  const titleHtml = attrs.title
    ? `<h1 class="text-h1 font-bold mb-stack-lg leading-tight">${escapeText(attrs.title)}</h1>`
    : "";

  const subtitleHtml = attrs.subtitle
    ? `<p class="text-body-lg mb-10 text-on-primary-container">${escapeText(attrs.subtitle)}</p>`
    : "";

  const primaryCta =
    attrs.primaryCtaLabel && attrs.primaryCtaHref
      ? `<a href="${escapeAttr(attrs.primaryCtaHref)}" class="bg-secondary text-on-secondary px-8 py-4 rounded-xl text-button font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2">${escapeText(attrs.primaryCtaLabel)}<span class="material-symbols-outlined">arrow_forward</span></a>`
      : "";

  const secondaryCta =
    attrs.secondaryCtaLabel && attrs.secondaryCtaHref
      ? `<a href="${escapeAttr(attrs.secondaryCtaHref)}" class="border border-on-primary/30 text-on-primary px-8 py-4 rounded-xl text-button font-semibold hover:bg-white/10 transition-colors">${escapeText(attrs.secondaryCtaLabel)}</a>`
      : "";

  const ctas =
    primaryCta || secondaryCta
      ? `<div class="flex flex-wrap gap-4">${primaryCta}${secondaryCta}</div>`
      : "";

  return {
    html: `<section class="relative min-h-[600px] md:min-h-[760px] flex items-center overflow-hidden">
<div class="absolute inset-0 z-0">${imageHtml}<div class="${gradientClass}"></div></div>
<div class="relative z-10 w-full px-gutter max-w-container-max mx-auto py-section-padding"><div class="max-w-2xl text-on-primary">${eyebrowHtml}${titleHtml}${subtitleHtml}${ctas}</div></div>
</section>`,
  };
}
