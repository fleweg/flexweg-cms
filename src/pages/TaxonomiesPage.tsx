import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useCmsData } from "../context/CmsDataContext";
import {
  detectTermSlugCollision,
  findAvailableSlug,
  isValidSlug,
  slugify,
} from "../core/slug";
import { createTerm, deleteTerm, updateTerm } from "../services/taxonomies";
import type { SeoMeta, Term, TermType } from "../core/types";
import {
  listTermEditorSections,
  subscribeTermEditorSections,
} from "../core/termEditorSectionRegistry";

export function TaxonomiesPage() {
  const { t } = useTranslation();
  const { categories, tags } = useCmsData();
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title={t("taxonomies.title")} />
      <TermSection
        title={t("taxonomies.categories")}
        emptyKey="taxonomies.noCategories"
        type="category"
        terms={categories}
      />
      <TermSection
        title={t("taxonomies.tags")}
        emptyKey="taxonomies.noTags"
        type="tag"
        terms={tags}
      />
    </div>
  );
}

function TermSection({
  title,
  emptyKey,
  type,
  terms,
}: {
  title: string;
  emptyKey: string;
  type: TermType;
  terms: Term[];
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);

  // Auto-deduplicate the new term's slug at submit time. If the user typed
  // an explicit slug we keep it as-is and let the collision check below
  // surface a friendly error (this matches the post-edit UX where manual
  // slugs aren't silently rewritten).
  async function handleAdd() {
    if (!name.trim()) return;
    const userSlug = slug.trim();
    let finalSlug: string;
    if (userSlug) {
      if (!isValidSlug(userSlug)) return;
      if (detectTermSlugCollision({ type, slug: userSlug }, terms)) return;
      finalSlug = userSlug;
    } else {
      const base = slugify(name) || "term";
      finalSlug = findAvailableSlug(base, (s) =>
        Boolean(detectTermSlugCollision({ type, slug: s }, terms)),
      );
    }
    setBusy(true);
    try {
      await createTerm({ type, name: name.trim(), slug: finalSlug });
      setName("");
      setSlug("");
    } finally {
      setBusy(false);
    }
  }

  // Live collision check on the manual slug input. Shown beneath the slug
  // field and used to disable the Add button.
  const newSlugCollision = useMemo(() => {
    const userSlug = slug.trim();
    if (!userSlug) return null;
    if (!isValidSlug(userSlug)) return null;
    return detectTermSlugCollision({ type, slug: userSlug }, terms);
  }, [slug, type, terms]);

  return (
    <section className="card p-4 space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          className="input flex-1 min-w-[160px]"
          placeholder={t("common.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="input flex-1 min-w-[160px]"
          placeholder={t("common.slug")}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button
          type="button"
          className="btn-primary"
          onClick={handleAdd}
          disabled={busy || !!newSlugCollision}
        >
          <Loader2 className={busy ? "h-4 w-4 animate-spin" : "hidden"} />
          <Plus className={busy ? "hidden" : "h-4 w-4"} />
          <span>{type === "category" ? t("taxonomies.newCategory") : t("taxonomies.newTag")}</span>
        </button>
      </div>
      {newSlugCollision && (
        <p className="text-xs text-red-600 mt-1">
          {t("taxonomies.slugCollision", { label: newSlugCollision.label })}
        </p>
      )}
      {terms.length === 0 ? (
        <p className="text-sm text-surface-500 italic dark:text-surface-400">{t(emptyKey)}</p>
      ) : (
        <ul className="divide-y divide-surface-200 dark:divide-surface-800">
          {terms.map((term) => (
            <TermRow key={term.id} term={term} terms={terms} />
          ))}
        </ul>
      )}
    </section>
  );
}

function TermRow({ term, terms }: { term: Term; terms: Term[] }) {
  const { t } = useTranslation();
  const [name, setName] = useState(term.name);
  const [slug, setSlug] = useState(term.slug);
  const [expanded, setExpanded] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  // In-memory patches contributed by plugin-registered term editor
  // sections (e.g. flexweg-multilang's per-language fields). The host
  // merges them with the standard name + slug fields on save.
  const [pluginPatch, setPluginPatch] = useState<Partial<Term>>({});
  const dirty =
    name !== term.name || slug !== term.slug || Object.keys(pluginPatch).length > 0;
  const collision = useMemo(() => {
    if (!isValidSlug(slug)) return null;
    return detectTermSlugCollision({ type: term.type, slug }, terms, term.id);
  }, [slug, term.type, term.id, terms]);

  // Reactive subscription to plugin-registered sections for this term
  // type (category vs tag). The registry caches the listed array so
  // the snapshot reference is stable between notifies — required by
  // useSyncExternalStore to avoid infinite render loops.
  const getSnapshot = useCallback(
    () => listTermEditorSections(term.type),
    [term.type],
  );
  const sections = useSyncExternalStore(
    subscribeTermEditorSections,
    getSnapshot,
    getSnapshot,
  );
  const hasSections = sections.length > 0;

  async function handleSave() {
    if (!isValidSlug(slug)) return;
    if (collision) return;
    await updateTerm(term.id, { name, slug, ...pluginPatch });
    setPluginPatch({});
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${term.name}"?`)) return;
    await deleteTerm(term.id);
  }

  function updateTermPatch(patch: Partial<Term>) {
    setPluginPatch((prev) => ({ ...prev, ...patch }));
  }

  return (
    <li className="py-2 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        {hasSections && (
          <button
            type="button"
            className="btn-ghost p-1"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        <input
          type="text"
          className="input flex-1 min-w-[160px]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="input flex-1 min-w-[160px]"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setSeoModalOpen(true)}
          title={t("taxonomies.seo.buttonTitle") as string}
        >
          {t("taxonomies.seo.button")}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleSave}
          disabled={!dirty || !!collision}
        >
          Save
        </button>
        <button type="button" className="btn-ghost" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {collision && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {t("taxonomies.slugCollision", { label: collision.label })}
        </p>
      )}
      {expanded && hasSections && (
        <div className="pl-8 pr-2 py-2 space-y-3 border-l-2 border-surface-200 dark:border-surface-700">
          {sections.map((section) => {
            const Component = section.component;
            // Merge the live patch into the term so plugin sections
            // read the user's in-flight edits.
            const liveEntity: Term = { ...term, ...pluginPatch };
            return (
              <Component
                key={section.id}
                term={liveEntity}
                updateTerm={updateTermPatch}
              />
            );
          })}
        </div>
      )}
      {seoModalOpen && (
        <TermSeoModal
          term={term}
          onClose={() => setSeoModalOpen(false)}
        />
      )}
    </li>
  );
}

// Modal exposing the primary-language SEO overrides for a term —
// `<title>` and `<meta name="description">` displayed on the
// category archive page. Falls back to the term's own name +
// description when left blank. Saves directly through `updateTerm`
// without going through the row's pluginPatch state.
//
// Per-language SEO overrides are owned by the flexweg-multilang
// plugin, surfaced through its `TermTranslationsSection` rendered
// inline below the row (expand chevron). Keeping the modal scoped
// to the primary language keeps the core decoupled from any
// translation plugin while still giving every site a way to fix
// the most common SEO gap (generic `<title>` on category pages).
function TermSeoModal({ term, onClose }: { term: Term; onClose: () => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(term.seo?.title ?? "");
  const [description, setDescription] = useState(term.seo?.description ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  async function handleSave() {
    setBusy(true);
    try {
      const trimmedTitle = title.trim();
      const trimmedDescription = description.trim();
      const next: SeoMeta = {};
      if (trimmedTitle) next.title = trimmedTitle;
      if (trimmedDescription) next.description = trimmedDescription;
      const preservedOg = term.seo?.ogImage;
      if (preservedOg) next.ogImage = preservedOg;
      await updateTerm(term.id, { seo: next });
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="term-seo-modal-title"
      onClick={(e) => {
        if (busy) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card w-full max-w-lg p-5 animate-scale-in space-y-4">
        <div>
          <h2 id="term-seo-modal-title" className="text-base font-semibold">
            {t("taxonomies.seo.title")}
          </h2>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            {t("taxonomies.seo.subtitle", { name: term.name })}
          </p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-surface-700 dark:text-surface-300">
            {t("taxonomies.seo.metaTitle")}
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder={term.name}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            {t("taxonomies.seo.metaTitleHint")}
          </p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-surface-700 dark:text-surface-300">
            {t("taxonomies.seo.metaDescription")}
          </label>
          <textarea
            className="input w-full min-h-[80px] resize-y"
            placeholder={term.description ?? ""}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            {t("taxonomies.seo.metaDescriptionHint")}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => void handleSave()}
            disabled={busy}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Loader2 className={"h-4 w-4 animate-spin " + (busy ? "" : "hidden")} />
              <span>{t("common.save")}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
