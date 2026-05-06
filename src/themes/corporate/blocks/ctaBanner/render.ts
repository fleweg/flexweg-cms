import { escapeAttr, escapeText } from "../util";

export type CtaBannerVariant = "navy" | "indigo";

export interface CtaBannerAttrs {
  // Visual variant. "navy" = primary background with secondary glow
  // (the home_desktop final CTA in the mockup). "indigo" = solid
  // secondary background (home_mobile final CTA).
  variant?: CtaBannerVariant;
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export interface CtaBannerRenderResult {
  html: string;
}

// Final-CTA banner block. Wraps the section padding around itself so
// it can be dropped into any post / page body without sandwiching
// extra wrappers. Two variants — both end up centered in their
// section, just with different brand emphasis.
export function renderCtaBanner(attrs: CtaBannerAttrs): CtaBannerRenderResult {
  if (!attrs.title && !attrs.subtitle) return { html: "" };

  const variant: CtaBannerVariant = attrs.variant === "indigo" ? "indigo" : "navy";

  const titleHtml = attrs.title
    ? `<h2 class="text-h2 font-bold mb-stack-md">${escapeText(attrs.title)}</h2>`
    : "";

  const subtitleHtml = attrs.subtitle
    ? `<p class="text-body-lg mb-stack-lg ${variant === "navy" ? "text-on-primary-container" : "opacity-90"} max-w-2xl mx-auto">${escapeText(attrs.subtitle)}</p>`
    : "";

  const primaryClassNavy =
    "bg-secondary text-on-secondary px-10 py-5 rounded-xl text-button font-semibold hover:scale-105 transition-transform";
  const secondaryClassNavy =
    "bg-white/10 text-on-primary px-10 py-5 rounded-xl text-button font-semibold hover:bg-white/20 transition-colors";
  const primaryClassIndigo =
    "bg-white text-secondary px-10 py-4 rounded-xl text-button font-semibold hover:bg-secondary-fixed transition-colors";
  const secondaryClassIndigo =
    "border border-white/30 text-white px-10 py-4 rounded-xl text-button font-semibold hover:bg-white/10 transition-colors";

  const primaryClass = variant === "navy" ? primaryClassNavy : primaryClassIndigo;
  const secondaryClass = variant === "navy" ? secondaryClassNavy : secondaryClassIndigo;

  const primaryCta =
    attrs.primaryCtaLabel && attrs.primaryCtaHref
      ? `<a href="${escapeAttr(attrs.primaryCtaHref)}" class="${primaryClass}">${escapeText(attrs.primaryCtaLabel)}</a>`
      : "";

  const secondaryCta =
    attrs.secondaryCtaLabel && attrs.secondaryCtaHref
      ? `<a href="${escapeAttr(attrs.secondaryCtaHref)}" class="${secondaryClass}">${escapeText(attrs.secondaryCtaLabel)}</a>`
      : "";

  const ctas =
    primaryCta || secondaryCta
      ? `<div class="flex flex-col sm:flex-row gap-4 justify-center">${primaryCta}${secondaryCta}</div>`
      : "";

  if (variant === "indigo") {
    // Solid indigo card — simpler shape, no decorative glows.
    return {
      html: `<section class="px-gutter py-section-padding bg-surface-bright">
<div class="max-w-4xl mx-auto bg-secondary rounded-2xl p-12 md:p-16 text-center text-on-secondary shadow-2xl relative overflow-hidden">
<div class="relative z-10">${titleHtml}${subtitleHtml}${ctas}</div>
<div class="absolute top-0 right-0 p-4 opacity-10"><span class="material-symbols-outlined text-[120px]">bolt</span></div>
</div>
</section>`,
    };
  }

  // Navy default — two decorative blurred circles in the corners.
  return {
    html: `<section class="py-section-padding px-gutter">
<div class="max-w-container-max mx-auto bg-primary rounded-3xl p-12 md:p-20 relative overflow-hidden text-center text-on-primary">
<div class="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
<div class="absolute bottom-0 left-0 w-96 h-96 bg-tertiary-fixed-dim/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
<div class="relative z-10 max-w-2xl mx-auto">${titleHtml}${subtitleHtml}${ctas}</div>
</div>
</section>`,
  };
}
