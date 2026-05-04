import { HTML_BLOCK_ID } from "./extension";

// Decodes the base64-JSON `data-attrs` payload back to the original
// code string. Mirrors encodeAttrs in extension.tsx — kept here as
// a local helper so the publish-time pipeline can run without
// importing the editor-side React module (avoids dragging React /
// lucide / Tiptap into the public site's runtime path).
function decodeCode(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    let json: string;
    if (typeof window === "undefined") {
      json = Buffer.from(raw, "base64").toString("utf-8");
    } else {
      json = decodeURIComponent(escape(window.atob(raw)));
    }
    const obj = JSON.parse(json) as { code?: unknown };
    return typeof obj.code === "string" ? obj.code : "";
  } catch {
    return "";
  }
}

// Replaces every Custom HTML marker in the rendered post body with
// the raw code the user entered. Implemented via DOMParser so the
// element's outer replacement preserves surrounding HTML correctly
// — a regex pass would be brittle when the marker sits inside a
// columns container or other nested block.
//
// Important: scripts in the user's code reach the published page
// verbatim. They DON'T execute inside the publisher's browser — the
// document we parse with DOMParser is detached, scripts only run
// when a real browser loads the file from Flexweg. This is the
// intended behaviour for a "Custom HTML" block: the user wants
// their JS to run on visitors' pages.
//
// DOMPurify in core/markdown.ts runs BEFORE this filter and would
// strip raw <script> tags from markdown. We sidestep that by
// storing the code base64-encoded inside `data-attrs` (DOMPurify
// keeps `data-*` attributes); the actual scripts only re-emerge at
// this point in the pipeline, after sanitisation has finished.
export function transformHtmlBlocks(html: string): string {
  if (!html.includes(`data-cms-block="${HTML_BLOCK_ID}"`)) return html;
  if (typeof DOMParser === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks = doc.querySelectorAll<HTMLElement>(
    `div[data-cms-block="${HTML_BLOCK_ID}"]`,
  );
  blocks.forEach((el) => {
    const code = decodeCode(el.getAttribute("data-attrs"));
    if (!code) {
      // Empty marker — strip it entirely so the published page
      // doesn't have a stray div hanging around.
      el.remove();
      return;
    }
    // outerHTML re-parses the new HTML in context, replacing the
    // marker element with whatever the user wrote. Preserves
    // <script>, <style>, <iframe>, etc. — the parser builds the
    // tree but doesn't execute anything (DOMParser context is
    // inert).
    el.outerHTML = code;
  });

  return doc.body.innerHTML;
}
