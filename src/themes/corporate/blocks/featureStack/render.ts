import { escapeAttr, escapeText } from "../util";

export interface FeatureItem {
  // Material Symbols Outlined glyph (e.g. "rocket_launch", "insights").
  icon?: string;
  // Small uppercase eyebrow above the title.
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  // Image rendered next to the text. Position toggles per row when
  // the section's `alternate` flag is set; this `imagePosition`
  // override pins one row to a specific side.
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export interface FeatureStackAttrs {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  // When true, image side flips on every odd row (image-right, then
  // image-left, …). Default true. Pin a row with imagePosition.
  alternate?: boolean;
  features?: FeatureItem[];
}

export interface FeatureStackRenderResult {
  html: string;
}

const DEFAULT_FEATURE: FeatureItem = {
  icon: "auto_awesome",
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  imageUrl: "",
  imageAlt: "",
};

function renderRow(feature: FeatureItem, index: number, alternate: boolean): string {
  const merged = { ...DEFAULT_FEATURE, ...feature };
  if (!merged.title && !merged.description) return "";

  // Determine image side. Explicit override wins; otherwise we
  // alternate when the global flag is on.
  const naturalRight = alternate ? index % 2 === 1 : false;
  const imageOnLeft = merged.imagePosition === "left" || (merged.imagePosition !== "right" && naturalRight);

  const iconHtml = merged.icon
    ? `<div class="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-stack-md"><span class="material-symbols-outlined text-secondary text-h3">${escapeText(merged.icon)}</span></div>`
    : "";
  const eyebrowHtml = merged.eyebrow
    ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block">${escapeText(merged.eyebrow)}</span>`
    : "";
  const titleHtml = `<h3 class="text-h2 font-bold text-primary mb-stack-md">${escapeText(merged.title)}</h3>`;
  const descHtml = `<p class="text-body-lg text-on-surface-variant mb-stack-md">${escapeText(merged.description)}</p>`;
  const ctaHtml =
    merged.ctaLabel && merged.ctaHref
      ? `<a href="${escapeAttr(merged.ctaHref)}" class="inline-flex items-center gap-2 text-button font-semibold text-secondary hover:gap-3 transition-all">${escapeText(merged.ctaLabel)}<span class="material-symbols-outlined text-[18px]">trending_flat</span></a>`
      : "";

  const textBlock = `<div class="flex flex-col justify-center">${iconHtml}${eyebrowHtml}${titleHtml}${descHtml}${ctaHtml}</div>`;
  const imageBlock = merged.imageUrl
    ? `<div class="rounded-2xl overflow-hidden shadow-xl aspect-video bg-surface-container-low"><img src="${escapeAttr(merged.imageUrl)}" alt="${escapeAttr(merged.imageAlt ?? merged.title)}" class="w-full h-full object-cover" loading="lazy" /></div>`
    : "";

  // Single-column on mobile (always text first, image second). Two
  // columns on md+ with the side resolved above.
  const order = imageOnLeft ? "md:[&>:first-child]:order-2" : "";
  return `<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-lg ${order}">${textBlock}${imageBlock}</div>`;
}

// Feature stack — repeating image+text rows for "How it works",
// "Product features", "Why us" sections. Alternate left/right by
// default to create vertical rhythm; per-row override available.
export function renderFeatureStack(attrs: FeatureStackAttrs): FeatureStackRenderResult {
  const features = (attrs.features ?? []).filter((f) => f && (f.title || f.description));
  if (features.length === 0 && !attrs.title) return { html: "" };

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
      ? `<div class="text-center max-w-2xl mx-auto mb-section-padding">${eyebrowHtml}${titleHtml}${subtitleHtml}</div>`
      : "";

  const alternate = attrs.alternate !== false;
  const rowsHtml = features.map((f, i) => renderRow(f, i, alternate)).join("");

  return {
    html: `<section class="py-section-padding px-gutter">
<div class="max-w-container-max mx-auto">
${headerHtml}
<div class="space-y-section-padding">${rowsHtml}</div>
</div>
</section>`,
  };
}
