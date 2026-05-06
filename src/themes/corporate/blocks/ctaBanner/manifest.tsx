import { Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { CtaBannerAttrs, CtaBannerVariant } from "./render";

const SUB_ID = "cta-banner";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: CtaBannerAttrs = {
  variant: "navy",
  title: "",
  subtitle: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
};

interface NodeViewProps {
  attrs: CtaBannerAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-corporate");
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
            {t("blocks.ctaBanner.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.ctaBanner.untitled")}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: CtaBannerAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<CtaBannerAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.ctaBanner.variant")}</label>
        <select
          className="input"
          value={attrs.variant ?? "navy"}
          onChange={(e) => patch({ variant: e.target.value as CtaBannerVariant })}
        >
          <option value="navy">{t("blocks.ctaBanner.variants.navy")}</option>
          <option value="indigo">{t("blocks.ctaBanner.variants.indigo")}</option>
        </select>
      </div>
      <div>
        <label className="label">{t("blocks.ctaBanner.heading")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.ctaBanner.subtitle")}</label>
        <textarea
          className="input"
          rows={3}
          value={attrs.subtitle ?? ""}
          onChange={(e) => patch({ subtitle: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t("blocks.heroOverlay.primaryCtaLabel")}</label>
          <input
            type="text"
            className="input"
            value={attrs.primaryCtaLabel ?? ""}
            onChange={(e) => patch({ primaryCtaLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("blocks.heroOverlay.primaryCtaHref")}</label>
          <input
            type="text"
            className="input"
            value={attrs.primaryCtaHref ?? ""}
            onChange={(e) => patch({ primaryCtaHref: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("blocks.heroOverlay.secondaryCtaLabel")}</label>
          <input
            type="text"
            className="input"
            value={attrs.secondaryCtaLabel ?? ""}
            onChange={(e) => patch({ secondaryCtaLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("blocks.heroOverlay.secondaryCtaHref")}</label>
          <input
            type="text"
            className="input"
            value={attrs.secondaryCtaHref ?? ""}
            onChange={(e) => patch({ secondaryCtaHref: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

const node = createBlockNode<CtaBannerAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const ctaBannerBlock: BlockManifest<CtaBannerAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.ctaBanner.title",
  namespace: "theme-corporate",
  icon: Megaphone,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
