import { escapeText } from "../util";

export interface StatItem {
  // Big number / value (string so it can include "+", "%", "k", etc.).
  value: string;
  // Label below the value, label-caps weight.
  label: string;
}

export interface StatsGridAttrs {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
}

export interface StatsGridRenderResult {
  html: string;
}

// Stats grid — large secondary-colored numerals over label-caps tags.
// Used for "X+ clients", "Y% growth" sections that anchor "About"
// pages or the bottom of services sections. Adapts to 2/3/4-column
// layouts based on item count.
export function renderStatsGrid(attrs: StatsGridAttrs): StatsGridRenderResult {
  const items = (attrs.stats ?? []).filter((s) => s && (s.value || s.label));
  if (items.length === 0 && !attrs.title) return { html: "" };

  const eyebrowHtml = attrs.eyebrow
    ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block">${escapeText(attrs.eyebrow)}</span>`
    : "";
  const titleHtml = attrs.title
    ? `<h2 class="text-h2 font-bold text-primary mb-4">${escapeText(attrs.title)}</h2>`
    : "";
  const subtitleHtml = attrs.subtitle
    ? `<p class="text-on-surface-variant text-body-md max-w-xl mx-auto">${escapeText(attrs.subtitle)}</p>`
    : "";

  const headerHtml =
    eyebrowHtml || titleHtml || subtitleHtml
      ? `<div class="text-center max-w-2xl mx-auto mb-stack-lg">${eyebrowHtml}${titleHtml}${subtitleHtml}</div>`
      : "";

  // 4 stats → 4 col, 3 → 3 col, 2 → 2 col, 1 → 1 col.
  const gridCols =
    items.length >= 4
      ? "grid-cols-2 md:grid-cols-4"
      : items.length === 3
        ? "grid-cols-1 md:grid-cols-3"
        : items.length === 2
          ? "grid-cols-2"
          : "grid-cols-1";

  const itemsHtml = items
    .map(
      (s) =>
        `<div class="text-center"><span class="text-h1 font-bold text-secondary block">${escapeText(s.value)}</span><span class="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider mt-2 block">${escapeText(s.label)}</span></div>`,
    )
    .join("");

  return {
    html: `<section class="py-section-padding px-gutter">
<div class="max-w-container-max mx-auto">
${headerHtml}
<div class="grid ${gridCols} gap-stack-lg bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-stack-lg shadow-sm">${itemsHtml}</div>
</div>
</section>`,
  };
}
