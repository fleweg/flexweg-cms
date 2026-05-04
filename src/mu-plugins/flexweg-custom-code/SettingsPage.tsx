import { Suspense, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Maximize2, TriangleAlert, X } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "../../lib/toast";
import type { PluginSettingsPageProps } from "../../plugins";

export interface CustomCodeConfig {
  head: string;
  bodyEnd: string;
}

export const DEFAULT_CUSTOM_CODE_CONFIG: CustomCodeConfig = {
  head: "",
  bodyEnd: "",
};

// Lazy-load the shared CodeMirror wrapper. Same chunk as the
// flexweg-blocks/html block — Vite resolves both lazy imports to
// a single shared chunk in production.
const CodeEditor = lazy(() =>
  import("../../components/ui/CodeEditor").then((m) => ({ default: m.CodeEditor })),
);

// Settings page for the Custom Code plugin. Two CodeMirror editors
// (Head + Body end) wired against `pluginConfigs["flexweg-custom-code"]`.
// Save is explicit — typing in the editors mutates a local draft;
// hitting Save commits the whole config in one Firestore write.
//
// Each zone has an Expand button that opens the editor in a
// fullscreen modal — same UX as the Custom HTML block's inspector.
export function CustomCodeSettingsPage({
  config,
  save,
}: PluginSettingsPageProps<CustomCodeConfig>) {
  const { t } = useTranslation("flexweg-custom-code");
  const [draft, setDraft] = useState<CustomCodeConfig>(config);
  const [saving, setSaving] = useState(false);
  // null when no zone is expanded; "head" | "bodyEnd" otherwise.
  const [expanded, setExpanded] = useState<"head" | "bodyEnd" | null>(null);

  // Re-hydrate the draft when the upstream config changes (other
  // admins editing simultaneously, first-load resolution after
  // CmsDataContext finishes its subscription). Comparing by JSON
  // is slightly wasteful but keeps the dependency simple — the
  // config object is small.
  useEffect(() => {
    setDraft(config);
  }, [config]);

  async function onSave() {
    setSaving(true);
    try {
      await save(draft);
      toast.success(t("saved"));
    } catch (err) {
      toast.error((err as Error).message || t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card p-4 space-y-3">
        <div>
          <h2 className="font-semibold">{t("title")}</h2>
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("description")}
          </p>
        </div>
        <div className="cms-html-block-warning">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{t("warning")}</span>
        </div>
      </section>

      <CodeZoneCard
        title={t("head.title")}
        help={t("head.help")}
        placeholder={t("head.placeholder")}
        value={draft.head}
        onChange={(v) => setDraft((d) => ({ ...d, head: v }))}
        onExpand={() => setExpanded("head")}
        loadingLabel={t("loadingEditor")}
        expandLabel={t("expand")}
      />

      <CodeZoneCard
        title={t("body.title")}
        help={t("body.help")}
        placeholder={t("body.placeholder")}
        value={draft.bodyEnd}
        onChange={(v) => setDraft((d) => ({ ...d, bodyEnd: v }))}
        onExpand={() => setExpanded("bodyEnd")}
        loadingLabel={t("loadingEditor")}
        expandLabel={t("expand")}
      />

      <section className="card p-4 space-y-3">
        <button
          type="button"
          className="btn-primary"
          onClick={onSave}
          disabled={saving}
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? t("saving") : t("save")}
        </button>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("republishHint")}
        </p>
      </section>

      {expanded && (
        <FullscreenZoneEditor
          value={expanded === "head" ? draft.head : draft.bodyEnd}
          onChange={(v) =>
            setDraft((d) => (expanded === "head" ? { ...d, head: v } : { ...d, bodyEnd: v }))
          }
          onClose={() => setExpanded(null)}
          title={
            expanded === "head" ? t("head.title") : t("body.title")
          }
          closeLabel={t("modalClose")}
          loadingLabel={t("loadingEditor")}
        />
      )}
    </div>
  );
}

interface CodeZoneCardProps {
  title: string;
  help: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onExpand: () => void;
  loadingLabel: string;
  expandLabel: string;
}

// Card for a single code zone. Encapsulates the label / help text /
// expand button + the inline CodeEditor. Kept as a separate
// component so the JSX of the parent page stays scannable.
function CodeZoneCard({
  title,
  help,
  placeholder,
  value,
  onChange,
  onExpand,
  loadingLabel,
  expandLabel,
}: CodeZoneCardProps) {
  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">{help}</p>
        </div>
        <button
          type="button"
          className="btn-ghost text-xs gap-1.5 px-2 py-1 shrink-0"
          onClick={onExpand}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>{expandLabel}</span>
        </button>
      </div>
      <Suspense
        fallback={
          <div className="cms-html-block-codeeditor-fallback">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{loadingLabel}</span>
          </div>
        }
      >
        <CodeEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          minHeight="200px"
          maxHeight="500px"
        />
      </Suspense>
    </section>
  );
}

interface FullscreenZoneEditorProps {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  title: string;
  closeLabel: string;
  loadingLabel: string;
}

// Full-screen modal mirroring the Custom HTML block's expand UX.
// Same Esc-to-close, no-backdrop-close behaviour. The editor here
// shares the parent draft state, so changes propagate back to the
// inline editor on close.
function FullscreenZoneEditor({
  value,
  onChange,
  onClose,
  title,
  closeLabel,
  loadingLabel,
}: FullscreenZoneEditorProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-surface-950">
      <div className="flex items-center justify-between gap-3 border-b border-surface-200 px-4 py-2.5 dark:border-surface-700">
        <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
          {title}
        </span>
        <button
          type="button"
          className="btn-ghost"
          onClick={onClose}
          aria-label={closeLabel}
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">{closeLabel}</span>
        </button>
      </div>
      <div className="cms-html-block-modal-body">
        <Suspense
          fallback={
            <div className="cms-html-block-codeeditor-fallback">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{loadingLabel}</span>
            </div>
          }
        >
          <CodeEditor
            value={value}
            onChange={onChange}
            height="100%"
            autoFocus
          />
        </Suspense>
      </div>
    </div>,
    document.body,
  );
}
