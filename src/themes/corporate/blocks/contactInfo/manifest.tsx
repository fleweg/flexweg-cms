import { MapPin, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "@flexweg/cms-runtime";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { ContactInfoAttrs } from "./render";

const SUB_ID = "contact-info";
const NODE_NAME = blockNodeName(SUB_ID);

const NEW_SOCIAL = { icon: "share", href: "", ariaLabel: "" };

const DEFAULT_ATTRS: ContactInfoAttrs = {
  heading: "",
  addressLines: "",
  phoneLines: "",
  emailLines: "",
  socialsLabel: "",
  socials: [],
};

interface NodeViewProps {
  attrs: ContactInfoAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-corporate");
  const lines = [attrs.addressLines, attrs.phoneLines, attrs.emailLines].filter(Boolean).length;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.contactInfo.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.heading || t("blocks.contactInfo.preview", { lines })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: ContactInfoAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const socials = attrs.socials ?? [];

  function commit(next: Partial<ContactInfoAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchSocial(index: number, next: Partial<typeof NEW_SOCIAL>) {
    commit({ socials: socials.map((s, i) => (i === index ? { ...s, ...next } : s)) });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.contactInfo.heading")}</label>
        <input
          type="text"
          className="input"
          placeholder={t("blocks.contactInfo.headingPlaceholder")}
          value={attrs.heading ?? ""}
          onChange={(e) => commit({ heading: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.contactInfo.address")}</label>
        <textarea
          className="input"
          rows={2}
          value={attrs.addressLines ?? ""}
          onChange={(e) => commit({ addressLines: e.target.value })}
        />
        <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
          {t("blocks.contactInfo.multilineHelp")}
        </p>
      </div>
      <div>
        <label className="label">{t("blocks.contactInfo.phone")}</label>
        <textarea
          className="input"
          rows={2}
          value={attrs.phoneLines ?? ""}
          onChange={(e) => commit({ phoneLines: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.contactInfo.email")}</label>
        <textarea
          className="input"
          rows={2}
          value={attrs.emailLines ?? ""}
          onChange={(e) => commit({ emailLines: e.target.value })}
        />
      </div>

      <div className="pt-3 border-t border-surface-200 dark:border-surface-700 space-y-3">
        <div>
          <label className="label">{t("blocks.contactInfo.socialsLabel")}</label>
          <input
            type="text"
            className="input"
            value={attrs.socialsLabel ?? ""}
            onChange={(e) => commit({ socialsLabel: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.contactInfo.socials")}
          </p>
          <button
            type="button"
            className="btn-ghost btn-sm flex items-center gap-1"
            onClick={() => commit({ socials: [...socials, { ...NEW_SOCIAL }] })}
          >
            <Plus className="h-3 w-3" />
            {t("blocks.contactInfo.addSocial")}
          </button>
        </div>
        {socials.map((social, index) => (
          <div
            key={index}
            className="rounded-md border border-surface-200 bg-surface-50 p-2 grid grid-cols-[1fr_2fr_auto] gap-2 items-end dark:border-surface-700 dark:bg-surface-800"
          >
            <div>
              <label className="label text-xs">{t("blocks.contactInfo.socialIcon")}</label>
              <input
                type="text"
                className="input"
                placeholder="share"
                value={social.icon ?? ""}
                onChange={(e) => patchSocial(index, { icon: e.target.value })}
              />
            </div>
            <div>
              <label className="label text-xs">{t("blocks.contactInfo.socialHref")}</label>
              <input
                type="url"
                className="input"
                placeholder="https://…"
                value={social.href ?? ""}
                onChange={(e) => patchSocial(index, { href: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn-ghost btn-icon text-red-600"
              onClick={() => commit({ socials: socials.filter((_, i) => i !== index) })}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const node = createBlockNode<ContactInfoAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const contactInfoBlock: BlockManifest<ContactInfoAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.contactInfo.title",
  namespace: "theme-corporate",
  icon: MapPin,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
