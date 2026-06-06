import { Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_CTA_BANNER, type CtaBannerAttrs } from "./render";

const SUB_ID = "cta-banner";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: CtaBannerAttrs; selected: boolean }) {
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
        <Megaphone className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.ctaBanner.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.headline || t("blocks.ctaBanner.empty")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: CtaBannerAttrs };
  const attrs = { ...DEFAULT_CTA_BANNER, ...(raw.attrs ?? {}) };
  function patch(next: Partial<CtaBannerAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Headline</label>
        <textarea className="input min-h-[60px]" value={attrs.headline} onChange={(e) => patch({ headline: e.target.value })} />
      </div>
      <div>
        <label className="label">Body</label>
        <textarea className="input min-h-[60px]" value={attrs.body} onChange={(e) => patch({ body: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Primary CTA label</label>
          <input className="input" value={attrs.primaryCta.label} onChange={(e) => patch({ primaryCta: { ...attrs.primaryCta, label: e.target.value } })} />
        </div>
        <div>
          <label className="label">Primary CTA URL</label>
          <input className="input" value={attrs.primaryCta.href} onChange={(e) => patch({ primaryCta: { ...attrs.primaryCta, href: e.target.value } })} />
        </div>
        <div>
          <label className="label">Secondary CTA label</label>
          <input className="input" value={attrs.secondaryCta.label} onChange={(e) => patch({ secondaryCta: { ...attrs.secondaryCta, label: e.target.value } })} />
        </div>
        <div>
          <label className="label">Secondary CTA URL</label>
          <input className="input" value={attrs.secondaryCta.href} onChange={(e) => patch({ secondaryCta: { ...attrs.secondaryCta, href: e.target.value } })} />
        </div>
      </div>
    </div>
  );
}

const node = createBlockNode<CtaBannerAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_CTA_BANNER,
  view: NodeView,
});

export const ctaBannerBlock: BlockManifest<CtaBannerAttrs> = {
  id: `marketplace-core/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.ctaBanner.title",
  namespace: "theme-marketplace-core",
  icon: Megaphone,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    (chain as { focus: () => { insertContent: (n: unknown) => { run: () => void } } })
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_CTA_BANNER } })
      .run();
  },
  isActive: (editor) => (editor as Editor).isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor as Editor} />,
};
