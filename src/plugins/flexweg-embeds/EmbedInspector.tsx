import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Editor } from "@tiptap/core";
import type { EmbedProvider } from "./providers";
import { embedNodeName } from "./nodes";

interface EmbedInspectorProps {
  editor: Editor;
  provider: EmbedProvider;
}

// Block-tab inspector for an embed node. Lets the user replace the
// URL after the block has been inserted (the NodeView itself shows
// the preview but no editing affordance once filled). Reads attrs
// from the editor on every render so external attribute updates —
// e.g. another inspector elsewhere — stay in sync.
export function EmbedInspector({ editor, provider }: EmbedInspectorProps) {
  const { t } = useTranslation("flexweg-embeds");
  const nodeName = embedNodeName(provider.providerId);
  const rawAttrs = editor.getAttributes(nodeName) as { url?: unknown; id?: unknown };
  // Coerce defensively — see EmbedNodeView for the same rationale.
  const attrs = {
    url: typeof rawAttrs.url === "string" ? rawAttrs.url : "",
    id: typeof rawAttrs.id === "string" ? rawAttrs.id : "",
  };
  const [draft, setDraft] = useState(attrs.url);
  const [error, setError] = useState<string | null>(null);

  // Sync the draft with the underlying node when the user clicks
  // between embeds: the inspector instance is reused across blocks
  // (provider differs, attrs differ) so we re-read on attrs change.
  useEffect(() => {
    setDraft(attrs.url);
    setError(null);
  }, [attrs.url, attrs.id]);

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) {
      editor.chain().focus().updateAttributes(nodeName, { url: "", id: "" }).run();
      setError(null);
      return;
    }
    const parsed = provider.parseUrl(trimmed);
    if (!parsed) {
      setError(t("inspector.invalidUrl"));
      return;
    }
    setError(null);
    editor.chain().focus().updateAttributes(nodeName, { url: trimmed, id: parsed }).run();
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="label" htmlFor="embed-url-input">
          {t("inspector.urlLabel")}
        </label>
        <input
          id="embed-url-input"
          type="url"
          className="input"
          placeholder={t(provider.hintKey)}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {!error && attrs.id && (
          <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
            <code>{attrs.id}</code>
          </p>
        )}
      </div>
    </div>
  );
}
