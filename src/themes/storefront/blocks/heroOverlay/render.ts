import { escapeAttr, escapeText } from "../util";

export interface HeroOverlayAttrs {
  imageUrl?: string;
  imageAlt?: string;
  eyebrow?: string;
  // Two-part headline: serif body + an italic tail for the editorial
  // feel from the catalog mockup. Tail is optional — empty falls back
  // to a single-line headline.
  title?: string;
  titleItalicTail?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export interface HeroOverlayRenderResult {
  html: string;
}

// Storefront home hero — full-bleed image with a frosted card holding
// the headline + CTAs. Layout matches the home_desktop catalog mockup:
// large image background, glass card on the left half, two CTAs.
export function renderHeroOverlay(attrs: HeroOverlayAttrs): HeroOverlayRenderResult {
  // Without title and subtitle and image the block has nothing to
  // communicate — emit nothing.
  if (!attrs.title && !attrs.subtitle && !attrs.imageUrl) {
    return { html: "" };
  }

  const imageHtml = attrs.imageUrl
    ? `<img class="w-full h-full object-cover" src="${escapeAttr(attrs.imageUrl)}" alt="${escapeAttr(attrs.imageAlt ?? "")}" loading="eager" fetchpriority="high" />`
    : "";

  const eyebrowHtml = attrs.eyebrow
    ? `<span class="inline-block font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">${escapeText(attrs.eyebrow)}</span>`
    : "";

  // Title supports an optional italic tail rendered on a second line
  // (`<title>` + `<br>` + `<em>tail</em>`). Both halves use the
  // editorial serif via the `display-serif` utility.
  const titleHtml = attrs.title
    ? `<h1 class="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-md leading-tight">${escapeText(attrs.title)}${
        attrs.titleItalicTail
          ? `<br/><span class="display-italic">${escapeText(attrs.titleItalicTail)}</span>`
          : ""
      }</h1>`
    : "";

  const subtitleHtml = attrs.subtitle
    ? `<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-md">${escapeText(attrs.subtitle)}</p>`
    : "";

  const primaryCta =
    attrs.primaryCtaLabel && attrs.primaryCtaHref
      ? `<a href="${escapeAttr(attrs.primaryCtaHref)}" class="bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all">${escapeText(attrs.primaryCtaLabel)}</a>`
      : "";

  const secondaryCta =
    attrs.secondaryCtaLabel && attrs.secondaryCtaHref
      ? `<a href="${escapeAttr(attrs.secondaryCtaHref)}" class="border border-secondary text-secondary px-8 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-container hover:text-on-secondary-container hover:border-transparent transition-all">${escapeText(attrs.secondaryCtaLabel)}</a>`
      : "";

  const ctas =
    primaryCta || secondaryCta
      ? `<div class="flex flex-wrap gap-stack-md">${primaryCta}${secondaryCta}</div>`
      : "";

  return {
    html: `<section class="relative min-h-[600px] md:min-h-[760px] flex items-center overflow-hidden">
<div class="absolute inset-0 z-0">${imageHtml}<div class="absolute inset-0 bg-black/10"></div></div>
<div class="relative z-10 w-full px-gutter md:px-gutter-desktop max-w-container-max mx-auto py-section-gap-mobile md:py-section-gap-desktop"><div class="max-w-2xl bg-surface/85 backdrop-blur-md p-8 md:p-12 lg:p-16 rounded-3xl border border-surface-container-high shadow-2xl">${eyebrowHtml}${titleHtml}${subtitleHtml}${ctas}</div></div>
</section>`,
  };
}
