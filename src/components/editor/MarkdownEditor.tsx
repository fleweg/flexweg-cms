import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Editor } from "@tiptap/core";
import {
  Bold,
  Code,
  Italic,
  Link as LinkIcon,
  Plus,
  Strikethrough,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  listBlocks,
  type BlockCategory,
  type BlockInsertContext,
  type BlockManifest,
} from "../../core/blockRegistry";
import { BlockToolbar } from "./BlockToolbar";

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  onPickMedia?: () => Promise<{ url: string; alt?: string } | null>;
  placeholder?: string;
  // Notified once the editor instance is ready (and again with `null`
  // on unmount). Lets the host page expose the editor to siblings —
  // e.g. the EditorInspector that surfaces per-block options in its
  // Block tab.
  onEditorReady?: (editor: Editor | null) => void;
}

// Tiptap-based WYSIWYG that reads/writes Markdown via tiptap-markdown.
// The editor uses a Gutenberg-style chrome:
//   • BubbleMenu — formatting actions on a non-empty selection.
//   • FloatingMenu — "+" inserter shown on empty paragraphs. Clicking
//     it opens a popover listing every block from the registry.
// No fixed top toolbar: keystrokes and the bubble/floating menus cover
// every action.
//
// Block extensions contributed by plugins are pulled from the registry
// at mount time and concatenated with StarterKit. Toggling a plugin
// after the editor is mounted does NOT add/remove its extensions — the
// editor must be reopened. The block list inside the inserter, on the
// other hand, is read on every render so newly-registered blocks
// appear immediately.
export function MarkdownEditor({
  value,
  onChange,
  onPickMedia,
  placeholder,
  onEditorReady,
}: MarkdownEditorProps) {
  const { t, i18n: i18nInstance } = useTranslation();
  // Tracks the last value we emitted upward; lets us avoid re-applying
  // the editor's own output back into it (which would reset the cursor).
  const lastEmittedRef = useRef<string>(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showInserter, setShowInserter] = useState(false);

  // Snapshot the plugin block extensions ONCE for the lifetime of this
  // editor instance. useEditor's options aren't reactive — passing a
  // changing extensions array is ignored — so we only read the registry
  // on mount. Toggling plugins later requires re-creating the editor.
  const initialExtensions = useMemo(() => {
    const base = [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? t("posts.fields.content") }),
      // html: true lets atom blocks (e.g. flexweg-embeds' YouTube /
      // Twitter / Spotify nodes) round-trip through markdown as their
      // `<div data-cms-embed=…>` markers. The DOMPurify pass at
      // publish time strips anything dangerous before the marker is
      // replaced with the real iframe.
      Markdown.configure({ html: true, transformPastedText: true, breaks: false }),
    ];
    const pluginExtensions = listBlocks()
      .flatMap((b) => b.extensions ?? [])
      // Deduplicate by reference — a block manifest can list the same
      // extension multiple times (e.g. shared dependency) and Tiptap
      // throws on duplicates.
      .filter((ext, idx, arr) => arr.indexOf(ext) === idx);
    return [...base, ...pluginExtensions];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editor = useEditor({
    extensions: initialExtensions,
    content: value,
    editorProps: { attributes: { class: "prose-editor focus:outline-none min-h-[400px]" } },
    onUpdate: ({ editor }) => {
      const md = editor.storage.markdown.getMarkdown() as string;
      lastEmittedRef.current = md;
      onChange(md);
    },
  });

  // Sync external value changes (e.g. switching between posts) without
  // clobbering ongoing edits.
  useEffect(() => {
    if (!editor) return;
    if (value === lastEmittedRef.current) return;
    editor.commands.setContent(value, false);
    lastEmittedRef.current = value;
  }, [editor, value]);

  // Notify the host page about the editor instance for inspector
  // wiring. The cleanup form clears the reference when the editor is
  // destroyed so consumers don't keep a stale handle.
  useEffect(() => {
    if (!onEditorReady) return;
    onEditorReady(editor ?? null);
    return () => {
      onEditorReady(null);
    };
  }, [editor, onEditorReady]);

  // Block list for the inserter, read fresh on every render so
  // freshly-registered blocks (e.g. after toggling a plugin) show up
  // without a remount. Extensions still need a remount to take effect,
  // so picking a freshly-added plugin block before that may no-op.
  const blockGroups = useMemo(() => groupByCategory(listBlocks()), []);

  if (!editor) return null;

  function handleSetLink() {
    const previousUrl = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previousUrl ?? "");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  // Resolves a manifest's display label using its declared i18n
  // namespace. Plugin blocks live in their own namespace; core blocks
  // use the global one.
  function blockLabel(manifest: BlockManifest): string {
    return manifest.namespace
      ? i18nInstance.t(manifest.titleKey, { ns: manifest.namespace })
      : t(manifest.titleKey);
  }

  async function handlePickBlock(manifest: BlockManifest) {
    setShowInserter(false);
    const ctx: BlockInsertContext = { pickMedia: onPickMedia };
    await manifest.insert(editor!.chain(), ctx);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      {/* BubbleMenu surfaces inline formatting on selection. Skipped
          when the cursor is inside an image or code block where these
          marks don't apply. */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor, from, to }) => {
          if (from === to) return false;
          if (editor.isActive("image")) return false;
          if (editor.isActive("codeBlock")) return false;
          return true;
        }}
        className="flex items-center gap-0.5 rounded-lg border border-surface-200 bg-white p-1 shadow-lg dark:border-surface-700 dark:bg-surface-900"
      >
        <BubbleButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} icon={Bold} />
        <BubbleButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} icon={Italic} />
        <BubbleButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} icon={Strikethrough} />
        <Sep />
        <BubbleButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} icon={Code} />
        <BubbleButton onClick={handleSetLink} active={editor.isActive("link")} icon={LinkIcon} />
      </BubbleMenu>

      {/* FloatingMenu shows an "Add block" button on empty paragraphs
          (typical insertion point in Gutenberg). Clicking the + opens a
          picker populated from the block registry. */}
      <FloatingMenu
        editor={editor}
        shouldShow={({ editor, view, state }) => {
          if (!view.hasFocus()) return false;
          const { $from } = state.selection;
          const isEmptyTextBlock =
            $from.parent.isTextblock && $from.parent.content.size === 0;
          if (!isEmptyTextBlock) return false;
          // Only suggest insertion in plain paragraphs — inside a
          // heading/list/quote the user is probably still drafting that
          // block's content.
          return editor.isActive("paragraph");
        }}
        className="relative"
      >
        <button
          type="button"
          aria-label={t("posts.edit.blocks.addBlock")}
          onClick={() => setShowInserter((v) => !v)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-surface-300 bg-white text-surface-600 shadow-sm transition hover:border-surface-900 hover:text-surface-900 dark:border-surface-600 dark:bg-surface-900 dark:text-surface-300 dark:hover:border-surface-100 dark:hover:text-surface-50"
        >
          <Plus className="h-4 w-4" />
        </button>
        {showInserter && (
          <div className="absolute left-0 top-9 z-30 max-h-80 w-64 overflow-y-auto rounded-lg border border-surface-200 bg-white p-1 shadow-lg dark:border-surface-700 dark:bg-surface-900">
            {blockGroups.map(({ category, blocks }) => (
              <div key={category} className="py-1">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-wide font-semibold text-surface-400 dark:text-surface-500">
                  {t(`posts.edit.blocks.categories.${category}`, { defaultValue: category })}
                </p>
                {blocks.map((manifest) => {
                  // Image blocks need a media picker; if the host page
                  // didn't provide one, hide the entry rather than
                  // surface a dead button.
                  if (manifest.id === "core/image" && !onPickMedia) return null;
                  return (
                    <BlockOption
                      key={manifest.id}
                      icon={manifest.icon}
                      label={blockLabel(manifest)}
                      onClick={() => handlePickBlock(manifest)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </FloatingMenu>

      <EditorContent editor={editor} />

      {/* Mounted last so the absolute-positioned toolbar paints above
          EditorContent without forcing a stacking-context on it. The
          wrapperRef lets the toolbar anchor its `top` / `right`
          relative to this same div. */}
      <BlockToolbar editor={editor} containerRef={wrapperRef} />
    </div>
  );
}

function BubbleButton({
  onClick,
  active,
  icon: Icon,
}: {
  onClick: () => void;
  active: boolean;
  icon: typeof Bold;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-md transition-colors",
        active
          ? "bg-surface-900 text-white dark:bg-surface-100 dark:text-surface-900"
          : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function BlockOption({
  icon: Icon,
  label,
  onClick,
}: {
  icon: BlockManifest["icon"];
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-surface-700 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800 dark:hover:text-surface-50"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function Sep() {
  return <span className="mx-0.5 h-5 w-px bg-surface-200 dark:bg-surface-700" />;
}

const CATEGORY_ORDER: BlockCategory[] = ["text", "media", "layout", "embed", "advanced"];

function groupByCategory(
  blocks: BlockManifest[],
): { category: BlockCategory; blocks: BlockManifest[] }[] {
  const buckets = new Map<BlockCategory, BlockManifest[]>();
  for (const block of blocks) {
    const list = buckets.get(block.category) ?? [];
    list.push(block);
    buckets.set(block.category, list);
  }
  // Preserve registration order inside each bucket; sort buckets by
  // the canonical category order (unknown categories appended).
  const orderedKnown = CATEGORY_ORDER.filter((c) => buckets.has(c));
  const orderedRest = Array.from(buckets.keys()).filter(
    (c) => !CATEGORY_ORDER.includes(c),
  );
  return [...orderedKnown, ...orderedRest].map((category) => ({
    category,
    blocks: buckets.get(category) ?? [],
  }));
}
