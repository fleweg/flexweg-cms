// Baseline CSS shared between the published page (injected via the
// page.head.extra hook only when at least one embed is on the page)
// and the admin editor (injected globally at module-load time so
// in-editor previews look the same as the live page).
//
// Themes can override these rules with their own `.cms-embed*`
// selectors but the defaults make sure iframes look reasonable out
// of the box.
export const EMBED_BASELINE_CSS = `
.cms-embed{aspect-ratio:16/9;width:100%;max-width:100%;margin:1.5rem 0;background:transparent;}
.cms-embed iframe{width:100%;height:100%;border:0;display:block;}
.cms-embed-spotify{aspect-ratio:auto;height:152px;}
.cms-embed-twitter{aspect-ratio:auto;max-width:550px;height:600px;margin:1.5rem auto;}
.cms-embed-placeholder{display:block;padding:1rem;border:1px dashed currentColor;border-radius:.5rem;font-size:.875rem;line-height:1.4;opacity:.7;}
`;

// Wrapped form used by the head-extra filter at publish time.
export const EMBED_BASELINE_STYLE_TAG = `<style data-cms-embed-styles>${EMBED_BASELINE_CSS}</style>`;

// Side-effect helper: inserts the baseline CSS into the admin
// document head exactly once. Idempotent — re-imports of the module
// (e.g. across HMR cycles in dev) skip the second insertion thanks
// to the data-attribute marker.
export function ensureAdminEmbedStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-cms-embed-styles-admin]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-cms-embed-styles-admin", "true");
  style.textContent = EMBED_BASELINE_CSS;
  document.head.appendChild(style);
}
