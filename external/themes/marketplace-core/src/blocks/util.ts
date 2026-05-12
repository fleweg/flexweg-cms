// Marketplace Core — block helpers. Mirrors the bundled themes'
// blocks/util.ts pattern: base64-encoded JSON in `data-attrs`.
//
// Note: this external theme doesn't ship full Tiptap node manifests
// — the focus is on the rendered HTML at publish time. Authors
// hand-write block markers in the markdown body (or paste them from
// the import bundle examples), and the publisher's
// `post.html.body` filter transforms them into rich HTML.

export const THEME_BLOCK_NAMESPACE = "marketplace-core";

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
    const json =
      typeof window === "undefined"
        ? Buffer.from(encoded, "base64").toString("utf-8")
        : decodeURIComponent(escape(window.atob(encoded)));
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
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

// Tiptap node name — `marketplace` prefix so this theme's nodes
// don't collide with other themes' atom nodes when both are
// transiently loaded.
export function nodeNameFor(blockSubId: string): string {
  return `marketplace${blockSubId.charAt(0).toUpperCase()}${blockSubId.slice(1)}`;
}
