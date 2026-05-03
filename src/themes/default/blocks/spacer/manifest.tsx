import { Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { SpacerAttrs } from "./render";

const SUB_ID = "spacer";
const NODE_NAME = blockNodeName(SUB_ID);
const DEFAULT_ATTRS: SpacerAttrs = { size: "md", divider: false };

function SpacerNodeView({ attrs, selected }: { attrs: SpacerAttrs; selected: boolean }) {
  const { t } = useTranslation("theme-default");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-2 rounded-md border border-dashed border-surface-300 bg-surface-50 p-2 text-center dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-center justify-center gap-2 text-xs text-surface-500 dark:text-surface-400">
        <Minus className="h-3 w-3" />
        <span>
          {t("blocks.spacer.title")} · {t(`blocks.spacer.sizes.${attrs.size ?? "md"}`)}
          {attrs.divider ? ` · ${t("blocks.spacer.dividerOn")}` : ""}
        </span>
      </div>
    </NodeViewWrapper>
  );
}

function SpacerInspector({ editor }: { editor: Editor }) {
  const { t } = useTranslation("theme-default");
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: SpacerAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<SpacerAttrs>) {
    // See hero/manifest.tsx for why .focus() is omitted: keeps
    // input focus while typing in the inspector.
    editor
      .chain()
      .updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } })
      .run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.spacer.size")}</label>
        <select
          className="input max-w-xs"
          value={attrs.size ?? "md"}
          onChange={(e) => patch({ size: e.target.value as SpacerAttrs["size"] })}
        >
          <option value="sm">{t("blocks.spacer.sizes.sm")}</option>
          <option value="md">{t("blocks.spacer.sizes.md")}</option>
          <option value="lg">{t("blocks.spacer.sizes.lg")}</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.divider ?? false}
          onChange={(e) => patch({ divider: e.target.checked })}
        />
        <span>{t("blocks.spacer.divider")}</span>
      </label>
    </div>
  );
}

const node = createBlockNode<SpacerAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: SpacerNodeView,
});

export const spacerBlock: BlockManifest<SpacerAttrs> = {
  id: `default/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.spacer.title",
  namespace: "theme-default",
  icon: Minus,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <SpacerInspector editor={props.editor} />,
};
