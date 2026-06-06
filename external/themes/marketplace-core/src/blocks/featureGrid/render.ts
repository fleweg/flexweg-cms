import { decodeAttrs, escapeText } from "../util";

// Feature grid block — 3 cards in a row on desktop (1-col mobile).
// Each card has a Material Symbol icon, a short title, and a 1-2
// sentence body. Used near the top of the landing page to surface
// the headline value props before the user scrolls into the longer
// feature-row sections.
export interface FeatureGridAttrs {
  heading: string;
  subhead: string;
  items: { icon: string; title: string; body: string }[];
}

export const DEFAULT_FEATURE_GRID: FeatureGridAttrs = {
  heading: "",
  subhead: "",
  items: [],
};

export function renderFeatureGrid(attrs: FeatureGridAttrs): string {
  const items = (attrs.items ?? []).filter((i) => i.title);
  if (items.length === 0) return "";
  const cards = items
    .map(
      (i) => `<div class="mp-grid-feat__card">
      <div class="mp-grid-feat__icon"><span class="material-symbols-outlined">${escapeText(i.icon || "bolt")}</span></div>
      <h3 class="mp-grid-feat__title">${escapeText(i.title)}</h3>
      ${i.body ? `<p class="mp-grid-feat__body">${escapeText(i.body)}</p>` : ""}
    </div>`,
    )
    .join("");
  const head = attrs.heading?.trim()
    ? `<h2 class="mp-section-heading">${escapeText(attrs.heading)}</h2>`
    : "";
  const sub = attrs.subhead?.trim()
    ? `<p class="mp-section-sub">${escapeText(attrs.subhead)}</p>`
    : "";
  return `<section class="mp-grid-feat">
  ${head}
  ${sub}
  <div class="mp-grid-feat__row">${cards}</div>
</section>`;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/feature-grid"[^>]*)>\s*<\/div>/g;

export function transformFeatureGrid(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<FeatureGridAttrs>(enc, DEFAULT_FEATURE_GRID);
    return renderFeatureGrid(attrs) || "";
  });
}
