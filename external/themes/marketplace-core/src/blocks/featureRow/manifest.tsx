import { Plus, SplitSquareVertical, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_FEATURE_ROW, type FeatureRowAttrs } from "./render";

const SUB_ID = "feature-row";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: FeatureRowAttrs; selected: boolean }) {
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
        <SplitSquareVertical className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.featureRow.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.headline || t("blocks.featureRow.empty")} ·{" "}
            <span className="text-surface-500">{attrs.imagePosition === "left" ? "← image" : "image →"}</span>
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: FeatureRowAttrs };
  const attrs = { ...DEFAULT_FEATURE_ROW, ...(raw.attrs ?? {}) };
  function patch(next: Partial<FeatureRowAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function updateBullet(i: number, value: string) {
    const bullets = [...attrs.bullets];
    bullets[i] = value;
    patch({ bullets });
  }
  function addBullet() {
    patch({ bullets: [...attrs.bullets, ""] });
  }
  function removeBullet(i: number) {
    patch({ bullets: attrs.bullets.filter((_, idx) => idx !== i) });
  }
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Image position</label>
        <select
          className="input"
          value={attrs.imagePosition}
          onChange={(e) => patch({ imagePosition: e.target.value as "left" | "right" })}
        >
          <option value="left">Image on the left</option>
          <option value="right">Image on the right</option>
        </select>
      </div>
      <div>
        <label className="label">Eyebrow</label>
        <input className="input" value={attrs.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} />
      </div>
      <div>
        <label className="label">Headline</label>
        <textarea className="input min-h-[60px]" value={attrs.headline} onChange={(e) => patch({ headline: e.target.value })} />
      </div>
      <div>
        <label className="label">Body</label>
        <textarea className="input min-h-[80px]" value={attrs.body} onChange={(e) => patch({ body: e.target.value })} />
      </div>
      <div>
        <label className="label">Bullets</label>
        <div className="space-y-2">
          {attrs.bullets.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input className="input text-xs flex-1" value={b} onChange={(e) => updateBullet(i, e.target.value)} />
              <button type="button" onClick={() => removeBullet(i)} className="btn-ghost p-1 text-red-600">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addBullet} className="btn-secondary text-xs w-full">
            <Plus className="h-3.5 w-3.5" />
            Add bullet
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">CTA label</label>
          <input className="input" value={attrs.ctaLabel} onChange={(e) => patch({ ctaLabel: e.target.value })} />
        </div>
        <div>
          <label className="label">CTA URL</label>
          <input className="input" value={attrs.ctaHref} onChange={(e) => patch({ ctaHref: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label">Image URL</label>
        <input className="input" value={attrs.imageUrl} onChange={(e) => patch({ imageUrl: e.target.value })} />
      </div>
      <div>
        <label className="label">Image alt</label>
        <input className="input" value={attrs.imageAlt} onChange={(e) => patch({ imageAlt: e.target.value })} />
      </div>
    </div>
  );
}

const node = createBlockNode<FeatureRowAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_FEATURE_ROW,
  view: NodeView,
});

export const featureRowBlock: BlockManifest<FeatureRowAttrs> = {
  id: `marketplace-core/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.featureRow.title",
  namespace: "theme-marketplace-core",
  icon: SplitSquareVertical,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    (chain as { focus: () => { insertContent: (n: unknown) => { run: () => void } } })
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_FEATURE_ROW } })
      .run();
  },
  isActive: (editor) => (editor as Editor).isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor as Editor} />,
};
