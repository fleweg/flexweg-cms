import { Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import type { Post } from "../../../../core/types";
import { postSortMillis } from "../../../../core/postSort";
import { useAllPosts } from "../../../../hooks/useAllPosts";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { MagazineHeroAttrs } from "./render";

const SUB_ID = "hero-split";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: MagazineHeroAttrs = {
  featuredPostId: "latest",
  secondary1PostId: "auto",
  secondary2PostId: "auto",
  showCategory: true,
  showAuthor: true,
  showFeaturedBadge: true,
};

interface NodeViewProps {
  attrs: MagazineHeroAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-magazine");
  const { posts } = useAllPosts("post");

  function label(id: string | undefined, autoKey: string): string {
    if (!id || id === "latest" || id === "auto") return t(autoKey);
    return posts.find((p: Post) => p.id === id)?.title ?? t("blocks.unknownPost");
  }

  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Newspaper className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.magazineHero.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            <span className="font-medium">1.</span> {label(attrs.featuredPostId, "blocks.magazineHero.latestLabel")}
          </p>
          <p className="text-xs text-surface-700 dark:text-surface-200 truncate">
            <span className="font-medium">2.</span> {label(attrs.secondary1PostId, "blocks.magazineHero.autoLabel")}
          </p>
          <p className="text-xs text-surface-700 dark:text-surface-200 truncate">
            <span className="font-medium">3.</span> {label(attrs.secondary2PostId, "blocks.magazineHero.autoLabel")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

interface InspectorProps {
  editor: Editor;
}

function Inspector({ editor }: InspectorProps) {
  const { t } = useTranslation("theme-magazine");
  const { posts } = useAllPosts("post");
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: MagazineHeroAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<MagazineHeroAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  const onlinePosts: Post[] = posts
    .filter((p: Post) => p.status === "online")
    .sort((a: Post, b: Post) => postSortMillis(b) - postSortMillis(a));

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.magazineHero.featured")}</label>
        <select
          className="input"
          value={attrs.featuredPostId ?? "latest"}
          onChange={(e) => patch({ featuredPostId: e.target.value })}
        >
          <option value="latest">{t("blocks.magazineHero.latestLabel")}</option>
          {onlinePosts.map((p) => (
            <option key={p.id} value={p.id}>{p.title || "(untitled)"}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">{t("blocks.magazineHero.secondary1")}</label>
        <select
          className="input"
          value={attrs.secondary1PostId ?? "auto"}
          onChange={(e) => patch({ secondary1PostId: e.target.value })}
        >
          <option value="auto">{t("blocks.magazineHero.autoLabel")}</option>
          {onlinePosts.map((p) => (
            <option key={p.id} value={p.id}>{p.title || "(untitled)"}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">{t("blocks.magazineHero.secondary2")}</label>
        <select
          className="input"
          value={attrs.secondary2PostId ?? "auto"}
          onChange={(e) => patch({ secondary2PostId: e.target.value })}
        >
          <option value="auto">{t("blocks.magazineHero.autoLabel")}</option>
          {onlinePosts.map((p) => (
            <option key={p.id} value={p.id}>{p.title || "(untitled)"}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.showCategory ?? true}
          onChange={(e) => patch({ showCategory: e.target.checked })}
        />
        <span>{t("blocks.magazineHero.showCategory")}</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.showAuthor ?? true}
          onChange={(e) => patch({ showAuthor: e.target.checked })}
        />
        <span>{t("blocks.magazineHero.showAuthor")}</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.showFeaturedBadge ?? true}
          onChange={(e) => patch({ showFeaturedBadge: e.target.checked })}
        />
        <span>{t("blocks.magazineHero.showFeaturedBadge")}</span>
      </label>
    </div>
  );
}

const node = createBlockNode<MagazineHeroAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const magazineHeroBlock: BlockManifest<MagazineHeroAttrs> = {
  id: `magazine/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.magazineHero.title",
  namespace: "theme-magazine",
  icon: Newspaper,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
