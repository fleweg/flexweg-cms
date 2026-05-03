import { FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { useCmsData } from "../../../../context/CmsDataContext";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { CategoryPostsAttrs } from "./render";

const SUB_ID = "category-posts";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: CategoryPostsAttrs = {
  count: 4,
  variant: "cards",
  columns: 2,
  excludeUsed: true,
};

interface NodeViewProps {
  attrs: CategoryPostsAttrs;
  selected: boolean;
}

function CategoryNodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-default");
  const { categories } = useCmsData();
  const cat = categories.find((c) => c.id === attrs.categoryId);
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <FolderOpen className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.categoryPosts.title")}
          </p>
          <p className="mt-1 text-sm text-surface-900 dark:text-surface-50">
            {cat?.name ?? t("blocks.categoryPosts.pickCategory")}
          </p>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            {t(`blocks.postsList.variants.${attrs.variant ?? "cards"}`)} · {attrs.count ?? 4}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

interface InspectorProps {
  editor: Editor;
}

function CategoryInspector({ editor }: InspectorProps) {
  const { t } = useTranslation("theme-default");
  const { categories } = useCmsData();
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: CategoryPostsAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<CategoryPostsAttrs>) {
    editor
      .chain()
      .focus()
      .updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } })
      .run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.categoryPosts.category")}</label>
        <select
          className="input"
          value={attrs.categoryId ?? ""}
          onChange={(e) => patch({ categoryId: e.target.value || undefined })}
        >
          <option value="">—</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">{t("blocks.categoryPosts.titleField")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder={t("blocks.categoryPosts.titlePlaceholder")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t("blocks.postsList.count")}</label>
          <input
            type="number"
            min={1}
            max={24}
            className="input"
            value={attrs.count ?? 4}
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
          onChange={(e) => patch({ variant: e.target.value as CategoryPostsAttrs["variant"] })}
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
            placeholder={t("blocks.categoryPosts.seeMoreUrlPlaceholder")}
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

const node = createBlockNode<CategoryPostsAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: CategoryNodeView,
});

export const categoryPostsBlock: BlockManifest<CategoryPostsAttrs> = {
  id: `default/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.categoryPosts.title",
  namespace: "theme-default",
  icon: FolderOpen,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <CategoryInspector editor={props.editor} />,
};
