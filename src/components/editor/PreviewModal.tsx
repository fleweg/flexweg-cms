import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface PreviewModalProps {
  // The page resolves the preview HTML asynchronously (the publisher
  // pipeline awaits filters, plugins, the markdown renderer). We
  // accept a Promise so the modal can paint a loading state on the
  // very first frame.
  htmlPromise: Promise<string>;
  onClose: () => void;
}

interface ViewportPreset {
  id: "mobile" | "tablet" | "desktop";
  labelKey: string;
  width: number;
  Icon: typeof Monitor;
}

const VIEWPORTS: ViewportPreset[] = [
  { id: "mobile", labelKey: "posts.preview.viewports.mobile", width: 375, Icon: Smartphone },
  { id: "tablet", labelKey: "posts.preview.viewports.tablet", width: 820, Icon: Tablet },
  { id: "desktop", labelKey: "posts.preview.viewports.desktop", width: 1280, Icon: Monitor },
];

// Full-screen modal showing the post / page rendered with the same
// pipeline that produces the published HTML. Sandboxed via an
// iframe's srcDoc so the admin's CSS / scripts can't leak into the
// preview and vice-versa. Width-toggleable to validate responsive
// layouts (mobile / tablet / desktop) without resizing the browser.
//
// `desktop` is the default — matches what most users glance at first
// when reviewing copy / hero blocks. The two narrower presets center
// the iframe with surrounding gutter so the page always feels like
// a real device rather than a clamped window.
export function PreviewModal({ htmlPromise, onClose }: PreviewModalProps) {
  const { t } = useTranslation();
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewportId, setViewportId] = useState<ViewportPreset["id"]>("desktop");
  const promiseRef = useRef(htmlPromise);

  // Resolve / reject the supplied promise once, into local state. We
  // intentionally don't re-run if `htmlPromise` reference changes —
  // the parent gives us a single fresh promise per Open click.
  useEffect(() => {
    let cancelled = false;
    promiseRef.current
      .then((value) => {
        if (!cancelled) setHtml(value);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Esc closes — the dominant keyboard pattern for modal overlays.
  // Bound on `window` (not the modal) so the focus state inside the
  // iframe doesn't swallow it.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const viewport = VIEWPORTS.find((v) => v.id === viewportId) ?? VIEWPORTS[2];

  // Portal'd at document.body root so the modal escapes any parent
  // stacking context / overflow constraint imposed by the editor
  // page layout.
  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-surface-100 dark:bg-surface-950">
      <div className="flex items-center justify-between gap-3 border-b border-surface-200 bg-white px-4 py-2.5 dark:border-surface-700 dark:bg-surface-900">
        <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
          {t("posts.preview.title")}
        </span>
        <div className="flex items-center gap-1 rounded-lg bg-surface-100 p-0.5 dark:bg-surface-800">
          {VIEWPORTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setViewportId(v.id)}
              aria-label={t(v.labelKey)}
              title={`${t(v.labelKey)} — ${v.width}px`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                v.id === viewportId
                  ? "bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-surface-50"
                  : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-surface-50",
              )}
            >
              <v.Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t(v.labelKey)}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-ghost"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-surface-200/40 p-4 dark:bg-surface-950/60">
        <div className="mx-auto h-full" style={{ maxWidth: viewport.width }}>
          {error ? (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">
                {t("posts.preview.error", { error })}
              </p>
            </div>
          ) : !html ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-surface-500 dark:text-surface-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("posts.preview.rendering")}
            </div>
          ) : (
            <iframe
              key={viewportId}
              title={t("posts.preview.title")}
              srcDoc={html}
              // sandbox unset on purpose — widgets from plugin
              // bodyScripts (Twitter, etc.) need to run for a
              // faithful preview. Same trust model as the
              // published page.
              className="block h-full w-full border-0 bg-white shadow-2xl"
              style={{ minHeight: "calc(100vh - 60px)" }}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
