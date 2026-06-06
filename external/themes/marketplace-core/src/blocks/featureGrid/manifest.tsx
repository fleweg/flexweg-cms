import { LayoutGrid, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_FEATURE_GRID, type FeatureGridAttrs } from "./render";

const SUB_ID = "feature-grid";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: FeatureGridAttrs; selected: boolean }) {
  const { t } = useTranslation("theme-marketplace-core");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <LayoutGrid className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.featureGrid.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {t("blocks.featureGrid.count", { n: attrs.items.length })}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: FeatureGridAttrs };
  const attrs = { ...DEFAULT_FEATURE_GRID, ...(raw.attrs ?? {}) };
  function patch(next: Partial<FeatureGridAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function updateItem(i: number, key: "icon" | "title" | "body", value: string) {
    const items = [...attrs.items];
    items[i] = { ...items[i], [key]: value };
    patch({ items });
  }
  function addItem() {
    patch({ items: [...attrs.items, { icon: "bolt", title: "", body: "" }] });
  }
  function removeItem(i: number) {
    patch({ items: attrs.items.filter((_, idx) => idx !== i) });
  }
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Heading</label>
        <input className="input" value={attrs.heading} onChange={(e) => patch({ heading: e.target.value })} />
      </div>
      <div>
        <label className="label">Subhead</label>
        <input className="input" value={attrs.subhead} onChange={(e) => patch({ subhead: e.target.value })} />
      </div>
      {attrs.items.map((item, i) => (
        <div key={i} className="space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-surface-500">Item {i + 1}</span>
            <button type="button" onClick={() => removeItem(i)} className="btn-ghost p-1 text-red-600">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <input className="input text-xs" placeholder="Material icon (bolt, language, …)" value={item.icon} onChange={(e) => updateItem(i, "icon", e.target.value)} />
          <input className="input text-xs" placeholder="Title" value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} />
          <textarea className="input text-xs min-h-[60px]" placeholder="Body" value={item.body} onChange={(e) => updateItem(i, "body", e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={addItem} className="btn-secondary text-xs w-full">
        <Plus className="h-3.5 w-3.5" />
        Add item
      </button>
    </div>
  );
}

const node = createBlockNode<FeatureGridAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_FEATURE_GRID,
  view: NodeView,
});

export const featureGridBlock: BlockManifest<FeatureGridAttrs> = {
  id: `marketplace-core/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.featureGrid.title",
  namespace: "theme-marketplace-core",
  icon: LayoutGrid,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    (chain as { focus: () => { insertContent: (n: unknown) => { run: () => void } } })
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_FEATURE_GRID } })
      .run();
  },
  isActive: (editor) => (editor as Editor).isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor as Editor} />,
};
