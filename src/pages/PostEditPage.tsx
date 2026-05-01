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
import {
  buildPostUrl,
  detectPathCollision,
  findAvailableSlug,
  isValidSlug,
  slugify,
} from "../core/slug";
import { pickMediaUrl } from "../core/media";
import { ADMIN_PREVIEW_KEY } from "../services/imageFormats";
import { createPost, deletePost, updatePost } from "../services/posts";
import {
  buildPublishContext,
  deletePostAndUnpublish,
  publishPost,
  type PublishLogEntry,
} from "../services/publisher";
import { toast } from "../lib/toast";
import type { Media, Post, SeoMeta } from "../core/types";

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

  // Keep the slug in sync with the title for new posts, until the user
  // types into the slug field. For existing posts the slug is hydrated
  // from Firestore and must not be clobbered: this effect would otherwise
  // run on the same first commit as the hydration effect, capture the
  // stale `slugDirty=false` from the initial render, and schedule a
  // setSlug(slugify("")) that wins over hydration's setSlug — leaving the
  // form with an empty (invalid) slug and a permanently-disabled Save
  // button.
  //
  // The auto-generated slug is also deduplicated against existing posts /
  // pages / categories: when the title produces a path that's already
  // taken, we append `-2`, `-3`, … until we land on a free path. This
  // mirrors WordPress's "post-2", "post-3" suffixes and prevents two
  // entries from silently overwriting each other on Flexweg.
  useEffect(() => {
    if (!isNew) return;
    if (slugDirty) return;
    const base = slugify(title);
    if (!base) {
      setSlug("");
      return;
    }
    const primaryTerm = primaryTermId
      ? categories.find((c) => c.id === primaryTermId)
      : undefined;
    const isUsed = (candidate: string): boolean => {
      const path = buildPostUrl({
        post: { type, slug: candidate },
        primaryTerm,
      });
      return detectPathCollision(path, posts, pages, [...categories, ...tags]) !== null;
    };
    setSlug(findAvailableSlug(base, isUsed));
  }, [title, slugDirty, isNew, primaryTermId, type, posts, pages, categories, tags]);

  const slugValid = isValidSlug(slug);
  const heroMedia = heroMediaId ? media.find((m) => m.id === heroMediaId) : undefined;

  // Detects whether the current draft would collide with another post,
  // page or category on its public URL. Computed live so the inline
  // validation message and the disabled state of the Save button stay in
  // sync with the form. Excludes the entity being edited via `id`.
  const collision = useMemo(() => {
    if (!slugValid) return null;
    const primaryTerm = primaryTermId
      ? categories.find((c) => c.id === primaryTermId)
      : undefined;
    let candidatePath: string;
    try {
      candidatePath = buildPostUrl({ post: { type, slug }, primaryTerm });
    } catch {
      return null;
    }
    return detectPathCollision(
      candidatePath,
      posts,
      pages,
      [...categories, ...tags],
      existing?.id,
    );
  }, [slugValid, slug, primaryTermId, type, posts, pages, categories, tags, existing?.id]);

  // Builds a SeoMeta object that never contains `undefined` values. The
  // top-level updatePost filter only skips `undefined` at the patch level,
  // so a nested `{ title: "x", description: undefined }` would otherwise
  // sneak through and Firestore rejects it with a silent payload error.
  function buildSeoPayload(): SeoMeta | undefined {
    const out: SeoMeta = {};
    if (seoTitle.trim()) out.title = seoTitle.trim();
    if (seoDescription.trim()) out.description = seoDescription.trim();
    return Object.keys(out).length > 0 ? out : undefined;
  }

  async function handleSave() {
    if (!user) return;
    if (!title.trim()) return;
    if (!slugValid) return;
    setSaving(true);
    setShowLog(false);
    try {
      const termIds = primaryTermId ? [primaryTermId, ...tagIds] : [...tagIds];
      const seo = buildSeoPayload();
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
        toast.success(t("posts.edit.draftSaved"));
        navigate(`/${type === "post" ? "posts" : "pages"}/${newId}`, { replace: true });
        return;
      }

      if (!existing) return;

      const heroFinal = heroMediaId ?? null;
      const primaryFinal = primaryTermId || null;
      await updatePost(existing.id, {
        title,
        slug,
        contentMarkdown,
        excerpt: excerpt || null,
        termIds,
        primaryTermId: primaryFinal,
        heroMediaId: heroFinal,
        // updatePost's top-level loop drops keys whose value is undefined,
        // so omitting `seo` when empty leaves the field untouched in
        // Firestore. To explicitly clear it, we'd need a deleteField()
        // sentinel — handled later if a UI affordance is added.
        seo: seo ?? undefined,
      });

      // If the post is already live, regenerate its static HTML right away
      // so the public site stays in sync with the edits. Without this,
      // saving an online post used to leave the published file untouched
      // until the user manually toggled Unpublish + Publish.
      if (existing.status === "online") {
        // The CmsDataContext snapshot in `posts`/`pages` doesn't yet
        // include the values we just wrote (Firestore subscription
        // hasn't propagated). Patch the publish context locally so
        // `publishPost` renders with the new title/slug/hero/etc.
        const patchedExisting: Post = {
          ...existing,
          title,
          slug,
          contentMarkdown,
          excerpt: excerpt || undefined,
          termIds,
          primaryTermId: primaryTermId || undefined,
          heroMediaId: heroMediaId ?? undefined,
          seo,
        };
        const ctx = await buildPublishContext({
          posts: posts.map((p) => (p.id === existing.id ? patchedExisting : p)),
          pages: pages.map((p) => (p.id === existing.id ? patchedExisting : p)),
          terms: [...categories, ...tags],
          settings,
          authorLookup: () => undefined,
        });
        setShowLog(true);
        setLogEntries([]);
        await publishPost(existing.id, ctx, appendLog);
        toast.success(t("posts.edit.savedAndRepublished"));
      } else {
        toast.success(t("posts.edit.saved"));
      }
    } catch (err) {
      const message = (err as Error).message;
      toast.error(message || t("posts.edit.saveFailed"));
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
        // Inline images inserted into post bodies use the default format
        // (typically "medium"). Editors can later swap formats per-image
        // by adding a custom Tiptap node — out of scope for the MVP.
        resolve(m ? { url: pickMediaUrl(m), alt: m.alt } : null);
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
            <button
              type="button"
              className={existing?.status === "online" ? "btn-primary" : "btn-secondary"}
              onClick={handleSave}
              disabled={saving || !slugValid || !!collision}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving
                ? t("common.saving")
                : existing?.status === "online"
                  ? t("posts.edit.saveAndRepublish")
                  : t("common.save")}
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
            {slugValid && collision && (
              <p className="text-xs text-red-600 mt-1">
                {t(`posts.edit.slugCollision.${collision.kind}`, { label: collision.label })}
              </p>
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
                    src={pickMediaUrl(heroMedia, ADMIN_PREVIEW_KEY)}
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
