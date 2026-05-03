import { ListOrdered } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { useCmsData } from "../../../../context/CmsDataContext";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { PostsListAttrs } from "./render";

const SUB_ID = "posts-list";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: PostsListAttrs = {
  query: "latest",
  count: 6,
  variant: "cards",
  columns: 2,
  excludeUsed: true,
};

interface PostsListNodeViewProps {
  attrs: PostsListAttrs;
  selected: boolean;
}

function PostsListNodeView({ attrs, selected }: PostsListNodeViewProps) {
  const { t } = useTranslation("theme-default");
  const summary = [
    t(`blocks.postsList.queries.${attrs.query ?? "latest"}`),
    `${attrs.count ?? 6}`,
    t(`blocks.postsList.variants.${attrs.variant ?? "cards"}`),
  ].join(" · ");

  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <ListOrdered className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.postsList.title")}
            {attrs.title ? ` — ${attrs.title}` : ""}
          </p>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{summary}</p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

interface PostsListInspectorProps {
  editor: Editor;
}

function PostsListInspector({ editor }: PostsListInspectorProps) {
  const { t } = useTranslation("theme-default");
  const { tags, users } = useCmsData();
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: PostsListAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<PostsListAttrs>) {
    editor
      .chain()
      .focus()
      .updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } })
      .run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.postsList.titleField")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder={t("blocks.postsList.titlePlaceholder")}
        />
      </div>
      <div>
        <label className="label">{t("blocks.postsList.query")}</label>
        <select
          className="input"
          value={attrs.query ?? "latest"}
          onChange={(e) => patch({ query: e.target.value as PostsListAttrs["query"] })}
        >
          <option value="latest">{t("blocks.postsList.queries.latest")}</option>
          <option value="by-tag">{t("blocks.postsList.queries.by-tag")}</option>
          <option value="by-author">{t("blocks.postsList.queries.by-author")}</option>
        </select>
      </div>
      {attrs.query === "by-tag" && (
        <div>
          <label className="label">{t("blocks.postsList.tag")}</label>
          <select
            className="input"
            value={attrs.tagId ?? ""}
            onChange={(e) => patch({ tagId: e.target.value || undefined })}
          >
            <option value="">—</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {attrs.query === "by-author" && (
        <div>
          <label className="label">{t("blocks.postsList.author")}</label>
          <select
            className="input"
            value={attrs.authorId ?? ""}
            onChange={(e) => patch({ authorId: e.target.value || undefined })}
          >
            <option value="">—</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {[u.firstName, u.lastName].filter(Boolean).join(" ") || u.displayName || u.email}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t("blocks.postsList.count")}</label>
          <input
            type="number"
            min={1}
            max={24}
            className="input"
            value={attrs.count ?? 6}
            onChange={(e) => patch({ count: Number.parseInt(e.target.value, 10) || 1 })}
          />
        </div>
        <div>
          <label className="label">{t("blocks.postsList.columns")}</label>
          <input
            type="number"
            min={1}
            max={4}
            className="input"
            value={attrs.columns ?? 2}
            onChange={(e) => patch({ columns: Number.parseInt(e.target.value, 10) || 1 })}
          />
        </div>
      </div>
      <div>
        <label className="label">{t("blocks.postsList.variant")}</label>
        <select
          className="input"
          value={attrs.variant ?? "cards"}
          onChange={(e) => patch({ variant: e.target.value as PostsListAttrs["variant"] })}
        >
          <option value="cards">{t("blocks.postsList.variants.cards")}</option>
          <option value="list">{t("blocks.postsList.variants.list")}</option>
          <option value="compact">{t("blocks.postsList.variants.compact")}</option>
          <option value="numbered">{t("blocks.postsList.variants.numbered")}</option>
          <option value="slider">{t("blocks.postsList.variants.slider")}</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t("blocks.postsList.seeMoreLabel")}</label>
          <input
            type="text"
            className="input"
            value={attrs.seeMoreLabel ?? ""}
            onChange={(e) => patch({ seeMoreLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("blocks.postsList.seeMoreUrl")}</label>
          <input
            type="text"
            className="input"
            value={attrs.seeMoreUrl ?? ""}
            onChange={(e) => patch({ seeMoreUrl: e.target.value })}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.excludeUsed ?? true}
          onChange={(e) => patch({ excludeUsed: e.target.checked })}
        />
        <span>{t("blocks.postsList.excludeUsed")}</span>
      </label>
    </div>
  );
}

const postsListNode = createBlockNode<PostsListAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: PostsListNodeView,
});

export const postsListBlock: BlockManifest<PostsListAttrs> = {
  id: `default/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.postsList.title",
  namespace: "theme-default",
  icon: ListOrdered,
  category: "layout",
  extensions: [postsListNode],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <PostsListInspector editor={props.editor} />,
};
