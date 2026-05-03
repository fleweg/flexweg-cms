import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { EmbedNodeView } from "./EmbedNodeView";
import type { EmbedProvider } from "./providers";

// Node names follow the convention `embed<Provider>` — camelCased so
// they're valid Tiptap names and predictable to look up via
// editor.getAttributes(). The factory returns one Node per provider;
// the manifest registers all four into the editor's extension list.

function nodeNameFor(providerId: string): string {
  return `embed${providerId.charAt(0).toUpperCase()}${providerId.slice(1)}`;
}

export function embedNodeName(providerId: string): string {
  return nodeNameFor(providerId);
}

// Builds a Tiptap atom node that round-trips through markdown as a
// `<div data-cms-embed="<id>" data-id="<id>">` marker. The editor
// renders an iframe preview via the React NodeView; the publish-time
// post.html.body filter replaces the marker with the provider's
// renderHtml output.
export function createEmbedNode(provider: EmbedProvider) {
  return Node.create({
    name: nodeNameFor(provider.providerId),
    group: "block",
    atom: true,
    selectable: true,
    draggable: true,

    addAttributes() {
      return {
        // Public URL the user pasted. Kept around so the inspector can
        // surface the original input even after the parsed id is also
        // stored. Optional in the marker (re-derivable from `id`).
        url: { default: "" },
        // Provider-specific identifier extracted from `url` —
        // see provider.parseUrl for shape.
        id: { default: "" },
      };
    },

    parseHTML() {
      return [
        {
          tag: `div[data-cms-embed="${provider.providerId}"]`,
          getAttrs: (el) => {
            if (typeof el === "string") return null;
            const node = el as HTMLElement;
            return {
              url: node.getAttribute("data-url") ?? "",
              id: node.getAttribute("data-id") ?? "",
            };
          },
        },
      ];
    },

    renderHTML({ HTMLAttributes, node }) {
      return [
        "div",
        mergeAttributes(HTMLAttributes, {
          "data-cms-embed": provider.providerId,
          "data-id": node.attrs.id,
          "data-url": node.attrs.url,
        }),
      ];
    },

    addNodeView() {
      return ReactNodeViewRenderer((props: NodeViewProps) => (
        <EmbedNodeView {...props} provider={provider} />
      ));
    },
  });
}
