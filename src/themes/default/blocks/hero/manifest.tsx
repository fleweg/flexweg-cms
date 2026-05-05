import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import type { Post } from "../../../../core/types";
import { postSortMillis } from "../../../../core/postSort";
import { useAllPosts } from "../../../../hooks/useAllPosts";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { HeroAttrs } from "./render";

const SUB_ID = "hero";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: HeroAttrs = {
  featuredPostId: "latest",
  variant: "image-overlay",
  showCategory: true,
  showAuthor: true,
};

interface HeroNodeViewProps {
  attrs: HeroAttrs;
  selected: boolean;
}

// Editor-side preview. Static placeholder card — picking a live
// preview would require duplicating the publish-time render logic
// inside React, which is heavy for a v1. Inspector covers attribute
// editing.
function HeroNodeView({ attrs, selected }: HeroNodeViewProps) {
  const { t } = useTranslation("theme-default");
  // Editor preview: load the posts list once via the cache-backed
  // helper. It's just to display the featured post's title — no
  // need for a live subscription.
  const { posts } = useAllPosts("post");
  const featured = attrs.featuredPostId === "latest" || !attrs.featuredPostId
    ? t("blocks.hero.latestLabel")
    : posts.find((p: Post) => p.id === attrs.featuredPostId)?.title ?? t("blocks.hero.unknownPost");

  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Star className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.hero.title")}
          </p>
          <p className="mt-1 truncate text-sm text-surface-900 dark:text-surface-50">
            {featured}
          </p>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            {t(`blocks.hero.variants.${attrs.variant ?? "image-overlay"}`)}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

interface HeroInspectorProps {
  editor: Editor;
}

function HeroInspector({ editor }: HeroInspectorProps) {
  const { t } = useTranslation("theme-default");
  const { posts } = useAllPosts("post");
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: HeroAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<HeroAttrs>) {
    // No .focus() in the chain — focusing the editor here steals
    // DOM focus from the inspector input the user is typing into,
    // dropping every keystroke after the first. Tiptap preserves
    // its selection state across DOM blur events, so the chain
    // still targets the right node without an explicit re-focus.
    editor
      .chain()
      .updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } })
      .run();
  }

  // Online posts only — featuring a draft would 404 on the public
  // site once published. Sorted newest-first to match what the
  // "latest" sentinel resolves to so users immediately see it at the
  // top of the dropdown.
  const onlinePosts: Post[] = posts
    .filter((p: Post) => p.status === "online")
    .sort((a: Post, b: Post) => postSortMillis(b) - postSortMillis(a));

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.hero.featured")}</label>
        <select
          className="input"
          value={attrs.featuredPostId ?? "latest"}
          onChange={(e) => patch({ featuredPostId: e.target.value })}
        >
          <option value="latest">{t("blocks.hero.latestLabel")}</option>
          {onlinePosts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title || "(untitled)"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">{t("blocks.hero.variant")}</label>
        <select
          className="input"
          value={attrs.variant ?? "image-overlay"}
          onChange={(e) => patch({ variant: e.target.value as HeroAttrs["variant"] })}
        >
          <option value="image-overlay">{t("blocks.hero.variants.image-overlay")}</option>
          <option value="split-left">{t("blocks.hero.variants.split-left")}</option>
          <option value="split-right">{t("blocks.hero.variants.split-right")}</option>
          <option value="minimal">{t("blocks.hero.variants.minimal")}</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.showCategory ?? true}
          onChange={(e) => patch({ showCategory: e.target.checked })}
        />
        <span>{t("blocks.hero.showCategory")}</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.showAuthor ?? true}
          onChange={(e) => patch({ showAuthor: e.target.checked })}
        />
        <span>{t("blocks.hero.showAuthor")}</span>
      </label>
    </div>
  );
}

const heroNode = createBlockNode<HeroAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: HeroNodeView,
});

export const heroBlock: BlockManifest<HeroAttrs> = {
  id: `default/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.hero.title",
  namespace: "theme-default",
  icon: Star,
  category: "layout",
  extensions: [heroNode],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <HeroInspector editor={props.editor} />,
};
