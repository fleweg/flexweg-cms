import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { FileCode2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";

export const HTML_NODE_NAME = "flexwegHtmlBlock";
export const HTML_BLOCK_ID = "flexweg-blocks/html";

// Encodes / decodes the block's `code` attr. Stored base64-JSON in
// `data-attrs` rather than raw inside the marker so the round-trip
// is safe regardless of what HTML the user enters (quotes, angle
// brackets, the literal string "</div>"... all survive).
function encodeAttrs(code: string): string {
  const json = JSON.stringify({ code });
  if (typeof window === "undefined") {
    return Buffer.from(json, "utf-8").toString("base64");
  }
  return window.btoa(unescape(encodeURIComponent(json)));
}

export function decodeAttrs(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    let json: string;
    if (typeof window === "undefined") {
      json = Buffer.from(raw, "base64").toString("utf-8");
    } else {
      json = decodeURIComponent(escape(window.atob(raw)));
    }
    const obj = JSON.parse(json) as { code?: unknown };
    return typeof obj.code === "string" ? obj.code : "";
  } catch {
    return "";
  }
}

// Tiptap atom node carrying a single string attr — the raw HTML/JS
// the user typed. Round-trips via a base64-JSON `data-attrs` so any
// special characters in the code (quotes, angle brackets, the
// literal `</script>`) survive markdown escaping intact.
//
// Editing happens in the inspector (right sidebar) rather than
// inline — placing a real <textarea> inside an atom NodeView fights
// ProseMirror's selection model (caret placement, drag-to-select,
// mousedown handling) hard enough that the UX never feels right.
// The inspector textarea lives outside the editor, so it behaves
// like any other native form control.
export const HtmlBlock = Node.create({
  name: HTML_NODE_NAME,
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      code: {
        default: "",
        parseHTML: (el: HTMLElement) =>
          decodeAttrs(el.getAttribute("data-attrs")),
        renderHTML: (attrs: { code?: string }) => ({
          "data-attrs": encodeAttrs(typeof attrs.code === "string" ? attrs.code : ""),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[data-cms-block="${HTML_BLOCK_ID}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-cms-block": HTML_BLOCK_ID }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HtmlBlockView);
  },
});

// React NodeView — an unobtrusive placeholder card. Two states:
//
//   • Empty (no code yet) — surfaces a hint pointing the user at the
//     inspector where the textarea lives.
//   • Populated — sandboxed iframe preview so the user sees what the
//     code does without leaving the canvas. The iframe is purely
//     read-only here; editing goes through the inspector.
//
// Both states share the same header with the block label so the
// block is identifiable at a glance (matches the embed and columns
// blocks).
function HtmlBlockView({ node, selected }: NodeViewProps) {
  const { t } = useTranslation("flexweg-blocks");
  const code = (node.attrs.code as string) || "";
  const hasCode = code.trim() !== "";

  return (
    <NodeViewWrapper
      className={cn("cms-html-block", selected && "is-selected")}
      data-cms-html-editor="true"
      // contentEditable=false prevents ProseMirror from trying to
      // manage anything inside this view. Combined with `atom: true`
      // on the Node spec, the block behaves as a single unit from
      // ProseMirror's perspective.
      contentEditable={false}
    >
      <div className="cms-html-block-header">
        <FileCode2 className="cms-html-block-header-icon" />
        <span className="cms-html-block-header-label">
          {t("blocks.html.title")}
        </span>
        {hasCode && (
          <span className="cms-html-block-header-meta">
            {t("blocks.html.lines", { n: code.split("\n").length })}
          </span>
        )}
      </div>
      {hasCode ? (
        <div className="cms-html-block-preview-wrap">
          <iframe
            className="cms-html-block-preview"
            // sandbox isolates scripts inside the preview so they
            // can't touch the editor's window. allow-scripts is
            // required for the JS to actually run.
            sandbox="allow-scripts"
            srcDoc={code}
            title={t("blocks.html.title")}
          />
        </div>
      ) : (
        <div className="cms-html-block-empty">
          {t("blocks.html.editInSidebar")}
        </div>
      )}
    </NodeViewWrapper>
  );
}
