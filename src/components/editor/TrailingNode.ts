import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

// Tiptap extension that guarantees the document always ends with an
// empty paragraph. Solves the dead-end UX of atom blocks (product-info,
// hero overlay, embeds, …) — without it, when an atom node is the
// last child of the doc the user has to click on it and press Enter
// to get a paragraph below where they can type. With it, the trailing
// paragraph appears automatically, the cursor can land there, and the
// FloatingMenu's "+" inserter is one click away.
//
// Implementation: appendTransaction watches every doc state and adds
// a paragraph to the end whenever the last child isn't a paragraph.
// Once the user types into that paragraph it stays (it's still a
// paragraph), so we don't keep appending — the rule fires only when
// the tail is something else (atom node, image, etc.).
export const TrailingNode = Extension.create({
  name: "trailingNode",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("trailingNode"),
        appendTransaction(_transactions, _oldState, newState) {
          const { doc, schema, tr } = newState;
          const lastChild = doc.lastChild;
          if (!lastChild) return null;
          if (lastChild.type.name === "paragraph") return null;
          const paragraph = schema.nodes.paragraph?.create();
          if (!paragraph) return null;
          return tr.insert(doc.content.size, paragraph);
        },
      }),
    ];
  },
});
