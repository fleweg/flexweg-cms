import { Tags } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { CategoriesPillsAttrs } from "./render";

const SUB_ID = "categories-pills";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: CategoriesPillsAttrs = { style: "pills" };

function CategoriesNodeView({ attrs, selected }: { attrs: CategoriesPillsAttrs; selected: boolean }) {
  const { t } = useTranslation("theme-default");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Tags className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.categoriesPills.title")}
          </p>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            {attrs.title || t("blocks.categoriesPills.untitled")} ·{" "}
            {t(`blocks.categoriesPills.styles.${attrs.style ?? "pills"}`)}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function CategoriesInspector({ editor }: { editor: Editor }) {
  const { t } = useTranslation("theme-default");
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: CategoriesPillsAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<CategoriesPillsAttrs>) {
    editor
      .chain()
      .focus()
      .updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } })
      .run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.categoriesPills.titleField")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder={t("blocks.categoriesPills.titlePlaceholder")}
        />
      </div>
      <div>
        <label className="label">{t("blocks.categoriesPills.style")}</label>
        <select
          className="input max-w-xs"
          value={attrs.style ?? "pills"}
          onChange={(e) => patch({ style: e.target.value as CategoriesPillsAttrs["style"] })}
        >
          <option value="pills">{t("blocks.categoriesPills.styles.pills")}</option>
          <option value="list">{t("blocks.categoriesPills.styles.list")}</option>
        </select>
      </div>
    </div>
  );
}

const node = createBlockNode<CategoriesPillsAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: CategoriesNodeView,
});

export const categoriesPillsBlock: BlockManifest<CategoriesPillsAttrs> = {
  id: `default/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.categoriesPills.title",
  namespace: "theme-default",
  icon: Tags,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <CategoriesInspector editor={props.editor} />,
};
