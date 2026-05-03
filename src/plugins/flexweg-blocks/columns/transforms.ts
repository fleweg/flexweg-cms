import { COLUMNS_BASELINE_STYLE_TAG } from "../styles";

// Tracks whether at least one columns block was processed during the
// most recent transformBodyHtml call. The page.head.extra filter
// reads this to decide whether to inject the baseline CSS — same
// pattern as flexweg-embeds. Reset at the start of every transform
// so a previous page's state never leaks across renders (publishing
// is sequential per page, all in one JS turn).
let detected = false;

// Transforms the post body's columns markers into the published
// markup. Two markers per columns block:
//
//   <div data-cms-block="flexweg-blocks/columns" data-cols="N">
//     <div data-cms-column>...</div>
//     <div data-cms-column>...</div>
//   </div>
//
// Becomes:
//
//   <div class="cms-columns cms-columns-cols-N">
//     <div class="cms-column">...</div>
//     <div class="cms-column">...</div>
//   </div>
//
// Inner content (paragraphs, headings, embeds, theme blocks) stays
// untouched — the regex-based filters from the default theme and
// flexweg-embeds run AFTER ours (priority 5 vs 10) and pick up the
// nested markers.
//
// Implemented via DOMParser rather than regex because nested HTML
// makes regex matching unreliable (a column's content may itself
// contain divs that happen to look like outer markers).
export function transformColumnsHtml(html: string): string {
  detected = false;
  if (!html.includes('data-cms-block="flexweg-blocks/columns"')) return html;
  if (typeof DOMParser === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");

  const containers = doc.querySelectorAll<HTMLElement>(
    'div[data-cms-block="flexweg-blocks/columns"]',
  );
  containers.forEach((container) => {
    detected = true;
    const cols = container.getAttribute("data-cols") ?? "2";
    const safeCols = sanitizeCols(cols);
    container.removeAttribute("data-cms-block");
    container.removeAttribute("data-cols");
    container.classList.add("cms-columns", `cms-columns-cols-${safeCols}`);
    // Inner column wrappers — only those that are direct children
    // of THIS container, so a nested columns block (allowed but
    // discouraged) gets processed independently in its own pass.
    Array.from(container.children).forEach((child) => {
      if (child instanceof HTMLElement && child.hasAttribute("data-cms-column")) {
        child.removeAttribute("data-cms-column");
        child.classList.add("cms-column");
      }
    });
  });

  // body.innerHTML re-serialises with normalised attribute quoting
  // and self-closing-tag rules. Should be lossless for our markup.
  return doc.body.innerHTML;
}

// Returns the head <style> block when at least one columns block
// was processed in the most recent transformColumnsHtml call.
// Mirrors flexweg-embeds' getDetectedHeadStyles — single point that
// the page.head.extra filter consumes.
export function getDetectedColumnsStyles(): string {
  return detected ? COLUMNS_BASELINE_STYLE_TAG : "";
}

function sanitizeCols(value: string): number {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return 2;
  return Math.max(1, Math.min(4, n));
}

// Test-only helper: lets unit tests reset module state between
// cases. Not exported through the plugin manifest.
export function _resetForTests(): void {
  detected = false;
}
