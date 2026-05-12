import { decodeAttrs, escapeText } from "../util";

export interface SpecsAttrs {
  heading: string;
  rows: { label: string; value: string }[];
}

export const DEFAULT_SPECS: SpecsAttrs = {
  heading: "Specifications",
  rows: [
    { label: "Version", value: "1.0.0" },
    { label: "License", value: "MIT" },
    { label: "Last Updated", value: "" },
    { label: "Requires Flexweg", value: "≥ 1.0.0" },
  ],
};

export function renderSpecs(attrs: SpecsAttrs): string {
  const rows = (attrs.rows ?? []).filter((r) => r.label || r.value);
  if (rows.length === 0) return "";
  const items = rows
    .map(
      (r) =>
        `<div class="mp-specs__row"><span class="mp-specs__label">${escapeText(r.label)}</span><span class="mp-specs__value">${escapeText(r.value)}</span></div>`,
    )
    .join("");
  const heading = attrs.heading
    ? `<h3 class="mp-section-heading">${escapeText(attrs.heading)}</h3>`
    : "";
  return `${heading}<section class="mp-specs"><div class="mp-specs__grid">${items}</div></section>`;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/specs"[^>]*)>\s*<\/div>/g;

export function transformSpecs(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<SpecsAttrs>(enc, DEFAULT_SPECS);
    return renderSpecs(attrs) || "";
  });
}
