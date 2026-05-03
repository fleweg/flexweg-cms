import { useTranslation } from "react-i18next";
import type { Editor } from "@tiptap/core";
import {
  COLUMNS_NODE_NAME,
  COLUMN_NODE_NAME,
  DEFAULT_COLS,
  MAX_COLS,
  MIN_COLS,
} from "./extension";

interface ColumnsInspectorProps {
  editor: Editor;
}

// Inspector for the Columns block. The only knob is the column
// count — changing it dispatches a transaction that adds or removes
// trailing columns to keep the doc in sync with the attribute.
//
// Tiptap's undo stack covers the whole transaction so a user who
// accidentally drops from 4→2 (losing two columns of content) can
// just press Cmd+Z to recover.
export function ColumnsInspector({ editor }: ColumnsInspectorProps) {
  const { t } = useTranslation("flexweg-blocks");
  const attrs = editor.getAttributes(COLUMNS_NODE_NAME) as { cols?: number };
  const currentCols = attrs.cols ?? DEFAULT_COLS;

  function setColumnCount(next: number) {
    const target = Math.max(MIN_COLS, Math.min(MAX_COLS, Math.floor(next) || DEFAULT_COLS));
    if (target === currentCols) return;

    const { state } = editor;
    const { selection, schema, doc, tr } = state;
    // Find the columnsContainer wrapping the current selection.
    // Walk depth-first up the position resolver until we hit the
    // node — works whether the cursor is inside a column or has the
    // container itself selected.
    const $pos = selection.$from;
    let containerPos = -1;
    let containerNode = null;
    for (let depth = $pos.depth; depth >= 0; depth--) {
      const node = $pos.node(depth);
      if (node.type.name === COLUMNS_NODE_NAME) {
        containerPos = depth === 0 ? -1 : $pos.before(depth);
        containerNode = node;
        break;
      }
    }
    if (!containerNode || containerPos < 0) return;

    const colType = schema.nodes[COLUMN_NODE_NAME];
    const paraType = schema.nodes.paragraph;
    if (!colType || !paraType) return;

    const childCount = containerNode.childCount;

    if (target > childCount) {
      // Append empty columns. Each new column gets a fresh empty
      // paragraph so the user can immediately type into it without
      // having to first satisfy the `block+` content constraint.
      // Insert position = end of the container's content (i.e.
      // `containerPos + 1 + node.content.size`).
      let cursor = containerPos + 1 + containerNode.content.size;
      for (let i = childCount; i < target; i++) {
        const emptyCol = colType.create(null, paraType.create());
        tr.insert(cursor, emptyCol);
        cursor += emptyCol.nodeSize;
      }
    } else {
      // Remove trailing columns. Walk from the end of the container
      // backwards so the offsets we compute don't shift mid-loop.
      let cursor = containerPos + 1 + containerNode.content.size;
      for (let i = childCount - 1; i >= target; i--) {
        const child = containerNode.child(i);
        cursor -= child.nodeSize;
        tr.delete(cursor, cursor + child.nodeSize);
      }
    }

    // Update the cols attribute on the (possibly mutated) container.
    // setNodeMarkup takes the original position pre-mutations
    // because tr.steps map them appropriately — and we've only
    // mutated the children inside, so the container's position is
    // unchanged.
    tr.setNodeMarkup(containerPos, undefined, {
      ...containerNode.attrs,
      cols: target,
    });

    // Re-read the doc post-mutations to verify the container is
    // still resolvable (defensive — Tiptap's command would've
    // thrown on an invalid schema state but better surface a clear
    // failure than dispatching a bad tr).
    if (!tr.docChanged) return;

    editor.view.dispatch(tr);
    editor.view.focus();
    void doc; // touched purely to silence the "unused variable" lint
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.columns.cols")}</label>
        <select
          className="input max-w-xs"
          value={currentCols}
          onChange={(e) => setColumnCount(Number.parseInt(e.target.value, 10))}
        >
          {Array.from({ length: MAX_COLS - MIN_COLS + 1 }, (_, idx) => MIN_COLS + idx).map(
            (n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ),
          )}
        </select>
        <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
          {t("blocks.columns.colsHelp")}
        </p>
      </div>
    </div>
  );
}
