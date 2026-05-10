import { escapeAttr, escapeText } from "../util";

export interface JournalFeatureAttrs {
  imageUrl?: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  titleItalicTail?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface JournalFeatureRenderResult {
  html: string;
}

// Journal feature — 2-column section with a square image on one side
// and a serif headline + subtitle + CTA on the other. Editorial feel
// from the catalog mockup. Image left + text right, stacked on mobile.
export function renderJournalFeature(
  attrs: JournalFeatureAttrs,
): JournalFeatureRenderResult {
  if (!attrs.title && !attrs.subtitle && !attrs.imageUrl) {
    return { html: "" };
  }

  const imageHtml = attrs.imageUrl
    ? `<div class="relative">
<div class="aspect-square rounded-3xl overflow-hidden shadow-2xl">
<img alt="${escapeAttr(attrs.imageAlt ?? "")}" class="w-full h-full object-cover" src="${escapeAttr(attrs.imageUrl)}" loading="lazy" />
</div>
<div class="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10"></div>
</div>`
    : "";

  const eyebrowHtml = attrs.eyebrow
    ? `<p class="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-stack-md">${escapeText(attrs.eyebrow)}</p>`
    : "";

  const titleHtml = attrs.title
    ? `<h2 class="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-md leading-tight">${escapeText(attrs.title)}${
        attrs.titleItalicTail
          ? `<br/><span class="display-italic">${escapeText(attrs.titleItalicTail)}</span>`
          : ""
      }</h2>`
    : "";

  const subtitleHtml = attrs.subtitle
    ? `<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">${escapeText(attrs.subtitle)}</p>`
    : "";

  const ctaHtml =
    attrs.ctaLabel && attrs.ctaHref
      ? `<a class="inline-flex items-center gap-stack-md group" href="${escapeAttr(attrs.ctaHref)}">
<div class="w-12 h-12 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
<span class="material-symbols-outlined text-base">arrow_forward</span>
</div>
<span class="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">${escapeText(attrs.ctaLabel)}</span>
</a>`
      : "";

  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-lg md:gap-16 items-center">${imageHtml}<div>${eyebrowHtml}${titleHtml}${subtitleHtml}${ctaHtml}</div></div>
</section>`,
  };
}
