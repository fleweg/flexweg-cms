import { PROVIDERS } from "./providers";
import { EMBED_BASELINE_STYLE_TAG } from "./styles";

// Cross-filter coordination state. The publish pipeline is sequential
// for a given page render (post.html.body runs first, page.body.end
// runs inside renderPageToHtml a few milliseconds later), so a plain
// module-level Set is safe — there is no concurrent rendering of two
// pages from the same browser tab.
//
// We reset the set at the start of every transformBodyHtml call so a
// previously-rendered page (with a Twitter embed) doesn't bleed its
// widgets.js script into the next page (without).
let detectedProviders = new Set<string>();

// Pulls a single attribute out of a substring of HTML attributes.
// Tolerant of single/double quotes and missing values; returns "" when
// the attribute is absent. We don't try to handle the full HTML5 spec
// (entities in attribute values, etc.) because the producer is our own
// renderHTML which only ever emits straight-quoted ASCII.
function pickAttr(attrsHtml: string, name: string): string {
  const match = attrsHtml.match(
    new RegExp(`${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`),
  );
  if (!match) return "";
  return match[1] ?? match[2] ?? match[3] ?? "";
}

// Replaces every `<div data-cms-embed="…" data-id="…"></div>` marker
// in the rendered post HTML with the provider's full embed markup.
// Markers whose provider is unknown (or whose data-id is empty) are
// dropped — the post would render an empty placeholder otherwise,
// which is worse than a missing block.
//
// Side effect: records which providers appear so the body-end filter
// can emit their scripts. Always reset at the start of the call so
// stale state from a previous page never leaks.
export function transformBodyHtml(html: string): string {
  detectedProviders = new Set<string>();
  return html.replace(
    /<div\s+([^>]*data-cms-embed="(\w+)"[^>]*)>\s*<\/div>/g,
    (_match, attrsHtml: string, providerId: string) => {
      const provider = PROVIDERS[providerId];
      if (!provider) return "";
      const id = pickAttr(attrsHtml, "data-id");
      if (!id) return "";
      detectedProviders.add(providerId);
      return provider.renderHtml(id);
    },
  );
}

// Returns the script tags to inject at body-end for the providers
// detected on the most recent transformBodyHtml call. Returns an empty
// string when no JS-requiring embed was used on the page so the
// page.body.end filter chain can stay a no-op.
//
// Each provider contributes at most one script regardless of how many
// of its embeds appear on the page — the Set deduplicates by
// providerId.
export function getDetectedBodyScripts(): string {
  const tags: string[] = [];
  for (const providerId of detectedProviders) {
    const script = PROVIDERS[providerId]?.bodyScript;
    if (script) tags.push(script);
  }
  return tags.join("\n");
}

// Returns the head <style> block when at least one embed was used on
// the page; empty string otherwise. Read by the page.head.extra
// filter chain. Single output regardless of how many embeds appear.
// The CSS itself is shared with the admin editor via styles.ts.
export function getDetectedHeadStyles(): string {
  return detectedProviders.size > 0 ? EMBED_BASELINE_STYLE_TAG : "";
}

// Test-only helper: lets unit tests reset module state between cases.
// Not exported through the plugin manifest — leaks of this symbol into
// the bundle are harmless but call sites in production code should
// rely on transformBodyHtml's automatic reset instead.
export function _resetForTests(): void {
  detectedProviders = new Set<string>();
}
