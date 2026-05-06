import { GridIcon, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { BlockManifest } from "../../../../core/blockRegistry";
import { blockNodeName, createBlockNode } from "../createBlockNode";
import type { ServiceItem, ServicesGridAttrs } from "./render";

const SUB_ID = "services-grid";
const NODE_NAME = blockNodeName(SUB_ID);

const NEW_SERVICE: ServiceItem = {
  icon: "auto_awesome",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  accent: false,
};

const DEFAULT_ATTRS: ServicesGridAttrs = {
  eyebrow: "",
  title: "",
  subtitle: "",
  // Seed with 3 empty cards mirroring the mockup's bento layout. The
  // middle card carries the accent flag by convention; users can flip
  // it on any other card if they want a different rhythm.
  services: [
    { ...NEW_SERVICE },
    { ...NEW_SERVICE, accent: true },
    { ...NEW_SERVICE },
  ],
};

interface NodeViewProps {
  attrs: ServicesGridAttrs;
  selected: boolean;
}

function NodeView({ attrs, selected }: NodeViewProps) {
  const { t } = useTranslation("theme-corporate");
  const count = attrs.services?.length ?? 0;
  return (
    <NodeViewWrapper
      contentEditable={false}
      className={
        "my-4 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-4 dark:border-surface-600 dark:bg-surface-900 " +
        (selected ? "ring-2 ring-blue-500/60" : "")
      }
    >
      <div className="flex items-start gap-3">
        <GridIcon className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.servicesGrid.title")}
          </p>
          <p className="text-sm text-surface-900 dark:text-surface-50 truncate">
            {attrs.title || t("blocks.servicesGrid.preview", { count })}
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
  const raw = editor.getAttributes(NODE_NAME) as { attrs?: ServicesGridAttrs };
  const attrs = { ...DEFAULT_ATTRS, ...(raw.attrs ?? {}) };
  const services = attrs.services ?? [];

  function commit(next: Partial<ServicesGridAttrs>) {
    editor.chain().updateAttributes(NODE_NAME, { attrs: { ...attrs, ...next } }).run();
  }
  function patchService(index: number, next: Partial<ServiceItem>) {
    const list = services.map((s, i) => (i === index ? { ...s, ...next } : s));
    commit({ services: list });
  }
  function addService() {
    commit({ services: [...services, { ...NEW_SERVICE }] });
  }
  function removeService(index: number) {
    commit({ services: services.filter((_, i) => i !== index) });
  }
  function moveService(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= services.length) return;
    const list = [...services];
    [list[index], list[target]] = [list[target], list[index]];
    commit({ services: list });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t("blocks.servicesGrid.eyebrow")}</label>
        <input
          type="text"
          className="input"
          value={attrs.eyebrow ?? ""}
          onChange={(e) => commit({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.servicesGrid.heading")}</label>
        <input
          type="text"
          className="input"
          value={attrs.title ?? ""}
          onChange={(e) => commit({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="label">{t("blocks.servicesGrid.subtitle")}</label>
        <textarea
          className="input"
          rows={2}
          value={attrs.subtitle ?? ""}
          onChange={(e) => commit({ subtitle: e.target.value })}
        />
      </div>

      <div className="space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {t("blocks.servicesGrid.servicesHeading")}
          </p>
          <button
            type="button"
            className="btn-ghost btn-sm flex items-center gap-1"
            onClick={addService}
          >
            <Plus className="h-3 w-3" />
            {t("blocks.servicesGrid.addService")}
          </button>
        </div>
        {services.map((service, index) => (
          <div
            key={index}
            className="rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                {t("blocks.servicesGrid.serviceIndex", { index: index + 1 })}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="btn-ghost btn-icon"
                  onClick={() => moveService(index, -1)}
                  disabled={index === 0}
                  title={t("blocks.servicesGrid.moveUp")}
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-icon"
                  onClick={() => moveService(index, 1)}
                  disabled={index === services.length - 1}
                  title={t("blocks.servicesGrid.moveDown")}
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-icon text-red-600"
                  onClick={() => removeService(index)}
                  title={t("blocks.servicesGrid.removeService")}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label text-xs">{t("blocks.servicesGrid.icon")}</label>
                <input
                  type="text"
                  className="input"
                  placeholder="analytics"
                  value={service.icon ?? ""}
                  onChange={(e) => patchService(index, { icon: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-xs text-surface-700 dark:text-surface-200">
                  <input
                    type="checkbox"
                    checked={!!service.accent}
                    onChange={(e) => patchService(index, { accent: e.target.checked })}
                  />
                  {t("blocks.servicesGrid.accent")}
                </label>
              </div>
            </div>
            <div>
              <label className="label text-xs">{t("blocks.servicesGrid.serviceTitle")}</label>
              <input
                type="text"
                className="input"
                value={service.title ?? ""}
                onChange={(e) => patchService(index, { title: e.target.value })}
              />
            </div>
            <div>
              <label className="label text-xs">
                {t("blocks.servicesGrid.serviceDescription")}
              </label>
              <textarea
                className="input"
                rows={2}
                value={service.description ?? ""}
                onChange={(e) => patchService(index, { description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label text-xs">{t("blocks.servicesGrid.ctaLabel")}</label>
                <input
                  type="text"
                  className="input"
                  value={service.ctaLabel ?? ""}
                  onChange={(e) => patchService(index, { ctaLabel: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">{t("blocks.servicesGrid.ctaHref")}</label>
                <input
                  type="text"
                  className="input"
                  value={service.ctaHref ?? ""}
                  onChange={(e) => patchService(index, { ctaHref: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("blocks.servicesGrid.iconHelp")}
      </p>
    </div>
  );
}

const node = createBlockNode<ServicesGridAttrs>({
  subId: SUB_ID,
  defaultAttrs: DEFAULT_ATTRS,
  view: NodeView,
});

export const servicesGridBlock: BlockManifest<ServicesGridAttrs> = {
  id: `corporate/${SUB_ID}`,
  nodeName: NODE_NAME,
  titleKey: "blocks.servicesGrid.title",
  namespace: "theme-corporate",
  icon: GridIcon,
  category: "layout",
  extensions: [node],
  insert: (chain) => {
    chain.focus().insertContent({ type: NODE_NAME }).run();
  },
  isActive: (editor) => editor.isActive(NODE_NAME),
  inspector: (props) => <Inspector editor={props.editor} />,
};
