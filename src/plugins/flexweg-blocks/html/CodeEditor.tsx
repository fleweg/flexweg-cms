import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useMemo } from "react";
import { useTheme } from "../../../context/ThemeContext";

interface CodeEditorProps {
  value: string;
  onChange: (next: string) => void;
  onBlur: () => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  // Explicit height — when set, overrides the min/max auto-grow
  // behaviour. Used by the fullscreen modal which needs the
  // editor to fill the available space rather than grow with
  // content.
  height?: string;
  // Auto-focuses the editor on mount. Useful when the editor opens
  // inside a freshly-mounted modal so the user can start typing
  // without an extra click.
  autoFocus?: boolean;
}

// Small wrapper around CodeMirror 6 specialised for our HTML
// block's inspector. Lazy-loaded by the inspector via React.lazy
// so the CodeMirror bundle (~150 KB gzipped) only ships when the
// user actually opens an HTML block.
//
// Language: html() — auto-detects JS inside <script> and CSS
// inside <style>, so the user gets per-language highlighting
// without us having to switch modes manually.
//
// Theme: follows the admin's dark/light preference. CodeMirror's
// default light styling already harmonises with the surrounding
// admin chrome; the dark mode swaps in @codemirror/theme-one-dark
// for legibility on dark backgrounds.
//
// Extensions:
//   • EditorView.lineWrapping — soft-wraps long lines so the user
//     doesn't have to scroll horizontally for inline HTML.
export function CodeEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  minHeight = "240px",
  maxHeight = "600px",
  height,
  autoFocus,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const extensions = useMemo(
    () => [html({ autoCloseTags: true, matchClosingTags: true }), EditorView.lineWrapping],
    [],
  );

  return (
    <div className="cms-html-block-codeeditor">
      <CodeMirror
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        extensions={extensions}
        theme={theme === "dark" ? oneDark : undefined}
        placeholder={placeholder}
        // When `height` is set, prefer it over min/max so the
        // editor fills its parent (modal use case). Otherwise fall
        // back to the auto-growing min/max bounds.
        height={height}
        minHeight={height ? undefined : minHeight}
        maxHeight={height ? undefined : maxHeight}
        autoFocus={autoFocus}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          tabSize: 2,
        }}
      />
    </div>
  );
}
