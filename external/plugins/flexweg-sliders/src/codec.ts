// UTF-8 safe base64 encoder/decoder for block payloads. Used by:
//   - the Tiptap node's renderHTML / parseHTML
//   - the publish-time transforms.ts to decode the marker payload
//
// The unescape/encodeURIComponent dance is the classic pre-TextEncoder
// way to handle non-ASCII characters with btoa/atob (otherwise btoa
// throws on any char > U+00FF).

export function encodeAttrs<T>(value: T): string {
  if (value === undefined || value === null) return "";
  try {
    const json = JSON.stringify(value);
    if (typeof window === "undefined") {
      // Node: only hit during unit tests / SSR (not in production).
      // The Buffer global is available in Node — declared via @types/node
      // would be cleaner, but inline cast keeps the bundle free of
      // platform-specific types.
      const B = (globalThis as { Buffer?: { from: (s: string, enc?: string) => { toString: (enc: string) => string } } }).Buffer;
      return B ? B.from(json, "utf-8").toString("base64") : "";
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
      const B = (globalThis as { Buffer?: { from: (s: string, enc?: string) => { toString: (enc: string) => string } } }).Buffer;
      json = B ? B.from(encoded, "base64").toString("utf-8") : "";
    } else {
      json = decodeURIComponent(escape(window.atob(encoded)));
    }
    if (!json) return fallback;
    const parsed = JSON.parse(json);
    // Shallow-merge with fallback so missing keys (e.g. attrs added in
    // a newer plugin version) come from defaults rather than being
    // undefined — which would crash render functions that don't
    // defensively check every field.
    return { ...fallback, ...parsed } as T;
  } catch {
    return fallback;
  }
}
