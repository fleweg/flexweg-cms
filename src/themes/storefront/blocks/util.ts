// Shared helpers for the storefront theme's blocks.
//
// Mirrors src/themes/corporate/blocks/util.ts — same encoding/escaping
// helpers, just under the storefront namespace so block markers don't
// collide with corporate's, magazine's, or default's. Block-encoded
// post bodies survive theme switches by remaining inert markers when
// the originating theme isn't active (transformBodyHtml drops them
// silently when the active theme has a different namespace).

export const THEME_BLOCK_NAMESPACE = "storefront";

export function encodeAttrs<T>(value: T): string {
  if (value === undefined || value === null) return "";
  try {
    const json = JSON.stringify(value);
    if (typeof window === "undefined") {
      return Buffer.from(json, "utf-8").toString("base64");
    }
    return window.btoa(unescape(encodeURIComponent(json)));
  } catch {
    return "";
  }
}

export function decodeAttrs<T>(encoded: string | undefined | null, fallback: T): T {
  if (!encoded || typeof encoded !== "string") return fallback;
  try {
    let json: string;
    if (typeof window === "undefined") {
      json = Buffer.from(encoded, "base64").toString("utf-8");
    } else {
      json = decodeURIComponent(escape(window.atob(encoded)));
    }
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Builds a Tiptap node name out of a block id. Storefront prefixes its
// node names with `storefront` to avoid collisions with default /
// magazine / corporate when their extension sets are mounted
// side-by-side.
export function nodeNameFor(blockSubId: string): string {
  return `storefront${blockSubId.charAt(0).toUpperCase()}${blockSubId.slice(1)}`;
}

export function escapeAttr(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Format a money value with the configured currency. Falls back to
// the native Intl.NumberFormat when available; otherwise returns a
// straight "<amount> <symbol>" string. Used by every product-related
// render path so the same locale/currency pair drives prices in
// product cards, the catalog filter, single-post hero, and the JSON
// blob the catalog publisher emits.
export function formatPrice(amount: number, currency: string, locale = "en"): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency || ""}`.trim();
  }
}
