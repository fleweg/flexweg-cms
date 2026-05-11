import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type { ComponentType } from "react";
import { THEME_BLOCK_NAMESPACE, decodeAttrs, encodeAttrs, nodeNameFor } from "./util";

interface CreateBlockNodeOptions<TAttrs> {
  // Sub-id under the theme namespace, e.g. "product-info". The full
  // block id is `storefront/<subId>`. Tiptap node name resolved via
  // `nodeNameFor()`.
  subId: string;
  defaultAttrs: TAttrs;
  view: ComponentType<{
    attrs: TAttrs;
    updateAttrs: (next: Partial<TAttrs>) => void;
    selected: boolean;
  }>;
}

// Builds a Tiptap atom node tied to a storefront theme block. Mirrors
// the corporate / magazine helpers — identical implementation,
// storefront namespace.
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

export function blockNodeName(subId: string): string {
  return nodeNameFor(subId.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase()));
}
