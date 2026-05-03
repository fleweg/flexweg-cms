// Baseline CSS shared between the published page (injected via the
// page.head.extra hook only when at least one columns block appears
// on the page) and the admin editor (injected globally at module-load
// time so the editor preview matches the published layout).
//
// Themes can override these rules with their own `.cms-columns*`
// selectors but the defaults below give a clean responsive grid out
// of the box.

// Custom widths flow through the --cms-columns-template variable.
// The variable indirection matters for the mobile media query at
// the bottom: the rule sets `grid-template-columns: 1fr` directly
// (a regular property), which always wins over an inline style that
// only sets the variable. Without this trick, an explicit inline
// `grid-template-columns: 80fr 20fr` would beat the media query and
// the mobile stack would never trigger.
export const COLUMNS_BASELINE_CSS = `
.cms-columns{display:grid;gap:24px;margin:32px 0;grid-template-columns:var(--cms-columns-template,1fr 1fr);}
.cms-columns-cols-1{--cms-columns-template:1fr;}
.cms-columns-cols-2{--cms-columns-template:repeat(2,1fr);}
.cms-columns-cols-3{--cms-columns-template:repeat(3,1fr);}
.cms-columns-cols-4{--cms-columns-template:repeat(4,1fr);}
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
// pipeline emits. Two extra rule blocks handle editor-only chrome:
//
//   1. Tiptap-React wrappers — ReactNodeViewRenderer inserts
//      `[data-node-view-content-react]` and `.react-renderer` divs
//      between `.cms-columns` and the actual column elements,
//      breaking the grid (the grid sees only one wrapper child).
//      `display: contents` flattens those wrappers so columns
//      become direct grid children.
//
//   2. Block header — a small label strip on top of every columns
//      block in the editor, giving the user a stable click target
//      to identify and select the whole block (same UX pattern as
//      the embed blocks). Stripped from the published version since
//      the relevant elements only exist in editor markup.
const ADMIN_EXTRAS_CSS = `
.prose-editor .cms-columns-block{position:relative;margin:24px 0;}
.prose-editor .cms-columns-block-header{display:flex;align-items:center;gap:6px;padding:6px 10px;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;color:rgba(127,127,127,0.85);background:rgba(127,127,127,0.08);border-radius:4px 4px 0 0;user-select:none;cursor:pointer;}
.prose-editor .cms-columns-block-header-icon{height:14px;width:14px;flex-shrink:0;}
.prose-editor .cms-columns-block-header-label{font-weight:600;}
.prose-editor .cms-columns-block-header-meta{margin-left:auto;font-variant-numeric:tabular-nums;opacity:0.7;}
.prose-editor .cms-columns-block.is-selected{outline:2px solid rgba(59,130,246,0.55);outline-offset:2px;border-radius:4px;}
.prose-editor .cms-columns-block.is-selected .cms-columns-block-header{color:rgba(59,130,246,0.95);background:rgba(59,130,246,0.10);}
.prose-editor .cms-column{outline:1px dashed rgba(127,127,127,0.25);outline-offset:-1px;padding:12px;min-height:48px;border-radius:4px;}
.prose-editor .cms-column:focus-within{outline-color:rgba(59,130,246,0.6);}
.prose-editor .cms-columns>[data-node-view-content-react],
.prose-editor .cms-columns>[data-node-view-content-react]>.react-renderer{display:contents;}
`;

export function ensureAdminColumnsStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-cms-columns-styles-admin]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-cms-columns-styles-admin", "true");
  style.textContent = COLUMNS_BASELINE_CSS + ADMIN_EXTRAS_CSS;
  document.head.appendChild(style);
}
