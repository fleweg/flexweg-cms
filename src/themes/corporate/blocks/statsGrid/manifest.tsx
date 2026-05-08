import { BarChart3, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { StatItem, StatsGridAttrs } from "./render";

const SUB_ID = "stats-grid";
const NODE_NAME = blockNodeName(SUB_ID);

const NEW_STAT: StatItem = { value: "", label: "" };

const DEFAULT_ATTRS: StatsGridAttrs = {
  eyebrow: "",
  title: "",
  subtitle: "",
  stats: [{ ...NEW_STAT }, { ...NEW_STAT }, { ...NEW_STAT }, { ...NEW_STAT }],
};

interface NodeViewProps {
  attrs: StatsGridAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-corporate");
  const count = attrs.stats?.length ?? 0;
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
            {t("blocks.statsGrid.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.statsGrid.preview", { count })}
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
  const { t } = useTranslation("theme-corporate");
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: StatsGridAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const items = attrs.stats ?? [];

  function commit(next: Partial<StatsGridAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchItem(index: number, next: Partial<StatItem>) {
    commit({ stats: items.map((s, i) => (i === index ? { ...s, ...next } : s)) });
  }
  function addItem() {
    commit({ stats: [...items, { ...NEW_STAT }] });
  }
  function removeItem(index: number) {
    commit({ stats: items.filter((_, i) => i !== index) });
  }
  function moveItem(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const list = [...items];
    [list[index], list[target]] = [list[target], list[index]];
    commit({ stats: list });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.statsGrid.eyebrow")}</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow ?? ""}
          onChange={(e) => commit({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.statsGrid.heading")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => commit({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.statsGrid.subtitle")}</label>
        <textarea
          className="input"
          rows={2}
          value={attrs.subtitle ?? ""}
          onChange={(e) => commit({ subtitle: e.target.value })}
        />
      </div>

      <div className="space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.statsGrid.statsHeading")}
          </p>
          <button
            type="button"
            className="btn-ghost btn-sm flex items-center gap-1"
            onClick={addItem}
          >
            <Plus className="h-3 w-3" />
            {t("blocks.statsGrid.addItem")}
          </button>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                {t("blocks.statsGrid.itemIndex", { index: index + 1 })}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="btn-ghost btn-icon"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-icon"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-icon text-red-600"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label text-xs">{t("blocks.statsGrid.value")}</label>
                <input
                  type="text"
                  className="input"
                  placeholder="500+"
                  value={item.value ?? ""}
                  onChange={(e) => patchItem(index, { value: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">{t("blocks.statsGrid.itemLabel")}</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Clients"
                  value={item.label ?? ""}
                  onChange={(e) => patchItem(index, { label: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const node = createBlockNode<StatsGridAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const statsGridBlock: BlockManifest<StatsGridAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.statsGrid.title",
  namespace: "theme-corporate",
  icon: BarChart3,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
