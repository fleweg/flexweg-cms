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

    // Per-attribute parseHTML/renderHTML pin each Tiptap attr to its
    // own `data-*` counterpart. Without these overrides Tiptap's
    // default mapper would also emit attrs named `id="..."` /
    // `url="..."`, where the former collides with HTML's native `id`
    // attribute and the latter is meaningless on a <div>. The collision
    // caused round-tripped nodes to come back with a non-string `id`
    // (the DOM element's id property leaked into node.attrs.id),
    // crashing renderEditorPreview.
    addAttributes() {
      return {
        url: {
          default: "",
          // Fall back to `url` for posts saved by the buggy initial
          // version of this plugin (which let Tiptap auto-emit `url`
          // as a plain HTML attribute alongside the data-* version).
          parseHTML: (el: HTMLElement) =>
            el.getAttribute("data-url") ?? el.getAttribute("url") ?? "",
          renderHTML: (attrs: Record<string, unknown>) =>
            attrs.url ? { "data-url": String(attrs.url) } : {},
        },
        id: {
          default: "",
          // Same fallback story for `id`. Reading the legacy plain
          // attribute is scoped to divs already matched by the
          // rule-level selector, so no collision with arbitrary HTML
          // ids elsewhere in the document.
          parseHTML: (el: HTMLElement) =>
            el.getAttribute("data-id") ?? el.getAttribute("id") ?? "",
          renderHTML: (attrs: Record<string, unknown>) =>
            attrs.id ? { "data-id": String(attrs.id) } : {},
        },
      };
    },

    parseHTML() {
      return [{ tag: `div[data-cms-embed="${provider.providerId}"]` }];
    },

    renderHTML({ HTMLAttributes }) {
      // The per-attribute renderHTML callbacks above already merged
      // `data-id` / `data-url` into HTMLAttributes; we only need to
      // tag the marker with the provider id here.
      return [
        "div",
        mergeAttributes(HTMLAttributes, { "data-cms-embed": provider.providerId }),
      ];
    },

    addNodeView() {
      return ReactNodeViewRenderer((props: NodeViewProps) => (
        <EmbedNodeView {...props} provider={provider} />
      ));
    },
  });
}
