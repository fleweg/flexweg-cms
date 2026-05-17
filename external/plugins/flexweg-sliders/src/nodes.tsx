// Tiptap node factory — one Node per slider kind. Each node:
//   - parses from `<div data-cms-block="flexweg-sliders/<kind>"
//     data-attrs="<base64>"></div>` (the marker that round-trips
//     through markdown via tiptap-markdown's html: true config on
//     the admin's editor)
//   - renders back to the same marker via renderHTML (so saved
//     content keeps a single canonical shape)
//   - mounts a NodeView so the editor preview matches the published
//     output (rendered HTML + a thin selection chrome)

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { encodeAttrs, decodeAttrs } from "./codec";
import { PLUGIN_ID, SLIDERS, type SliderAttrs, type SliderDef, type SliderKind } from "./sliders";
import { SliderNodeView } from "./SliderNodeView";

// Camel-case node name so Tiptap accepts it and lookups like
// editor.getAttributes(name) are predictable.
export function sliderNodeName(kind: SliderKind): string {
  const cap = kind.charAt(0).toUpperCase() + kind.slice(1);
  return `flexwegSlider${cap}`;
}

export function createSliderNode(def: SliderDef) {
  const blockId = def.id;
  const name = sliderNodeName(def.kind);

  return Node.create({
    name,
    group: "block",
    atom: true,
    selectable: true,
    draggable: true,

    addAttributes() {
      return {
        attrs: {
          default: def.defaults,
          parseHTML: (el: HTMLElement) =>
            decodeAttrs<SliderAttrs>(el.getAttribute("data-attrs") ?? "", def.defaults),
          renderHTML: (a: { attrs?: SliderAttrs }) => ({
            "data-attrs": encodeAttrs(a.attrs ?? def.defaults),
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
        const attrs = (props.node.attrs.attrs as SliderAttrs) ?? def.defaults;
        const updateAttrs = (patch: Partial<SliderAttrs>) => {
          props.updateAttributes({ attrs: { ...attrs, ...patch } as SliderAttrs });
        };
        return (
          <SliderNodeView
            kind={def.kind}
            attrs={attrs}
            updateAttrs={updateAttrs}
            selected={props.selected}
          />
        );
      });
    },
  });
}

export { PLUGIN_ID, SLIDERS };
