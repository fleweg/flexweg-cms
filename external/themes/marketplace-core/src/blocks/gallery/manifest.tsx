import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { MediaPicker, pickMediaUrl } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import { DEFAULT_GALLERY, type GalleryAttrs } from "./render";

const SUB_ID = "gallery";
const NODE_NAME = blockNodeName(SUB_ID);

function NodeView({ attrs, selected }: { attrs: GalleryAttrs; selected: boolean }) {
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
        <ImagePlus className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.gallery.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {t("blocks.gallery.count", { n: attrs.images.length })}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function Inspector({ editor }: { editor: Editor }) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: GalleryAttrs };
  const attrs = { ...DEFAULT_GALLERY, ...(raw.attrs ?? {}) };
  const [pickerOpen, setPickerOpen] = useState(false);

  function patch(next: Partial<GalleryAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function setAt(i: number, val: { url: string; alt: string }) {
    const images = [...attrs.images];
    images[i] = val;
    patch({ images });
  }
  function remove(i: number) {
    patch({ images: attrs.images.filter((_, idx) => idx !== i) });
  }
  function move(i: number, delta: number) {
    const dest = i + delta;
    if (dest < 0 || dest >= attrs.images.length) return;
    const images = [...attrs.images];
    [images[i], images[dest]] = [images[dest], images[i]];
    patch({ images });
  }

  return (
    <div className="space-y-3">
      {attrs.images.length === 0 && (
        <p className="text-xs text-surface-500">No images yet — click "Add image" to pick from the media library.</p>
      )}
      {attrs.images.map((img, i) => (
        <div
          key={i}
          className="flex items-start gap-2 rounded border border-surface-200 p-2 dark:border-surface-700"
        >
          {img.url && (
            <img src={img.url} alt={img.alt} className="h-16 w-16 object-cover rounded" />
          )}
          <div className="flex-1 min-w-0">
            <input
              className="input text-xs"
              placeholder="Image alt"
              value={img.alt}
              onChange={(e) => setAt(i, { ...img, alt: e.target.value })}
            />
            <p className="text-[10px] text-surface-500 mt-1 truncate" title={img.url}>
              {img.url}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="btn-ghost p-1"
              title="Move up"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === attrs.images.length - 1}
              className="btn-ghost p-1"
              title="Move down"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="btn-ghost p-1 text-red-600"
              title="Remove"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="btn-secondary text-xs w-full"
      >
        <ImagePlus className="h-3.5 w-3.5" />
        Add image from library
      </button>
      {pickerOpen && (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          onPick={(media) => {
            setPickerOpen(false);
            const url = pickMediaUrl(media, "large") || pickMediaUrl(media, "medium") || pickMediaUrl(media);
            if (!url) return;
            patch({ images: [...attrs.images, { url, alt: media.alt ?? "" }] });
          }}
        />
      )}
    </div>
  );
}

const node = createBlockNode<GalleryAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_GALLERY,
  view: NodeView,
});

export const galleryBlock: BlockManifest<GalleryAttrs> = {
  id: `marketplace-core/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.gallery.title",
  namespace: "theme-marketplace-core",
  icon: ImagePlus,
  category: "media",
  extensions: [node],
  insert: (chain) => {
    (chain as { focus: () => { insertContent: (n: unknown) => { run: () => void } } })
      .focus()
      .insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_GALLERY } })
      .run();
  },
  isActive: (editor) => (editor as Editor).isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor as Editor} />,
};
