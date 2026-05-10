import { escapeAttr, escapeText } from "../util";

export interface FeatureItem {
  // Material Symbols Outlined glyph name (e.g. "local_shipping",
  // "eco", "loyalty", "verified", "spa").
  icon: string;
  label: string;
}

export interface ProductFeaturesAttrs {
  features: FeatureItem[];
}

export interface ProductFeaturesRenderResult {
  html: string;
}

// Inline 3-icon row used after the product hero. Matches the catalog
// mockup's "Same Day Delivery / Sustainably Sourced / Fragrance
// Guarantee" trio. Renders nothing when no features set.
export function renderProductFeatures(
  attrs: ProductFeaturesAttrs,
): ProductFeaturesRenderResult {
  const features = Array.isArray(attrs.features)
    ? attrs.features.filter((f) => f.icon || f.label)
    : [];
  if (features.length === 0) return { html: "" };

  const colsClass =
    features.length === 1
      ? "grid-cols-1"
      : features.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  return {
    html: `<section class="max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="grid ${colsClass} gap-stack-md py-stack-lg border-y border-outline-variant/30">${features
      .map(
        (f) =>
          `<div class="text-center"><span class="material-symbols-outlined text-2xl text-primary mb-stack-sm block">${escapeAttr(f.icon)}</span><p class="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest">${escapeText(f.label)}</p></div>`,
      )
      .join("")}</div>
</section>`,
  };
}
