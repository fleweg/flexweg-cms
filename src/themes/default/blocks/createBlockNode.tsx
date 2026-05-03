import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type { ComponentType } from "react";
import { THEME_BLOCK_NAMESPACE, decodeAttrs, encodeAttrs, nodeNameFor } from "./util";

interface CreateBlockNodeOptions<TAttrs> {
  // Sub-id under the theme namespace, e.g. "hero", "posts-list".
  // The full block id is `default/<subId>`. Tiptap node name is
  // `block<PascalCase>`.
  subId: string;
  // Default attrs surfaced when a fresh block is inserted. The
  // inspector / NodeView should treat missing fields as defaults.
  defaultAttrs: TAttrs;
  // React component rendered inside the editor for this block.
  // Receives the decoded attrs + an updater that re-encodes and
  // commits via Tiptap's updateAttributes.
  view: ComponentType<{
    attrs: TAttrs;
    updateAttrs: (next: Partial<TAttrs>) => void;
    selected: boolean;
  }>;
}

// Builds a Tiptap atom node tied to the default theme's home blocks.
// Stores the block's attrs as a single base64-JSON `data-attrs` so
// schemas can evolve without DOM-level migrations. Round-trips via
// markdown thanks to tiptap-markdown `html: true` (set globally in
// MarkdownEditor) plus our parseHTML rule on the marker div.
//
// Using the full block id (`default/hero`) as the marker's
// `data-cms-block` value keeps the publisher's regex simple and
// scoped to theme blocks only.
export function createBlockNode<TAttrs extends object>({
  subId,
  defaultAttrs,
  view: View,
}: CreateBlockNodeOptions<TAttrs>) {
  const blockId = `${THEME_BLOCK_NAMESPACE}/${subId}`;
  const tiptapName = nodeNameFor(subId.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase()));

  return Node.create({
    name: tiptapName,
    group: "block",
    atom: true,
    selectable: true,
    draggable: true,

    addAttributes() {
      return {
        attrs: {
          // The actual JSON object — serialized to base64 only when
          // we cross into the DOM. Keeps consumers (NodeView,
          // inspector) free to read/write rich JS values.
          default: defaultAttrs,
          parseHTML: (el: HTMLElement) =>
            decodeAttrs<TAttrs>(el.getAttribute("data-attrs") ?? "", defaultAttrs),
          renderHTML: (attrs: { attrs?: TAttrs }) => ({
            "data-attrs": encodeAttrs(attrs.attrs ?? defaultAttrs),
          }),
        },
      };
    },

    parseHTML() {
      return [{ tag: `div[data-cms-block="${blockId}"]` }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "div",
        mergeAttributes(HTMLAttributes, { "data-cms-block": blockId }),
      ];
    },

    addNodeView() {
      return ReactNodeViewRenderer((props: NodeViewProps) => {
        const attrs = (props.node.attrs.attrs as TAttrs) ?? defaultAttrs;
        const updateAttrs = (patch: Partial<TAttrs>) => {
          props.updateAttributes({ attrs: { ...attrs, ...patch } });
        };
        return <View attrs={attrs} updateAttrs={updateAttrs} selected={props.selected} />;
      });
    },
  });
}

// Convenience export — the matching nodeName helper, so manifests
// can reference `editor.isActive(<name>)` inside their `isActive`
// predicate without re-deriving.
export function blockNodeName(subId: string): string {
  return nodeNameFor(subId.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase()));
}
