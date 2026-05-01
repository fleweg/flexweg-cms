import { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  defaultDurationFor,
  subscribeToToasts,
  type Toast,
  type ToastLevel,
} from "../../lib/toast";

// Renders the live stack of flash messages emitted by lib/toast. Mounted
// once at the root of the authenticated shell; outside the routed tree so
// navigation never unmounts in-flight toasts.

const LEVEL_STYLES: Record<ToastLevel, string> = {
  info:
    "bg-blue-50 text-blue-900 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:ring-blue-700/50",
  success:
    "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:ring-emerald-700/50",
  warn:
    "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:ring-amber-700/50",
  error:
    "bg-red-50 text-red-900 ring-red-200 dark:bg-red-900/30 dark:text-red-100 dark:ring-red-700/50",
};

const LEVEL_ICON: Record<ToastLevel, typeof AlertCircle> = {
  info: Info,
  success: CheckCircle2,
  warn: AlertTriangle,
  error: AlertCircle,
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return subscribeToToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      // Schedule auto-dismiss. duration === 0 means sticky — the user
      // must close the toast manually with the X button.
      const lifetime = toast.durationMs ?? defaultDurationFor(toast.level);
      if (lifetime > 0) {
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, lifetime);
      }
    });
  }, []);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none"
      role="region"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = LEVEL_ICON[toast.level];
  return (
    <div
      className={cn(
        "rounded-lg shadow-pop ring-1 px-3 py-2.5 flex items-start gap-2.5 animate-scale-in pointer-events-auto",
        LEVEL_STYLES[toast.level],
      )}
      role={toast.level === "error" ? "alert" : "status"}
    >
      <Icon className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
      <p className="text-sm leading-snug flex-1 whitespace-pre-line break-words">
        {toast.message}
      </p>
      <button
        type="button"
        className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
