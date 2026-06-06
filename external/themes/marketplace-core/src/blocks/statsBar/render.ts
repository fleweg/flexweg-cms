import { decodeAttrs, escapeText } from "../util";

// Stats bar block — a thin horizontal strip of N stats. Each entry
// pairs a big-emphasis number (or short string like "MIT") with a
// label. Used as a "trust" / "proof" element between the hero and
// the long feature sections. Mobile collapses to a 2-col grid.
export interface StatsBarAttrs {
  items: { value: string; label: string }[];
}

export const DEFAULT_STATS_BAR: StatsBarAttrs = {
  items: [],
};

export function renderStatsBar(attrs: StatsBarAttrs): string {
  const items = (attrs.items ?? []).filter((i) => i.value || i.label);
  if (items.length === 0) return "";
  const cells = items
    .map(
      (i) => `<div class="mp-stats__cell">
      <p class="mp-stats__value">${escapeText(i.value)}</p>
      <p class="mp-stats__label">${escapeText(i.label)}</p>
    </div>`,
    )
    .join("");
  return `<section class="mp-stats"><div class="mp-stats__row">${cells}</div></section>`;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/stats-bar"[^>]*)>\s*<\/div>/g;

export function transformStatsBar(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<StatsBarAttrs>(enc, DEFAULT_STATS_BAR);
    return renderStatsBar(attrs) || "";
  });
}
