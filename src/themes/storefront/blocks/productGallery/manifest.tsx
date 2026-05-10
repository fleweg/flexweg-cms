import { Images as ImagesIcon, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { GalleryImage, ProductGalleryAttrs } from "./render";

const SUB_ID = "product-gallery";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: ProductGalleryAttrs = {
  images: [],
  primaryFeatured: true,
};

interface NodeViewProps {
  attrs: ProductGalleryAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-storefront");
  const count = attrs.images?.length ?? 0;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <ImagesIcon className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.productGallery.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50">
            {t("blocks.productGallery.preview", { count })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: ProductGalleryAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const images = attrs.images ?? [];

  function patch(next: Partial<ProductGalleryAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchImages(next: GalleryImage[]) {
    patch({ images: next });
  }
  function addImage() {
    patchImages([...images, { url: "", alt: "" }]);
  }
  function removeImage(idx: number) {
    patchImages(images.filter((_, i) => i !== idx));
  }
  function patchImage(idx: number, next: Partial<GalleryImage>) {
    patchImages(images.map((img, i) => (i === idx ? { ...img, ...next } : img)));
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attrs.primaryFeatured}
          onChange={(e) => patch({ primaryFeatured: e.target.checked })}
        />
        <span>First image as featured (hero), rest as thumbnails</span>
      </label>

      <div className="border-t border-surface-200 pt-3 dark:border-surface-700">
        <div className="flex items-center justify-between mb-2">
          <span className="label !mb-0">Images ({images.length})</span>
          <button
            type="button"
            onClick={addImage}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add image
          </button>
        </div>
        <div className="space-y-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                  Image {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                type="url"
                className="input"
                placeholder="Image URL"
                value={img.url}
                onChange={(e) => patchImage(idx, { url: e.target.value })}
              />
              <input
                type="text"
                className="input"
                placeholder="Alt text"
                value={img.alt}
                onChange={(e) => patchImage(idx, { alt: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const node = createBlockNode<ProductGalleryAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const productGalleryBlock: BlockManifest<ProductGalleryAttrs> = {
  id: `storefront/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.productGallery.title",
  namespace: "theme-storefront",
  icon: ImagesIcon,
  category: "media",
  extensions: [node],
  insert: async (chain, ctx) => {
    const picked = ctx.pickMedia ? await ctx.pickMedia() : null;
    chain
      .focus()
      .insertContent({
        type: NODE_NAME,
        attrs: {
          attrs: picked
            ? { ...DEFAULT_ATTRS, images: [{ url: picked.url, alt: picked.alt ?? "" }] }
            : DEFAULT_ATTRS,
        },
      })
      .run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
