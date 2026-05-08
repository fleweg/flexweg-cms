import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { ContactFormAttrs, ContactFormMode } from "./render";

const SUB_ID = "contact-form";
const NODE_NAME = blockNodeName(SUB_ID);

const DEFAULT_ATTRS: ContactFormAttrs = {
  heading: "",
  subtitle: "",
  mode: "endpoint",
  endpointUrl: "",
  mailtoAddress: "",
  labelName: "Full name",
  labelEmail: "Work email",
  labelCompany: "Company",
  labelSubject: "Subject",
  labelMessage: "Message",
  subjectOptions: "",
  submitLabel: "Send inquiry",
  privacyText: "",
  privacyHref: "",
  successMessage: "",
  errorMessage: "",
};

interface NodeViewProps {
  attrs: ContactFormAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-corporate");
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.contactForm.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.heading || t("blocks.contactForm.preview", { mode: attrs.mode ?? "endpoint" })}
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
  const { t } = useTranslation("theme-corporate");
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: ContactFormAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };

  function commit(next: Partial<ContactFormAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.contactForm.heading")}</label>
        <input
          type="text"
          className="input"
          value={attrs.heading ?? ""}
          onChange={(e) => commit({ heading: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.contactForm.subtitle")}</label>
        <textarea
          className="input"
          rows={2}
          value={attrs.subtitle ?? ""}
          onChange={(e) => commit({ subtitle: e.target.value })}
        />
      </div>

      <div className="pt-3 border-t border-surface-200 dark:border-surface-700 space-y-3">
        <div>
          <label className="label">{t("blocks.contactForm.mode")}</label>
          <select
            className="input"
            value={attrs.mode ?? "endpoint"}
            onChange={(e) => commit({ mode: e.target.value as ContactFormMode })}
          >
            <option value="endpoint">{t("blocks.contactForm.modes.endpoint")}</option>
            <option value="mailto">{t("blocks.contactForm.modes.mailto")}</option>
          </select>
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("blocks.contactForm.modeHelp")}
          </p>
        </div>
        {attrs.mode !== "mailto" ? (
          <div>
            <label className="label">{t("blocks.contactForm.endpointUrl")}</label>
            <input
              type="url"
              className="input"
              placeholder="https://formspree.io/f/abcdefg"
              value={attrs.endpointUrl ?? ""}
              onChange={(e) => commit({ endpointUrl: e.target.value })}
            />
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("blocks.contactForm.endpointHelp")}
            </p>
          </div>
        ) : (
          <div>
            <label className="label">{t("blocks.contactForm.mailtoAddress")}</label>
            <input
              type="email"
              className="input"
              placeholder="hello@example.com"
              value={attrs.mailtoAddress ?? ""}
              onChange={(e) => commit({ mailtoAddress: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-surface-200 dark:border-surface-700 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
          {t("blocks.contactForm.fieldLabels")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label text-xs">{t("blocks.contactForm.labelName")}</label>
            <input
              type="text"
              className="input"
              value={attrs.labelName ?? ""}
              onChange={(e) => commit({ labelName: e.target.value })}
            />
          </div>
          <div>
            <label className="label text-xs">{t("blocks.contactForm.labelEmail")}</label>
            <input
              type="text"
              className="input"
              value={attrs.labelEmail ?? ""}
              onChange={(e) => commit({ labelEmail: e.target.value })}
            />
          </div>
          <div>
            <label className="label text-xs">{t("blocks.contactForm.labelCompany")}</label>
            <input
              type="text"
              className="input"
              value={attrs.labelCompany ?? ""}
              onChange={(e) => commit({ labelCompany: e.target.value })}
            />
          </div>
          <div>
            <label className="label text-xs">{t("blocks.contactForm.labelSubject")}</label>
            <input
              type="text"
              className="input"
              value={attrs.labelSubject ?? ""}
              onChange={(e) => commit({ labelSubject: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="label text-xs">{t("blocks.contactForm.labelMessage")}</label>
            <input
              type="text"
              className="input"
              value={attrs.labelMessage ?? ""}
              onChange={(e) => commit({ labelMessage: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label text-xs">{t("blocks.contactForm.subjectOptions")}</label>
          <textarea
            className="input"
            rows={4}
            value={attrs.subjectOptions ?? ""}
            onChange={(e) => commit({ subjectOptions: e.target.value })}
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("blocks.contactForm.subjectOptionsHelp")}
          </p>
        </div>
        <div>
          <label className="label text-xs">{t("blocks.contactForm.submitLabel")}</label>
          <input
            type="text"
            className="input"
            value={attrs.submitLabel ?? ""}
            onChange={(e) => commit({ submitLabel: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-surface-200 dark:border-surface-700 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
          {t("blocks.contactForm.privacyHeading")}
        </p>
        <div>
          <label className="label text-xs">{t("blocks.contactForm.privacyText")}</label>
          <textarea
            className="input"
            rows={2}
            value={attrs.privacyText ?? ""}
            onChange={(e) => commit({ privacyText: e.target.value })}
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("blocks.contactForm.privacyHelp")}
          </p>
        </div>
        <div>
          <label className="label text-xs">{t("blocks.contactForm.privacyHref")}</label>
          <input
            type="url"
            className="input"
            placeholder="/privacy.html"
            value={attrs.privacyHref ?? ""}
            onChange={(e) => commit({ privacyHref: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-surface-200 dark:border-surface-700 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
          {t("blocks.contactForm.feedback")}
        </p>
        <div>
          <label className="label text-xs">{t("blocks.contactForm.successMessage")}</label>
          <input
            type="text"
            className="input"
            value={attrs.successMessage ?? ""}
            onChange={(e) => commit({ successMessage: e.target.value })}
          />
        </div>
        <div>
          <label className="label text-xs">{t("blocks.contactForm.errorMessage")}</label>
          <input
            type="text"
            className="input"
            value={attrs.errorMessage ?? ""}
            onChange={(e) => commit({ errorMessage: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

const node = createBlockNode<ContactFormAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const contactFormBlock: BlockManifest<ContactFormAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.contactForm.title",
  namespace: "theme-corporate",
  icon: Mail,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
