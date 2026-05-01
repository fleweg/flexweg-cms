import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  onPickMedia?: () => Promise<{ url: string; alt?: string } | null>;
  placeholder?: string;
}

// Tiptap-based WYSIWYG that reads/writes Markdown thanks to tiptap-markdown.
// We keep the editor itself agnostic about the storage format so the parent
// component just passes value/onChange in markdown — exactly what the post
// document holds.
export function MarkdownEditor({ value, onChange, onPickMedia, placeholder }: MarkdownEditorProps) {
  const { t } = useTranslation();
  // Tracks the last value we emitted upward; lets us avoid re-applying the
  // editor's own output back into it (which would reset the cursor).
  const lastEmittedRef = useRef<string>(value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? t("posts.fields.content") }),
      Markdown.configure({ html: false, transformPastedText: true, breaks: false }),
    ],
    content: value,
    editorProps: { attributes: { class: "prose-editor focus:outline-none min-h-[300px]" } },
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
    // setContent's second arg is a boolean: whether to emit an update event.
    // We pass false to avoid bouncing this hydration back into onUpdate.
    editor.commands.setContent(value, false);
    lastEmittedRef.current = value;
  }, [editor, value]);

  if (!editor) return null;

  async function handleInsertImage() {
    if (!onPickMedia) return;
    const picked = await onPickMedia();
    if (!picked) return;
    editor!.chain().focus().setImage({ src: picked.url, alt: picked.alt ?? "" }).run();
  }

  function handleSetLink() {
    const url = window.prompt("URL");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-surface-200 px-2 py-1.5 dark:border-surface-700">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} icon={Bold} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} icon={Italic} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} icon={Strikethrough} />
        <Sep />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} icon={Heading2} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} icon={Heading3} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} icon={List} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} icon={ListOrdered} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} icon={Quote} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} icon={Code} />
        <Sep />
        <ToolbarButton onClick={handleSetLink} active={editor.isActive("link")} icon={LinkIcon} />
        {onPickMedia && <ToolbarButton onClick={handleInsertImage} active={false} icon={ImageIcon} />}
      </div>
      <div className="px-3 py-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
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

function Sep() {
  return <span className="mx-1 h-5 w-px bg-surface-200 dark:bg-surface-700" />;
}
