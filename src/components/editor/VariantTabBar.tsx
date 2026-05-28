import type { EditorVariant } from "../../core/editorVariantRegistry";
import { cn } from "../../lib/utils";

// Tab strip rendered above the editor body when a plugin registers an
// `EditorVariantProvider` that returns more than one variant. Switching
// tabs swaps the entire editor state (title, slug, content, excerpt,
// SEO) for the selected variant — the host preserves the same Tiptap
// instance so WYSIWYG + blocks + drag-and-drop work identically across
// variants.
//
// Visually mirrors the Gutenberg secondary toolbar: a thin row of
// pill-style buttons with a subtle background, sticky to the top edge
// of the editor pane. The active tab gets a darker emphasis; filled
// non-active variants show a small dot, empty variants stay muted.

interface VariantTabBarProps {
  variants: EditorVariant[];
  activeId: string;
  onSelect: (id: string) => void;
  // Optional per-variant "filled" state — derived by the host from the
  // current draft cache. When undefined the tab is rendered with the
  // default muted style.
  isFilled?: (variant: EditorVariant) => boolean;
}

export function VariantTabBar({ variants, activeId, onSelect, isFilled }: VariantTabBarProps) {
  if (variants.length <= 1) return null;
  return (
    <div className="sticky top-12 z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-2 bg-surface-50/95 dark:bg-surface-900/95 backdrop-blur border-b border-surface-200 dark:border-surface-800">
      <div className="flex flex-wrap items-center gap-1">
        {variants.map((variant) => {
          const active = variant.id === activeId;
          const filled = isFilled?.(variant) ?? false;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                active
                  ? "bg-surface-900 text-surface-50 dark:bg-surface-100 dark:text-surface-900"
                  : "text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800",
              )}
              aria-pressed={active}
            >
              <span className="uppercase tracking-wide">{variant.label}</span>
              {variant.badge && (
                <span
                  className={cn(
                    "ml-1 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    active
                      ? "bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-50"
                      : "bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-200",
                  )}
                >
                  {variant.badge}
                </span>
              )}
              {!variant.badge && !variant.primary && (
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    filled
                      ? active
                        ? "bg-surface-100 dark:bg-surface-800"
                        : "bg-emerald-500"
                      : "bg-surface-300 dark:bg-surface-600",
                  )}
                  aria-hidden
                />
              )}
              {variant.primary && (
                <span className="text-[10px] opacity-60" aria-label="primary">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
