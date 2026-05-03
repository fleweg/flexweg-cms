import {
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Type,
} from "lucide-react";
import { registerCoreBlock } from "./blockRegistry";

// Built-in CMS blocks — the always-available set, registered once at
// app boot. They wrap Tiptap commands already provided by StarterKit
// and the Image extension; no custom Tiptap nodes are required here.
//
// Plugin authors who want to add a block should call
// pluginApi.registerBlock(...) from their manifest.register() hook
// rather than touching this file. Core blocks live alongside plugin
// blocks in the same registry but are immune to resetBlocks().

registerCoreBlock({
  id: "core/paragraph",
  titleKey: "posts.edit.blocks.paragraph",
  icon: Type,
  category: "text",
  insert: (chain) => {
    chain.focus().setParagraph().run();
  },
  isActive: (editor) =>
    editor.isActive("paragraph") &&
    !editor.isActive("blockquote") &&
    !editor.isActive("listItem"),
});

registerCoreBlock({
  id: "core/heading-2",
  titleKey: "posts.edit.blocks.heading2",
  icon: Heading2,
  category: "text",
  insert: (chain) => {
    chain.focus().toggleHeading({ level: 2 }).run();
  },
  isActive: (editor) => editor.isActive("heading", { level: 2 }),
});

registerCoreBlock({
  id: "core/heading-3",
  titleKey: "posts.edit.blocks.heading3",
  icon: Heading3,
  category: "text",
  insert: (chain) => {
    chain.focus().toggleHeading({ level: 3 }).run();
  },
  isActive: (editor) => editor.isActive("heading", { level: 3 }),
});

registerCoreBlock({
  id: "core/bullet-list",
  titleKey: "posts.edit.blocks.bulletList",
  icon: List,
  category: "text",
  insert: (chain) => {
    chain.focus().toggleBulletList().run();
  },
  isActive: (editor) => editor.isActive("bulletList"),
});

registerCoreBlock({
  id: "core/ordered-list",
  titleKey: "posts.edit.blocks.orderedList",
  icon: ListOrdered,
  category: "text",
  insert: (chain) => {
    chain.focus().toggleOrderedList().run();
  },
  isActive: (editor) => editor.isActive("orderedList"),
});

registerCoreBlock({
  id: "core/blockquote",
  titleKey: "posts.edit.blocks.blockquote",
  icon: Quote,
  category: "text",
  insert: (chain) => {
    chain.focus().toggleBlockquote().run();
  },
  isActive: (editor) => editor.isActive("blockquote"),
});

registerCoreBlock({
  id: "core/code-block",
  titleKey: "posts.edit.blocks.codeBlock",
  icon: Code,
  category: "text",
  insert: (chain) => {
    chain.focus().toggleCodeBlock().run();
  },
  isActive: (editor) => editor.isActive("codeBlock"),
});

registerCoreBlock({
  id: "core/horizontal-rule",
  titleKey: "posts.edit.blocks.horizontalRule",
  icon: Minus,
  category: "layout",
  insert: (chain) => {
    chain.focus().setHorizontalRule().run();
  },
  // Horizontal rule is never selected (it has no content), so isActive
  // is omitted — selecting an HR resolves to no active block.
});

registerCoreBlock({
  id: "core/image",
  titleKey: "posts.edit.blocks.image",
  icon: ImageIcon,
  category: "media",
  insert: async (chain, ctx) => {
    if (!ctx.pickMedia) return;
    const picked = await ctx.pickMedia();
    if (!picked) return;
    chain
      .focus()
      .setImage({ src: picked.url, alt: picked.alt ?? "" })
      .run();
  },
  isActive: (editor) => editor.isActive("image"),
});
