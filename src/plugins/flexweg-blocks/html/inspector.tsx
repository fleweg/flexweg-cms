import { Suspense, lazy, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Maximize2, TriangleAlert, X } from "lucide-react";
import type { Editor } from "@tiptap/core";
import { HTML_NODE_NAME } from "./extension";

// Lazy-load the CodeMirror-backed editor so its bundle (~150 KB
// gzipped, including the html-lang module + the one-dark theme)
// only ships on demand. Most posts won't include an HTML block —
// keeping the editor out of the boot bundle saves first-load
// weight for everyone else.
//
// Imports from the shared admin component (also used by the
// flexweg-custom-code plugin's Settings page) so both features
// resolve to the same chunk in the production bundle.
const CodeEditor = lazy(() =>
  import("../../../components/ui/CodeEditor").then((m) => ({ default: m.CodeEditor })),
);

interface HtmlInspectorProps {
  editor: Editor;
}

// Inspector for the Custom HTML block — renders inside the right
// sidebar's Block tab. Houses a CodeMirror-powered code editor +
// a one-line security warning.
//
// Two view modes:
//   • Inline (default) — compact editor sized for the sidebar.
//   • Fullscreen modal — opened via the Expand button. Useful for
//     long HTML blobs where the sidebar's narrow column gets
//     uncomfortable.
//
// Both modes share the same `draft` state and commit logic, so
// edits made in one show up in the other once you switch back.
//
// State sync: a local React `draft` mirrors `node.attrs.code`; the
// commit happens on blur. One Tiptap transaction per edit session
// — keeps the undo stack readable rather than one entry per
// keystroke.
export function HtmlInspector({ editor }: HtmlInspectorProps) {
  const { t } = useTranslation("flexweg-blocks");
  const attrs = editor.getAttributes(HTML_NODE_NAME) as { code?: string };
  const code = typeof attrs.code === "string" ? attrs.code : "";
  const [draft, setDraft] = useState(code);
  const [expanded, setExpanded] = useState(false);

  // Sync the draft when external attr changes land (undo/redo, the
  // user picks a different HTML block). String compare prevents
  // looping on our own commits.
  useEffect(() => {
    setDraft((prev) => (prev === code ? prev : code));
  }, [code]);

  function commit() {
    if (draft === code) return;
    // No .focus() in the chain — would steal focus from the code
    // editor after every commit, dropping selections / caret
    // position. Same reasoning as the other block inspectors.
    editor
      .chain()
      .updateAttributes(HTML_NODE_NAME, { code: draft })
      .run();
  }

  return (
    <div className="space-y-2">
      <div>
        <div className="flex items-center justify-between gap-2">
          <label className="label mb-0">{t("blocks.html.codeLabel")}</label>
          <button
            type="button"
            className="btn-ghost text-xs gap-1.5 px-2 py-1"
            onClick={() => setExpanded(true)}
            title={t("blocks.html.expand")}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{t("blocks.html.expand")}</span>
          </button>
        </div>
        <div className="mt-1.5">
          <Suspense
            fallback={
              <div className="cms-html-block-codeeditor-fallback">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("blocks.html.loadingEditor")}</span>
              </div>
            }
          >
            <CodeEditor
              value={draft}
              onChange={setDraft}
              onBlur={commit}
              placeholder={t("blocks.html.placeholder")}
            />
          </Suspense>
        </div>
      </div>
      <div className="cms-html-block-warning">
        <TriangleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>{t("blocks.html.warning")}</span>
      </div>

      {expanded && (
        <FullscreenEditor
          draft={draft}
          onDraftChange={setDraft}
          onCommit={commit}
          onClose={() => {
            // Commit any pending changes before closing — onBlur
            // would do it implicitly when the editor unmounts but
            // explicit is safer in case the editor still had focus.
            commit();
            setExpanded(false);
          }}
          placeholder={t("blocks.html.placeholder")}
        />
      )}
    </div>
  );
}

interface FullscreenEditorProps {
  draft: string;
  onDraftChange: (next: string) => void;
  onCommit: () => void;
  onClose: () => void;
  placeholder?: string;
}

// Fullscreen modal hosting a second CodeEditor instance bound to
// the same draft as the inline one. Mounted via createPortal so
// the modal escapes the inspector's stacking / overflow context
// and covers the whole admin viewport.
//
// Esc closes; clicking the backdrop does NOT close, intentionally
// — the user is editing code, an accidental click outside the
// editor area shouldn't lose their session. Only the explicit
// close button (or Esc) dismisses.
function FullscreenEditor({
  draft,
  onDraftChange,
  onCommit,
  onClose,
  placeholder,
}: FullscreenEditorProps) {
  const { t } = useTranslation("flexweg-blocks");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-surface-950">
      <div className="flex items-center justify-between gap-3 border-b border-surface-200 px-4 py-2.5 dark:border-surface-700">
        <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
          {t("blocks.html.modalTitle")}
        </span>
        <button
          type="button"
          className="btn-ghost"
          onClick={onClose}
          aria-label={t("blocks.html.modalClose")}
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">{t("blocks.html.modalClose")}</span>
        </button>
      </div>
      <div className="cms-html-block-modal-body">
        <Suspense
          fallback={
            <div className="cms-html-block-codeeditor-fallback">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("blocks.html.loadingEditor")}</span>
            </div>
          }
        >
          <CodeEditor
            value={draft}
            onChange={onDraftChange}
            onBlur={onCommit}
            placeholder={placeholder}
            // Fills the modal body — overrides the inline editor's
            // default min/max-height auto-grow.
            height="100%"
            autoFocus
          />
        </Suspense>
      </div>
    </div>,
    document.body,
  );
}
