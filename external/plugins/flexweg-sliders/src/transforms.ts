// Publish-time pipeline:
//
//   1. post.html.body — scans for `<div data-cms-block="flexweg-sliders/*"
//      data-attrs="<base64>"></div>` markers, replaces each with the
//      slider's published HTML, and records the slider kind so the
//      head/body filters know whether to inject runtime assets.
//
//   2. page.head.extra — emits the runtime CSS once per page if any
//      slider appears.
//
//   3. page.body.end — emits the runtime JS once per page if any
//      slider appears.
//
// Module-level Set tracks per-page detection. The publish pipeline
// runs sequentially for a single page, so a plain shared Set is safe;
// transformBodyHtml resets it at the start of every call to prevent
// state leaking from one page render to the next.

import { SLIDERS, SLIDER_LIST, type SliderAttrs, type SliderKind } from "./sliders";
import { SLIDER_SCRIPT_TAG, SLIDER_STYLE_TAG } from "./runtime";
import { decodeAttrs, encodeAttrs as encodeAttrsImpl } from "./codec";

let detected = false;

function pickAttr(attrsHtml: string, name: string): string {
  const match = attrsHtml.match(
    new RegExp(`${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`),
  );
  if (!match) return "";
  return match[1] ?? match[2] ?? match[3] ?? "";
}

const MARKER_RE = /<div\s+([^>]*data-cms-block="flexweg-sliders\/(\w+)"[^>]*)>\s*<\/div>/g;

export function transformBodyHtml(html: string): string {
  detected = false;
  return html.replace(MARKER_RE, (_match, attrsHtml: string, kind: string) => {
    const def = SLIDERS[kind as SliderKind];
    if (!def) return "";
    const encoded = pickAttr(attrsHtml, "data-attrs");
    const attrs = decodeAttrs<SliderAttrs>(encoded, def.defaults);
    const out = def.renderHtml(attrs as SliderAttrs);
    if (out) detected = true;
    return out;
  });
}

export function getDetectedStyles(): string {
  return detected ? SLIDER_STYLE_TAG : "";
}

export function getDetectedScripts(): string {
  return detected ? SLIDER_SCRIPT_TAG : "";
}

export const encodeAttrs = encodeAttrsImpl;

// Reset helper for unit tests — not exported from manifest.tsx.
export function _resetForTests(): void {
  detected = false;
}

// Convenience export: every slider id, for the editor's block tab
// active-id matching.
export const ALL_SLIDER_IDS = SLIDER_LIST.map((s) => s.id);
