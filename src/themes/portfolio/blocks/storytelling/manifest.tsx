import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_STORYTELLING_ATTRS, type StorytellingAttrs } from "./render";

const SUB_ID = "storytelling";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: StorytellingAttrs; selected: boolean }) {
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
        <Quote className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.storytelling.title")}
          </p>
          <p className="text-sm italic text-surface-900 dark:text-surface-50 truncate">
            {attrs.headline || t("blocks.storytelling.untitled")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: StorytellingAttrs };
  const attrs = { ...DEFAULT_STORYTELLING_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<StorytellingAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Eyebrow</label>
        <input className="input" value={attrs.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} />
      </div>
      <div>
        <label className="label">Headline (italic)</label>
        <textarea className="input" rows={2} value={attrs.headline} onChange={(e) => patch({ headline: e.target.value })} />
      </div>
      <div>
        <label className="label">Body paragraph</label>
        <textarea className="input" rows={4} value={attrs.body} onChange={(e) => patch({ body: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Step 1 label</label>
          <input className="input" value={attrs.step1Label} onChange={(e) => patch({ step1Label: e.target.value })} />
        </div>
        <div>
          <label className="label">Step 2 label</label>
          <input className="input" value={attrs.step2Label} onChange={(e) => patch({ step2Label: e.target.value })} />
        </div>
        <div>
          <label className="label">Step 1 text</label>
          <input className="input" value={attrs.step1Text} onChange={(e) => patch({ step1Text: e.target.value })} />
        </div>
        <div>
          <label className="label">Step 2 text</label>
          <input className="input" value={attrs.step2Text} onChange={(e) => patch({ step2Text: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label">Image URL</label>
        <input className="input" value={attrs.imageUrl} onChange={(e) => patch({ imageUrl: e.target.value })} placeholder="https://…" />
      </div>
      <div>
        <label className="label">Image alt</label>
        <input className="input" value={attrs.imageAlt} onChange={(e) => patch({ imageAlt: e.target.value })} />
      </div>
    </div>
  );
}

const node = createBlockNode<StorytellingAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_STORYTELLING_ATTRS,
  view: NodeView,
});

export const storytellingBlock: BlockManifest<StorytellingAttrs> = {
  id: `portfolio/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.storytelling.title",
  namespace: "theme-portfolio",
  icon: Quote,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain
      .focus()
      .insertContent({
        type: NODE_NAME,
        attrs: { attrs: DEFAULT_STORYTELLING_ATTRS },
      })
      .run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
