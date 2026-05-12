import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_HEADER_BUTTONS, type HeaderButtonsAttrs } from "./render";

const SUB_ID = "header-buttons";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: HeaderButtonsAttrs; selected: boolean }) {
  const { t } = useTranslation("theme-marketplace-core");
  const ready = !!(attrs.downloadUrl || attrs.previewUrl);
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Download className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.headerButtons.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {ready
              ? [attrs.downloadUrl, attrs.previewUrl].filter(Boolean).join(" · ")
              : t("blocks.headerButtons.untitled")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: HeaderButtonsAttrs };
  const attrs = { ...DEFAULT_HEADER_BUTTONS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<HeaderButtonsAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_2fr] gap-2">
        <div>
          <label className="label">Byline prefix</label>
          <input
            className="input"
            placeholder="by"
            value={attrs.creatorPrefix}
            onChange={(e) => patch({ creatorPrefix: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Created by</label>
          <input
            className="input"
            placeholder="Brad Frost"
            value={attrs.creator}
            onChange={(e) => patch({ creator: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Download URL</label>
        <input
          type="url"
          className="input"
          placeholder="https://github.com/example/your-project/releases/latest"
          value={attrs.downloadUrl}
          onChange={(e) => patch({ downloadUrl: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Live Preview URL</label>
        <input
          type="url"
          className="input"
          placeholder="https://demo.example.com"
          value={attrs.previewUrl}
          onChange={(e) => patch({ previewUrl: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Download label</label>
          <input
            className="input"
            value={attrs.downloadLabel}
            onChange={(e) => patch({ downloadLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Preview label</label>
          <input
            className="input"
            value={attrs.previewLabel}
            onChange={(e) => patch({ previewLabel: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Free badge label</label>
        <input
          className="input"
          value={attrs.freeLabel}
          onChange={(e) => patch({ freeLabel: e.target.value })}
        />
      </div>
    </div>
  );
}

const node = createBlockNode<HeaderButtonsAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_HEADER_BUTTONS,
  view: NodeView,
});

export const headerButtonsBlock: BlockManifest<HeaderButtonsAttrs> = {
  id: `marketplace-core/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.headerButtons.title",
  namespace: "theme-marketplace-core",
  icon: Download,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    (chain as { focus: () => { insertContent: (n: unknown) => { run: () => void } } })
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_HEADER_BUTTONS } })
      .run();
  },
  isActive: (editor) => (editor as Editor).isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor as Editor} />,
};
