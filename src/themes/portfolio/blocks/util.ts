// Portfolio block helpers. Mirrors storefront / corporate / magazine
// util.ts — same encoding shape, just under the `portfolio` namespace
// so markers from different themes can coexist in a post body
// without collision (transformBodyHtml in each theme drops markers
// owned by other namespaces silently).

export const THEME_BLOCK_NAMESPACE = "portfolio";

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

// Tiptap node name — `portfolio` prefix so this theme's nodes don't
// collide with the other themes' inserters when both are
// transiently loaded.
export function nodeNameFor(blockSubId: string): string {
  return `portfolio${blockSubId.charAt(0).toUpperCase()}${blockSubId.slice(1)}`;
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
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
