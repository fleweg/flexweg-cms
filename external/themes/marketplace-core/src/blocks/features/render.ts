import { decodeAttrs, escapeText } from "../util";

export interface FeaturesAttrs {
  heading: string;
  items: { icon: string; title: string }[];
}

export const DEFAULT_FEATURES: FeaturesAttrs = {
  heading: "Key Features",
  items: [],
};

export function renderFeatures(attrs: FeaturesAttrs): string {
  const items = (attrs.items ?? []).filter((i) => i.title);
  if (items.length === 0) return "";
  const itemsHtml = items
    .map(
      (i) =>
        `<div class="mp-features__item"><div class="mp-features__icon"><span class="material-symbols-outlined">${escapeText(i.icon || "bolt")}</span></div><h4 class="mp-features__title">${escapeText(i.title)}</h4></div>`,
    )
    .join("");
  const heading = attrs.heading
    ? `<h3 class="mp-section-heading">${escapeText(attrs.heading)}</h3>`
    : "";
  return `${heading}<div class="mp-features">${itemsHtml}</div>`;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/features"[^>]*)>\s*<\/div>/g;

export function transformFeatures(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<FeaturesAttrs>(enc, DEFAULT_FEATURES);
    return renderFeatures(attrs) || "";
  });
}
