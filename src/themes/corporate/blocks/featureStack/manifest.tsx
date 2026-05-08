import { Layers, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { FeatureItem, FeatureStackAttrs } from "./render";

const SUB_ID = "feature-stack";
const NODE_NAME = blockNodeName(SUB_ID);

const NEW_FEATURE: FeatureItem = {
  icon: "auto_awesome",
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  imageUrl: "",
  imageAlt: "",
  imagePosition: undefined,
};

const DEFAULT_ATTRS: FeatureStackAttrs = {
  eyebrow: "",
  title: "",
  subtitle: "",
  alternate: true,
  features: [{ ...NEW_FEATURE }, { ...NEW_FEATURE }],
};

interface NodeViewProps {
  attrs: FeatureStackAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-corporate");
  const count = attrs.features?.length ?? 0;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Layers className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.featureStack.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.featureStack.preview", { count })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: FeatureStackAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const items = attrs.features ?? [];

  function commit(next: Partial<FeatureStackAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchItem(index: number, next: Partial<FeatureItem>) {
    commit({ features: items.map((s, i) => (i === index ? { ...s, ...next } : s)) });
  }
  function addItem() {
    commit({ features: [...items, { ...NEW_FEATURE }] });
  }
  function removeItem(index: number) {
    commit({ features: items.filter((_, i) => i !== index) });
  }
  function moveItem(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const list = [...items];
    [list[index], list[target]] = [list[target], list[index]];
    commit({ features: list });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.featureStack.eyebrow")}</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow ?? ""}
          onChange={(e) => commit({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.featureStack.heading")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => commit({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.featureStack.subtitle")}</label>
        <textarea
          className="input"
          rows={2}
          value={attrs.subtitle ?? ""}
          onChange={(e) => commit({ subtitle: e.target.value })}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
        <input
          type="checkbox"
          checked={attrs.alternate !== false}
          onChange={(e) => commit({ alternate: e.target.checked })}
        />
        {t("blocks.featureStack.alternate")}
      </label>

      <div className="space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.featureStack.featuresHeading")}
          </p>
          <button
            type="button"
            className="btn-ghost btn-sm flex items-center gap-1"
            onClick={addItem}
          >
            <Plus className="h-3 w-3" />
            {t("blocks.featureStack.addFeature")}
          </button>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                {t("blocks.featureStack.itemIndex", { index: index + 1 })}
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
                <label className="label text-xs">{t("blocks.featureStack.icon")}</label>
                <input
                  type="text"
                  className="input"
                  placeholder="rocket_launch"
                  value={item.icon ?? ""}
                  onChange={(e) => patchItem(index, { icon: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">{t("blocks.featureStack.eyebrowField")}</label>
                <input
                  type="text"
                  className="input"
                  value={item.eyebrow ?? ""}
                  onChange={(e) => patchItem(index, { eyebrow: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label text-xs">{t("blocks.featureStack.featureTitle")}</label>
              <input
                type="text"
                className="input"
                value={item.title ?? ""}
                onChange={(e) => patchItem(index, { title: e.target.value })}
              />
            </div>
            <div>
              <label className="label text-xs">{t("blocks.featureStack.featureDescription")}</label>
              <textarea
                className="input"
                rows={2}
                value={item.description ?? ""}
                onChange={(e) => patchItem(index, { description: e.target.value })}
              />
            </div>
            <div>
              <label className="label text-xs">{t("blocks.featureStack.imageUrl")}</label>
              <input
                type="url"
                className="input"
                placeholder="https://…"
                value={item.imageUrl ?? ""}
                onChange={(e) => patchItem(index, { imageUrl: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label text-xs">{t("blocks.featureStack.ctaLabel")}</label>
                <input
                  type="text"
                  className="input"
                  value={item.ctaLabel ?? ""}
                  onChange={(e) => patchItem(index, { ctaLabel: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">{t("blocks.featureStack.ctaHref")}</label>
                <input
                  type="text"
                  className="input"
                  value={item.ctaHref ?? ""}
                  onChange={(e) => patchItem(index, { ctaHref: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label text-xs">{t("blocks.featureStack.imagePosition")}</label>
              <select
                className="input"
                value={item.imagePosition ?? ""}
                onChange={(e) =>
                  patchItem(index, {
                    imagePosition: (e.target.value as "left" | "right" | "") || undefined,
                  })
                }
              >
                <option value="">{t("blocks.featureStack.imagePositions.auto")}</option>
                <option value="left">{t("blocks.featureStack.imagePositions.left")}</option>
                <option value="right">{t("blocks.featureStack.imagePositions.right")}</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const node = createBlockNode<FeatureStackAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const featureStackBlock: BlockManifest<FeatureStackAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.featureStack.title",
  namespace: "theme-corporate",
  icon: Layers,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
