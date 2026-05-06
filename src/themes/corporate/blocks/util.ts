// Shared helpers for the corporate theme's blocks.
//
// Mirrors src/themes/magazine/blocks/util.ts — same encoding/escaping
// helpers, just under the corporate namespace so block markers don't
// collide with default's or magazine's. Block-encoded post bodies
// survive theme switches by remaining inert markers when the
// originating theme isn't active (transformBodyHtml drops them
// silently when the active theme has a different namespace).

export const THEME_BLOCK_NAMESPACE = "corporate";

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

// Builds a Tiptap node name out of a block id. Corporate prefixes its
// node names with `corporate` to avoid collisions with default /
// magazine when their extension sets are mounted side-by-side
// (theoretically only on theme switch, but the unique prefix is a
// belt-and-suspenders safety margin).
export function nodeNameFor(blockSubId: string): string {
  return `corporate${blockSubId.charAt(0).toUpperCase()}${blockSubId.slice(1)}`;
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
