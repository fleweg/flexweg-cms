import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Editor } from "@tiptap/core";
import { cn } from "../../lib/utils";
import { findActiveBlock, type BlockManifest } from "../../core/blockRegistry";

interface EditorInspectorProps {
  documentPanel: ReactNode;
  // Tiptap editor instance, lifted from MarkdownEditor by the host
  // page. Optional so the inspector can render its Document panel even
  // before the editor finishes mounting.
  editor?: Editor | null;
}

type Tab = "document" | "block";

// Right-side inspector with two tabs. Mirrors Gutenberg's Document /
// Block split — the Document tab holds post metadata (status,
// taxonomy, hero, SEO, …) and the Block tab surfaces per-block
// options resolved through the BlockRegistry.
//
// The Document tab content is dumb (passed in as a ReactNode); the
// Block tab is editor-aware and re-renders when the cursor selection
// changes.
export function EditorInspector({ documentPanel, editor }: EditorInspectorProps) {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<Tab>("document");
  const activeBlock = useActiveBlock(editor);

  // Auto-switch to the Block tab when the user activates a block that
  // has its own settings UI. Conversely, if the user clicks elsewhere
  // (no settings to show) we don't yank them away from a tab they
  // chose. This mirrors Gutenberg's behavior closely enough without
  // being intrusive.
  useEffect(() => {
    if (activeBlock?.inspector) setTab("block");
  }, [activeBlock]);

  return (
    <aside className="w-full lg:w-[320px] lg:shrink-0">
      <div className="card overflow-hidden">
        <div className="flex border-b border-surface-200 dark:border-surface-700">
          <TabButton
            active={tab === "document"}
            onClick={() => setTab("document")}
            label={t("posts.edit.inspector.document")}
          />
          <TabButton
            active={tab === "block"}
            onClick={() => setTab("block")}
            label={t("posts.edit.inspector.block")}
          />
        </div>
        <div className="p-4 space-y-4">
          {tab === "document" ? (
            documentPanel
          ) : (
            <BlockPanel editor={editor ?? null} block={activeBlock} t={t} i18n={i18n} />
          )}
        </div>
      </div>
    </aside>
  );
}

// Subscribes to the editor's selection-update event and recomputes the
// active block manifest. Returns undefined when no editor is mounted
// or no registered manifest matches the current selection.
function useActiveBlock(editor: Editor | null | undefined): BlockManifest | undefined {
  const [, force] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const onChange = () => force((v) => v + 1);
    editor.on("selectionUpdate", onChange);
    editor.on("transaction", onChange);
    return () => {
      editor.off("selectionUpdate", onChange);
      editor.off("transaction", onChange);
    };
  }, [editor]);
  if (!editor) return undefined;
  return findActiveBlock(editor);
}

interface BlockPanelProps {
  editor: Editor | null;
  block: BlockManifest | undefined;
  t: ReturnType<typeof useTranslation>["t"];
  i18n: ReturnType<typeof useTranslation>["i18n"];
}

function BlockPanel({ editor, block, t, i18n }: BlockPanelProps) {
  if (!editor || !block) {
    return (
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("posts.edit.blocks.noSelection")}
      </p>
    );
  }

  const Icon = block.icon;
  const label = block.namespace
    ? i18n.t(block.titleKey, { ns: block.namespace })
    : t(block.titleKey);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-surface-900 dark:text-surface-50">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      {block.inspector ? (
        <BlockInspectorRenderer editor={editor} block={block} />
      ) : (
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("posts.edit.blocks.noSettings")}
        </p>
      )}
    </div>
  );
}

// Reads the current attrs for the active block's underlying Tiptap
// node and renders the manifest's inspector component. The updater
// commits attribute changes back to the document via Tiptap's
// updateAttributes command.
function BlockInspectorRenderer({
  editor,
  block,
}: {
  editor: Editor;
  block: BlockManifest;
}) {
  const Inspector = block.inspector;
  if (!Inspector) return null;

  // Manifest-declared nodeName wins; otherwise infer from id. Core
  // blocks ship without a nodeName (mapped via "core/<x>" → "<x>"
  // sans dashes); plugin blocks whose id contains a slash MUST set
  // nodeName explicitly because slashes aren't valid in Tiptap node
  // names.
  const nodeName =
    block.nodeName ??
    (block.id.startsWith("core/")
      ? block.id.slice("core/".length).replace(/-/g, "")
      : block.id);
  const attrs = (editor.getAttributes(nodeName) ?? {}) as Record<string, unknown>;

  const updateAttrs = (next: Partial<Record<string, unknown>>) => {
    editor.chain().focus().updateAttributes(nodeName, next).run();
  };

  return <Inspector attrs={attrs} updateAttrs={updateAttrs} editor={editor} />;
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 px-3 py-2.5 text-xs font-medium transition-colors",
        active
          ? "border-b-2 border-surface-900 text-surface-900 dark:border-surface-100 dark:text-surface-50"
          : "text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50",
      )}
    >
      {label}
    </button>
  );
}

// Convenience grouping primitive used inside the Document panel. Keeps
// the visual cadence consistent (small label + spacing) without
// requiring callers to repeat the same Tailwind classes.
export function InspectorSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-[11px] uppercase tracking-wide font-semibold text-surface-500 dark:text-surface-400">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
