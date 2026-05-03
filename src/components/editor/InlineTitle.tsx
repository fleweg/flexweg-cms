import { useEffect, useRef } from "react";

interface InlineTitleProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

// Auto-growing textarea styled as an h1. Mirrors Gutenberg's inline
// title field — borderless, large, multi-line capable. We use a
// textarea (not contentEditable) for accessibility, IME support, and
// straightforward controlled-state semantics.
export function InlineTitle({ value, onChange, placeholder }: InlineTitleProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Resize on every value change so the textarea grows with the title.
  // Setting height to 'auto' first lets scrollHeight shrink as well as
  // grow — without it, deleting characters wouldn't reduce the height.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full resize-none border-0 bg-transparent px-0 py-1 text-3xl md:text-4xl font-semibold leading-tight text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-0 dark:text-surface-50 dark:placeholder:text-surface-500"
      // Enter creates a body block, not a newline in the title — match
      // Gutenberg's UX. We just preventDefault here; focus jumping into
      // the editor is handled at the page level when needed.
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
}
