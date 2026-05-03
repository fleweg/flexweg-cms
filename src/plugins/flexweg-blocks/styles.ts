// Baseline CSS shared between the published page (injected via the
// page.head.extra hook only when at least one columns block appears
// on the page) and the admin editor (injected globally at module-load
// time so the editor preview matches the published layout).
//
// Themes can override these rules with their own `.cms-columns*`
// selectors but the defaults below give a clean responsive grid out
// of the box.

export const COLUMNS_BASELINE_CSS = `
.cms-columns{display:grid;gap:24px;margin:32px 0;}
.cms-columns-cols-1{grid-template-columns:1fr;}
.cms-columns-cols-2{grid-template-columns:repeat(2,1fr);}
.cms-columns-cols-3{grid-template-columns:repeat(3,1fr);}
.cms-columns-cols-4{grid-template-columns:repeat(4,1fr);}
.cms-column{min-width:0;}
.cms-column>*:first-child{margin-top:0;}
.cms-column>*:last-child{margin-bottom:0;}
@media (max-width:768px){.cms-columns{grid-template-columns:1fr;}}
`;

// Wrapped form used by the head-extra filter at publish time.
export const COLUMNS_BASELINE_STYLE_TAG = `<style data-cms-columns-styles>${COLUMNS_BASELINE_CSS}</style>`;

// Side-effect helper: inserts the baseline CSS into the admin
// document head exactly once. Idempotent — re-imports of the module
// (e.g. across HMR cycles in dev) skip the second insertion thanks
// to the data-attribute marker. Mirrors flexweg-embeds' admin style
// injection.
//
// Editor cells need this CSS so the in-editor layout (with 2-4
// columns, gap, mobile stacking) matches what the publish-time
// pipeline emits — no surprises between draft and live.
export function ensureAdminColumnsStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-cms-columns-styles-admin]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-cms-columns-styles-admin", "true");
  // Augment the editor styling slightly so empty columns are still
  // discoverable: thin dashed outline + min-height. Stripped from
  // the published version (see COLUMNS_BASELINE_CSS above).
  style.textContent =
    COLUMNS_BASELINE_CSS +
    `
.prose-editor .cms-column{outline:1px dashed rgba(127,127,127,0.25);outline-offset:-1px;padding:12px;min-height:48px;border-radius:4px;}
.prose-editor .cms-column:focus-within{outline-color:rgba(59,130,246,0.6);}
`;
  document.head.appendChild(style);
}
