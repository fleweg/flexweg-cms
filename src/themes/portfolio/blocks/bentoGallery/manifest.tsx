import { LayoutGrid } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_BENTO_GALLERY_ATTRS, type BentoGalleryAttrs } from "./render";

const SUB_ID = "bento-gallery";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: BentoGalleryAttrs; selected: boolean }) {
  const { t } = useTranslation("theme-portfolio");
  const filled = [
    attrs.mainImageUrl,
    attrs.subTopImageUrl,
    attrs.subBottomImageUrl,
    attrs.wideImageUrl,
  ].filter(Boolean).length;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <LayoutGrid className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.bentoGallery.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {filled}/4 {t("blocks.bentoGallery.imagesFilled")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: BentoGalleryAttrs };
  const attrs = { ...DEFAULT_BENTO_GALLERY_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<BentoGalleryAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  function imageField(key: keyof BentoGalleryAttrs, altKey: keyof BentoGalleryAttrs, label: string) {
    return (
      <div className="space-y-2 rounded border border-surface-200 p-2 dark:border-surface-700">
        <span className="text-xs font-semibold uppercase tracking-wide text-surface-500">{label}</span>
        <input
          className="input"
          value={(attrs[key] as string) ?? ""}
          onChange={(e) => patch({ [key]: e.target.value } as Partial<BentoGalleryAttrs>)}
          placeholder="https://…"
        />
        <input
          className="input"
          value={(attrs[altKey] as string) ?? ""}
          onChange={(e) => patch({ [altKey]: e.target.value } as Partial<BentoGalleryAttrs>)}
          placeholder="Image alt"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {imageField("mainImageUrl", "mainImageAlt", "Main image (col-span-8, 600px)")}
      {imageField("subTopImageUrl", "subTopImageAlt", "Sub top image (col-span-4, top half)")}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={attrs.subTopGrayscale}
          onChange={(e) => patch({ subTopGrayscale: e.target.checked })}
        />
        <span className="text-sm">Grayscale the top sub image</span>
      </label>
      {imageField("subBottomImageUrl", "subBottomImageAlt", "Sub bottom image (col-span-4, bottom half)")}
      {imageField("wideImageUrl", "wideImageAlt", "Wide image (col-span-12, 800px)")}
    </div>
  );
}

const node = createBlockNode<BentoGalleryAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_BENTO_GALLERY_ATTRS,
  view: NodeView,
});

export const bentoGalleryBlock: BlockManifest<BentoGalleryAttrs> = {
  id: `portfolio/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.bentoGallery.title",
  namespace: "theme-portfolio",
  icon: LayoutGrid,
  category: "media",
  extensions: [node],
  insert: (chain) => {
    chain
      .focus()
      .insertContent({
        type: NODE_NAME,
        attrs: { attrs: DEFAULT_BENTO_GALLERY_ATTRS },
      })
      .run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
