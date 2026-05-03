import { Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { CtaAttrs } from "./render";

const SUB_ID = "cta";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: CtaAttrs = { variant: "light" };

function CtaNodeView({ attrs, selected }: { attrs: CtaAttrs; selected: boolean }) {
  const { t } = useTranslation("theme-default");
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
            {t("blocks.cta.title")}
          </p>
          <p className="mt-1 truncate text-sm text-surface-900 dark:text-surface-50">
            {attrs.title || t("blocks.cta.placeholder")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function CtaInspector({ editor }: { editor: Editor }) {
  const { t } = useTranslation("theme-default");
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: CtaAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<CtaAttrs>) {
    editor
      .chain()
      .focus()
      .updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } })
      .run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.cta.titleField")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.cta.description")}</label>
        <textarea
          className="input min-h-[60px]"
          value={attrs.description ?? ""}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t("blocks.cta.buttonLabel")}</label>
          <input
            type="text"
            className="input"
            value={attrs.buttonLabel ?? ""}
            onChange={(e) => patch({ buttonLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("blocks.cta.buttonUrl")}</label>
          <input
            type="text"
            className="input"
            value={attrs.buttonUrl ?? ""}
            onChange={(e) => patch({ buttonUrl: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">{t("blocks.cta.variant")}</label>
        <select
          className="input max-w-xs"
          value={attrs.variant ?? "light"}
          onChange={(e) => patch({ variant: e.target.value as CtaAttrs["variant"] })}
        >
          <option value="light">{t("blocks.cta.variants.light")}</option>
          <option value="dark">{t("blocks.cta.variants.dark")}</option>
        </select>
      </div>
    </div>
  );
}

const node = createBlockNode<CtaAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: CtaNodeView,
});

export const ctaBlock: BlockManifest<CtaAttrs> = {
  id: `default/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.cta.title",
  namespace: "theme-default",
  icon: Megaphone,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <CtaInspector editor={props.editor} />,
};
