import { Mail as MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { NewsletterAttrs } from "./render";

const SUB_ID = "newsletter";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: NewsletterAttrs = {
  variant: "card",
  eyebrow: "",
  title: "Stay in the loop",
  subtitle: "Get exclusive arrivals and seasonal tips.",
  placeholder: "Email address",
  ctaLabel: "Subscribe",
  mode: "endpoint",
  endpoint: "",
  mailto: "",
  successMessage: "",
  errorMessage: "",
};

interface NodeViewProps {
  attrs: NewsletterAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-storefront");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <MailIcon className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.newsletter.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.newsletter.untitled")}
          </p>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

interface InspectorProps {
  editor: Editor;
}

function Inspector({ editor }: InspectorProps) {
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: NewsletterAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function patch(next: Partial<NewsletterAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Variant</label>
        <select
          className="input"
          value={attrs.variant ?? "card"}
          onChange={(e) => patch({ variant: e.target.value as NewsletterAttrs["variant"] })}
        >
          <option value="card">Card (centered, light surface)</option>
          <option value="banner">Banner (full-width, primary color)</option>
        </select>
      </div>
      <div>
        <label className="label">Eyebrow</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow ?? ""}
          onChange={(e) => patch({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Title</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Subtitle</label>
        <textarea
          className="input"
          rows={2}
          value={attrs.subtitle ?? ""}
          onChange={(e) => patch({ subtitle: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Email placeholder</label>
          <input
            type="text"
            className="input"
            value={attrs.placeholder ?? ""}
            onChange={(e) => patch({ placeholder: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Submit label</label>
          <input
            type="text"
            className="input"
            value={attrs.ctaLabel ?? ""}
            onChange={(e) => patch({ ctaLabel: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Form mode</label>
        <select
          className="input"
          value={attrs.mode ?? "endpoint"}
          onChange={(e) => patch({ mode: e.target.value as NewsletterAttrs["mode"] })}
        >
          <option value="endpoint">POST endpoint (Mailchimp / Buttondown / Formspree)</option>
          <option value="mailto">mailto: handler</option>
        </select>
      </div>
      <div>
        <label className="label">Endpoint URL</label>
        <input
          type="url"
          className="input"
          placeholder="https://…"
          value={attrs.endpoint ?? ""}
          onChange={(e) => patch({ endpoint: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Mailto address</label>
        <input
          type="email"
          className="input"
          placeholder="hello@your-shop.com"
          value={attrs.mailto ?? ""}
          onChange={(e) => patch({ mailto: e.target.value })}
        />
      </div>
    </div>
  );
}

const node = createBlockNode<NewsletterAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const newsletterBlock: BlockManifest<NewsletterAttrs> = {
  id: `storefront/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.newsletter.title",
  namespace: "theme-storefront",
  icon: MailIcon,
  category: "embed",
  extensions: [node],
  insert: async (chain) => {
    chain.focus().insertContent({ type: NODE_NAME, attrs: { attrs: DEFAULT_ATTRS } }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
