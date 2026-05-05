import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

// Generic confirmation modal — used by ThemesPage for the
// switch-theme confirmation today. Designed to be the standard
// affordance for any "are you sure?" interaction in the admin
// (delete confirmations, destructive actions, etc.).
//
// Cancel paths: backdrop click, Escape key, or the Cancel button.
// All three drive `onCancel`. Confirm path is the only one that
// calls `onConfirm`.
//
// Layout: backdrop with `bg-black/40`, centered card with
// `animate-fade-in` + `animate-scale-in` (shared keyframes from the
// admin Tailwind config).

interface ConfirmModalProps {
  // Heading line — kept to a short sentence (no period) by convention.
  title: string;
  // Longer body explaining what's about to happen. Plain string or
  // ReactNode for richer copy (links, code spans).
  description: ReactNode;
  // Label for the affirmative button.
  confirmLabel: string;
  // Label for the dismiss button. Defaults to a localised "Cancel"
  // — pass through if you've already resolved an i18n key.
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  // Visual variant of the confirm button. `"danger"` paints it red
  // for irreversible actions (delete). Defaults to `"primary"`.
  variant?: "primary" | "danger";
  // When true, both buttons are disabled and the confirm button
  // shows a spinner. The parent owns the busy lifecycle so the modal
  // can stay mounted while a long-running action progresses (or it
  // can unmount on confirm — caller's choice).
  busy?: boolean;
}

export function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "primary",
  busy,
}: ConfirmModalProps) {
  // Esc closes the modal — same affordance as the click-outside
  // handler below. Skipped while busy so a runaway keypress
  // mid-regen doesn't dismiss the progress UI.
  useEffect(() => {
    if (busy) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={(e) => {
        // Backdrop click cancels — but only when the click landed on
        // the backdrop itself, not bubbled from the inner card.
        if (busy) return;
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="card w-full max-w-md p-5 animate-scale-in">
        <h2 id="confirm-modal-title" className="text-base font-semibold mb-2">
          {title}
        </h2>
        <div className="text-sm text-surface-600 dark:text-surface-300 mb-5">
          {description}
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={variant === "danger" ? "btn-danger" : "btn-primary"}
            onClick={() => {
              if (!busy) void onConfirm();
            }}
            disabled={busy}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
