import { Suspense, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, TriangleAlert } from "lucide-react";
import type { Editor } from "@tiptap/core";
import { HTML_NODE_NAME } from "./extension";

// Lazy-load the CodeMirror-backed editor so its bundle (~150 KB
// gzipped, including the html-lang module + the one-dark theme)
// only ships on demand. Most posts won't include an HTML block —
// keeping the editor out of the boot bundle saves first-load
// weight for everyone else.
const CodeEditor = lazy(() =>
  import("./CodeEditor").then((m) => ({ default: m.CodeEditor })),
);

interface HtmlInspectorProps {
  editor: Editor;
}

// Inspector for the Custom HTML block — renders inside the right
// sidebar's Block tab. Houses a CodeMirror-powered code editor +
// a one-line security warning.
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
        <label className="label">{t("blocks.html.codeLabel")}</label>
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
      <div className="cms-html-block-warning">
        <TriangleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>{t("blocks.html.warning")}</span>
      </div>
    </div>
  );
}
