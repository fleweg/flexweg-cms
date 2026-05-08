import { LayoutPanelLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { HeroSplitAttrs } from "./render";

const SUB_ID = "hero-split";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: HeroSplitAttrs = {
  eyebrow: "",
  title: "",
  subtitle: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  imageUrl: "",
  imageAlt: "",
};

interface NodeViewProps {
  attrs: HeroSplitAttrs;
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
        <LayoutPanelLeft className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.heroSplit.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.heroSplit.untitled")}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: HeroSplitAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<HeroSplitAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.heroSplit.eyebrow")}</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow ?? ""}
          onChange={(e) => patch({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.heroSplit.heading")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.heroSplit.subtitle")}</label>
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
      <div>
        <label className="label">{t("blocks.heroSplit.decorImageUrl")}</label>
        <input
          type="url"
          className="input"
          placeholder="https://…"
          value={attrs.imageUrl ?? ""}
          onChange={(e) => patch({ imageUrl: e.target.value })}
        />
        <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
          {t("blocks.heroSplit.decorImageHelp")}
        </p>
      </div>
      <div>
        <label className="label">{t("blocks.heroOverlay.imageAlt")}</label>
        <input
          type="text"
          className="input"
          value={attrs.imageAlt ?? ""}
          onChange={(e) => patch({ imageAlt: e.target.value })}
        />
      </div>
    </div>
  );
}

const node = createBlockNode<HeroSplitAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const heroSplitBlock: BlockManifest<HeroSplitAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.heroSplit.title",
  namespace: "theme-corporate",
  icon: LayoutPanelLeft,
  category: "layout",
  extensions: [node],
  insert: async (chain, ctx) => {
    const picked = ctx.pickMedia ? await ctx.pickMedia() : null;
    chain
      .focus()
      .insertContent({
        type: NODE_NAME,
        attrs: {
          attrs: picked
            ? { ...DEFAULT_ATTRS, imageUrl: picked.url, imageAlt: picked.alt ?? "" }
            : DEFAULT_ATTRS,
        },
      })
      .run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
