import { Star as StarIcon, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { ReviewItem, ReviewsListAttrs } from "./render";

const SUB_ID = "reviews-list";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_REVIEW: ReviewItem = {
  authorName: "",
  authorRole: "Verified buyer",
  authorInitials: "",
  authorAvatarUrl: "",
  rating: 5,
  text: "",
  dateLabel: "",
};

const DEFAULT_ATTRS: ReviewsListAttrs = {
  eyebrow: "",
  title: "Client impressions",
  writeReviewLabel: "",
  writeReviewHref: "",
  reviews: [],
};

interface NodeViewProps {
  attrs: ReviewsListAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-storefront");
  const count = attrs.reviews?.length ?? 0;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <StarIcon className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.reviewsList.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50">
            {t("blocks.reviewsList.preview", { count })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: ReviewsListAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const reviews = attrs.reviews ?? [];

  function patch(next: Partial<ReviewsListAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchReviews(next: ReviewItem[]) {
    patch({ reviews: next });
  }
  function addReview() {
    patchReviews([...reviews, { ...DEFAULT_REVIEW }]);
  }
  function removeReview(idx: number) {
    patchReviews(reviews.filter((_, i) => i !== idx));
  }
  function patchReview(idx: number, next: Partial<ReviewItem>) {
    patchReviews(reviews.map((r, i) => (i === idx ? { ...r, ...next } : r)));
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Eyebrow</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow}
          onChange={(e) => patch({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Title</label>
        <input
          type="text"
          className="input"
          value={attrs.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">"Write a review" label</label>
          <input
            type="text"
            className="input"
            value={attrs.writeReviewLabel}
            onChange={(e) => patch({ writeReviewLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="label">"Write a review" link</label>
          <input
            type="text"
            className="input"
            placeholder="mailto: or https://…"
            value={attrs.writeReviewHref}
            onChange={(e) => patch({ writeReviewHref: e.target.value })}
          />
        </div>
      </div>

      <div className="border-t border-surface-200 pt-3 dark:border-surface-700">
        <div className="flex items-center justify-between mb-2">
          <span className="label !mb-0">Reviews ({reviews.length})</span>
          <button
            type="button"
            onClick={addReview}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add review
          </button>
        </div>
        <div className="space-y-3">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                  Review {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeReview(idx)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className="input"
                  placeholder="Author name"
                  value={r.authorName}
                  onChange={(e) => patchReview(idx, { authorName: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Role"
                  value={r.authorRole}
                  onChange={(e) => patchReview(idx, { authorRole: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Initials (auto from name)"
                  value={r.authorInitials}
                  onChange={(e) => patchReview(idx, { authorInitials: e.target.value })}
                />
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="5"
                  className="input"
                  placeholder="Rating 0-5"
                  value={r.rating}
                  onChange={(e) =>
                    patchReview(idx, { rating: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <input
                type="url"
                className="input"
                placeholder="Avatar URL (optional)"
                value={r.authorAvatarUrl}
                onChange={(e) => patchReview(idx, { authorAvatarUrl: e.target.value })}
              />
              <textarea
                className="input"
                rows={3}
                placeholder="Review text"
                value={r.text}
                onChange={(e) => patchReview(idx, { text: e.target.value })}
              />
              <input
                type="text"
                className="input"
                placeholder="Date label (e.g. May 12, 2024)"
                value={r.dateLabel}
                onChange={(e) => patchReview(idx, { dateLabel: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const node = createBlockNode<ReviewsListAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const reviewsListBlock: BlockManifest<ReviewsListAttrs> = {
  id: `storefront/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.reviewsList.title",
  namespace: "theme-storefront",
  icon: StarIcon,
  category: "advanced",
  extensions: [node],
  insert: async (chain) => {
    chain.focus().insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_ATTRS } }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
