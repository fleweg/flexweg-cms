import { FileCode2 } from "lucide-react";
import type { BlockManifest } from "../../../core/blockRegistry";
import { HTML_BLOCK_ID, HTML_NODE_NAME, HtmlBlock } from "./extension";
import { HtmlInspector } from "./inspector";

// Block-registry manifest for the Custom HTML block. Inserts an
// empty atom — the user fills in the code via the textarea in the
// inspector (right sidebar Block tab). The inline NodeView shows
// a sandboxed iframe preview so the user can still see what their
// code looks like without leaving the canvas.
//
// Category is "layout" (same as the other blocks in this plugin)
// so it groups with Columns in the editor's inserter.
export const htmlBlock: BlockManifest = {
  id: HTML_BLOCK_ID,
  nodeName: HTML_NODE_NAME,
  titleKey: "blocks.html.title",
  namespace: "flexweg-blocks",
  icon: FileCode2,
  category: "layout",
  extensions: [HtmlBlock],
  insert: (chain) => {
    chain.focus().insertContent({ type: HTML_NODE_NAME, attrs: { code: "" } }).run();
  },
  isActive: (editor) => editor.isActive(HTML_NODE_NAME),
  inspector: (props) => <HtmlInspector editor={props.editor} />,
};
