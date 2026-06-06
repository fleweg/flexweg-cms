import { BarChart3, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_STATS_BAR, type StatsBarAttrs } from "./render";

const SUB_ID = "stats-bar";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: StatsBarAttrs; selected: boolean }) {
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
        <BarChart3 className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.statsBar.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {t("blocks.statsBar.count", { n: attrs.items.length })}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: StatsBarAttrs };
  const attrs = { ...DEFAULT_STATS_BAR, ...(raw.attrs ?? {}) };
  function patch(next: Partial<StatsBarAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function updateItem(i: number, key: "value" | "label", value: string) {
    const items = [...attrs.items];
    items[i] = { ...items[i], [key]: value };
    patch({ items });
  }
  function addItem() {
    patch({ items: [...attrs.items, { value: "", label: "" }] });
  }
  function removeItem(i: number) {
    patch({ items: attrs.items.filter((_, idx) => idx !== i) });
  }
  return (
    <div className="space-y-3">
      {attrs.items.map((item, i) => (
        <div key={i} className="space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-surface-500">Stat {i + 1}</span>
            <button type="button" onClick={() => removeItem(i)} className="btn-ghost p-1 text-red-600">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <input className="input text-xs" placeholder="Value (10, MIT, ∞)" value={item.value} onChange={(e) => updateItem(i, "value", e.target.value)} />
          <input className="input text-xs" placeholder="Label" value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={addItem} className="btn-secondary text-xs w-full">
        <Plus className="h-3.5 w-3.5" />
        Add stat
      </button>
    </div>
  );
}

const node = createBlockNode<StatsBarAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_STATS_BAR,
  view: NodeView,
});

export const statsBarBlock: BlockManifest<StatsBarAttrs> = {
  id: `marketplace-core/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.statsBar.title",
  namespace: "theme-marketplace-core",
  icon: BarChart3,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    (chain as { focus: () => { insertContent: (n: unknown) => { run: () => void } } })
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_STATS_BAR } })
      .run();
  },
  isActive: (editor) => (editor as Editor).isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor as Editor} />,
};
