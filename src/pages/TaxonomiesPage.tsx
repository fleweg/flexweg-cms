import { useMemo, useState } from "react";
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
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
import type { Term, TermType } from "../core/types";

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
  const dirty = name !== term.name || slug !== term.slug;
  const collision = useMemo(() => {
    if (!isValidSlug(slug)) return null;
    return detectTermSlugCollision({ type: term.type, slug }, terms, term.id);
  }, [slug, term.type, term.id, terms]);

  async function handleSave() {
    if (!isValidSlug(slug)) return;
    if (collision) return;
    await updateTerm(term.id, { name, slug });
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${term.name}"?`)) return;
    await deleteTerm(term.id);
  }

  return (
    <li className="py-2 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
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
    </li>
  );
}
