import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { renderMarkdown } from "../../core/markdown";

interface ReadmeModalProps {
  // Plugin display name — shown in the modal header.
  title: string;
  // Raw Markdown content (the file imported via Vite's ?raw).
  markdown: string;
  onClose: () => void;
}

// Centered modal that renders a plugin's README. Markdown goes through
// the same renderMarkdown helper the publisher uses (marked + DOMPurify
// sanitization) so we never inject unsanitised HTML even when a future
// README ships hand-rolled tags.
//
// Esc closes — same affordance as PreviewModal — and the click on the
// backdrop closes too. Plain centered card layout (NOT full-screen)
// because the README is reading-oriented and a constrained column is
// more readable than a viewport-wide canvas.
export function ReadmeModal({ title, markdown, onClose }: ReadmeModalProps) {
  const { t } = useTranslation();
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-950/60 p-4"
      onClick={onClose}
    >
      <div
        className="card flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden"
        // Stop propagation so clicking inside the card doesn't trigger
        // the backdrop's close handler.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-surface-200 px-4 py-3 dark:border-surface-700">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-50">{title}</h2>
          <button
            type="button"
            className="btn-ghost"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          className="cms-readme-body prose-editor flex-1 overflow-y-auto px-6 py-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>,
    document.body,
  );
}
