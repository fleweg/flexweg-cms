import { decodeAttrs, escapeAttr, escapeText } from "../util";

// Feature row block — alternating image+text section. Image sits on
// the left or right (configurable per-instance) and the copy column
// stacks an eyebrow, headline, body paragraph, optional bullet list,
// and a single CTA. Multiple rows on the page should alternate
// imagePosition for visual rhythm (the CSS doesn't auto-alternate to
// keep authoring intent explicit).
export interface FeatureRowAttrs {
  imagePosition: "left" | "right";
  eyebrow: string;
  headline: string;
  body: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
}

export const DEFAULT_FEATURE_ROW: FeatureRowAttrs = {
  imagePosition: "right",
  eyebrow: "",
  headline: "",
  body: "",
  bullets: [],
  ctaLabel: "",
  ctaHref: "",
  imageUrl: "",
  imageAlt: "",
};

export function renderFeatureRow(attrs: FeatureRowAttrs): string {
  if (!attrs.headline?.trim()) return "";
  const eyebrow = attrs.eyebrow?.trim()
    ? `<p class="mp-row-feat__eyebrow">${escapeText(attrs.eyebrow)}</p>`
    : "";
  const body = attrs.body?.trim()
    ? `<p class="mp-row-feat__body">${escapeText(attrs.body)}</p>`
    : "";
  const bullets = (attrs.bullets ?? []).filter((b) => b?.trim());
  const bulletList = bullets.length > 0
    ? `<ul class="mp-row-feat__bullets">${bullets.map((b) => `<li><span class="material-symbols-outlined">check_circle</span>${escapeText(b)}</li>`).join("")}</ul>`
    : "";
  const cta = attrs.ctaLabel?.trim() && attrs.ctaHref?.trim()
    ? `<a class="mp-row-feat__cta" href="${escapeAttr(attrs.ctaHref)}">${escapeText(attrs.ctaLabel)} <span aria-hidden="true">→</span></a>`
    : "";
  const image = attrs.imageUrl?.trim()
    ? `<div class="mp-row-feat__visual"><img src="${escapeAttr(attrs.imageUrl)}" alt="${escapeAttr(attrs.imageAlt || attrs.headline)}" loading="lazy"/></div>`
    : "";
  const positionClass = attrs.imagePosition === "left"
    ? "mp-row-feat--image-left"
    : "mp-row-feat--image-right";
  return `<section class="mp-row-feat ${positionClass}">
  ${image}
  <div class="mp-row-feat__copy">
    ${eyebrow}
    <h2 class="mp-row-feat__headline">${escapeText(attrs.headline)}</h2>
    ${body}
    ${bulletList}
    ${cta}
  </div>
</section>`;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/feature-row"[^>]*)>\s*<\/div>/g;

export function transformFeatureRow(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<FeatureRowAttrs>(enc, DEFAULT_FEATURE_ROW);
    return renderFeatureRow(attrs) || "";
  });
}
