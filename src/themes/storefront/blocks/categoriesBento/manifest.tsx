import { Grid3X3 as GridIcon, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { BentoCard, CategoriesBentoAttrs } from "./render";

const SUB_ID = "categories-bento";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_CARD: BentoCard = {
  imageUrl: "",
  imageAlt: "",
  label: "",
  ctaLabel: "Shop now",
  ctaHref: "",
  size: "small",
};

const DEFAULT_ATTRS: CategoriesBentoAttrs = {
  eyebrow: "",
  title: "Curated collections",
  subtitle: "",
  viewAllLabel: "",
  viewAllHref: "",
  cards: [],
};

interface NodeViewProps {
  attrs: CategoriesBentoAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-storefront");
  const count = attrs.cards?.length ?? 0;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <GridIcon className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.categoriesBento.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50">
            {t("blocks.categoriesBento.preview", { count })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: CategoriesBentoAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const cards = attrs.cards ?? [];

  function patch(next: Partial<CategoriesBentoAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchCards(next: BentoCard[]) {
    patch({ cards: next });
  }
  function addCard() {
    patchCards([...cards, { ...DEFAULT_CARD }]);
  }
  function removeCard(idx: number) {
    patchCards(cards.filter((_, i) => i !== idx));
  }
  function moveCard(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= cards.length) return;
    const copy = cards.slice();
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    patchCards(copy);
  }
  function patchCard(idx: number, next: Partial<BentoCard>) {
    patchCards(cards.map((c, i) => (i === idx ? { ...c, ...next } : c)));
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Eyebrow</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow ?? ""}
          onChange={(e) => patch({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Title</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Subtitle</label>
        <input
          type="text"
          className="input"
          value={attrs.subtitle ?? ""}
          onChange={(e) => patch({ subtitle: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">View-all label</label>
          <input
            type="text"
            className="input"
            value={attrs.viewAllLabel ?? ""}
            onChange={(e) => patch({ viewAllLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">View-all link</label>
          <input
            type="text"
            className="input"
            value={attrs.viewAllHref ?? ""}
            onChange={(e) => patch({ viewAllHref: e.target.value })}
          />
        </div>
      </div>

      <div className="border-t border-surface-200 pt-3 mt-3 dark:border-surface-700">
        <div className="flex items-center justify-between mb-2">
          <span className="label !mb-0">Bento cards ({cards.length})</span>
          <button
            type="button"
            onClick={addCard}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add card
          </button>
        </div>
        <div className="space-y-3">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                  Card {idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveCard(idx, -1)}
                    className="p-1 text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCard(idx, 1)}
                    className="p-1 text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCard(idx)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                className="input"
                placeholder="Image URL"
                value={card.imageUrl}
                onChange={(e) => patchCard(idx, { imageUrl: e.target.value })}
              />
              <input
                type="text"
                className="input"
                placeholder="Image alt"
                value={card.imageAlt}
                onChange={(e) => patchCard(idx, { imageAlt: e.target.value })}
              />
              <input
                type="text"
                className="input"
                placeholder="Label"
                value={card.label}
                onChange={(e) => patchCard(idx, { label: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className="input"
                  placeholder="CTA label"
                  value={card.ctaLabel}
                  onChange={(e) => patchCard(idx, { ctaLabel: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="CTA link"
                  value={card.ctaHref}
                  onChange={(e) => patchCard(idx, { ctaHref: e.target.value })}
                />
              </div>
              <select
                className="input"
                value={card.size}
                onChange={(e) =>
                  patchCard(idx, { size: e.target.value as BentoCard["size"] })
                }
              >
                <option value="large">Large (8 cols)</option>
                <option value="small">Small (4 cols)</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const node = createBlockNode<CategoriesBentoAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const categoriesBentoBlock: BlockManifest<CategoriesBentoAttrs> = {
  id: `storefront/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.categoriesBento.title",
  namespace: "theme-storefront",
  icon: GridIcon,
  category: "layout",
  extensions: [node],
  insert: async (chain) => {
    chain.focus().insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_ATTRS } }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
