import { decodeAttrs, escapeAttr, escapeText } from "../util";

// CTA banner block — full-width center-aligned final-push section
// usually placed near the bottom of a landing page. Pairs a single
// strong headline + short body + up to two CTAs. Background uses
// the theme's primary palette to stand out from preceding sections.
export interface CtaBannerAttrs {
  headline: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export const DEFAULT_CTA_BANNER: CtaBannerAttrs = {
  headline: "",
  body: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
};

export function renderCtaBanner(attrs: CtaBannerAttrs): string {
  if (!attrs.headline?.trim()) return "";
  const body = attrs.body?.trim()
    ? `<p class="mp-cta-banner__body">${escapeText(attrs.body)}</p>`
    : "";
  const ctas = [
    attrs.primaryCta?.label && attrs.primaryCta?.href
      ? `<a class="mp-btn mp-btn--primary" href="${escapeAttr(attrs.primaryCta.href)}">${escapeText(attrs.primaryCta.label)}</a>`
      : "",
    attrs.secondaryCta?.label && attrs.secondaryCta?.href
      ? `<a class="mp-btn mp-btn--ghost" href="${escapeAttr(attrs.secondaryCta.href)}">${escapeText(attrs.secondaryCta.label)}</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");
  const ctaWrap = ctas ? `<div class="mp-cta-banner__ctas">${ctas}</div>` : "";
  return `<section class="mp-cta-banner">
  <div class="mp-cta-banner__inner">
    <h2 class="mp-cta-banner__headline">${escapeText(attrs.headline)}</h2>
    ${body}
    ${ctaWrap}
  </div>
</section>`;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/cta-banner"[^>]*)>\s*<\/div>/g;

export function transformCtaBanner(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<CtaBannerAttrs>(enc, DEFAULT_CTA_BANNER);
    return renderCtaBanner(attrs) || "";
  });
}
