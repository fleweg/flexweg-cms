// Shared helpers for the magazine theme's blocks.
//
// Mirrors src/themes/default/blocks/util.ts — same encoding/escaping
// helpers, just under the magazine namespace so block markers don't
// collide with default's. Block-encoded post bodies survive theme
// switches by remaining inert markers when the originating theme isn't
// active (transformBodyHtml drops them silently).

export const THEME_BLOCK_NAMESPACE = "magazine";

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

// Builds a Tiptap node name out of a block id. Magazine prefixes its
// node names with `magazine` to avoid collisions with default theme's
// `block*` names when the editor is mounted with both extension sets
// (which only happens on a theme switch — by design they don't overlap
// at runtime, but unique node names keep the safety margin).
export function nodeNameFor(blockSubId: string): string {
  return `magazine${blockSubId.charAt(0).toUpperCase()}${blockSubId.slice(1)}`;
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
