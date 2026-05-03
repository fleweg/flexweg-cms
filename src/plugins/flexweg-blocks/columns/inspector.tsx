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

// Inspector for the Columns block.
//
// Two controls:
//   1. Column count select (2-4) — adds or removes trailing columns
//      to keep the doc in sync with the attr. Changing this also
//      resets the per-column widths (option A in the plan) so the
//      user is never left with an array length mismatching the cell
//      count.
//   2. Custom widths — opt-in proportions array (in `fr` units).
//      Toggle the checkbox to enable; per-column number inputs
//      appear and write back into `widths` on every change. Toggle
//      off (or hit the Reset button) to clear the array, falling
//      back to the equal `repeat(N, 1fr)` default supplied by CSS.
//
// Tiptap's undo stack covers each transaction — accidental cell
// deletions / width changes are recoverable with Cmd+Z.
export function ColumnsInspector({ editor }: ColumnsInspectorProps) {
  const { t } = useTranslation("flexweg-blocks");
  const attrs = editor.getAttributes(COLUMNS_NODE_NAME) as {
    cols?: number;
    widths?: number[] | null;
  };
  const currentCols = attrs.cols ?? DEFAULT_COLS;
  const widths = attrs.widths ?? null;
  const customEnabled = !!widths && widths.length > 0;

  function setColumnCount(next: number) {
    const target = Math.max(MIN_COLS, Math.min(MAX_COLS, Math.floor(next) || DEFAULT_COLS));
    if (target === currentCols) return;

    const { state } = editor;
    const { selection, schema, tr } = state;
    // Walk up from the selection to find the columnsContainer.
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
      // Append empty columns each pre-seeded with an empty paragraph
      // so the user can immediately type into them.
      let cursor = containerPos + 1 + containerNode.content.size;
      for (let i = childCount; i < target; i++) {
        const emptyCol = colType.create(null, paraType.create());
        tr.insert(cursor, emptyCol);
        cursor += emptyCol.nodeSize;
      }
    } else {
      // Remove trailing columns. Walking backwards keeps the offsets
      // we compute valid mid-loop.
      let cursor = containerPos + 1 + containerNode.content.size;
      for (let i = childCount - 1; i >= target; i--) {
        const child = containerNode.child(i);
        cursor -= child.nodeSize;
        tr.delete(cursor, cursor + child.nodeSize);
      }
    }

    // Reset widths whenever cols changes (option A in the plan).
    // The user re-customizes if they want non-equal widths after a
    // resize — simpler than auto-rebalancing.
    tr.setNodeMarkup(containerPos, undefined, {
      ...containerNode.attrs,
      cols: target,
      widths: null,
    });

    if (!tr.docChanged) return;
    editor.view.dispatch(tr);
    editor.view.focus();
  }

  function setWidths(next: number[] | null) {
    editor
      .chain()
      .focus()
      .updateAttributes(COLUMNS_NODE_NAME, { widths: next })
      .run();
  }

  function toggleCustomWidths(checked: boolean) {
    if (!checked) {
      setWidths(null);
      return;
    }
    // Seed with equal proportions when enabling so the user has
    // sensible starting values to tweak (rather than empty inputs).
    const seed = Array.from({ length: currentCols }, () =>
      Math.round((100 / currentCols) * 100) / 100,
    );
    setWidths(seed);
  }

  function setSingleWidth(index: number, value: number) {
    const safe = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
    const base = widths && widths.length === currentCols
      ? [...widths]
      : Array.from({ length: currentCols }, () => 100 / currentCols);
    base[index] = safe;
    setWidths(base);
  }

  // Inputs are driven by the live attr — fall back to equal split
  // when widths is null/undefined so the values displayed match
  // what the layout would render.
  const displayedWidths =
    widths && widths.length === currentCols
      ? widths
      : Array.from({ length: currentCols }, () =>
          Math.round((100 / currentCols) * 100) / 100,
        );

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

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={customEnabled}
          onChange={(e) => toggleCustomWidths(e.target.checked)}
        />
        <span>{t("blocks.columns.customWidths")}</span>
      </label>

      {customEnabled && (
        <div className="space-y-2">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${currentCols}, 1fr)` }}>
            {displayedWidths.map((value, index) => (
              <div key={index}>
                <label className="label text-[11px]">
                  {t("blocks.columns.colN", { n: index + 1 })}
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  className="input"
                  value={value}
                  onChange={(e) => setSingleWidth(index, Number.parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {t("blocks.columns.widthsHelp")}
          </p>
          <button type="button" className="btn-ghost text-xs" onClick={() => setWidths(null)}>
            {t("blocks.columns.resetWidths")}
          </button>
        </div>
      )}
    </div>
  );
}
