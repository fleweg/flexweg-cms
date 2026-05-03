import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import type { EmbedProvider } from "./providers";
import { cn } from "../../lib/utils";

interface EmbedNodeViewProps extends NodeViewProps {
  provider: EmbedProvider;
}

// React NodeView shown inside the editor for every embed atom. Two
// states:
//   • Empty (no parsed id) — surfaces a URL input so the user can
//     paste straight into the block, mirroring Gutenberg's empty-
//     embed UX. Once a valid URL is entered, attrs are written and
//     the view flips to the preview.
//   • Filled — renders the provider's renderEditorPreview HTML inside
//     a sandboxed iframe-style container so the editor visually
//     matches the published page.
export function EmbedNodeView({ node, updateAttributes, selected, provider }: EmbedNodeViewProps) {
  const { t } = useTranslation("flexweg-embeds");
  const id = (node.attrs.id as string) || "";
  const [draftUrl, setDraftUrl] = useState((node.attrs.url as string) || "");
  const [error, setError] = useState<string | null>(null);

  function commitUrl() {
    const trimmed = draftUrl.trim();
    if (!trimmed) {
      updateAttributes({ url: "", id: "" });
      setError(null);
      return;
    }
    const parsed = provider.parseUrl(trimmed);
    if (!parsed) {
      setError(t("inspector.invalidUrl"));
      return;
    }
    setError(null);
    updateAttributes({ url: trimmed, id: parsed });
  }

  return (
    <NodeViewWrapper
      className={cn(
        "cms-embed-node my-3 rounded-lg border border-surface-200 dark:border-surface-700",
        selected && "ring-2 ring-blue-500/60",
      )}
      // contentEditable=false keeps the cursor from landing inside the
      // preview — the block is an atom, the only writable surface is
      // the URL input below.
      contentEditable={false}
    >
      <div className="flex items-center justify-between border-b border-surface-200 px-3 py-1.5 text-xs text-surface-500 dark:border-surface-700 dark:text-surface-400">
        <span className="font-medium">{t(provider.titleKey)}</span>
        {id && <code className="text-[10px] opacity-70">{id}</code>}
      </div>
      {id ? (
        <div
          // Editor previews are pre-built HTML strings (iframes /
          // placeholders) supplied by each provider. Treated as trusted
          // because providers ship inside the bundle — never reflect
          // user URLs into raw HTML without escaping (handled in
          // providers.ts).
          className="cms-embed-preview aspect-video overflow-hidden bg-surface-50 dark:bg-surface-950 [&_iframe]:h-full [&_iframe]:w-full"
          dangerouslySetInnerHTML={{ __html: provider.renderEditorPreview(id) }}
        />
      ) : (
        <div className="space-y-2 p-3">
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {t("inspector.emptyHint")}
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              className="input flex-1"
              placeholder={t(provider.hintKey)}
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitUrl();
                }
              }}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={commitUrl}
              disabled={!draftUrl.trim()}
            >
              {t("inspector.urlLabel")}
            </button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}
    </NodeViewWrapper>
  );
}
