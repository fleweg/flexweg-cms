import { Sparkles as SparklesIcon, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { FeatureItem, ProductFeaturesAttrs } from "./render";

const SUB_ID = "product-features";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: ProductFeaturesAttrs = {
  features: [
    { icon: "local_shipping", label: "Fast delivery" },
    { icon: "eco", label: "Sustainably sourced" },
    { icon: "loyalty", label: "Quality guarantee" },
  ],
};

interface NodeViewProps {
  attrs: ProductFeaturesAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-storefront");
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
        <SparklesIcon className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.productFeatures.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50">
            {t("blocks.productFeatures.preview", { count })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: ProductFeaturesAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const features = attrs.features ?? [];

  function patch(next: Partial<ProductFeaturesAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchFeatures(next: FeatureItem[]) {
    patch({ features: next });
  }
  function addFeature() {
    patchFeatures([...features, { icon: "", label: "" }]);
  }
  function removeFeature(idx: number) {
    patchFeatures(features.filter((_, i) => i !== idx));
  }
  function patchFeature(idx: number, next: Partial<FeatureItem>) {
    patchFeatures(features.map((f, i) => (i === idx ? { ...f, ...next } : f)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="label !mb-0">Features ({features.length})</span>
        <button
          type="button"
          onClick={addFeature}
          className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-3.5 w-3.5" /> Add feature
        </button>
      </div>
      <div className="space-y-2">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                Feature {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="p-1 text-red-500 hover:text-red-700"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              type="text"
              className="input"
              placeholder="Icon (e.g. local_shipping)"
              value={f.icon}
              onChange={(e) => patchFeature(idx, { icon: e.target.value })}
            />
            <input
              type="text"
              className="input"
              placeholder="Label"
              value={f.label}
              onChange={(e) => patchFeature(idx, { label: e.target.value })}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-surface-500">
        Use any Material Symbols Outlined glyph name — e.g. local_shipping, eco, loyalty, verified, spa.
      </p>
    </div>
  );
}

const node = createBlockNode<ProductFeaturesAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const productFeaturesBlock: BlockManifest<ProductFeaturesAttrs> = {
  id: `storefront/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.productFeatures.title",
  namespace: "theme-storefront",
  icon: SparklesIcon,
  category: "layout",
  extensions: [node],
  insert: async (chain) => {
    chain.focus().insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_ATTRS } }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
