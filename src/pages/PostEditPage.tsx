import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ImageIcon, Loader2, Save, Trash2 } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useCmsData } from "../context/CmsDataContext";
import { MarkdownEditor } from "../components/editor/MarkdownEditor";
import { MediaPicker } from "../components/editor/MediaPicker";
import { StatusBadge } from "../components/publishing/StatusBadge";
import { PublishButton } from "../components/publishing/PublishButton";
import { PublishLog } from "../components/publishing/PublishLog";
import { isValidSlug, slugify } from "../core/slug";
import { createPost, deletePost, updatePost } from "../services/posts";
import {
  buildPublishContext,
  deletePostAndUnpublish,
  type PublishLogEntry,
} from "../services/publisher";
import type { Media, Post } from "../core/types";

export function PostEditPage() {
  return <PostOrPageEditPage type="post" />;
}

interface PostOrPageEditPageProps {
  type: "post" | "page";
}

export function PostOrPageEditPage({ type }: PostOrPageEditPageProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, pages, categories, tags, media, settings } = useCmsData();
  const isNew = !id;
  const list = type === "post" ? posts : pages;
  const existing = useMemo(() => list.find((p) => p.id === id), [list, id]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [primaryTermId, setPrimaryTermId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [heroMediaId, setHeroMediaId] = useState<string | undefined>();
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [logEntries, setLogEntries] = useState<PublishLogEntry[]>([]);
  const [showHeroPicker, setShowHeroPicker] = useState(false);
  const [showInlinePicker, setShowInlinePicker] = useState(false);
  const inlinePickerResolveRef = useRef<((m: Media | null) => void) | null>(null);
  // Promise-based controller for the inline media picker. Lets the editor's
  // image button await the user's selection before inserting the URL.
  const [showLog, setShowLog] = useState(false);

  // Hydrate from Firestore record on first match. Only depend on the id +
  // existing.id to avoid resetting fields on every Firestore-driven re-render.
  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title);
    setSlug(existing.slug);
    setSlugDirty(true);
    setContentMarkdown(existing.contentMarkdown);
    setExcerpt(existing.excerpt ?? "");
    setPrimaryTermId(existing.primaryTermId ?? "");
    setTagIds(existing.termIds.filter((tid) => tags.some((tag) => tag.id === tid)));
    setHeroMediaId(existing.heroMediaId);
    setSeoTitle(existing.seo?.title ?? "");
    setSeoDescription(existing.seo?.description ?? "");
    // tags is intentionally outside the deps: we re-derive tagIds when the
    // list of available tags changes (rare) but not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  // Keep the slug in sync with the title until the user types into it.
  useEffect(() => {
    if (slugDirty) return;
    setSlug(slugify(title));
  }, [title, slugDirty]);

  const slugValid = isValidSlug(slug);
  const heroMedia = heroMediaId ? media.find((m) => m.id === heroMediaId) : undefined;

  async function handleSave() {
    if (!user) return;
    if (!title.trim()) return;
    if (!slugValid) return;
    setSaving(true);
    try {
      const termIds = primaryTermId ? [primaryTermId, ...tagIds] : [...tagIds];
      const seo = seoTitle || seoDescription
        ? { title: seoTitle || undefined, description: seoDescription || undefined }
        : undefined;
      if (isNew) {
        const newId = await createPost({
          type,
          title,
          slug,
          contentMarkdown,
          excerpt: excerpt || undefined,
          authorId: user.uid,
          termIds,
          primaryTermId: primaryTermId || undefined,
          heroMediaId,
          seo,
        });
        navigate(`/${type === "post" ? "posts" : "pages"}/${newId}`, { replace: true });
      } else if (existing) {
        await updatePost(existing.id, {
          title,
          slug,
          contentMarkdown,
          excerpt: excerpt || null,
          termIds,
          primaryTermId: primaryTermId || null,
          heroMediaId: heroMediaId ?? null,
          seo: seo ?? undefined,
        });
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    if (!window.confirm("Delete this entry?")) return;
    setShowLog(true);
    const log = (entry: PublishLogEntry) => setLogEntries((prev) => [...prev, entry]);
    try {
      const ctx = await buildPublishContext({
        posts,
        pages,
        terms: [...categories, ...tags],
        settings,
        authorLookup: () => undefined,
      });
      await deletePostAndUnpublish(existing.id, ctx, log);
      await deletePost(existing.id);
      navigate(`/${type === "post" ? "posts" : "pages"}`);
    } catch (err) {
      log({ level: "error", message: (err as Error).message });
    }
  }

  function appendLog(entry: PublishLogEntry) {
    setShowLog(true);
    setLogEntries((prev) => [...prev, entry]);
  }

  async function pickInlineMedia(): Promise<{ url: string; alt?: string } | null> {
    setShowInlinePicker(true);
    return new Promise((resolve) => {
      inlinePickerResolveRef.current = (m) => {
        setShowInlinePicker(false);
        inlinePickerResolveRef.current = null;
        resolve(m ? { url: m.url, alt: m.alt } : null);
      };
    });
  }

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title={
          isNew
            ? type === "post"
              ? t("posts.edit.newTitle")
              : "New page"
            : type === "post"
              ? t("posts.edit.editTitle")
              : "Edit page"
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate(`/${type === "post" ? "posts" : "pages"}`)}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </button>
            {existing && <StatusBadge status={existing.status} />}
            <button type="button" className="btn-secondary" onClick={handleSave} disabled={saving || !slugValid}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? t("common.saving") : t("common.save")}
            </button>
            {existing && <PublishButton post={existing as Post} onLog={appendLog} />}
            {existing && (
              <button type="button" className="btn-ghost" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                {t("common.delete")}
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            className="input text-lg font-semibold"
            placeholder={t("posts.fields.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="label">{t("posts.fields.slug")}</label>
            <input
              type="text"
              className="input"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugDirty(true);
              }}
            />
            {!slugValid && slug && (
              <p className="text-xs text-red-600 mt-1">Lower-case, ASCII, dash-separated only.</p>
            )}
          </div>

          <div>
            <label className="label">{t("posts.fields.excerpt")}</label>
            <textarea
              className="input min-h-[60px]"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          <div>
            <label className="label">{t("posts.fields.content")}</label>
            <MarkdownEditor
              value={contentMarkdown}
              onChange={setContentMarkdown}
              onPickMedia={pickInlineMedia}
            />
          </div>

          {showLog && <PublishLog entries={logEntries} />}
        </div>

        <aside className="space-y-4">
          <div className="card p-4 space-y-3">
            <div>
              <label className="label">{t("posts.fields.heroImage")}</label>
              {heroMedia ? (
                <div className="space-y-2">
                  <img
                    src={heroMedia.url}
                    alt={heroMedia.alt ?? ""}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button type="button" className="btn-ghost text-xs" onClick={() => setShowHeroPicker(true)}>
                      {t("common.edit")}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost text-xs"
                      onClick={() => setHeroMediaId(undefined)}
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" className="btn-secondary w-full" onClick={() => setShowHeroPicker(true)}>
                  <ImageIcon className="h-4 w-4" />
                  {t("media.upload")}
                </button>
              )}
            </div>
          </div>

          {type === "post" && (
            <div className="card p-4 space-y-3">
              <div>
                <label className="label">{t("posts.fields.category")}</label>
                <select
                  className="input"
                  value={primaryTermId}
                  onChange={(e) => setPrimaryTermId(e.target.value)}
                >
                  <option value="">{t("common.none")}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">{t("posts.fields.tags")}</label>
                <select
                  className="input"
                  multiple
                  value={tagIds}
                  size={Math.min(6, Math.max(3, tags.length))}
                  onChange={(e) =>
                    setTagIds(Array.from(e.target.selectedOptions).map((opt) => opt.value))
                  }
                >
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="card p-4 space-y-3">
            <div>
              <label className="label">{t("posts.fields.seoTitle")}</label>
              <input
                type="text"
                className="input"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t("posts.fields.seoDescription")}</label>
              <textarea
                className="input min-h-[60px]"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
              />
            </div>
          </div>
        </aside>
      </div>

      {showHeroPicker && (
        <MediaPicker
          onPick={(m) => {
            setHeroMediaId(m.id);
            setShowHeroPicker(false);
          }}
          onClose={() => setShowHeroPicker(false)}
        />
      )}
      {showInlinePicker && (
        <MediaPicker
          onPick={(m) => inlinePickerResolveRef.current?.(m)}
          onClose={() => inlinePickerResolveRef.current?.(null)}
        />
      )}
    </div>
  );
}
