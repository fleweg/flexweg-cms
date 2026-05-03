import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import type { EmbedProvider } from "./providers";
import { loadScriptOnce } from "./scriptLoader";
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
//   • Filled — renders provider.renderEditorPreview (or renderHtml as
//     fallback) and, for providers that need a runtime script (kept
//     as an extension point for future Instagram / TikTok blocks),
//     lazy-loads the script then calls provider.attachEditor.
export function EmbedNodeView({ node, updateAttributes, selected, provider }: EmbedNodeViewProps) {
  const { t } = useTranslation("flexweg-embeds");
  // Coerce defensively — older posts (or attrs round-tripped through
  // an HTML pass that turned them into something unexpected) might
  // hand us anything but a string here. An empty string puts the
  // NodeView into its "paste a URL" empty state, which is recoverable;
  // throwing inside renderHtml is not.
  const id = typeof node.attrs.id === "string" ? node.attrs.id : "";
  const initialUrl = typeof node.attrs.url === "string" ? node.attrs.url : "";
  const [draftUrl, setDraftUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Wire the in-editor preview to the provider's optional runtime
  // script. Currently every shipped provider uses a self-contained
  // iframe (no editorScript) so this effect is a no-op for them; the
  // hook is preserved so future providers (Instagram embed.js, …)
  // can plug in without changes here.
  useEffect(() => {
    if (!id || !previewRef.current) return;
    if (!provider.editorScript) {
      provider.attachEditor?.(previewRef.current);
      return;
    }
    const target = previewRef.current;
    let cancelled = false;
    loadScriptOnce(provider.editorScript)
      .then(() => {
        if (cancelled) return;
        provider.attachEditor?.(target);
      })
      .catch(() => {
        // Script load failures fall back to the un-upgraded preview
        // (HTML supplied by renderHtml). Better than crashing.
      });
    return () => {
      cancelled = true;
    };
  }, [id, provider]);

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

  // Use the editor-specific preview when the provider supplies one,
  // otherwise fall back to renderHtml — same markup as the published
  // page, which thanks to the .cms-embed* CSS injected at module-load
  // time looks identical inside the editor.
  const previewHtml = id
    ? (provider.renderEditorPreview ?? provider.renderHtml)(id)
    : "";

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
          ref={previewRef}
          // Editor previews are pre-built HTML strings supplied by
          // each provider — treated as trusted because providers ship
          // inside the bundle and renderHtml escapes user input via
          // escapeAttr.
          //
          // The wrapper itself is unstyled (display: block, padding
          // 0) — the .cms-embed* class on the inner div carries the
          // sizing rules (aspect ratio for videos, fixed height for
          // tweets, etc.).
          className="cms-embed-preview overflow-hidden bg-surface-50 px-3 py-2 dark:bg-surface-950"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
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
