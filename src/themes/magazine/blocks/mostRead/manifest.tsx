import { ListOrdered } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { MostReadAttrs } from "./render";

const SUB_ID = "most-read";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: MostReadAttrs = {
  count: 4,
  source: "latest",
  showHeading: true,
};

interface NodeViewProps {
  attrs: MostReadAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-magazine");
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
            {t("blocks.mostRead.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50">
            {t("blocks.mostRead.preview", { count: attrs.count ?? 4 })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: MostReadAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<MostReadAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.mostRead.count")}</label>
        <input
          type="number"
          className="input max-w-xs"
          min={1}
          max={10}
          value={attrs.count ?? 4}
          onChange={(e) =>
            patch({ count: Math.max(1, Math.min(10, Number.parseInt(e.target.value, 10) || 4)) })
          }
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.showHeading ?? true}
          onChange={(e) => patch({ showHeading: e.target.checked })}
        />
        <span>{t("blocks.mostRead.showHeading")}</span>
      </label>
    </div>
  );
}

const node = createBlockNode<MostReadAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const mostReadBlock: BlockManifest<MostReadAttrs> = {
  id: `magazine/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.mostRead.title",
  namespace: "theme-magazine",
  icon: ListOrdered,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
