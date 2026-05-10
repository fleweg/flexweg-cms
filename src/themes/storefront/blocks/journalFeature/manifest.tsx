import { BookOpen as BookIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { JournalFeatureAttrs } from "./render";

const SUB_ID = "journal-feature";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: JournalFeatureAttrs = {
  imageUrl: "",
  imageAlt: "",
  eyebrow: "",
  title: "",
  titleItalicTail: "",
  subtitle: "",
  ctaLabel: "",
  ctaHref: "",
};

interface NodeViewProps {
  attrs: JournalFeatureAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-storefront");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <BookIcon className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.journalFeature.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.journalFeature.untitled")}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: JournalFeatureAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<JournalFeatureAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Image URL</label>
        <input
          type="url"
          className="input"
          value={attrs.imageUrl ?? ""}
          onChange={(e) => patch({ imageUrl: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Image alt</label>
        <input
          type="text"
          className="input"
          value={attrs.imageAlt ?? ""}
          onChange={(e) => patch({ imageAlt: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Eyebrow</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow ?? ""}
          onChange={(e) => patch({ eyebrow: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Title</label>
          <input
            type="text"
            className="input"
            value={attrs.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Italic tail</label>
          <input
            type="text"
            className="input"
            value={attrs.titleItalicTail ?? ""}
            onChange={(e) => patch({ titleItalicTail: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Subtitle</label>
        <textarea
          className="input"
          rows={3}
          value={attrs.subtitle ?? ""}
          onChange={(e) => patch({ subtitle: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">CTA label</label>
          <input
            type="text"
            className="input"
            value={attrs.ctaLabel ?? ""}
            onChange={(e) => patch({ ctaLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">CTA link</label>
          <input
            type="text"
            className="input"
            value={attrs.ctaHref ?? ""}
            onChange={(e) => patch({ ctaHref: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

const node = createBlockNode<JournalFeatureAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const journalFeatureBlock: BlockManifest<JournalFeatureAttrs> = {
  id: `storefront/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.journalFeature.title",
  namespace: "theme-storefront",
  icon: BookIcon,
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
