import { Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { PromoCardAttrs } from "./render";

const SUB_ID = "promo-card";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: PromoCardAttrs = {
  imageUrl: "",
  imageAlt: "",
  title: "",
  eyebrow: "",
  href: "",
};

interface NodeViewProps {
  attrs: PromoCardAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-magazine");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Megaphone className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.promoCard.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.promoCard.untitled")}
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
  const { t } = useTranslation("theme-magazine");
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: PromoCardAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<PromoCardAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.promoCard.imageUrl")}</label>
        <input
          type="url"
          className="input"
          placeholder="https://…"
          value={attrs.imageUrl ?? ""}
          onChange={(e) => patch({ imageUrl: e.target.value })}
        />
        <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
          {t("blocks.promoCard.imageUrlHelp")}
        </p>
      </div>
      <div>
        <label className="label">{t("blocks.promoCard.imageAlt")}</label>
        <input
          type="text"
          className="input"
          value={attrs.imageAlt ?? ""}
          onChange={(e) => patch({ imageAlt: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.promoCard.eyebrow")}</label>
        <input
          type="text"
          className="input"
          placeholder={t("blocks.promoCard.defaultEyebrow")}
          value={attrs.eyebrow ?? ""}
          onChange={(e) => patch({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.promoCard.heading")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.promoCard.href")}</label>
        <input
          type="url"
          className="input"
          placeholder="https://…"
          value={attrs.href ?? ""}
          onChange={(e) => patch({ href: e.target.value })}
        />
      </div>
    </div>
  );
}

const node = createBlockNode<PromoCardAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const promoCardBlock: BlockManifest<PromoCardAttrs> = {
  id: `magazine/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.promoCard.title",
  namespace: "theme-magazine",
  icon: Megaphone,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
