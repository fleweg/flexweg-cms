import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Columns3 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Minimum / maximum number of columns exposed to the user. Outside
// that range the layout breaks visually — at 1 col it's a no-op, at
// 5+ desktop content gets too cramped and mobile-stacking becomes
// overwhelming.
export const MIN_COLS = 2;
export const MAX_COLS = 4;
export const DEFAULT_COLS = 2;

export const COLUMNS_NODE_NAME = "columnsContainer";
export const COLUMN_NODE_NAME = "column";

const BLOCK_ID = "flexweg-blocks/columns";

// Top-level container. Lives in the `block` group so the editor's
// inserter can drop it at the document root. Content is a non-empty
// list of `column` nodes — Tiptap's schema validation prevents a
// columns block without columns from existing.
//
// `isolating: true` keeps the cursor from escaping into a sibling
// block on backspace at the start of a column — feels more like a
// proper container.
export const ColumnsContainer = Node.create({
  name: COLUMNS_NODE_NAME,
  group: "block",
  content: "column+",
  isolating: true,
  defining: true,

  addAttributes() {
    return {
      cols: {
        default: DEFAULT_COLS,
        parseHTML: (el) => {
          const raw = (el as HTMLElement).getAttribute("data-cols");
          const n = raw ? Number.parseInt(raw, 10) : DEFAULT_COLS;
          if (Number.isNaN(n)) return DEFAULT_COLS;
          return Math.max(MIN_COLS, Math.min(MAX_COLS, n));
        },
        renderHTML: (attrs: { cols?: number }) => ({
          "data-cols": String(attrs.cols ?? DEFAULT_COLS),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[data-cms-block="${BLOCK_ID}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    // The `0` slot tells ProseMirror "this is where my children go"
    // — children are rendered in the markdown / HTML output via
    // their own renderHTML. Wrapped in a div with the marker
    // attribute so the publish-time DOMParser pass can pick it up.
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-cms-block": BLOCK_ID }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnsContainerView);
  },
});

// Individual column. Intentionally NOT in the `block` group so the
// inserter can't drop one at the root — columns only exist as
// children of a columnsContainer.
//
// Content is `block+` — accepts any block-group node (paragraphs,
// headings, embeds, theme blocks…). Nesting columns inside columns
// isn't blocked at the schema level (would require a custom group
// system); documented as discouraged in the README.
export const Column = Node.create({
  name: COLUMN_NODE_NAME,
  content: "block+",
  isolating: true,
  defining: true,

  parseHTML() {
    return [{ tag: "div[data-cms-column]" }];
  },

  renderHTML() {
    return ["div", { "data-cms-column": "" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnView);
  },
});

// React NodeView for the container. Two visible parts:
//
//   • A header strip with the block label + count — gives the user a
//     stable click target to select the whole columns block
//     (matching how the embed blocks surface their identity).
//   • A grid host that holds the columns. Tiptap-React injects two
//     intermediate wrappers between NodeViewContent and the actual
//     column NodeViewWrappers (`[data-node-view-content-react]` →
//     `.react-renderer`). The styles.ts CSS applies `display: contents`
//     to both so the column elements end up as direct grid children.
//
// We deliberately do NOT pass `as="div"` here — older Tiptap React
// versions leak unknown props onto the rendered element, leaving an
// `as="div"` attribute on the DOM. Default rendering is already a
// div, so it's redundant either way.
function ColumnsContainerView({ node, selected }: NodeViewProps) {
  const { t } = useTranslation("flexweg-blocks");
  const cols = (node.attrs.cols as number | undefined) ?? DEFAULT_COLS;
  return (
    <NodeViewWrapper
      className={`cms-columns-block${selected ? " is-selected" : ""}`}
      data-cms-columns-editor="true"
    >
      <div
        className="cms-columns-block-header"
        // The header itself isn't editable — clicks on it select the
        // node so the user can run the inspector / move buttons.
        contentEditable={false}
      >
        <Columns3 className="cms-columns-block-header-icon" />
        <span className="cms-columns-block-header-label">
          {t("blocks.columns.title")}
        </span>
        <span className="cms-columns-block-header-meta">{cols}</span>
      </div>
      <NodeViewContent className={`cms-columns cms-columns-cols-${cols}`} />
    </NodeViewWrapper>
  );
}

// React NodeView for a single column. The wrapper exposes a
// `cms-column` class that matches the published version. Empty-state
// affordances (dashed outline, min-height) are added via admin-only
// CSS in styles.ts so the published HTML stays clean.
function ColumnView() {
  return (
    <NodeViewWrapper className="cms-column">
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
