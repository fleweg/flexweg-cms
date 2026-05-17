import { Extension } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import {
  listBlocks,
  type BlockInsertContext,
  type BlockManifest,
} from "../../core/blockRegistry";
import i18n from "../../i18n";
import {
  SlashCommandList,
  type SlashCommandListHandle,
  type SlashCommandListProps,
} from "./SlashCommandList";

// Slash-command Tiptap extension — Notion-style block picker. Typing
// `/` anywhere in the editor opens a floating menu near the cursor;
// keep typing to filter, ↑/↓ to navigate, Enter/click to insert, Esc
// to dismiss.
//
// The popover is a React component (SlashCommandList) mounted through
// Tiptap's ReactRenderer. We position it manually via inline styles
// using the clientRect helper that the Suggestion plugin provides —
// avoids pulling in tippy.js or another positioning lib.

interface SlashCommandStorage {
  // Callback supplied by the host editor (MarkdownEditor) at mount
  // time. Mirrors the FloatingMenu's onPickMedia plumbing so blocks
  // that need to await a media picker (e.g. core/image) still work
  // when inserted via the slash command.
  pickMedia?: () => Promise<{ url: string; alt?: string } | null>;
}

export interface SlashCommandOptions {
  // Pluggable media picker handed to BlockManifest.insert via the
  // BlockInsertContext. Optional — blocks that don't need a picker
  // ignore it.
  pickMedia?: () => Promise<{ url: string; alt?: string } | null>;
}

interface SuggestionItemProps {
  manifest: BlockManifest;
}

// Resolves a manifest's display label in the active locale, using the
// block's declared i18n namespace when present. Mirrors the helper
// defined inline inside MarkdownEditor.tsx so the slash list shows
// the exact same wording as the `+` FloatingMenu.
function resolveLabel(manifest: BlockManifest): string {
  if (manifest.namespace) {
    return i18n.t(manifest.titleKey, { ns: manifest.namespace });
  }
  return i18n.t(manifest.titleKey);
}

// Filters the block list by the user's query. Matches against both
// the localised label AND the manifest id, so power users can hop to
// `/flexweg-embeds/youtube` without depending on translations.
function filterBlocks(query: string): BlockManifest[] {
  const all = listBlocks();
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter((manifest) => {
    const label = resolveLabel(manifest).toLowerCase();
    return label.includes(q) || manifest.id.toLowerCase().includes(q);
  });
}

export const SlashCommand = Extension.create<SlashCommandOptions, SlashCommandStorage>({
  name: "slashCommand",

  addOptions() {
    return {
      pickMedia: undefined,
    };
  },

  addStorage() {
    return {
      pickMedia: undefined,
    };
  },

  onCreate() {
    // Mirror options into storage so the suggestion command callback
    // (which closes over `this.editor` only) can still read the
    // current pickMedia — the host MarkdownEditor updates it via the
    // setPickMedia helper below when the prop changes.
    this.storage.pickMedia = this.options.pickMedia;
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    const extensionThis = this;

    const suggestionOptions: Omit<SuggestionOptions<SuggestionItemProps>, "editor"> = {
      char: "/",
      // allowSpaces=false so typing a space after `/` immediately
      // dismisses the popover — matches Notion's behaviour and
      // matches how users tend to think about the trigger ("/" is
      // a control char, a space ends it).
      allowSpaces: false,
      // Require the trigger to be at the start of a node OR right
      // after whitespace — typing `https://` in a link shouldn't
      // pop the menu open. Default Suggestion behaviour already
      // matches this via the startOfLine + prefix check.
      startOfLine: false,

      items: ({ query }) =>
        filterBlocks(query).map((manifest) => ({ manifest })),

      // Called when the user picks an item via Enter or click. Tiptap
      // hands us the range covering the `/` + query the user typed;
      // we delete it first so the inserted block doesn't carry the
      // residual text, then run the block's standard insert helper.
      command: ({ editor, range, props }) => {
        const { manifest } = props;
        editor.chain().focus().deleteRange(range).run();
        const ctx: BlockInsertContext = {
          pickMedia: extensionThis.storage.pickMedia,
        };
        // BlockManifest.insert can be sync or return a Promise (the
        // image block awaits the media picker). We don't await here
        // — the editor remains usable while the picker is open and
        // the block resolves into the doc when the promise settles.
        void manifest.insert(editor.chain(), ctx);
      },

      // ReactRenderer wraps the React component so we can manage its
      // lifecycle from inside a vanilla ProseMirror plugin. updateProps
      // re-renders with new items / query as the user types.
      render: () => {
        let component: ReactRenderer<SlashCommandListHandle, SlashCommandListProps> | null = null;
        let popover: HTMLDivElement | null = null;

        function position(clientRect: (() => DOMRect | null) | null | undefined) {
          if (!popover || !clientRect) return;
          const rect = clientRect();
          if (!rect) return;
          // Position the popover BELOW the cursor by default; flip
          // above if it would overflow the viewport. Use fixed
          // positioning so scrolling the editor doesn't drift it.
          const margin = 6;
          const popHeight = popover.offsetHeight || 300;
          const popWidth = popover.offsetWidth || 288;
          let top = rect.bottom + margin;
          if (top + popHeight > window.innerHeight - 8) {
            top = Math.max(8, rect.top - popHeight - margin);
          }
          let left = rect.left;
          if (left + popWidth > window.innerWidth - 8) {
            left = Math.max(8, window.innerWidth - popWidth - 8);
          }
          popover.style.position = "fixed";
          popover.style.top = `${top}px`;
          popover.style.left = `${left}px`;
          popover.style.zIndex = "60";
        }

        return {
          onStart: (props) => {
            component = new ReactRenderer(SlashCommandList, {
              props: {
                items: props.items.map((p) => p.manifest),
                command: (manifest: BlockManifest) =>
                  props.command({ manifest }),
                grouped: !props.query,
                resolveLabel,
              },
              editor,
            });
            popover = document.createElement("div");
            popover.appendChild(component.element);
            document.body.appendChild(popover);
            // Wait one frame so the popover has dimensions before we
            // position it — otherwise offsetHeight is 0 and the
            // viewport-flip math is wrong on the first frame.
            requestAnimationFrame(() => position(props.clientRect));
          },

          onUpdate: (props) => {
            if (!component) return;
            component.updateProps({
              items: props.items.map((p) => p.manifest),
              command: (manifest: BlockManifest) =>
                props.command({ manifest }),
              grouped: !props.query,
              resolveLabel,
            });
            requestAnimationFrame(() => position(props.clientRect));
          },

          onKeyDown: (props) => {
            if (props.event.key === "Escape") {
              // Let the suggestion plugin handle cleanup; our
              // onExit will fire next.
              return false;
            }
            return component?.ref?.onKeyDown(props.event as never) ?? false;
          },

          onExit: () => {
            if (popover && popover.parentNode) {
              popover.parentNode.removeChild(popover);
            }
            component?.destroy();
            component = null;
            popover = null;
          },
        };
      },
    };

    return [Suggestion({ editor, ...suggestionOptions })];
  },
});

// Sets the pickMedia callback on a mounted editor's slash-command
// storage. Lets MarkdownEditor wire its onPickMedia prop without
// having to recreate the editor when the callback identity changes.
export function setSlashCommandPickMedia(
  editor: Editor,
  pickMedia: SlashCommandStorage["pickMedia"],
): void {
  const storage = editor.storage.slashCommand as SlashCommandStorage | undefined;
  if (storage) storage.pickMedia = pickMedia;
}
