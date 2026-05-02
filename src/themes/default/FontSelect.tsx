import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

// Custom dropdown for font pickers. Native <option> elements don't
// honor `style={{ fontFamily }}` reliably across browsers (Firefox /
// Safari ignore it), so we render our own list where each row is a
// proper styled element. Each option's text uses its own font face,
// giving the admin a true visual preview.
//
// Each option carries its own `fallback` (serif vs sans-serif) so a
// merged list of serif + sans fonts can render every entry against
// the right generic family while the Google Fonts fetch is in flight.

export interface FontOption {
  name: string;
  fallback: "serif" | "sans-serif";
}

interface FontSelectProps {
  value: string;
  onChange: (next: string) => void;
  options: FontOption[];
  ariaLabel?: string;
}

export function FontSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: FontSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click. `pointerdown` fires before `click` on the
  // underlying option so a tap on a row closes the dropdown via the
  // option's own handler instead of being swallowed by this listener.
  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  function familyStack(name: string, fallback: "serif" | "sans-serif"): string {
    return `"${name.replace(/"/g, '\\"')}", ${fallback}`;
  }

  // Look up the fallback for the currently-selected name so the
  // trigger button renders with the right generic family chain.
  const valueFallback =
    options.find((o) => o.name === value)?.fallback ?? "sans-serif";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="input flex items-center justify-between w-full gap-2 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        style={{ fontFamily: familyStack(value, valueFallback) }}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-surface-400" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 mt-1 z-20 card max-h-72 overflow-y-auto p-1 shadow-pop"
        >
          {options.map((opt) => {
            const selected = opt.name === value;
            return (
              <li key={opt.name}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt.name);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-base flex items-center justify-between gap-2 transition-colors",
                    selected
                      ? "bg-surface-900 text-white dark:bg-surface-100 dark:text-surface-900"
                      : "hover:bg-surface-100 dark:hover:bg-surface-800",
                  )}
                  style={{ fontFamily: familyStack(opt.name, opt.fallback) }}
                >
                  <span className="truncate">{opt.name}</span>
                  {selected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
