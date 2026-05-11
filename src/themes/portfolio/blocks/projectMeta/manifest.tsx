import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_PROJECT_META_ATTRS, type ProjectMetaAttrs } from "./render";

const SUB_ID = "project-meta";
const NODE_NAME = blockNodeName(SUB_ID);

interface NodeViewProps {
  attrs: ProjectMetaAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-portfolio");
  const summary = attrs.rows.map((r) => r.label).filter(Boolean).join(" · ");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.projectMeta.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {summary || t("blocks.projectMeta.untitled")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: ProjectMetaAttrs };
  const attrs = { ...DEFAULT_PROJECT_META_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<ProjectMetaAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function updateRow(i: number, key: "label" | "value", value: string) {
    const rows = [...attrs.rows];
    rows[i] = { ...rows[i], [key]: value };
    patch({ rows });
  }
  function addRow() {
    patch({ rows: [...attrs.rows, { label: "", value: "" }] });
  }
  function removeRow(i: number) {
    patch({ rows: attrs.rows.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-3">
      {attrs.rows.map((row, i) => (
        <div key={i} className="space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-surface-500">
              Row {i + 1}
            </span>
            <button type="button" onClick={() => removeRow(i)} className="text-xs text-red-600 hover:underline">
              Remove
            </button>
          </div>
          <div>
            <label className="label">Label</label>
            <input className="input" value={row.label} onChange={(e) => updateRow(i, "label", e.target.value)} />
          </div>
          <div>
            <label className="label">Value (one item per line)</label>
            <textarea className="input" rows={3} value={row.value} onChange={(e) => updateRow(i, "value", e.target.value)} />
          </div>
        </div>
      ))}
      <button type="button" onClick={addRow} className="btn-secondary text-xs">
        Add row
      </button>
    </div>
  );
}

const node = createBlockNode<ProjectMetaAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_PROJECT_META_ATTRS,
  view: NodeView,
});

export const projectMetaBlock: BlockManifest<ProjectMetaAttrs> = {
  id: `portfolio/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.projectMeta.title",
  namespace: "theme-portfolio",
  icon: Info,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain
      .focus()
      .insertContent({
        type: NODE_NAME,
        attrs: { attrs: DEFAULT_PROJECT_META_ATTRS },
      })
      .run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
