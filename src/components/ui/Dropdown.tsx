import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Generic dropdown menu primitive — used by ThemesPage's Regenerate ▾
// today, intended for re-use anywhere the admin needs a "split a
// primary action into a list of variants" affordance (PostsListPage
// bulk actions, etc.).
//
// Closes on click-outside (pointerdown so the close fires before any
// `click` handler on the underlying element), Escape, or after an
// item is activated.

export interface DropdownItem {
  // Stable key used as React key + aria identifier. Distinct from
  // `label` because an item's label can change with i18n while the id
  // stays. Use "separator-<n>" for divider rows when needed.
  id: string;
  label: ReactNode;
  // Optional second-line copy. Rendered in a smaller muted style.
  description?: ReactNode;
  // Click handler. The dropdown closes BEFORE the handler fires, so
  // long-running async work doesn't keep the menu open visually.
  onSelect?: () => void | Promise<void>;
  // Disable the row (greyed out, no hover, click ignored).
  disabled?: boolean;
}

// Section header — renders a small uppercase label followed by its
// `items`. Multiple sections render with a light separator between.
export interface DropdownSection {
  id: string;
  label?: string;
  items: DropdownItem[];
}

interface DropdownProps {
  // The trigger button. Clicking it toggles the panel. Pass either a
  // simple label (renders inside a `btn-primary` with a chevron) or a
  // full ReactNode for custom triggers.
  triggerLabel: ReactNode;
  // Disables the trigger button entirely. Closing happens immediately
  // when this flips to true while the panel is open.
  disabled?: boolean;
  // Aligns the panel's right edge to the trigger's right edge — useful
  // when the trigger sits at the right of a toolbar so the panel
  // doesn't overflow off-screen. Defaults to true.
  alignEnd?: boolean;
  sections: DropdownSection[];
}

export function Dropdown({
  triggerLabel,
  disabled,
  alignEnd = true,
  sections,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Force-close when the trigger is disabled mid-open (e.g. the parent
  // started an async run and disabled all controls).
  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);

  function handleSelect(item: DropdownItem) {
    if (item.disabled) return;
    setOpen(false);
    if (item.onSelect) void item.onSelect();
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        className="btn-primary"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {triggerLabel}
        <ChevronDown
          className={"h-4 w-4 transition-transform " + (open ? "rotate-180" : "")}
        />
      </button>
      {open && (
        <div
          role="menu"
          className={
            "absolute z-50 mt-1 min-w-[260px] max-w-[360px] rounded-md border border-surface-200 bg-white shadow-pop dark:border-surface-700 dark:bg-surface-900 animate-scale-in origin-top-right " +
            (alignEnd ? "right-0" : "left-0")
          }
        >
          {sections.map((section, idx) => (
            <div key={section.id} className={idx > 0 ? "border-t border-surface-100 dark:border-surface-800" : ""}>
              {section.label && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(item)}
                  disabled={item.disabled}
                  className={
                    "block w-full text-left px-3 py-2 text-sm transition-colors " +
                    (item.disabled
                      ? "cursor-not-allowed text-surface-400 dark:text-surface-500"
                      : "hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-900 dark:text-surface-50")
                  }
                >
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
