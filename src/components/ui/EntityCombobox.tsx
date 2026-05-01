import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

// Reusable lightweight combobox for picking one entity from a finite list.
// Used by MenusPage to select the post / page a menu item points to —
// preferable to a vanilla <select> when the list grows past a handful of
// entries (typing-to-filter beats scrolling through 100+ options).
//
// Deliberately framework-free (no Radix / Headless UI dependency) to keep
// the bundle small and the visual style identical to the rest of the
// admin (uses the existing `.input` and `.card` classes).

export interface ComboboxOption {
  id: string;
  // Primary label shown in the dropdown row and as the selected value.
  label: string;
  // Optional secondary text rendered in muted color (e.g. slug or path).
  subtitle?: string;
}

interface EntityComboboxProps {
  options: ComboboxOption[];
  value: string | null | undefined;
  onSelect: (id: string | null) => void;
  placeholder?: string;
  // Shown above the dropdown if no option matches the query.
  emptyLabel?: string;
  className?: string;
}

export function EntityCombobox({
  options,
  value,
  onSelect,
  placeholder = "Search…",
  emptyLabel = "No match",
  className,
}: EntityComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close the dropdown when the user clicks/taps anywhere outside the
  // component. Captured at the document level so it works even when the
  // click lands on another input or button.
  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  const selected = useMemo(
    () => options.find((o) => o.id === value) ?? null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 20);
    return options
      .filter((o) => {
        const haystack = `${o.label} ${o.subtitle ?? ""}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 20);
  }, [options, query]);

  function pick(id: string) {
    onSelect(id);
    setQuery("");
    setOpen(false);
  }

  function clear() {
    onSelect(null);
    setQuery("");
    inputRef.current?.focus();
  }

  // Display text in the input: when nothing is selected, the input is
  // free for typing. When something is selected and the input isn't
  // focused, we show the selected label as a chip-like value. While
  // editing (open + query non-empty), we show the typed query.
  const displayValue = open ? query : selected?.label ?? query;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          className="input pl-8 pr-8"
          placeholder={placeholder}
          value={displayValue}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        {selected && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
            onClick={clear}
            aria-label="Clear selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 z-20 card max-h-60 overflow-y-auto p-1 shadow-pop">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-xs text-surface-500 dark:text-surface-400">
              {emptyLabel}
            </p>
          ) : (
            <ul className="space-y-0.5">
              {filtered.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors",
                      opt.id === value
                        ? "bg-surface-900 text-white dark:bg-surface-100 dark:text-surface-900"
                        : "hover:bg-surface-100 dark:hover:bg-surface-800",
                    )}
                    onClick={() => pick(opt.id)}
                  >
                    <div className="font-medium truncate">{opt.label}</div>
                    {opt.subtitle && (
                      <div
                        className={cn(
                          "text-[11px] truncate",
                          opt.id === value
                            ? "text-surface-300"
                            : "text-surface-500 dark:text-surface-400",
                        )}
                      >
                        {opt.subtitle}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
