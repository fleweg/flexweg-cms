import { escapeAttr, escapeText } from "../util";

export interface HeroSplitAttrs {
  // Light/airy variant — text on the left over a light background,
  // optional decorative image faded behind the right edge.
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface HeroSplitRenderResult {
  html: string;
}

// Lighter hero variant — used on internal landing pages and on mobile
// where the dark overlay version feels heavy. Faithful to the
// home_mobile mockup: navy h1 on bg-background, decorative image
// faded into the right half. On md+ the image stays in the right
// half; on mobile the image hides behind the gradient.
export function renderHeroSplit(attrs: HeroSplitAttrs): HeroSplitRenderResult {
  if (!attrs.title && !attrs.subtitle) return { html: "" };

  const eyebrowHtml = attrs.eyebrow
    ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider">${escapeText(attrs.eyebrow)}</span>`
    : "";

  const titleHtml = attrs.title
    ? `<h1 class="text-h1 font-bold text-primary max-w-2xl leading-tight">${escapeText(attrs.title)}</h1>`
    : "";

  const subtitleHtml = attrs.subtitle
    ? `<p class="text-body-lg text-on-surface-variant max-w-xl">${escapeText(attrs.subtitle)}</p>`
    : "";

  const primaryCta =
    attrs.primaryCtaLabel && attrs.primaryCtaHref
      ? `<a href="${escapeAttr(attrs.primaryCtaHref)}" class="text-button font-semibold bg-secondary text-on-secondary px-8 py-4 rounded-xl shadow-lg shadow-secondary/20 hover:translate-y-[-2px] transition-all inline-flex items-center gap-2">${escapeText(attrs.primaryCtaLabel)}</a>`
      : "";

  const secondaryCta =
    attrs.secondaryCtaLabel && attrs.secondaryCtaHref
      ? `<a href="${escapeAttr(attrs.secondaryCtaHref)}" class="text-button font-semibold border border-outline text-primary px-8 py-4 rounded-xl hover:bg-surface-container-low transition-all">${escapeText(attrs.secondaryCtaLabel)}</a>`
      : "";

  const ctas =
    primaryCta || secondaryCta
      ? `<div class="flex flex-wrap gap-4">${primaryCta}${secondaryCta}</div>`
      : "";

  const decorImage = attrs.imageUrl
    ? `<div class="absolute top-0 right-0 w-full md:w-1/2 h-full -z-0 opacity-10 pointer-events-none"><img class="w-full h-full object-cover" src="${escapeAttr(attrs.imageUrl)}" alt="${escapeAttr(attrs.imageAlt ?? "")}" loading="lazy" /></div>`
    : "";

  return {
    html: `<section class="relative px-gutter py-section-padding overflow-hidden">
<div class="max-w-container-max mx-auto flex flex-col gap-stack-lg relative z-10">
<div class="flex flex-col gap-stack-sm">${eyebrowHtml}${titleHtml}${subtitleHtml}</div>
${ctas}
</div>
${decorImage}
</section>`,
  };
}
