import { ListChecks, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_SPECS, type SpecsAttrs } from "./render";

const SUB_ID = "specs";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: SpecsAttrs; selected: boolean }) {
  const { t } = useTranslation("theme-marketplace-core");
  const summary = attrs.rows
    .map((r) => r.label)
    .filter(Boolean)
    .slice(0, 3)
    .join(" · ");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <ListChecks className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.specs.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {summary || t("blocks.specs.untitled")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: SpecsAttrs };
  const attrs = { ...DEFAULT_SPECS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<SpecsAttrs>) {
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
      <div>
        <label className="label">Section heading</label>
        <input className="input" value={attrs.heading} onChange={(e) => patch({ heading: e.target.value })} />
      </div>
      {attrs.rows.map((row, i) => (
        <div key={i} className="space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-surface-500">Row {i + 1}</span>
            <button type="button" onClick={() => removeRow(i)} className="btn-ghost p-1 text-red-600">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Label</label>
              <input
                className="input text-xs"
                value={row.label}
                onChange={(e) => updateRow(i, "label", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Value</label>
              <input
                className="input text-xs"
                value={row.value}
                onChange={(e) => updateRow(i, "value", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={addRow} className="btn-secondary text-xs w-full">
        <Plus className="h-3.5 w-3.5" />
        Add row
      </button>
    </div>
  );
}

const node = createBlockNode<SpecsAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_SPECS,
  view: NodeView,
});

export const specsBlock: BlockManifest<SpecsAttrs> = {
  id: `marketplace-core/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.specs.title",
  namespace: "theme-marketplace-core",
  icon: ListChecks,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    (chain as { focus: () => { insertContent: (n: unknown) => { run: () => void } } })
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_SPECS } })
      .run();
  },
  isActive: (editor) => (editor as Editor).isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor as Editor} />,
};
