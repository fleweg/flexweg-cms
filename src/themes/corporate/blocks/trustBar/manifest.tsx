import { ShieldCheck, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { TrustBarAttrs, TrustLogo } from "./render";

const SUB_ID = "trust-bar";
const NODE_NAME = blockNodeName(SUB_ID);

const NEW_LOGO: TrustLogo = { imageUrl: "", imageAlt: "", href: "" };

const DEFAULT_ATTRS: TrustBarAttrs = {
  label: "",
  logos: [{ ...NEW_LOGO }, { ...NEW_LOGO }, { ...NEW_LOGO }, { ...NEW_LOGO }],
};

interface NodeViewProps {
  attrs: TrustBarAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-corporate");
  const count = attrs.logos?.filter((l) => l.imageUrl).length ?? 0;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.trustBar.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {t("blocks.trustBar.preview", { count })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: TrustBarAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const logos = attrs.logos ?? [];

  function commit(next: Partial<TrustBarAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchLogo(index: number, next: Partial<TrustLogo>) {
    commit({ logos: logos.map((l, i) => (i === index ? { ...l, ...next } : l)) });
  }
  function addLogo() {
    commit({ logos: [...logos, { ...NEW_LOGO }] });
  }
  function removeLogo(index: number) {
    commit({ logos: logos.filter((_, i) => i !== index) });
  }
  function moveLogo(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= logos.length) return;
    const list = [...logos];
    [list[index], list[target]] = [list[target], list[index]];
    commit({ logos: list });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.trustBar.label")}</label>
        <input
          type="text"
          className="input"
          placeholder={t("blocks.trustBar.labelPlaceholder")}
          value={attrs.label ?? ""}
          onChange={(e) => commit({ label: e.target.value })}
        />
      </div>

      <div className="space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.trustBar.logosHeading")}
          </p>
          <button
            type="button"
            className="btn-ghost btn-sm flex items-center gap-1"
            onClick={addLogo}
          >
            <Plus className="h-3 w-3" />
            {t("blocks.trustBar.addLogo")}
          </button>
        </div>
        {logos.map((logo, index) => (
          <div
            key={index}
            className="rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                {t("blocks.trustBar.logoIndex", { index: index + 1 })}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="btn-ghost btn-icon"
                  onClick={() => moveLogo(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-icon"
                  onClick={() => moveLogo(index, 1)}
                  disabled={index === logos.length - 1}
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-icon text-red-600"
                  onClick={() => removeLogo(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div>
              <label className="label text-xs">{t("blocks.trustBar.imageUrl")}</label>
              <input
                type="url"
                className="input"
                placeholder="https://…"
                value={logo.imageUrl ?? ""}
                onChange={(e) => patchLogo(index, { imageUrl: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label text-xs">{t("blocks.trustBar.imageAlt")}</label>
                <input
                  type="text"
                  className="input"
                  value={logo.imageAlt ?? ""}
                  onChange={(e) => patchLogo(index, { imageAlt: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">{t("blocks.trustBar.href")}</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://…"
                  value={logo.href ?? ""}
                  onChange={(e) => patchLogo(index, { href: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const node = createBlockNode<TrustBarAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const trustBarBlock: BlockManifest<TrustBarAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.trustBar.title",
  namespace: "theme-corporate",
  icon: ShieldCheck,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
