import type { ReactNode } from "react";

interface EditorTopbarProps {
  left: ReactNode;
  right: ReactNode;
}

// Sticky command bar above the post/page canvas. Sits right under the
// global app Topbar (which is sticky at top:0, h-14) and groups the
// editor's contextual actions (back, status, save, publish, delete).
//
// The component is meant to render directly inside <main>, NOT inside
// a padded wrapper — its own inner div carries the horizontal/vertical
// padding so it stays flush with the global Topbar in both static and
// scrolled states.
//
// The component is intentionally minimal — pages compose their own
// button stacks and pass them in as `left` / `right` ReactNodes.
export function EditorTopbar({ left, right }: EditorTopbarProps) {
  return (
    <div className="sticky z-20 border-b border-surface-200 bg-white/95 backdrop-blur dark:border-surface-700 dark:bg-surface-900/95">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-2.5">
        <div className="flex items-center gap-3 min-w-0">{left}</div>
        <div className="flex items-center gap-2 shrink-0">{right}</div>
      </div>
    </div>
  );
}
