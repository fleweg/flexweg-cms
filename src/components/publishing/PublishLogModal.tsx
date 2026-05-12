import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Loader2, RefreshCw, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PublishLog } from "./PublishLog";
import type { PublishLogEntry } from "../../services/publisher";

// Centered modal that wraps PublishLog. Shared across:
//   - the global Regenerate menu in the Topbar
//   - the Themes page (theme-switch flow)
//   - the post / page editor (publish / unpublish flow)
//
// Portaled to <body> so `position: fixed` resolves against the
// viewport — without the portal, the modal would center against
// whatever ancestor has a `backdrop-filter` / `transform` /
// `will-change` rule (creates a new containing block per CSS spec).
//
// Behavior:
//   - Visible whenever `busy` OR `entries.length > 0`
//   - Backdrop click + Escape clear the log AFTER the run completes
//     (mid-regen they're inert so the user can't dismiss accidentally)
//   - Close button (X) appears once the run is done
//
// Owner of the entries/busy state is the caller — they pass `onClear`
// which we call when the user dismisses.
export interface PublishLogModalProps {
  entries: PublishLogEntry[];
  busy: boolean;
  onClear: () => void;
  // Optional override for the modal title. Defaults to the theme
  // regenerate i18n labels (Running… / Regenerate). Pass when the
  // modal surfaces a non-regenerate operation (e.g. "Publishing…").
  title?: string;
  runningTitle?: string;
}

export function PublishLogModal({
  entries,
  busy,
  onClear,
  title,
  runningTitle,
}: PublishLogModalProps) {
  const { t } = useTranslation();
  const visible = busy || entries.length > 0;

  // Esc clears the log once the run is done. Mid-regen we ignore the
  // key so an accidental keystroke can't hide live progress.
  useEffect(() => {
    if (!visible) return;
    if (busy) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClear();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, busy, onClear]);

  if (!visible) return null;

  const resolvedTitle = busy
    ? runningTitle ?? t("themes.regenerate.running")
    : title ?? t("themes.regenerate.button");

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-log-modal-title"
      onClick={(e) => {
        if (busy) return;
        if (e.target === e.currentTarget) onClear();
      }}
    >
      <div className="card w-full max-w-lg max-h-[80vh] flex flex-col animate-scale-in">
        <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3 dark:border-surface-700">
          <h2
            id="publish-log-modal-title"
            className="text-sm font-semibold flex items-center gap-2"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            ) : (
              <RefreshCw className="h-4 w-4 text-surface-500" />
            )}
            {resolvedTitle}
          </h2>
          {!busy && (
            <button
              type="button"
              className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800"
              onClick={onClear}
              aria-label={t("common.close")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="overflow-y-auto p-3">
          <PublishLog entries={entries} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
