import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { EntityCombobox, type ComboboxOption } from "../components/ui/EntityCombobox";
import { useCmsData } from "../context/CmsDataContext";
import { useAllPosts } from "../hooks/useAllPosts";
import { updateSettings } from "../services/settings";
import { publishMenuJson } from "../services/menuPublisher";
import { toast } from "../lib/toast";
import type { MenuItem, Post, SiteSettings } from "../core/types";

type MenuItemKind = "home" | "post" | "term" | "external";

function detectKind(item: MenuItem): MenuItemKind {
  if (item.externalUrl !== undefined) return "external";
  if (item.ref?.kind === "post") return "post";
  if (item.ref?.kind === "term") return "term";
  return "home";
}

// Builds a fresh MenuItem when the user changes its kind. Rebuilding from
// scratch (rather than spread + overwrite) avoids leaving an unused
// `externalUrl: undefined` on a post-kind item — Firestore rejects nested
// `undefined` values and that used to silently drop the whole save.
function buildItem(item: MenuItem, kind: MenuItemKind): MenuItem {
  const base = { id: item.id, label: item.label };
  switch (kind) {
    case "external":
      return { ...base, externalUrl: item.externalUrl ?? "" };
    case "home":
      return { ...base, ref: { kind: "home" } };
    case "post":
      return {
        ...base,
        ref: item.ref?.kind === "post" ? { kind: "post", id: item.ref.id } : { kind: "post" },
      };
    case "term":
      return {
        ...base,
        ref: item.ref?.kind === "term" ? { kind: "term", id: item.ref.id } : { kind: "term" },
      };
  }
}

// Cheap structural equality for the menu shape. Items are simple plain
// objects whose JSON is deterministic enough for our purposes (no Maps,
// Dates, etc.) — avoids pulling in lodash for one comparison.
function sameMenu(a: MenuItem[], b: MenuItem[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function MenusPage() {
  const { t, i18n } = useTranslation();
  const { settings, terms } = useCmsData();
  // Menu items reference posts + pages by id. We need the full
  // corpus on screen to populate the picker, so this surface is one
  // of the legitimate fetchAllPosts-on-mount call sites.
  const { posts } = useAllPosts("post");
  const { posts: pages } = useAllPosts("page");
  const savedHeader = settings.menus.header ?? [];
  const savedFooter = settings.menus.footer ?? [];

  // Local drafts, edited freely by the UI. Saving pushes them to Firestore
  // and re-publishes the menu.json blob in a single explicit action; the
  // page no longer touches Firestore on every keystroke.
  const [header, setHeader] = useState<MenuItem[]>(savedHeader);
  const [footer, setFooter] = useState<MenuItem[]>(savedFooter);
  const [saving, setSaving] = useState(false);

  // Tracks the snapshot we last hydrated FROM. Lets the effect below
  // distinguish between "external Firestore update lands while user is
  // mid-edit" (keep the local draft alone) and "we saved, the
  // subscription echoed back our own write" (re-sync silently).
  const hydratedFromRef = useRef<{ header: string; footer: string }>({
    header: JSON.stringify(savedHeader),
    footer: JSON.stringify(savedFooter),
  });

  useEffect(() => {
    const incomingHeader = JSON.stringify(savedHeader);
    if (sameMenu(header, JSON.parse(hydratedFromRef.current.header))) {
      setHeader(savedHeader);
      hydratedFromRef.current.header = incomingHeader;
    }
    const incomingFooter = JSON.stringify(savedFooter);
    if (sameMenu(footer, JSON.parse(hydratedFromRef.current.footer))) {
      setFooter(savedFooter);
      hydratedFromRef.current.footer = incomingFooter;
    }
    // Intentionally exclude `header`/`footer` from the deps — including
    // them would loop the effect's setState back into itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedHeader, savedFooter]);

  const isDirty = !sameMenu(header, savedHeader) || !sameMenu(footer, savedFooter);

  async function save() {
    setSaving(true);
    try {
      const nextMenus = { header, footer };
      await updateSettings({ menus: nextMenus });
      const patched: SiteSettings = { ...settings, menus: nextMenus };
      await publishMenuJson(patched, posts, pages, terms);
      hydratedFromRef.current = {
        header: JSON.stringify(header),
        footer: JSON.stringify(footer),
      };
      toast.success(t("menus.saved"));
    } catch (err) {
      // updateSettings + publishMenuJson already toast through the
      // flexwegApi funnel; this fallback covers anything else.
      toast.error((err as Error).message || t("menus.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    setHeader(savedHeader);
    setFooter(savedFooter);
    hydratedFromRef.current = {
      header: JSON.stringify(savedHeader),
      footer: JSON.stringify(savedFooter),
    };
  }

  // Posts and pages are merged into a single combobox option list — the
  // dropdown is a typeable filter so a flat list is fine even at scale.
  const postOptions: ComboboxOption[] = [
    ...posts.map((p) => ({
      id: p.id,
      label: p.title || p.slug || "(untitled)",
      subtitle: `[post] ${formatSubtitle(p)}`,
    })),
    ...pages.map((p) => ({
      id: p.id,
      label: p.title || p.slug || "(untitled)",
      subtitle: `[page] ${formatSubtitle(p)}`,
    })),
  ];

  // i18n locale — keeps the page in sync when the LocaleSwitcher fires.
  // Also gives the build a referenced binding so unused-locals don't trip.
  void i18n;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title={t("menus.title")}
        description={isDirty ? t("menus.unsavedChanges") : undefined}
        actions={
          <>
            <button
              type="button"
              className="btn-ghost"
              onClick={discard}
              disabled={!isDirty || saving}
            >
              <RotateCcw className="h-4 w-4" />
              {t("menus.discard")}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={save}
              disabled={!isDirty || saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? t("common.saving") : t("menus.saveAndPublish")}
            </button>
          </>
        }
      />
      <MenuEditor
        labelKey="menus.header"
        items={header}
        onChange={setHeader}
        terms={terms}
        postOptions={postOptions}
      />
      <MenuEditor
        labelKey="menus.footer"
        items={footer}
        onChange={setFooter}
        terms={terms}
        postOptions={postOptions}
      />
    </div>
  );
}

interface MenuEditorProps {
  labelKey: string;
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
  terms: { id: string; type: string; name: string; slug: string }[];
  postOptions: ComboboxOption[];
}

function MenuEditor({ labelKey, items, onChange, terms, postOptions }: MenuEditorProps) {
  const { t } = useTranslation();

  function move(idx: number, dir: -1 | 1) {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  function add() {
    onChange([
      ...items,
      { id: crypto.randomUUID(), label: "New item", ref: { kind: "home" } },
    ]);
  }

  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  function patch(idx: number, item: MenuItem) {
    const next = [...items];
    next[idx] = item;
    onChange(next);
  }

  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t(labelKey)}</h2>
        <button type="button" className="btn-secondary" onClick={add}>
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
          {items.map((item, idx) => {
            const kind = detectKind(item);
            return (
              <li
                key={item.id}
                className="border border-surface-200 rounded-lg p-3 space-y-2 dark:border-surface-700"
              >
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
                <div className="flex flex-wrap gap-2 items-start">
                  <select
                    className="input w-44"
                    value={kind}
                    onChange={(e) => patch(idx, buildItem(item, e.target.value as MenuItemKind))}
                  >
                    <option value="home">Home</option>
                    <option value="post">Post / Page</option>
                    <option value="term">Category</option>
                    <option value="external">External URL</option>
                  </select>

                  {kind === "post" && (
                    <EntityCombobox
                      className="flex-1 min-w-[220px]"
                      options={postOptions}
                      value={item.ref?.kind === "post" ? item.ref.id : null}
                      onSelect={(id) =>
                        patch(idx, {
                          id: item.id,
                          label: item.label,
                          ref: id ? { kind: "post", id } : { kind: "post" },
                        })
                      }
                      placeholder="Search posts and pages…"
                    />
                  )}

                  {kind === "term" && (
                    <select
                      className="input flex-1"
                      value={item.ref?.kind === "term" ? item.ref.id ?? "" : ""}
                      onChange={(e) =>
                        patch(idx, {
                          id: item.id,
                          label: item.label,
                          ref: e.target.value
                            ? { kind: "term", id: e.target.value }
                            : { kind: "term" },
                        })
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
                  )}

                  {kind === "external" && (
                    <input
                      className="input flex-1"
                      type="url"
                      placeholder="https://…"
                      value={item.externalUrl ?? ""}
                      onChange={(e) =>
                        patch(idx, {
                          id: item.id,
                          label: item.label,
                          externalUrl: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function formatSubtitle(p: Pick<Post, "slug">): string {
  return p.slug ? `/${p.slug}` : "(no slug)";
}
