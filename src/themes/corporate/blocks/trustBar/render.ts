import { escapeAttr, escapeText } from "../util";

export interface TrustLogo {
  imageUrl: string;
  imageAlt?: string;
  // Optional click target. Empty = static logo.
  href?: string;
}

export interface TrustBarAttrs {
  // Small label rendered above the logo row, label-caps weight.
  // Defaults to a localised "Trusted by industry leaders" when empty.
  label?: string;
  logos?: TrustLogo[];
}

export interface TrustBarRenderResult {
  html: string;
}

// Logo strip — used under hero / contact sections to anchor brand
// credibility. Logos are rendered desaturated + faded by default;
// hover restores full color so the section reads as proof but
// doesn't compete with primary content.
export function renderTrustBar(attrs: TrustBarAttrs): TrustBarRenderResult {
  const logos = (attrs.logos ?? []).filter((l) => l && l.imageUrl);
  if (logos.length === 0) return { html: "" };

  const labelHtml = attrs.label
    ? `<p class="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider w-full text-center mb-stack-md">${escapeText(attrs.label)}</p>`
    : "";

  const logosHtml = logos
    .map((logo) => {
      const img = `<img src="${escapeAttr(logo.imageUrl)}" alt="${escapeAttr(logo.imageAlt ?? "")}" class="h-8 md:h-10 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all" loading="lazy" />`;
      return logo.href
        ? `<a href="${escapeAttr(logo.href)}" class="inline-flex items-center justify-center" target="_blank" rel="noopener noreferrer">${img}</a>`
        : img;
    })
    .join("");

  return {
    html: `<section class="px-gutter py-section-padding">
<div class="max-w-container-max mx-auto p-stack-lg flex flex-wrap items-center justify-center gap-stack-lg">${labelHtml}${logosHtml}</div>
</section>`,
  };
}
