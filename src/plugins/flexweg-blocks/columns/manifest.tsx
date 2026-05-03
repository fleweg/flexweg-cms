import { Columns3 } from "lucide-react";
import type { BlockManifest } from "../../../core/blockRegistry";
import {
  Column,
  COLUMNS_NODE_NAME,
  ColumnsContainer,
  DEFAULT_COLS,
} from "./extension";
import { ColumnsInspector } from "./inspector";

const PLUGIN_ID = "flexweg-blocks";
const SUB_ID = "columns";

// Block-registry manifest for the Columns block. Both the
// ColumnsContainer and Column Tiptap nodes ship in the `extensions`
// array so the editor's schema is complete the moment the plugin is
// enabled — registering only the container would leave the schema
// inconsistent (column type referenced but not defined) and crash on
// first use.
//
// The `insert` callback creates a 2-column layout with each column
// pre-seeded with an empty paragraph. Without that paragraph the
// `block+` content constraint on Column would reject the empty
// node, and the user would be stuck with no caret position to start
// typing.
export const columnsBlock: BlockManifest = {
  id: `${PLUGIN_ID}/${SUB_ID}`,
  nodeName: COLUMNS_NODE_NAME,
  titleKey: "blocks.columns.title",
  namespace: PLUGIN_ID,
  icon: Columns3,
  category: "layout",
  extensions: [ColumnsContainer, Column],
  insert: (chain) => {
    chain
      .focus()
      .insertContent({
        type: COLUMNS_NODE_NAME,
        attrs: { cols: DEFAULT_COLS },
        content: Array.from({ length: DEFAULT_COLS }, () => ({
          type: "column",
          content: [{ type: "paragraph" }],
        })),
      })
      .run();
  },
  isActive: (editor) => editor.isActive(COLUMNS_NODE_NAME),
  inspector: (props) => <ColumnsInspector editor={props.editor} />,
};
