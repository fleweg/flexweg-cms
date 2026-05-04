import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useMemo } from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";

interface CodeEditorProps {
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  // Explicit height — when set, overrides the min/max auto-grow
  // behaviour. Used by full-screen modals that need the editor to
  // fill the available space rather than grow with content.
  height?: string;
  // Auto-focuses the editor on mount. Useful when the editor opens
  // inside a freshly-mounted modal so the user can start typing
  // without an extra click.
  autoFocus?: boolean;
  // Optional wrapper className for callers that need extra styling
  // (e.g. the full-screen modal that needs the wrapper to flex-1).
  className?: string;
}

// Shared CodeMirror 6 wrapper used across the admin — currently by
// the Custom HTML block (flexweg-blocks/html) and the Custom Code
// plugin (flexweg-custom-code). Lazy-loaded by both consumers via
// React.lazy so the bundle (~150 KB gzipped, html-lang module +
// one-dark theme included) only ships when the user actually opens
// a feature that needs it.
//
// Language: html() — auto-detects JS inside <script> and CSS
// inside <style>, so users get per-language highlighting without
// having to switch modes manually.
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
  className,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const extensions = useMemo(
    () => [html({ autoCloseTags: true, matchClosingTags: true }), EditorView.lineWrapping],
    [],
  );

  return (
    <div
      className={cn(
        // Generic visual frame matching the admin's input fields:
        // thin neutral border, rounded corners, focus ring on
        // focus-within. Tailwind keeps it self-styled — consumers
        // don't need to ship plugin CSS just for the wrapper.
        "cms-code-editor overflow-hidden rounded-md border border-surface-200 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 dark:border-surface-700 dark:focus-within:border-blue-400",
        className,
      )}
    >
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
