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
  const base: { id: string; label: string; translations?: MenuItem["translations"] } = {
    id: item.id,
    label: item.label,
  };
  // Preserve per-language translations across kind switches — the
  // label override is independent of whether the link points at a
  // post, term, or external URL.
  if (item.translations) base.translations = item.translations;
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

// Reads enabled secondary languages from the multilang plugin's stored
// config. Returns an empty array when the plugin isn't installed /
// enabled / has no secondary languages — the MenusPage uses that to
// hide the per-language label inputs entirely on mono-lingual sites.
//
// Plugins are enabled by default: PluginsPage's toggle stores `false`
// only when the user explicitly disables one. A missing entry means
// "active with defaults" — so we check `=== false`, not truthiness.
//
// We read the plugin config as an opaque blob rather than importing
// the multilang types: the menu UI lives in core and can't take a
// hard dependency on a plugin's TypeScript surface.
function getEnabledLanguages(settings: SiteSettings): string[] {
  if (settings.enabledPlugins?.["flexweg-multilang"] === false) return [];
  const config = settings.pluginConfigs?.["flexweg-multilang"] as
    | { enabledLanguages?: unknown }
    | undefined;
  const raw = config?.enabledLanguages;
  if (!Array.isArray(raw)) return [];
  return raw.filter((l): l is string => typeof l === "string" && l.length > 0);
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
  const enabledLanguages = getEnabledLanguages(settings);

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
              <Loader2 className={saving ? "h-4 w-4 animate-spin" : "hidden"} />
              <Save className={saving ? "hidden" : "h-4 w-4"} />
              <span>{saving ? t("common.saving") : t("menus.saveAndPublish")}</span>
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
        enabledLanguages={enabledLanguages}
      />
      <MenuEditor
        labelKey="menus.footer"
        items={footer}
        onChange={setFooter}
        terms={terms}
        postOptions={postOptions}
        enabledLanguages={enabledLanguages}
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
  enabledLanguages: string[];
}

function MenuEditor({ labelKey, items, onChange, terms, postOptions, enabledLanguages }: MenuEditorProps) {
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
            function patchLangLabel(lang: string, label: string): void {
              const next = { ...(item.translations ?? {}) };
              const trimmed = label.trim();
              if (trimmed) {
                next[lang] = { ...(next[lang] ?? {}), label: trimmed };
              } else {
                // Empty input clears the override — drop the entry
                // entirely rather than persisting `{ label: "" }`
                // which would pollute the menu.json with empty
                // strings that the loader would still match against.
                delete next[lang];
              }
              const hasAny = Object.keys(next).length > 0;
              patch(idx, {
                ...item,
                translations: hasAny ? next : undefined,
              });
            }
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
                    placeholder={t("menus.label") as string}
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
                {enabledLanguages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {enabledLanguages.map((lang) => (
                      <label key={lang} className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold w-8 text-surface-500">
                          {lang}
                        </span>
                        <input
                          className="input flex-1"
                          value={item.translations?.[lang]?.label ?? ""}
                          onChange={(e) => patchLangLabel(lang, e.target.value)}
                          placeholder={item.label}
                        />
                      </label>
                    ))}
                  </div>
                )}
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
