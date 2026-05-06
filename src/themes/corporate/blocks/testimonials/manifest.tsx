import { Quote, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { Testimonial, TestimonialsAttrs, TestimonialsVariant } from "./render";

const SUB_ID = "testimonials";
const NODE_NAME = blockNodeName(SUB_ID);

const NEW_TESTIMONIAL: Testimonial = {
  rating: 5,
  quote: "",
  authorName: "",
  authorTitle: "",
  authorAvatarUrl: "",
  authorAvatarAlt: "",
};

const DEFAULT_ATTRS: TestimonialsAttrs = {
  eyebrow: "",
  title: "",
  subtitle: "",
  variant: "glass",
  testimonials: [{ ...NEW_TESTIMONIAL }, { ...NEW_TESTIMONIAL }, { ...NEW_TESTIMONIAL }],
};

interface NodeViewProps {
  attrs: TestimonialsAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-corporate");
  const count = attrs.testimonials?.length ?? 0;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Quote className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.testimonials.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.testimonials.preview", { count })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: TestimonialsAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const items = attrs.testimonials ?? [];

  function commit(next: Partial<TestimonialsAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchItem(index: number, next: Partial<Testimonial>) {
    commit({ testimonials: items.map((s, i) => (i === index ? { ...s, ...next } : s)) });
  }
  function addItem() {
    commit({ testimonials: [...items, { ...NEW_TESTIMONIAL }] });
  }
  function removeItem(index: number) {
    commit({ testimonials: items.filter((_, i) => i !== index) });
  }
  function moveItem(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const list = [...items];
    [list[index], list[target]] = [list[target], list[index]];
    commit({ testimonials: list });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.testimonials.variant")}</label>
        <select
          className="input"
          value={attrs.variant ?? "glass"}
          onChange={(e) => commit({ variant: e.target.value as TestimonialsVariant })}
        >
          <option value="glass">{t("blocks.testimonials.variants.glass")}</option>
          <option value="navy">{t("blocks.testimonials.variants.navy")}</option>
        </select>
      </div>
      <div>
        <label className="label">{t("blocks.testimonials.eyebrow")}</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow ?? ""}
          onChange={(e) => commit({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.testimonials.heading")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => commit({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.testimonials.subtitle")}</label>
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
            {t("blocks.testimonials.itemsHeading")}
          </p>
          <button
            type="button"
            className="btn-ghost btn-sm flex items-center gap-1"
            onClick={addItem}
          >
            <Plus className="h-3 w-3" />
            {t("blocks.testimonials.addItem")}
          </button>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                {t("blocks.testimonials.itemIndex", { index: index + 1 })}
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
            <div>
              <label className="label text-xs">{t("blocks.testimonials.quote")}</label>
              <textarea
                className="input"
                rows={3}
                value={item.quote ?? ""}
                onChange={(e) => patchItem(index, { quote: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label text-xs">{t("blocks.testimonials.authorName")}</label>
                <input
                  type="text"
                  className="input"
                  value={item.authorName ?? ""}
                  onChange={(e) => patchItem(index, { authorName: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">{t("blocks.testimonials.authorTitle")}</label>
                <input
                  type="text"
                  className="input"
                  value={item.authorTitle ?? ""}
                  onChange={(e) => patchItem(index, { authorTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">{t("blocks.testimonials.avatarUrl")}</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://…"
                  value={item.authorAvatarUrl ?? ""}
                  onChange={(e) => patchItem(index, { authorAvatarUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">{t("blocks.testimonials.rating")}</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="input"
                  value={item.rating ?? 5}
                  onChange={(e) => patchItem(index, { rating: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const node = createBlockNode<TestimonialsAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const testimonialsBlock: BlockManifest<TestimonialsAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.testimonials.title",
  namespace: "theme-corporate",
  icon: Quote,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
