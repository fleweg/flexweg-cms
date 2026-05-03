// Shared helpers for the default theme's home blocks.
//
// Storage strategy: each block is a Tiptap atom node that round-trips
// as `<div data-cms-block="<id>" data-attrs="<base64-json>"></div>`.
// Encoding all attrs into a single base64 blob keeps the schema
// extensible (we can add fields later without changing the marker
// shape) and avoids HTML-attribute escaping headaches when values
// contain quotes or angle brackets. The publisher decodes on the way
// out, the editor decodes inside its NodeView / inspector.
//
// Why base64 (vs raw JSON in the attribute): browsers strip leading
// whitespace and may normalize quotes inside attribute values; base64
// is a flat ASCII string that survives every pipeline cleanly.

export const THEME_BLOCK_NAMESPACE = "default";

export function encodeAttrs<T>(value: T): string {
  if (value === undefined || value === null) return "";
  try {
    const json = JSON.stringify(value);
    if (typeof window === "undefined") {
      // SSR / Node fallback — the publisher runs in the browser today
      // but Buffer.from is safe should that change.
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

// Builds a Tiptap node name out of a block id of the form
// "default/hero" → "blockHero". Tiptap node names can't contain
// slashes, dashes are allowed but camelCase is more conventional.
export function nodeNameFor(blockSubId: string): string {
  return `block${blockSubId.charAt(0).toUpperCase()}${blockSubId.slice(1)}`;
}

// Escapes a string for safe inclusion as an HTML attribute value.
// Used by every block's renderHtml to emit user-controlled strings
// (titles, urls, …) without giving them a chance to break out of
// their attribute. DOMPurify catches anything we miss at the
// post.html.body stage but emitting clean HTML is still good
// hygiene.
export function escapeAttr(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// HTML-escape arbitrary text content. Same intent as escapeAttr but
// drops the quote handling because it's destined for text nodes,
// not attribute values.
export function escapeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
