import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react";
import type { Editor } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import type { Node as PMNode } from "@tiptap/pm/model";

interface BlockToolbarProps {
  editor: Editor | null;
  // The element relative to which the toolbar should be absolutely
  // positioned. Typically the same wrapper that contains
  // <EditorContent />. Falls back to editor.view.dom's parent if not
  // provided, which works for the default MarkdownEditor layout.
  containerRef?: React.RefObject<HTMLElement>;
}

interface ToolbarPos {
  top: number;
  right: number;
}

// Small floating toolbar pinned to the top-right of the active
// top-level block. Mirrors WordPress / Gutenberg's "block toolbar" but
// trimmed to four canonical actions: move up, move down, duplicate,
// delete. Drag-to-reorder is intentionally out of scope for this pass
// — the buttons cover the same UX with simpler plumbing.
//
// Position update strategy: subscribe to Tiptap's selection-update
// and transaction events plus the focus / blur events. Geometry is
// computed by `getBoundingClientRect()` on the active block's DOM
// node (resolved via `editor.view.nodeDOM(pos)`) and offset against
// the container's own rect — the toolbar lives inside the same
// relatively-positioned wrapper so scrolling the page or resizing the
// inspector keeps everything aligned for free.
export function BlockToolbar({ editor, containerRef: providedRef }: BlockToolbarProps) {
  const { t } = useTranslation();
  const [pos, setPos] = useState<ToolbarPos | null>(null);
  const fallbackRef = useRef<HTMLElement | null>(null);

  // Resolve the layout container once Tiptap has mounted. The
  // ProseMirror view's DOM is wrapped twice: <div class="prose-editor">
  // sits inside <EditorContent>'s host element, which sits inside the
  // MarkdownEditor's outer relative wrapper. Two parents up gets us to
  // that wrapper.
  useEffect(() => {
    if (providedRef?.current) {
      fallbackRef.current = providedRef.current;
      return;
    }
    if (!editor) return;
    fallbackRef.current = editor.view.dom.parentElement?.parentElement ?? null;
  }, [editor, providedRef]);

  // Recompute the position synchronously after every render so the
  // toolbar tracks the active block during typing without a frame of
  // misalignment. useLayoutEffect (vs useEffect) ensures the read of
  // getBoundingClientRect happens after the browser laid out the new
  // content but before the user can perceive a flicker.
  useLayoutEffect(() => {
    if (!editor) return;

    const recompute = () => {
      const blockInfo = findActiveBlock(editor);
      const container = providedRef?.current ?? fallbackRef.current;
      if (!blockInfo || !container) {
        setPos(null);
        return;
      }
      const dom = editor.view.nodeDOM(blockInfo.pos);
      if (!(dom instanceof HTMLElement)) {
        setPos(null);
        return;
      }
      const blockRect = dom.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPos({
        top: blockRect.top - containerRect.top - 32,
        right: containerRect.right - blockRect.right,
      });
    };

    const onBlur = () => setPos(null);

    editor.on("selectionUpdate", recompute);
    editor.on("transaction", recompute);
    editor.on("focus", recompute);
    editor.on("blur", onBlur);
    window.addEventListener("resize", recompute);
    recompute();

    return () => {
      editor.off("selectionUpdate", recompute);
      editor.off("transaction", recompute);
      editor.off("focus", recompute);
      editor.off("blur", onBlur);
      window.removeEventListener("resize", recompute);
    };
  }, [editor, providedRef]);

  if (!editor || !pos) return null;

  return (
    <div
      // mousedown.preventDefault stops the click from blurring the
      // editor (which would otherwise hide the toolbar mid-click and
      // race with the command's dispatch).
      onMouseDown={(e) => e.preventDefault()}
      style={{ position: "absolute", top: pos.top, right: pos.right, zIndex: 20 }}
      className="flex items-center gap-0.5 rounded-md border border-surface-200 bg-white p-0.5 shadow-md dark:border-surface-700 dark:bg-surface-900"
    >
      <ToolbarBtn
        onClick={() => moveBlock(editor, "up")}
        ariaLabel={t("posts.edit.blocks.moveUp")}
        Icon={ChevronUp}
      />
      <ToolbarBtn
        onClick={() => moveBlock(editor, "down")}
        ariaLabel={t("posts.edit.blocks.moveDown")}
        Icon={ChevronDown}
      />
      <ToolbarBtn
        onClick={() => duplicateBlock(editor)}
        ariaLabel={t("posts.edit.blocks.duplicate")}
        Icon={Copy}
      />
      <ToolbarBtn
        onClick={() => deleteBlock(editor)}
        ariaLabel={t("posts.edit.blocks.remove")}
        Icon={Trash2}
        danger
      />
    </div>
  );
}

function ToolbarBtn({
  onClick,
  ariaLabel,
  Icon,
  danger,
}: {
  onClick: () => void;
  ariaLabel: string;
  Icon: typeof ChevronUp;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={ariaLabel}
      aria-label={ariaLabel}
      onClick={onClick}
      className={
        "p-1 rounded transition-colors " +
        (danger
          ? "text-surface-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50")
      }
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

interface ActiveBlockInfo {
  node: PMNode;
  pos: number; // Position immediately before the block
}

// Locates the top-level block that contains the current selection.
// Top-level = direct child of the doc node (depth 1 from doc's
// perspective). Three cases handled:
//   1. NodeSelection on a top-level block → that block.
//   2. TextSelection inside a top-level text block → its container.
//   3. TextSelection nested deeper (e.g. list item) → the depth-1
//      ancestor (the bulletList / orderedList wrapping the item).
// In case 3 the move buttons reorder the entire list, not individual
// items. Per-item moves are a future refinement.
function findActiveBlock(editor: Editor): ActiveBlockInfo | null {
  const { selection } = editor.state;
  const { $from } = selection;
  if (selection instanceof NodeSelection && $from.depth === 0) {
    return { node: selection.node, pos: $from.pos };
  }
  if ($from.depth >= 1) {
    return { node: $from.node(1), pos: $from.before(1) };
  }
  return null;
}

// Swaps the active top-level block with its sibling in the requested
// direction. Returns false (and does nothing) when the block is
// already at the boundary.
function moveBlock(editor: Editor, direction: "up" | "down"): boolean {
  const { state } = editor;
  const info = findActiveBlock(editor);
  if (!info) return false;
  const { doc } = state;
  const $blockPos = doc.resolve(info.pos);
  const idx = $blockPos.index(0);
  if (direction === "up" && idx === 0) return false;
  if (direction === "down" && idx >= doc.childCount - 1) return false;

  const tr = state.tr;
  // Snapshot the block before the deletion shifts positions.
  const blockNode = info.node;
  tr.delete(info.pos, info.pos + blockNode.nodeSize);

  // After deletion, the original positions are unchanged for content
  // BEFORE the deleted range. Compute the insertion point relative to
  // this shifted document.
  let insertPos: number;
  if (direction === "up") {
    const prev = doc.child(idx - 1);
    insertPos = info.pos - prev.nodeSize;
  } else {
    const next = doc.child(idx + 1);
    // Original next sibling was at info.pos + blockNode.nodeSize.
    // After delete it shifted left by blockNode.nodeSize → now at
    // info.pos. We want to insert AFTER it: + next.nodeSize.
    insertPos = info.pos + next.nodeSize;
  }

  tr.insert(insertPos, blockNode);
  // Restore selection on the moved block as a NodeSelection where
  // possible — keeps the toolbar visible on the same block.
  try {
    tr.setSelection(NodeSelection.create(tr.doc, insertPos));
  } catch {
    // Some leaf-only nodes (text containers) reject NodeSelection at
    // their position — leave the selection at whatever ProseMirror
    // mapped it to.
  }

  editor.view.dispatch(tr);
  editor.view.focus();
  return true;
}

// Inserts a copy of the active block right after itself. Uses
// node.copy(content) to clone — re-uses fragments where possible,
// preserving attrs (essential for embed blocks where attrs encode the
// URL / id).
function duplicateBlock(editor: Editor): boolean {
  const { state } = editor;
  const info = findActiveBlock(editor);
  if (!info) return false;

  const tr = state.tr;
  const insertPos = info.pos + info.node.nodeSize;
  const clone = info.node.copy(info.node.content);
  tr.insert(insertPos, clone);
  try {
    tr.setSelection(NodeSelection.create(tr.doc, insertPos));
  } catch {
    /* see moveBlock */
  }

  editor.view.dispatch(tr);
  editor.view.focus();
  return true;
}

// Removes the active top-level block. Refuses to delete when the doc
// would be left empty — ProseMirror requires at least one block, and
// silently re-inserting an empty paragraph would be more confusing
// than the noop.
function deleteBlock(editor: Editor): boolean {
  const { state } = editor;
  const info = findActiveBlock(editor);
  if (!info) return false;
  if (state.doc.childCount <= 1) return false;

  const tr = state.tr;
  tr.delete(info.pos, info.pos + info.node.nodeSize);
  editor.view.dispatch(tr);
  editor.view.focus();
  return true;
}
