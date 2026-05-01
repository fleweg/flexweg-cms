import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useCmsData } from "../context/CmsDataContext";
import { isValidSlug, slugify } from "../core/slug";
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

  async function handleAdd() {
    const finalSlug = slug || slugify(name);
    if (!name.trim() || !isValidSlug(finalSlug)) return;
    setBusy(true);
    try {
      await createTerm({ type, name: name.trim(), slug: finalSlug });
      setName("");
      setSlug("");
    } finally {
      setBusy(false);
    }
  }

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
        <button type="button" className="btn-primary" onClick={handleAdd} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {type === "category" ? t("taxonomies.newCategory") : t("taxonomies.newTag")}
        </button>
      </div>
      {terms.length === 0 ? (
        <p className="text-sm text-surface-500 italic dark:text-surface-400">{t(emptyKey)}</p>
      ) : (
        <ul className="divide-y divide-surface-200 dark:divide-surface-800">
          {terms.map((term) => (
            <TermRow key={term.id} term={term} />
          ))}
        </ul>
      )}
    </section>
  );
}

function TermRow({ term }: { term: Term }) {
  const [name, setName] = useState(term.name);
  const [slug, setSlug] = useState(term.slug);
  const dirty = name !== term.name || slug !== term.slug;

  async function handleSave() {
    if (!isValidSlug(slug)) return;
    await updateTerm(term.id, { name, slug });
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${term.name}"?`)) return;
    await deleteTerm(term.id);
  }

  return (
    <li className="flex flex-wrap items-center gap-2 py-2">
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
      <button type="button" className="btn-secondary" onClick={handleSave} disabled={!dirty}>
        Save
      </button>
      <button type="button" className="btn-ghost" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
