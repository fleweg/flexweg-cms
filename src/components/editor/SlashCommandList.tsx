import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import type { BlockCategory, BlockManifest } from "../../core/blockRegistry";

// Notion-style popover rendered by the SlashCommand extension when the
// user types `/` inside the editor. Receives the filtered list of
// block manifests + a `command` callback the extension hands us — we
// invoke it with the picked manifest to trigger insertion.
//
// Exposed through forwardRef so the extension can forward keyboard
// events (↑/↓/Enter/Esc) into `onKeyDown` without React having to be
// aware of the underlying ProseMirror plugin.

export interface SlashCommandListProps {
  items: BlockManifest[];
  // Called by the parent extension when the user picks an item via
  // click OR Enter. The extension's `command` callback handles the
  // text-range deletion + the actual manifest.insert(...) call.
  command: (manifest: BlockManifest) => void;
  // Optional groupings: when the query is empty we show items grouped
  // by category; when filtered we show a flat list (faster to scan).
  grouped: boolean;
  // Translation namespace resolution helper, supplied by the extension
  // so it can reuse the editor's i18n instance. Returns the resolved
  // label for the manifest in the active locale.
  resolveLabel: (manifest: BlockManifest) => string;
}

export interface SlashCommandListHandle {
  // Returns true when the event was consumed by the popover (the
  // editor must NOT also handle it — e.g. Enter inserting a
  // paragraph instead of picking the highlighted item).
  onKeyDown: (event: KeyboardEvent) => boolean;
}

const CATEGORY_ORDER: BlockCategory[] = [
  "text",
  "media",
  "layout",
  "embed",
  "advanced",
];

export const SlashCommandList = forwardRef<
  SlashCommandListHandle,
  SlashCommandListProps
>(function SlashCommandList(props, ref) {
  const { items, command, grouped, resolveLabel } = props;
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const itemsRef = useRef<HTMLDivElement | null>(null);

  // Reset the highlight whenever the item list changes — typically
  // when the user types another character and the filter rebuilds.
  // Keeping a stale index would let Enter pick a different item than
  // the one visually highlighted.
  useEffect(() => {
    setSelected(0);
  }, [items]);

  // Scroll the highlighted item into view when navigating with the
  // keyboard so the popover behaves like a native menu.
  useEffect(() => {
    if (!itemsRef.current) return;
    const el = itemsRef.current.querySelector<HTMLButtonElement>(
      `[data-slash-index="${selected}"]`,
    );
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selected]);

  function pick(index: number) {
    const manifest = items[index];
    if (manifest) command(manifest);
  }

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown(event) {
        if (event.key === "ArrowDown") {
          setSelected((i) => (items.length === 0 ? 0 : (i + 1) % items.length));
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelected((i) =>
            items.length === 0 ? 0 : (i - 1 + items.length) % items.length,
          );
          return true;
        }
        if (event.key === "Enter") {
          if (items.length === 0) return true;
          pick(selected);
          return true;
        }
        return false;
      },
    }),
    [items, selected],
  );

  if (items.length === 0) {
    return (
      <div className="w-72 rounded-lg border border-surface-200 bg-white p-3 text-sm text-surface-500 shadow-lg dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400">
        {t("posts.edit.blocks.slash.noResults")}
      </div>
    );
  }

  if (!grouped) {
    return (
      <div
        ref={itemsRef}
        className="max-h-80 w-72 overflow-y-auto rounded-lg border border-surface-200 bg-white p-1 shadow-lg dark:border-surface-700 dark:bg-surface-900"
      >
        {items.map((manifest, index) => (
          <Row
            key={manifest.id}
            manifest={manifest}
            label={resolveLabel(manifest)}
            active={index === selected}
            index={index}
            onMouseEnter={() => setSelected(index)}
            onClick={() => pick(index)}
          />
        ))}
      </div>
    );
  }

  // Grouped view (when no query is active): preserve registration order
  // inside each category bucket; cycle through categories in the
  // canonical order, with unknown categories tacked on at the end.
  const buckets = new Map<BlockCategory, { manifest: BlockManifest; index: number }[]>();
  items.forEach((manifest, index) => {
    const list = buckets.get(manifest.category) ?? [];
    list.push({ manifest, index });
    buckets.set(manifest.category, list);
  });
  const orderedKnown = CATEGORY_ORDER.filter((c) => buckets.has(c));
  const orderedRest = Array.from(buckets.keys()).filter(
    (c) => !CATEGORY_ORDER.includes(c),
  );
  const order = [...orderedKnown, ...orderedRest];

  return (
    <div
      ref={itemsRef}
      className="max-h-80 w-72 overflow-y-auto rounded-lg border border-surface-200 bg-white p-1 shadow-lg dark:border-surface-700 dark:bg-surface-900"
    >
      {order.map((category) => (
        <div key={category} className="py-1">
          <p className="px-2 pb-1 text-[10px] uppercase tracking-wide font-semibold text-surface-400 dark:text-surface-500">
            {t(`posts.edit.blocks.categories.${category}`, {
              defaultValue: category,
            })}
          </p>
          {buckets.get(category)?.map(({ manifest, index }) => (
            <Row
              key={manifest.id}
              manifest={manifest}
              label={resolveLabel(manifest)}
              active={index === selected}
              index={index}
              onMouseEnter={() => setSelected(index)}
              onClick={() => pick(index)}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

interface RowProps {
  manifest: BlockManifest;
  label: string;
  active: boolean;
  index: number;
  onMouseEnter: () => void;
  onClick: () => void;
}

function Row({ manifest, label, active, index, onMouseEnter, onClick }: RowProps) {
  const Icon = manifest.icon;
  return (
    <button
      type="button"
      data-slash-index={index}
      // mousedown.preventDefault so the editor doesn't blur before the
      // click handler fires — without this Enter and Click work but
      // the editor selection bounces to the popover container.
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors " +
        (active
          ? "bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-50"
          : "text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800 dark:hover:text-surface-50")
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}
