import { useEffect } from "react";
import {
  DEFAULT_EDITOR_SIZES,
  getEditorFont,
} from "../core/editorFonts";
import type { EditorStyle } from "../core/types";

// Injects the post editor's typography preferences into the admin
// document at component mount, refreshing on every change. Two side
// effects:
//
//   • A single <style data-cms-editor-style> block in <head> mapping
//     `.prose-editor` selectors to the user's chosen font + sizes.
//     Replaced (not duplicated) on every change.
//
//   • A <link rel="stylesheet" data-cms-editor-font="<id>"> for the
//     Google Fonts CSS of the chosen preset. Idempotent per preset id
//     — picking the same preset twice doesn't re-fetch; switching
//     presets adds a new link without removing the old (cache stays
//     warm, browsers dedupe at the network layer).
//
// Defaults match the values the admin used to hardcode in index.css
// so users who never touch the setting see no visual change.
// Coerces a length input into something the CSS parser accepts. Bare
// numbers — `16`, `1.25` — get a `rem` suffix; users typing those
// commonly mean "rems" but the browser silently drops the rule when
// the unit is missing, which then lets Tailwind preflight's
// `h2 { font-size: inherit }` reset win. Any non-empty string with at
// least one non-numeric character is passed through untouched
// (`16px`, `1rem`, `clamp(...)`, …).
function normalizeLength(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}rem`;
  return trimmed;
}

export function useEditorStyleInjection(style: EditorStyle | undefined): void {
  // Display name (e.g. "Inter", "EB Garamond") — same string the user
  // sees in the dropdown, same value stored in Firestore. Falls back
  // to the system entry when missing.
  const fontName = style?.fontFamily;
  const bodySize = normalizeLength(style?.bodySize ?? "") || DEFAULT_EDITOR_SIZES.body;
  const h1Size = normalizeLength(style?.h1Size ?? "") || DEFAULT_EDITOR_SIZES.h1;
  const h2Size = normalizeLength(style?.h2Size ?? "") || DEFAULT_EDITOR_SIZES.h2;
  const h3Size = normalizeLength(style?.h3Size ?? "") || DEFAULT_EDITOR_SIZES.h3;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const preset = getEditorFont(fontName);

    // Lazy-load the Google Fonts CSS for the chosen preset. Skipped
    // for "System" (no googleHref). Idempotent — querySelector on the
    // data-attr key prevents duplicate <link>s across renders.
    if (preset.googleHref) {
      const selector = `link[data-cms-editor-font="${preset.name}"]`;
      if (!document.querySelector(selector)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = preset.googleHref;
        link.setAttribute("data-cms-editor-font", preset.name);
        document.head.appendChild(link);
      }
    }

    // Re-write the inline style block on every change. We ALWAYS
    // emit it (even at defaults) so removing the block on cleanup is
    // safe — there's exactly one source of editor typography in head.
    //
    // The doubled `.prose-editor.prose-editor` selector raises the
    // class specificity from (0,1,1) to (0,2,1) to outrank Tailwind
    // preflight's `h1,h2,…{ font-size: inherit }` reset (specificity
    // 0,0,1) AND any future utility class a user might bolt onto a
    // heading. Cleaner than peppering !important across every rule.
    //
    // .cms-editor-title is the inline post-title <textarea> (lives
    // outside the Tiptap canvas, so .prose-editor h1 doesn't reach
    // it). Tied to the H1 size on purpose — the title IS the page's
    // H1, just rendered as a textarea for IME / accessibility reasons.
    const css = `
.prose-editor.prose-editor { font-family: ${preset.stack}; font-size: ${bodySize}; }
.prose-editor.prose-editor h1 { font-size: ${h1Size}; }
.prose-editor.prose-editor h2 { font-size: ${h2Size}; }
.prose-editor.prose-editor h3 { font-size: ${h3Size}; }
.cms-editor-title.cms-editor-title { font-family: ${preset.stack}; font-size: ${h1Size}; }
`.trim();

    let styleEl = document.querySelector<HTMLStyleElement>(
      "style[data-cms-editor-style]",
    );
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.setAttribute("data-cms-editor-style", "true");
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;

    return () => {
      // Remove the style block when the editor unmounts so admin
      // pages outside /posts/* aren't styled by it. The Google Fonts
      // <link> is intentionally kept — the browser cache makes it
      // free on the next mount, and removing it would just trigger
      // a flash of un-styled fonts.
      const existing = document.querySelector("style[data-cms-editor-style]");
      existing?.parentNode?.removeChild(existing);
    };
  }, [fontName, bodySize, h1Size, h2Size, h3Size]);
}
