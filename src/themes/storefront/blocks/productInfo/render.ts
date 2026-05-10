import { decodeAttrs, escapeAttr, escapeText, formatPrice } from "../util";

// Card-level labels extracted from a post's product-info block,
// used by HomeTemplate / CategoryTemplate / AuthorTemplate to render
// prices + promo strike + first badge on listing cards. Operates on
// raw markdown (the marker survives tiptap-markdown's round-trip)
// so callers can pass `post.contentMarkdown` directly without going
// through the rendered HTML.
export interface ProductCardLabels {
  priceLabel: string;
  promoLabel: string;
  badge: string;
}

export function extractProductCardLabels(
  markdown: string,
  locale: string,
  fallbackCurrency: string,
  inquiryOnly: boolean,
): ProductCardLabels {
  // Inquiry-only mode hides prices everywhere, including listings.
  if (inquiryOnly) return { priceLabel: "", promoLabel: "", badge: "" };
  const extracted = extractProductInfo(markdown);
  if (!extracted) return { priceLabel: "", promoLabel: "", badge: "" };
  const { attrs } = extracted;
  const currency = attrs.currency || fallbackCurrency || "EUR";
  const priceTTC = attrs.priceTTC ?? 0;
  const promoTTC = attrs.promoTTC ?? 0;
  const hasPromo = promoTTC > 0 && promoTTC < priceTTC;
  return {
    priceLabel: priceTTC > 0 ? formatPrice(priceTTC, currency, locale) : "",
    promoLabel: hasPromo ? formatPrice(promoTTC, currency, locale) : "",
    badge:
      Array.isArray(attrs.badges) && attrs.badges.length > 0
        ? attrs.badges[0]
        : "",
  };
}

// Stock pill mapping. Keys must match StockStatus on
// StorefrontProductDefaults; CSS classes are defined in theme.css
// under `.storefront-stock-*`.
const STOCK_PILL_CLASSES: Record<string, string> = {
  "in-stock": "storefront-stock-in",
  "low-stock": "storefront-stock-low",
  "out-of-stock": "storefront-stock-out",
  "on-order": "storefront-stock-order",
};

export interface ProductVariant {
  // Field label (e.g. "Size", "Vase option").
  label: string;
  // Selectable options. Each is rendered as a <select> entry. Add a
  // "+ $X" suffix in the option label to surface upcharges — the
  // theme doesn't compute prices, this is purely informational.
  options: string[];
}

export interface ProductInfoAttrs {
  priceHT: number;
  priceTTC: number;
  promoTTC: number;
  currency: string;
  // Match StorefrontProductDefaults.StockStatus literals.
  stockStatus: "in-stock" | "low-stock" | "out-of-stock" | "on-order" | "";
  variants: ProductVariant[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  // Free-form labels appearing as pills above the title (e.g.
  // "Limited Edition", "New", "Bestseller"). Comma-separated input
  // in the inspector.
  badges: string[];
}

export interface ProductInfoLabels {
  inStock: string;
  lowStock: string;
  outOfStock: string;
  onOrder: string;
  promoBadge: string;
  priceHT: string;
  priceTTC: string;
}

// Locates the FIRST product-info marker in `bodyHtml` and decodes its
// attrs. Used by SingleTemplate to extract the product card data
// before the body renders. Returns null when no marker is present.
const PRODUCT_INFO_MARKER_REGEX =
  /<div\s+([^>]*data-cms-block="storefront\/product-info"[^>]*)>\s*<\/div>/;

export function extractProductInfo(
  bodyHtml: string,
): { attrs: ProductInfoAttrs; markerMatch: string } | null {
  const m = bodyHtml.match(PRODUCT_INFO_MARKER_REGEX);
  if (!m) return null;
  const attrsHtmlMatch = m[1].match(
    /data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/,
  );
  const attrsRaw = attrsHtmlMatch
    ? (attrsHtmlMatch[1] ?? attrsHtmlMatch[2] ?? attrsHtmlMatch[3] ?? "")
    : "";
  const attrs = decodeAttrs<ProductInfoAttrs>(attrsRaw, DEFAULT_PRODUCT_INFO_ATTRS);
  return { attrs, markerMatch: m[0] };
}

// Strip the first product-info marker from `bodyHtml`. Always called
// after extractProductInfo so the marker doesn't render as an empty
// `<div>` later in the body.
export function stripProductInfoMarker(bodyHtml: string): string {
  return bodyHtml.replace(PRODUCT_INFO_MARKER_REGEX, "");
}

// Default attrs — also exported for the manifest's defaultAttrs and
// extractProductInfo's fallback when decode fails.
export const DEFAULT_PRODUCT_INFO_ATTRS: ProductInfoAttrs = {
  priceHT: 0,
  priceTTC: 0,
  promoTTC: 0,
  currency: "",
  stockStatus: "",
  variants: [],
  ctaPrimaryLabel: "",
  ctaPrimaryHref: "",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "",
  badges: [],
};

// Builds the right-column product card on the single page. Pulls
// labels from i18n via the `labels` arg so the renderer stays pure
// (no i18n dependency).
export function renderProductInfoCard(args: {
  attrs: ProductInfoAttrs;
  labels: ProductInfoLabels;
  locale: string;
  // Site-wide product defaults — the attrs override these when set,
  // otherwise we fall back to the defaults so empty fields still
  // surface a credible value.
  defaults: {
    currency: string;
    ctaLabel: string;
    ctaHref: string;
    inquiryOnly: boolean;
  };
}): string {
  const { attrs, labels, locale, defaults } = args;
  const currency = attrs.currency || defaults.currency || "EUR";
  const inquiryOnly = defaults.inquiryOnly === true;

  // Badges — small uppercase chips above the title in the right
  // column (the title itself is rendered by SingleTemplate, not
  // here, so the right-column starts with badges).
  const badgesHtml =
    attrs.badges && attrs.badges.length > 0
      ? `<div class="flex flex-wrap gap-2 mb-stack-md">${attrs.badges
          .map(
            (b) =>
              `<span class="font-label-caps text-label-caps text-secondary bg-secondary-fixed/40 px-3 py-1 rounded-full uppercase tracking-widest">${escapeText(b)}</span>`,
          )
          .join("")}</div>`
      : "";

  // Price block. Inquiry-only mode: hide prices entirely (sites
  // selling bespoke arrangements often prefer "request a quote"). When
  // a promo is set, show the discounted TTC in secondary color and
  // the original TTC struck-through next to it.
  let priceHtml = "";
  if (!inquiryOnly && attrs.priceTTC > 0) {
    if (attrs.promoTTC > 0 && attrs.promoTTC < attrs.priceTTC) {
      priceHtml = `<div class="flex items-baseline gap-stack-md mb-stack-md">
<p class="display-serif text-headline-md text-secondary">${escapeText(formatPrice(attrs.promoTTC, currency, locale))}</p>
<p class="text-on-surface-variant line-through text-body-md">${escapeText(formatPrice(attrs.priceTTC, currency, locale))}</p>
</div>`;
    } else {
      priceHtml = `<p class="display-serif text-headline-md text-primary mb-stack-md">${escapeText(formatPrice(attrs.priceTTC, currency, locale))}</p>`;
    }
  }

  // Stock pill — skip silently when no status set.
  const stockHtml = attrs.stockStatus
    ? `<p class="${STOCK_PILL_CLASSES[attrs.stockStatus] ?? "storefront-stock-pill"} mb-stack-md storefront-stock-pill">${escapeText(stockLabel(attrs.stockStatus, labels))}</p>`
    : "";

  // Variants — one <select> per row, plain field. The form is
  // decorative on a static-host CMS (no real cart), but keeping the
  // markup native means the user's CTA handler (mailto / external
  // checkout) can pre-fill the chosen options if it wants to.
  const variantsHtml =
    attrs.variants && attrs.variants.length > 0
      ? `<div class="grid ${attrs.variants.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-stack-md mb-stack-md">${attrs.variants
          .map(
            (v) =>
              `<div><label class="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">${escapeText(v.label)}</label><select name="variant_${escapeAttr(v.label.toLowerCase().replace(/\s+/g, "_"))}" class="w-full bg-surface border border-outline-variant rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none">${v.options
                .map((opt) => `<option>${escapeText(opt)}</option>`)
                .join("")}</select></div>`,
          )
          .join("")}</div>`
      : "";

  // CTAs — primary uses attrs, falls back to defaults; secondary
  // appears only when both label and href are set.
  const primaryLabel = attrs.ctaPrimaryLabel || defaults.ctaLabel;
  const primaryHref = attrs.ctaPrimaryHref || defaults.ctaHref;
  const ctaPrimaryHtml = primaryLabel && primaryHref
    ? `<a href="${escapeAttr(primaryHref)}" class="block w-full text-center bg-primary text-on-primary py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg">${escapeText(primaryLabel)}</a>`
    : "";
  const ctaSecondaryHtml = attrs.ctaSecondaryLabel && attrs.ctaSecondaryHref
    ? `<a href="${escapeAttr(attrs.ctaSecondaryHref)}" class="block w-full text-center border border-secondary text-secondary py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-fixed hover:border-transparent transition-all">${escapeText(attrs.ctaSecondaryLabel)}</a>`
    : "";
  const ctasHtml = ctaPrimaryHtml || ctaSecondaryHtml
    ? `<div class="space-y-stack-sm">${ctaPrimaryHtml}${ctaSecondaryHtml}</div>`
    : "";

  return [
    badgesHtml,
    priceHtml,
    stockHtml,
    `<div class="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-outline-variant/30">`,
    variantsHtml,
    ctasHtml,
    `</div>`,
  ].join("");
}

function stockLabel(status: string, labels: ProductInfoLabels): string {
  switch (status) {
    case "in-stock":
      return labels.inStock;
    case "low-stock":
      return labels.lowStock;
    case "out-of-stock":
      return labels.outOfStock;
    case "on-order":
      return labels.onOrder;
    default:
      return "";
  }
}
