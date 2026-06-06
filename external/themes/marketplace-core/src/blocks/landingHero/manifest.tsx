import { Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_LANDING_HERO, type LandingHeroAttrs } from "./render";

const SUB_ID = "landing-hero";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: LandingHeroAttrs; selected: boolean }) {
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
        <Rocket className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.landingHero.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.headline || t("blocks.landingHero.empty")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: LandingHeroAttrs };
  const attrs = { ...DEFAULT_LANDING_HERO, ...(raw.attrs ?? {}) };
  function patch(next: Partial<LandingHeroAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Eyebrow</label>
        <input className="input" value={attrs.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} />
      </div>
      <div>
        <label className="label">Headline</label>
        <textarea className="input min-h-[60px]" value={attrs.headline} onChange={(e) => patch({ headline: e.target.value })} />
      </div>
      <div>
        <label className="label">Subhead</label>
        <textarea className="input min-h-[60px]" value={attrs.subhead} onChange={(e) => patch({ subhead: e.target.value })} />
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
      <div>
        <label className="label">Image URL</label>
        <input className="input" value={attrs.imageUrl} onChange={(e) => patch({ imageUrl: e.target.value })} placeholder="home-hero-admin.jpg or /media/…" />
      </div>
      <div>
        <label className="label">Image alt text</label>
        <input className="input" value={attrs.imageAlt} onChange={(e) => patch({ imageAlt: e.target.value })} />
      </div>
    </div>
  );
}

const node = createBlockNode<LandingHeroAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_LANDING_HERO,
  view: NodeView,
});

export const landingHeroBlock: BlockManifest<LandingHeroAttrs> = {
  id: `marketplace-core/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.landingHero.title",
  namespace: "theme-marketplace-core",
  icon: Rocket,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    (chain as { focus: () => { insertContent: (n: unknown) => { run: () => void } } })
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_LANDING_HERO } })
      .run();
  },
  isActive: (editor) => (editor as Editor).isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor as Editor} />,
};
