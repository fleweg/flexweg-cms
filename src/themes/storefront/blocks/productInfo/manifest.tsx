import { Tag as TagIcon, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import {
  DEFAULT_PRODUCT_INFO_ATTRS,
  type ProductInfoAttrs,
  type ProductVariant,
} from "./render";

const SUB_ID = "product-info";
const NODE_NAME = blockNodeName(SUB_ID);

interface NodeViewProps {
  attrs: ProductInfoAttrs;
  selected: boolean;
}

// Editor preview — surfaces the most useful fields as a small
// summary card so the user knows what's stored without opening the
// inspector. The block ITSELF doesn't render anything inline on the
// public site (SingleTemplate extracts and renders it in the hero
// right-column).
function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-storefront");
  const summary = [
    attrs.priceTTC > 0 ? `${attrs.priceTTC} ${attrs.currency || "EUR"}` : "",
    attrs.stockStatus,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-amber-400 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30 " +
        (selected ? "ring-2 ring-amber-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <TagIcon className="h-5 w-5 shrink-0 text-amber-600" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            {t("blocks.productInfo.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {summary || t("blocks.productInfo.untitled")}
          </p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">
            {t("blocks.productInfo.editorHint")}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: ProductInfoAttrs };
  const attrs: ProductInfoAttrs = {
    ...DEFAULT_PRODUCT_INFO_ATTRS,
    ...(raw.attrs ?? {}),
  };

  function patch(next: Partial<ProductInfoAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchVariants(next: ProductVariant[]) {
    patch({ variants: next });
  }
  function addVariant() {
    patchVariants([...(attrs.variants ?? []), { label: "", options: [""] }]);
  }
  function removeVariant(idx: number) {
    patchVariants((attrs.variants ?? []).filter((_, i) => i !== idx));
  }
  function patchVariant(idx: number, next: Partial<ProductVariant>) {
    patchVariants((attrs.variants ?? []).map((v, i) => (i === idx ? { ...v, ...next } : v)));
  }
  function patchVariantOption(varIdx: number, optIdx: number, value: string) {
    const v = attrs.variants[varIdx];
    const newOpts = v.options.slice();
    newOpts[optIdx] = value;
    patchVariant(varIdx, { options: newOpts });
  }
  function addVariantOption(varIdx: number) {
    const v = attrs.variants[varIdx];
    patchVariant(varIdx, { options: [...v.options, ""] });
  }
  function removeVariantOption(varIdx: number, optIdx: number) {
    const v = attrs.variants[varIdx];
    patchVariant(varIdx, { options: v.options.filter((_, i) => i !== optIdx) });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Price excl. tax</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={attrs.priceHT}
            onChange={(e) => patch({ priceHT: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="label">Price incl. tax</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={attrs.priceTTC}
            onChange={(e) => patch({ priceTTC: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="label">Promo (incl. tax)</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={attrs.promoTTC}
            onChange={(e) => patch({ promoTTC: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="label">Currency (ISO 4217)</label>
          <input
            type="text"
            className="input"
            placeholder="EUR"
            value={attrs.currency}
            onChange={(e) => patch({ currency: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label">Stock status</label>
        <select
          className="input"
          value={attrs.stockStatus || ""}
          onChange={(e) =>
            patch({ stockStatus: e.target.value as ProductInfoAttrs["stockStatus"] })
          }
        >
          <option value="">—</option>
          <option value="in-stock">In stock</option>
          <option value="low-stock">Low stock</option>
          <option value="out-of-stock">Out of stock</option>
          <option value="on-order">On order</option>
        </select>
      </div>

      <div>
        <label className="label">Badges (comma-separated)</label>
        <input
          type="text"
          className="input"
          placeholder="Limited Edition, New"
          value={(attrs.badges ?? []).join(", ")}
          onChange={(e) =>
            patch({
              badges: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Primary CTA label</label>
          <input
            type="text"
            className="input"
            value={attrs.ctaPrimaryLabel}
            onChange={(e) => patch({ ctaPrimaryLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Primary CTA link</label>
          <input
            type="text"
            className="input"
            value={attrs.ctaPrimaryHref}
            onChange={(e) => patch({ ctaPrimaryHref: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Secondary CTA label</label>
          <input
            type="text"
            className="input"
            value={attrs.ctaSecondaryLabel}
            onChange={(e) => patch({ ctaSecondaryLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Secondary CTA link</label>
          <input
            type="text"
            className="input"
            value={attrs.ctaSecondaryHref}
            onChange={(e) => patch({ ctaSecondaryHref: e.target.value })}
          />
        </div>
      </div>

      <div className="border-t border-surface-200 pt-3 mt-3 dark:border-surface-700">
        <div className="flex items-center justify-between mb-2">
          <span className="label !mb-0">Variants ({attrs.variants?.length ?? 0})</span>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add variant
          </button>
        </div>
        <div className="space-y-3">
          {(attrs.variants ?? []).map((v, vIdx) => (
            <div
              key={vIdx}
              className="rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Label (e.g. Size)"
                  value={v.label}
                  onChange={(e) => patchVariant(vIdx, { label: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeVariant(vIdx)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove variant"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                {v.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Option (e.g. Small)"
                      value={opt}
                      onChange={(e) =>
                        patchVariantOption(vIdx, oIdx, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantOption(vIdx, oIdx)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Remove option"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addVariantOption(vIdx)}
                  className="text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add option
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const node = createBlockNode<ProductInfoAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_PRODUCT_INFO_ATTRS,
  view: NodeView,
});

export const productInfoBlock: BlockManifest<ProductInfoAttrs> = {
  id: `storefront/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.productInfo.title",
  namespace: "theme-storefront",
  icon: TagIcon,
  category: "advanced",
  extensions: [node],
  insert: async (chain) => {
    chain
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_PRODUCT_INFO_ATTRS } })
      .run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
