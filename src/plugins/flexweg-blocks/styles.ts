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

/* Custom HTML block (editor placeholder + sandboxed iframe preview;
   actual editing happens in the inspector textarea — see below).
   Replaced by the raw user code at publish time, so none of these
   rules ever ship to the public site. */
.prose-editor .cms-html-block{position:relative;margin:24px 0;border:1px solid rgba(127,127,127,0.25);border-radius:6px;overflow:hidden;background:#fafafa;}
.prose-editor .cms-html-block.is-selected{outline:2px solid rgba(59,130,246,0.55);outline-offset:2px;}
.prose-editor .cms-html-block-header{display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(127,127,127,0.08);border-bottom:1px solid rgba(127,127,127,0.18);font-size:11px;letter-spacing:0.05em;text-transform:uppercase;color:rgba(60,60,60,0.85);}
.prose-editor .cms-html-block-header-icon{height:14px;width:14px;flex-shrink:0;}
.prose-editor .cms-html-block-header-label{font-weight:600;}
.prose-editor .cms-html-block-header-meta{margin-left:auto;font-variant-numeric:tabular-nums;opacity:0.7;text-transform:none;letter-spacing:0;}
.prose-editor .cms-html-block-preview-wrap{padding:0;background:#fff;}
.prose-editor .cms-html-block-preview{width:100%;min-height:160px;border:0;display:block;background:#fff;}
.prose-editor .cms-html-block-empty{padding:32px 16px;text-align:center;font-size:12px;color:rgba(127,127,127,0.85);}

/* Inspector-side CodeMirror editor — lives in the right sidebar
   (NOT inside .prose-editor), so we scope these rules globally.
   CodeMirror 6 ships its own structural styling; we just frame
   it with the admin's input border treatment so it visually
   matches surrounding form fields. */
.cms-html-block-codeeditor{border:1px solid rgba(127,127,127,0.25);border-radius:6px;overflow:hidden;}
.cms-html-block-codeeditor:focus-within{border-color:rgba(59,130,246,0.55);box-shadow:0 0 0 1px rgba(59,130,246,0.20);}
.cms-html-block-codeeditor .cm-editor{font-size:12.5px;}
.cms-html-block-codeeditor .cm-editor.cm-focused{outline:none;}
.cms-html-block-codeeditor-fallback{display:flex;align-items:center;gap:8px;padding:24px;border:1px solid rgba(127,127,127,0.25);border-radius:6px;font-size:12px;color:rgba(127,127,127,0.85);justify-content:center;}
.cms-html-block-warning{display:flex;align-items:flex-start;gap:6px;padding:8px 10px;font-size:11px;line-height:1.4;color:rgba(180,90,0,0.95);background:rgba(255,180,40,0.10);border:1px solid rgba(255,180,40,0.30);border-radius:6px;}

/* Dark mode — the prose-editor adapts via the .dark scope used
   elsewhere in the admin. */
.dark .prose-editor .cms-html-block{background:#1a1a1a;border-color:rgba(180,180,180,0.18);}
.dark .prose-editor .cms-html-block-header{background:rgba(255,255,255,0.04);border-bottom-color:rgba(180,180,180,0.14);color:rgba(220,220,220,0.85);}
.dark .prose-editor .cms-html-block-preview-wrap,.dark .prose-editor .cms-html-block-preview{background:#0d0d0d;}
.dark .cms-html-block-warning{color:rgba(255,200,100,0.95);background:rgba(255,180,40,0.08);border-color:rgba(255,180,40,0.25);}
`;

export function ensureAdminColumnsStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-cms-columns-styles-admin]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-cms-columns-styles-admin", "true");
  style.textContent = COLUMNS_BASELINE_CSS + ADMIN_EXTRAS_CSS;
  document.head.appendChild(style);
}
