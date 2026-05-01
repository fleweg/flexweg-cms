import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useCmsData } from "../context/CmsDataContext";
import { updateSettings } from "../services/settings";
import type { MenuItem } from "../core/types";

type MenuKey = "header" | "footer";

export function MenusPage() {
  const { t } = useTranslation();
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title={t("menus.title")} />
      <MenuEditor menuKey="header" labelKey="menus.header" />
      <MenuEditor menuKey="footer" labelKey="menus.footer" />
    </div>
  );
}

function MenuEditor({ menuKey, labelKey }: { menuKey: MenuKey; labelKey: string }) {
  const { t } = useTranslation();
  const { settings, posts, pages, terms } = useCmsData();
  const items = settings.menus[menuKey] ?? [];
  const [busy, setBusy] = useState(false);

  async function update(next: MenuItem[]) {
    setBusy(true);
    try {
      await updateSettings({
        menus: { ...settings.menus, [menuKey]: next },
      });
    } finally {
      setBusy(false);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    void update(next);
  }

  function add() {
    void update([
      ...items,
      { id: crypto.randomUUID(), label: "New item", ref: { kind: "home" } },
    ]);
  }

  function remove(idx: number) {
    void update(items.filter((_, i) => i !== idx));
  }

  function patch(idx: number, item: MenuItem) {
    const next = [...items];
    next[idx] = item;
    void update(next);
  }

  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t(labelKey)}</h2>
        <button type="button" className="btn-secondary" onClick={add} disabled={busy}>
          <Plus className="h-4 w-4" />
          {t("common.create")}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-surface-500 italic dark:text-surface-400">
          {t("common.none")}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={item.id} className="border border-surface-200 rounded-lg p-3 space-y-2 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <input
                  className="input flex-1"
                  value={item.label}
                  onChange={(e) => patch(idx, { ...item, label: e.target.value })}
                  placeholder="Label"
                />
                <button type="button" className="btn-ghost" onClick={() => move(idx, -1)}>
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" className="btn-ghost" onClick={() => move(idx, 1)}>
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" className="btn-ghost" onClick={() => remove(idx)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  className="input flex-1"
                  value={item.externalUrl ? "external" : item.ref?.kind ?? "home"}
                  onChange={(e) => {
                    const kind = e.target.value;
                    if (kind === "external") {
                      patch(idx, { ...item, ref: undefined, externalUrl: item.externalUrl ?? "" });
                    } else {
                      patch(idx, {
                        ...item,
                        externalUrl: undefined,
                        ref: { kind: kind as "home" | "post" | "term" },
                      });
                    }
                  }}
                >
                  <option value="home">Home</option>
                  <option value="post">Post / Page</option>
                  <option value="term">Category</option>
                  <option value="external">External URL</option>
                </select>
                {item.externalUrl !== undefined ? (
                  <input
                    className="input flex-1"
                    placeholder="https://…"
                    value={item.externalUrl}
                    onChange={(e) => patch(idx, { ...item, externalUrl: e.target.value })}
                  />
                ) : item.ref?.kind === "post" ? (
                  <select
                    className="input flex-1"
                    value={item.ref.id ?? ""}
                    onChange={(e) =>
                      patch(idx, { ...item, ref: { kind: "post", id: e.target.value || undefined } })
                    }
                  >
                    <option value="">—</option>
                    {[...posts, ...pages].map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                ) : item.ref?.kind === "term" ? (
                  <select
                    className="input flex-1"
                    value={item.ref.id ?? ""}
                    onChange={(e) =>
                      patch(idx, { ...item, ref: { kind: "term", id: e.target.value || undefined } })
                    }
                  >
                    <option value="">—</option>
                    {terms
                      .filter((tm) => tm.type === "category")
                      .map((tm) => (
                        <option key={tm.id} value={tm.id}>
                          {tm.name}
                        </option>
                      ))}
                  </select>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
