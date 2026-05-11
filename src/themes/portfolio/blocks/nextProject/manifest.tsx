import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_NEXT_PROJECT_ATTRS, type NextProjectAttrs } from "./render";

const SUB_ID = "next-project";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: NextProjectAttrs; selected: boolean }) {
  const { t } = useTranslation("theme-portfolio");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <ArrowRight className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.nextProject.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.nextProject.untitled")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: NextProjectAttrs };
  const attrs = { ...DEFAULT_NEXT_PROJECT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<NextProjectAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Eyebrow</label>
        <input className="input" value={attrs.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} />
      </div>
      <div>
        <label className="label">Project title</label>
        <input className="input" value={attrs.title} onChange={(e) => patch({ title: e.target.value })} />
      </div>
      <div>
        <label className="label">Link target</label>
        <input className="input" value={attrs.href} onChange={(e) => patch({ href: e.target.value })} placeholder="/category/project.html" />
      </div>
      <div>
        <label className="label">CTA label</label>
        <input className="input" value={attrs.ctaLabel} onChange={(e) => patch({ ctaLabel: e.target.value })} />
      </div>
    </div>
  );
}

const node = createBlockNode<NextProjectAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_NEXT_PROJECT_ATTRS,
  view: NodeView,
});

export const nextProjectBlock: BlockManifest<NextProjectAttrs> = {
  id: `portfolio/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.nextProject.title",
  namespace: "theme-portfolio",
  icon: ArrowRight,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain
      .focus()
      .insertContent({
        type: NODE_NAME,
        attrs: { attrs: DEFAULT_NEXT_PROJECT_ATTRS },
      })
      .run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
