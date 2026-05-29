import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  ExternalLink,
  ImageIcon,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import type { Editor } from "@tiptap/core";
import { Timestamp as TimestampImpl, type Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useCmsData } from "../context/CmsDataContext";
import { useAllPosts } from "../hooks/useAllPosts";
import { MarkdownEditor } from "../components/editor/MarkdownEditor";
import { MediaPicker } from "../components/editor/MediaPicker";
import { EditorTopbar } from "../components/editor/EditorTopbar";
import { InlineTitle } from "../components/editor/InlineTitle";
import { InlineSlug } from "../components/editor/InlineSlug";
import { EditorInspector, InspectorSection } from "../components/editor/EditorInspector";
import { PreviewModal } from "../components/editor/PreviewModal";
import { VariantTabBar } from "../components/editor/VariantTabBar";
import {
  listEditorVariantProviders,
  subscribeEditorVariantProviders,
  type EditorVariant,
  type EditorVariantProvider,
  type VariantFields,
} from "../core/editorVariantRegistry";
import { useSyncExternalStore } from "react";
import { useEditorStyleInjection } from "../hooks/useEditorStyleInjection";
import { StatusBadge } from "../components/publishing/StatusBadge";
import { PublishButton } from "../components/publishing/PublishButton";
import { PublishLogModal } from "../components/publishing/PublishLogModal";
import {
  buildPostUrl,
  detectPathCollision,
  findAvailableSlug,
  isValidSlug,
  slugify,
  type PathOwner,
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
import { renderPostPreview } from "../services/previewRenderer";
import { getActiveTheme } from "../themes";
import { buildAuthorLookup } from "../services/users";
import { toast } from "../lib/toast";
import type { Media, Post, SeoMeta } from "../core/types";

export function PostEditPage() {
  return <PostOrPageEditPage type="post" />;
}

// Converts a Firestore Timestamp (or undefined) into the
// "YYYY-MM-DDTHH:mm" string expected by <input type="datetime-local">.
// The input shows wall-clock time in the user's local timezone, so we
// emit local-zoned components (no timezone suffix).
function timestampToInputValue(ts: Timestamp | undefined): string {
  if (!ts) return "";
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Returns a Date when the input value differs from the existing
// Timestamp by at least a minute (datetime-local resolution). Empty or
// invalid input returns undefined — the patch loop in updatePost skips
// undefined keys, leaving Firestore unchanged.
function diffInputDate(input: string, existing: Timestamp | undefined): Date | undefined {
  if (!input) return undefined;
  const next = new Date(input);
  if (Number.isNaN(next.getTime())) return undefined;
  if (existing) {
    // datetime-local has minute resolution — compare on the rounded
    // millisecond to avoid spurious writes from the seconds we drop
    // when stringifying the existing timestamp.
    const prevRounded = Math.floor(existing.toMillis() / 60000) * 60000;
    if (prevRounded === next.getTime()) return undefined;
  }
  return next;
}

// Read-only display of the updatedAt timestamp using the active i18n
// locale's preferred date+time formatting.
function formatTimestamp(ts: Timestamp | undefined, locale: string): string {
  if (!ts) return "—";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(ts.toDate());
}

interface PostOrPageEditPageProps {
  type: "post" | "page";
}

export function PostOrPageEditPage({ type }: PostOrPageEditPageProps) {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, tags, media, settings, users, addOptimisticPost } = useCmsData();
  // Posts + pages used to come from the global subscription. Now
  // we fetch on mount (cached for 30 s in services/posts.ts) — the
  // edit page needs both lists for slug collision checks across the
  // whole corpus, plus the matching list to look up `existing`.
  const { posts } = useAllPosts("post");
  const { posts: pages } = useAllPosts("page");
  const isNew = !id;
  const list = type === "post" ? posts : pages;
  const existing = useMemo(() => list.find((p: Post) => p.id === id), [list, id]);

  // Apply the site-wide editor typography preference. Reads from the
  // same Firestore subscription that drives the rest of the page, so
  // any change in Settings → Editor reflects instantly.
  useEditorStyleInjection(settings.editorStyle);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  // Lazy initializer — for new posts, seed the editor from the
  // active theme's `defaultPostMarkdown[type]` when set. Existing
  // posts still load their own contentMarkdown via the hydrate
  // useEffect below, which fires only when `existing` resolves.
  const [contentMarkdown, setContentMarkdown] = useState<string>(() => {
    if (id) return "";
    try {
      const theme = getActiveTheme(settings.activeThemeId);
      return theme.defaultPostMarkdown?.[type] ?? "";
    } catch {
      return "";
    }
  });
  const [excerpt, setExcerpt] = useState("");
  const [primaryTermId, setPrimaryTermId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [heroMediaId, setHeroMediaId] = useState<string | undefined>();
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  // Date inputs use the "YYYY-MM-DDTHH:mm" format expected by
  // <input type="datetime-local">. Empty string = "no override" — the
  // existing Firestore value is left untouched on save.
  const [createdAtInput, setCreatedAtInput] = useState("");
  const [publishedAtInput, setPublishedAtInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [logEntries, setLogEntries] = useState<PublishLogEntry[]>([]);
  const [showHeroPicker, setShowHeroPicker] = useState(false);
  const [showInlinePicker, setShowInlinePicker] = useState(false);
  const inlinePickerResolveRef = useRef<((m: Media | null) => void) | null>(null);
  // Promise-based controller for the inline media picker. Lets the editor's
  // image button await the user's selection before inserting the URL.
  //
  // PublishLogModal auto-shows when `logEntries.length > 0` — no
  // separate showLog flag needed. Closing the modal calls
  // `setLogEntries([])` which hides it.
  // Tiptap editor instance, lifted from MarkdownEditor so the
  // EditorInspector's Block tab can read selection state and surface
  // per-block options.
  const [editor, setEditor] = useState<Editor | null>(null);
  const handleEditorReady = useCallback((next: Editor | null) => {
    setEditor(next);
  }, []);

  // Preview modal — controlled by a single Promise<string> that the
  // modal awaits internally. Set to a fresh promise each Open click
  // so the modal re-resolves with the current draft state; reset to
  // null on close so a re-open kicks a new render.
  const [previewPromise, setPreviewPromise] = useState<Promise<string> | null>(null);

  // ─── Editor variants (multilang etc.) ────────────────────────────
  //
  // The active variant provider is the first one that returns more
  // than one variant for this entity. The host renders a tab strip
  // above the editor and swaps the entire editor state when the user
  // switches variants. The Tiptap editor instance is preserved across
  // switches via `editor.commands.setContent()` so WYSIWYG + blocks +
  // drag-and-drop are identical for every variant.
  //
  // For non-primary variants, save flows through `provider.saveFields`
  // instead of the host's `updatePost`. The primary variant uses the
  // entity's native fields (the existing handleSave path).
  const variantProviders = useSyncExternalStore(
    subscribeEditorVariantProviders,
    listEditorVariantProviders,
    listEditorVariantProviders,
  );
  // Stable ctx for variant providers — settings + terms come from the
  // CmsDataContext subscription. Recomputed on relevant changes only.
  const variantCtx = useMemo(
    () => ({ settings, terms: [...categories, ...tags] }),
    [settings, categories, tags],
  );
  const variants = useMemo<EditorVariant[]>(() => {
    if (!existing) return [];
    for (const p of variantProviders) {
      const list = p.listVariants(existing, variantCtx);
      if (list.length > 1) return list;
    }
    return [];
  }, [existing, variantProviders, variantCtx]);
  const activeProvider = useMemo<EditorVariantProvider | null>(() => {
    if (!existing) return null;
    for (const p of variantProviders) {
      if (p.listVariants(existing, variantCtx).length > 1) return p;
    }
    return null;
  }, [existing, variantProviders, variantCtx]);
  const primaryVariantId = variants.find((v) => v.primary)?.id ?? "";
  const [activeVariantId, setActiveVariantId] = useState<string>("");
  // Re-sync the active variant id when the list changes. Falls back to
  // primary if the previously active id disappears.
  useEffect(() => {
    if (variants.length === 0) {
      setActiveVariantId("");
      return;
    }
    if (!variants.some((v) => v.id === activeVariantId)) {
      setActiveVariantId(primaryVariantId || variants[0]!.id);
    }
  }, [variants, primaryVariantId, activeVariantId]);
  // Local draft cache for non-primary variants. Keyed by variant id.
  // The primary variant's draft lives in the existing title / slug /
  // contentMarkdown / excerpt / seo state directly.
  const [variantDrafts, setVariantDrafts] = useState<Record<string, VariantFields>>({});
  // Reset draft cache when the entity changes (different post = fresh
  // drafts loaded from disk).
  useEffect(() => {
    setVariantDrafts({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  // True when the host is editing a non-primary variant. The save
  // logic, slug-collision logic and publish button all branch on this.
  const isOnPrimaryVariant =
    !activeVariantId || activeVariantId === primaryVariantId || variants.length <= 1;

  // Captures the current editor state into a VariantFields snapshot.
  // Used when switching variants — we stash the outgoing draft before
  // loading the incoming one.
  const captureCurrentFields = useCallback((): VariantFields => {
    const seo: { title?: string; description?: string; ogImage?: string } = {};
    if (seoTitle.trim()) seo.title = seoTitle.trim();
    if (seoDescription.trim()) seo.description = seoDescription.trim();
    return {
      title,
      slug,
      contentMarkdown,
      excerpt: excerpt || undefined,
      seo: Object.keys(seo).length > 0 ? seo : undefined,
    };
  }, [title, slug, contentMarkdown, excerpt, seoTitle, seoDescription]);

  // Applies a VariantFields snapshot to the editor state. Also swaps
  // the live Tiptap document via `editor.commands.setContent()` so the
  // WYSIWYG reflects the new variant without remounting (preserves
  // extensions, blocks, scroll, etc.).
  //
  // `slugAlreadySet` controls the auto-slug-from-title behaviour: pass
  // true when the variant has a saved slug (existing primary variant
  // or existing secondary translation), false when this is a fresh
  // empty draft and the user should benefit from auto-generation.
  const applyFieldsToEditor = useCallback(
    (fields: VariantFields, slugAlreadySet: boolean) => {
      setTitle(fields.title);
      setSlug(fields.slug);
      setSlugDirty(slugAlreadySet);
      setContentMarkdown(fields.contentMarkdown);
      setExcerpt(fields.excerpt ?? "");
      setSeoTitle(fields.seo?.title ?? "");
      setSeoDescription(fields.seo?.description ?? "");
      // Tiptap holds its own state — push the new markdown so the
      // visible document updates. tiptap-markdown's storage exposes a
      // `setMarkdown` helper at runtime; we fall back to setContent
      // on the chain when the helper is absent (older Tiptap).
      if (editor) {
        const md = (
          editor.storage as {
            markdown?: { setMarkdown?: (text: string) => void };
          }
        ).markdown;
        if (md?.setMarkdown) {
          md.setMarkdown(fields.contentMarkdown);
        } else {
          editor.commands.setContent(fields.contentMarkdown, false);
        }
      }
    },
    [editor],
  );

  // Switches the active variant. Stashes the current draft into the
  // cache (keyed by the OLD variant id), loads the incoming variant's
  // fields from the provider (or the cache), and applies them to the
  // editor.
  const handleVariantChange = useCallback(
    (nextId: string) => {
      if (!existing || !activeProvider) return;
      if (nextId === activeVariantId) return;
      void variantCtx; // referenced via closure in incoming resolution
      // Stash the OLD variant's current draft.
      const outgoing = activeVariantId;
      const draft = captureCurrentFields();
      setVariantDrafts((prev) => ({ ...prev, [outgoing]: draft }));
      // Resolve the incoming variant's data — prefer the in-memory
      // cache (the user already touched this tab), fall back to the
      // provider (loads from `entity.translations[...]` etc.), fall
      // back to an empty draft. Track whether the incoming variant
      // has a saved slug so the auto-slug-from-title hook only fires
      // for fresh / never-saved translations.
      let incoming: VariantFields | null = variantDrafts[nextId] ?? null;
      let hasSavedSlug = false;
      if (incoming) {
        hasSavedSlug = Boolean(incoming.slug);
      } else {
        if (nextId === primaryVariantId) {
          incoming = {
            title: existing.title,
            slug: existing.slug,
            contentMarkdown: existing.contentMarkdown,
            excerpt: existing.excerpt,
            seo: existing.seo,
          };
          hasSavedSlug = Boolean(existing.slug);
        } else {
          const loaded = activeProvider.loadFields(existing, nextId, variantCtx);
          if (loaded) {
            incoming = loaded;
            hasSavedSlug = Boolean(loaded.slug);
          }
        }
      }
      if (!incoming) {
        // Empty draft for this variant — start fresh. Auto-slug from
        // title will kick in as the user types.
        incoming = {
          title: "",
          slug: "",
          contentMarkdown: "",
          excerpt: "",
          seo: {},
        };
        hasSavedSlug = false;
      }
      setActiveVariantId(nextId);
      applyFieldsToEditor(incoming, hasSavedSlug);
    },
    [
      existing,
      activeProvider,
      activeVariantId,
      captureCurrentFields,
      variantDrafts,
      primaryVariantId,
      applyFieldsToEditor,
      variantCtx,
    ],
  );

  // Per-variant "is filled" predicate for the tab strip dot.
  const isVariantFilled = useCallback(
    (variant: EditorVariant): boolean => {
      if (!existing) return false;
      if (variant.id === activeVariantId) {
        // The active variant's "filled" status is whatever the user
        // currently has typed — base it on title + slug presence.
        return Boolean(title.trim() && slug.trim());
      }
      if (variantDrafts[variant.id]) {
        const d = variantDrafts[variant.id];
        return Boolean(d.title?.trim() && d.slug?.trim());
      }
      if (variant.primary) {
        return Boolean(existing.title && existing.slug);
      }
      if (activeProvider) {
        const f = activeProvider.loadFields(existing, variant.id, variantCtx);
        return Boolean(f?.title && f?.slug);
      }
      return false;
    },
    [existing, activeVariantId, title, slug, variantDrafts, activeProvider, variantCtx],
  );

  // One-shot guard read by the slug auto-gen effect below. React 18
  // batches state updates from sibling effects in the same render, so
  // when `existing` first resolves the auto-gen effect runs ALONGSIDE
  // the hydrate effect and sees the pre-hydrate `title=""` /
  // `slugDirty=false`. Without this guard it would call setSlug("")
  // after the hydrate's setSlug(existing.slug), and the hydrated slug
  // would disappear on the primary variant until the user manually
  // swaps tabs (which forces a fresh applyFieldsToEditor pass).
  const justHydratedRef = useRef(false);

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
    setCreatedAtInput(timestampToInputValue(existing.createdAt));
    setPublishedAtInput(timestampToInputValue(existing.publishedAt));
    // Tell the auto-slug-from-title effect that runs later in this
    // same render cycle to skip its run — see the ref's declaration
    // above for the race details.
    justHydratedRef.current = true;
    // tags is intentionally outside the deps: we re-derive tagIds when the
    // list of available tags changes (rare) but not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  // Keep the slug in sync with the title until the user manually
  // edits the slug field. Triggers for:
  //   - new posts (no `existing` yet)
  //   - existing posts on a variant that has no saved slug yet
  //     (typically a freshly opened translation tab)
  // `slugDirty` is the single source of truth: it's true whenever the
  // current variant already has a saved slug OR the user manually
  // typed into the slug input. False means "this slug is unmanaged —
  // generate it from the title".
  //
  // Auto-generated slug is deduplicated against existing posts /
  // pages / categories on the PRIMARY variant — same WordPress-style
  // "post-2", "post-3" suffixes that prevent silent overwrites on
  // Flexweg. For non-primary variants we skip the dedup because
  // collision detection is per-language (handled by the variant
  // provider at save time).
  // When auto-gen produces a suffixed slug (`my-post-2` because
  // `my-post` was already taken), this carries the owner of the base
  // collision so InlineSlug can show "Suggested X-2 because 'X' is
  // already used by post: Y". Without this, the suffix is silent and
  // the user is left guessing why their slug isn't what they typed.
  const [autoSlugCollisionOwner, setAutoSlugCollisionOwner] =
    useState<PathOwner | null>(null);

  useEffect(() => {
    if (slugDirty) return;
    // Skip exactly one cycle after the hydrate effect committed —
    // sibling effects don't see each other's pending state updates,
    // so the freshly-hydrated `slugDirty=true` isn't visible yet.
    // Without this guard the next two lines would overwrite the
    // hydrated slug with a slugified empty title.
    if (justHydratedRef.current) {
      justHydratedRef.current = false;
      return;
    }
    const base = slugify(title);
    if (!base) {
      setSlug("");
      setAutoSlugCollisionOwner(null);
      return;
    }
    if (!isOnPrimaryVariant) {
      // Non-primary variant — let the language's own collision
      // detection (provider.validate) handle uniqueness at save.
      setSlug(base);
      setAutoSlugCollisionOwner(null);
      return;
    }
    const primaryTerm = primaryTermId
      ? categories.find((c) => c.id === primaryTermId)
      : undefined;
    // Check the BASE path explicitly so we can tell the user which
    // entity owns the conflicting URL. Exclude the entity being
    // edited so an existing post doesn't appear to collide with
    // itself once its slug-from-title gets recomputed.
    const allTerms = [...categories, ...tags];
    const basePath = buildPostUrl({ post: { type, slug: base }, primaryTerm });
    const baseOwner = detectPathCollision(basePath, posts, pages, allTerms, existing?.id);
    if (!baseOwner) {
      setSlug(base);
      setAutoSlugCollisionOwner(null);
      return;
    }
    const isUsed = (candidate: string): boolean => {
      const path = buildPostUrl({
        post: { type, slug: candidate },
        primaryTerm,
      });
      return detectPathCollision(path, posts, pages, allTerms, existing?.id) !== null;
    };
    setSlug(findAvailableSlug(base, isUsed));
    setAutoSlugCollisionOwner(baseOwner);
  }, [
    title,
    slugDirty,
    isOnPrimaryVariant,
    primaryTermId,
    type,
    posts,
    pages,
    categories,
    tags,
    existing?.id,
  ]);

  const slugValid = isValidSlug(slug);
  const heroMedia = heroMediaId ? media.find((m) => m.id === heroMediaId) : undefined;

  // Detects whether the current draft would collide with another post,
  // page or category on its public URL. Computed live so the inline
  // validation message and the disabled state of the Save button stay
  // in sync with the form. Excludes the entity being edited via `id`.
  //
  // Non-primary variants skip core collision detection — the variant
  // provider does its own (per-language uniqueness check etc.) and
  // surfaces errors through its `validate` callback at save time.
  const collision = useMemo(() => {
    if (!isOnPrimaryVariant) return null;
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
  }, [
    isOnPrimaryVariant,
    slugValid,
    slug,
    primaryTermId,
    type,
    posts,
    pages,
    categories,
    tags,
    existing?.id,
  ]);

  // Visible URL prefix shown next to the editable slug in the inline
  // permalink strip. Categories live as URL segments only for posts;
  // pages always sit at the root regardless of taxonomy.
  //
  // When a non-primary variant is active, defer to the variant
  // provider's `getSlugPathPrefix` so the user sees the right
  // language-prefixed URL (e.g. "fr/actualites/" for the FR variant).
  const slugPathPrefix = useMemo(() => {
    if (!isOnPrimaryVariant && activeProvider && existing) {
      const fields = captureCurrentFields();
      const customPrefix = activeProvider.getSlugPathPrefix?.(
        existing,
        activeVariantId,
        fields,
        variantCtx,
      );
      if (customPrefix !== undefined) return customPrefix;
    }
    if (type !== "post") return "";
    if (!primaryTermId) return "";
    const term = categories.find((c) => c.id === primaryTermId);
    return term ? `${term.slug}/` : "";
  }, [
    isOnPrimaryVariant,
    activeProvider,
    existing,
    activeVariantId,
    captureCurrentFields,
    variantCtx,
    type,
    primaryTermId,
    categories,
  ]);

  const publishedUrl = useMemo(() => {
    if (!existing?.lastPublishedPath) return undefined;
    if (!settings.baseUrl) return undefined;
    return `${settings.baseUrl.replace(/\/$/, "")}/${existing.lastPublishedPath}`;
  }, [existing?.lastPublishedPath, settings.baseUrl]);

  // Builds a SeoMeta object that never contains `undefined` values. The
  // top-level updatePost filter only skips `undefined` at the patch
  // level, so a nested `{ title: "x", description: undefined }` would
  // otherwise sneak through and Firestore rejects it with a silent
  // payload error.
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

    // Lock the slug for the rest of the save flow. The user committed
    // to it by clicking Save; the auto-gen has no business second-
    // guessing it. Specifically this defends against an intermediate
    // render between `addOptimisticPost` (which adds the new post to
    // the in-memory list) and the URL change (which lands `existing`)
    // — in that brief window, the auto-gen would otherwise see the
    // freshly-added optimistic post as a collision and bump the slug
    // to `-2`, then optimistic & DB both stick at `-2`.
    if (!slugDirty) setSlugDirty(true);

    // Non-primary variant branch — dispatch to the provider's
    // saveFields. The primary variant continues through the standard
    // updatePost path below.
    if (!isOnPrimaryVariant && activeProvider && existing) {
      setSaving(true);
      setLogEntries([]);
      try {
        const fields = captureCurrentFields();
        const validationError = activeProvider.validate?.(
          existing,
          activeVariantId,
          fields,
          variantCtx,
        );
        if (validationError) {
          toast.error(validationError);
          return;
        }
        await activeProvider.saveFields(existing, activeVariantId, fields, variantCtx);
        // Cache the fresh draft so the host doesn't re-fetch from the
        // entity on the next variant switch.
        setVariantDrafts((prev) => ({ ...prev, [activeVariantId]: fields }));
        // If the post is already online, also republish so the
        // freshly-saved variant goes live alongside the others.
        // Matches the "Save and republish" UX of the primary variant.
        if (existing.status === "online") {
          const ctx = await buildPublishContext({
            terms: [...categories, ...tags],
            settings,
            users,
            authorLookup: buildAuthorLookup(users, media),
          });
          await publishPost(existing.id, ctx, appendLog);
          toast.success(t("posts.edit.savedAndRepublished"));
        } else {
          toast.success(t("posts.edit.saved"));
        }
      } catch (err) {
        toast.error((err as Error).message || t("posts.edit.saveFailed"));
      } finally {
        setSaving(false);
      }
      return;
    }

    setSaving(true);
    setLogEntries([]);
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
        // Optimistic insert — closes the latency gap between the
        // server-side INSERT and the next subscription tick (~4 s
        // in SQLite mode, ~100 ms in Firebase). Without it, the
        // PostEditPage re-renders post-navigate and finds nothing
        // in `useAllPosts`, briefly showing a "Post not found" flash.
        const nowTs = TimestampImpl.now();
        addOptimisticPost({
          id: newId,
          type,
          title,
          slug,
          contentMarkdown,
          excerpt: excerpt || undefined,
          heroMediaId: heroMediaId ?? undefined,
          authorId: user.uid,
          termIds,
          primaryTermId: primaryTermId || undefined,
          status: "draft",
          seo,
          createdAt: nowTs,
          updatedAt: nowTs,
        });
        toast.success(t("posts.edit.draftSaved"));
        navigate(`/${type === "post" ? "posts" : "pages"}/${newId}`, { replace: true });
        return;
      }

      if (!existing) return;

      const heroFinal = heroMediaId ?? null;
      const primaryFinal = primaryTermId || null;
      // Only commit a date override when the input differs from the
      // current Firestore value — keeps no-op saves from rewriting the
      // timestamps and prevents an empty input from accidentally
      // clearing a date.
      const createdAtOverride = diffInputDate(createdAtInput, existing.createdAt);
      const publishedAtOverride = diffInputDate(publishedAtInput, existing.publishedAt);
      await updatePost(existing.id, {
        title,
        slug,
        contentMarkdown,
        excerpt: excerpt || null,
        termIds,
        primaryTermId: primaryFinal,
        heroMediaId: heroFinal,
        // updatePost's top-level loop drops keys whose value is
        // undefined, so omitting `seo` when empty leaves the field
        // untouched in Firestore. To explicitly clear it, we'd need a
        // deleteField() sentinel — handled later if a UI affordance is
        // added.
        seo: seo ?? undefined,
        createdAt: createdAtOverride,
        publishedAt: publishedAtOverride,
      });

      // If the post is already live, regenerate its static HTML right
      // away so the public site stays in sync with the edits. Without
      // this, saving an online post used to leave the published file
      // untouched until the user manually toggled Unpublish + Publish.
      if (existing.status === "online") {
        // updatePost above invalidated the fetchAllPosts cache; the
        // ctx fetch picks up the fresh title / slug / category state
        // automatically. No need to hand-patch the lists.
        const ctx = await buildPublishContext({
          terms: [...categories, ...tags],
          settings,
          users,
          authorLookup: buildAuthorLookup(users, media),
        });
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

  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!existing) return;
    if (!window.confirm(t("posts.edit.confirmDelete"))) return;
    setLogEntries([]);
    setDeleting(true);
    const log = (entry: PublishLogEntry) => setLogEntries((prev) => [...prev, entry]);
    try {
      const ctx = await buildPublishContext({
        terms: [...categories, ...tags],
        settings,
        users,
        authorLookup: buildAuthorLookup(users, media),
      });
      await deletePostAndUnpublish(existing.id, ctx, log);
      await deletePost(existing.id);
      navigate(`/${type === "post" ? "posts" : "pages"}`);
    } catch (err) {
      log({ level: "error", message: (err as Error).message });
      // Only clear the loader on failure — on success we navigate
      // away and unmount, so the spinner stays until the route
      // change. Without that, the trash icon would re-appear for one
      // render between the await chain finishing and the navigate
      // committing, looking like a no-op click.
      setDeleting(false);
    }
  }

  function appendLog(entry: PublishLogEntry) {
    setLogEntries((prev) => [...prev, entry]);
  }

  // Builds a synthetic Post from the current editor state and hands
  // it to the preview pipeline. Both new and existing posts go through
  // the same path — for new ones we mint a synthetic id so blocks that
  // reference posts by id stay self-consistent during the render. The
  // returned promise feeds the modal which paints a loading state
  // until it resolves.
  function openPreview() {
    const termIds = primaryTermId ? [primaryTermId, ...tagIds] : [...tagIds];
    const seo: SeoMeta = {};
    if (seoTitle.trim()) seo.title = seoTitle.trim();
    if (seoDescription.trim()) seo.description = seoDescription.trim();
    const draft: Post = existing
      ? {
          ...existing,
          title,
          slug: slug || "preview",
          contentMarkdown,
          excerpt: excerpt || undefined,
          termIds,
          primaryTermId: primaryTermId || undefined,
          heroMediaId: heroMediaId ?? undefined,
          seo: Object.keys(seo).length ? seo : undefined,
        }
      : {
          id: "__preview__",
          type,
          title,
          slug: slug || "preview",
          contentMarkdown,
          excerpt: excerpt || undefined,
          authorId: user?.uid ?? "",
          termIds,
          primaryTermId: primaryTermId || undefined,
          heroMediaId,
          seo: Object.keys(seo).length ? seo : undefined,
          status: "draft",
        };

    setPreviewPromise(
      renderPostPreview({
        draft,
        posts,
        pages,
        terms: [...categories, ...tags],
        media,
        settings,
        users,
        authorLookup: buildAuthorLookup(users, media),
      }),
    );
  }

  async function pickInlineMedia(): Promise<{ url: string; alt?: string } | null> {
    setShowInlinePicker(true);
    return new Promise((resolve) => {
      inlinePickerResolveRef.current = (m) => {
        setShowInlinePicker(false);
        inlinePickerResolveRef.current = null;
        // Inline images inserted into post bodies use the default
        // format (typically "medium"). Editors can later swap formats
        // per-image by adding a custom Tiptap node — out of scope for
        // the MVP.
        resolve(m ? { url: pickMediaUrl(m), alt: m.alt } : null);
      };
    });
  }

  const pageHeading = isNew
    ? type === "post"
      ? t("posts.edit.newTitle")
      : t("pages.newPage")
    : type === "post"
      ? t("posts.edit.editTitle")
      : t("pages.title");

  // Suppress collision messaging while a save is mid-flight. After
  // `addOptimisticPost` lands but before the navigation commits, the
  // optimistic copy of the post being saved briefly appears as a
  // collision against itself (existing?.id isn't `newId` yet, so
  // detectPathCollision doesn't exclude it). Showing the red error
  // for those few frames looks like an actual save failure even
  // though everything is on track — confusing UX. We hide the
  // collision string entirely while `saving` is true and re-check
  // once it lands.
  const collisionMessage =
    !saving && slugValid && collision
      ? t(`posts.edit.slugCollision.${collision.kind}`, { label: collision.label })
      : undefined;

  // One-line reason the Save button is disabled. Surfaced both as a
  // hover tooltip on the button itself and as an inline message under
  // the slug input — so the user never has to wonder why nothing
  // happens when they click Save. `undefined` means the button is
  // ready to fire.
  const saveBlockedReason: string | undefined = !title.trim()
    ? t("posts.edit.saveBlocked.titleRequired")
    : !slug
      ? t("posts.edit.saveBlocked.slugRequired")
      : !slugValid
        ? t("posts.edit.saveBlocked.slugInvalid")
        : collisionMessage
          ? t("posts.edit.saveBlocked.slugCollision")
          : undefined;

  return (
    <>
      <EditorTopbar
        left={
          <>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate(`/${type === "post" ? "posts" : "pages"}`)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t("common.back")}</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-200 truncate">
                {pageHeading}
              </span>
              {existing && <StatusBadge status={existing.status} />}
            </div>
          </>
        }
        right={
          <>
            <button
              type="button"
              className="btn-ghost"
              onClick={openPreview}
              disabled={!title.trim()}
              title={t("posts.preview.title")}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden md:inline">{t("posts.preview.title")}</span>
            </button>
            {publishedUrl && (
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden md:inline">{t("posts.edit.viewPublished")}</span>
              </a>
            )}
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSave}
              disabled={saving || !!saveBlockedReason}
              title={saveBlockedReason}
              aria-disabled={saving || !!saveBlockedReason}
            >
              <Loader2 className={saving ? "h-4 w-4 animate-spin" : "hidden"} />
              <AlertCircle
                className={
                  !saving && saveBlockedReason
                    ? "h-4 w-4 text-amber-500"
                    : "hidden"
                }
              />
              <Save
                className={saving || saveBlockedReason ? "hidden" : "h-4 w-4"}
              />
              <span className="hidden sm:inline">
                {saving
                  ? t("common.saving")
                  : existing?.status === "online"
                    ? t("posts.edit.saveAndRepublish")
                    : t("common.save")}
              </span>
            </button>
            {existing && <PublishButton post={existing as Post} onLog={appendLog} />}
            {existing && (
              <button
                type="button"
                className="btn-ghost"
                onClick={handleDelete}
                disabled={deleting}
                aria-label={t("common.delete")}
                title={deleting ? (t("common.deleting") as string) : undefined}
              >
                <Loader2 className={deleting ? "h-4 w-4 animate-spin" : "hidden"} />
                <Trash2 className={deleting ? "hidden" : "h-4 w-4"} />
              </button>
            )}
          </>
        }
      />

      <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 max-w-3xl mx-auto w-full lg:mx-0">
          <VariantTabBar
            variants={variants}
            activeId={activeVariantId}
            onSelect={handleVariantChange}
            isFilled={isVariantFilled}
          />

          <div className="space-y-3">
            <InlineTitle
              value={title}
              onChange={setTitle}
              placeholder={t("posts.edit.titlePlaceholder")}
            />
            <InlineSlug
              slug={slug}
              onChange={(next) => {
                setSlug(next);
                setSlugDirty(true);
              }}
              pathPrefix={slugPathPrefix}
              pathSuffix=".html"
              invalid={!slugValid && !!slug}
              invalidMessage={t("posts.edit.slugFormatHint")}
              collisionMessage={collisionMessage}
              requiredHint={t("posts.edit.saveBlocked.slugRequired")}
              autoSuggestMessage={
                autoSlugCollisionOwner && !slugDirty && isOnPrimaryVariant
                  ? t("posts.edit.slugAutoSuffixed", {
                      base: slugify(title),
                      owner: t(
                        `posts.edit.slugAutoSuffixedOwner.${autoSlugCollisionOwner.kind}`,
                        { label: autoSlugCollisionOwner.label },
                      ),
                    })
                  : undefined
              }
            />
          </div>

          <div className="mt-8">
            <MarkdownEditor
              value={contentMarkdown}
              onChange={setContentMarkdown}
              onPickMedia={pickInlineMedia}
              onEditorReady={handleEditorReady}
            />
          </div>

          <PublishLogModal
            entries={logEntries}
            busy={false}
            onClear={() => setLogEntries([])}
          />
        </div>

        <EditorInspector
          editor={editor}
          entity={existing}
          save={handleSave}
          documentPanel={
            <>
              <InspectorSection title={t("posts.edit.inspector.featured")}>
                {heroMedia ? (
                  <div className="space-y-2">
                    <img
                      src={pickMediaUrl(heroMedia, ADMIN_PREVIEW_KEY)}
                      alt={heroMedia.alt ?? ""}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn-ghost text-xs"
                        onClick={() => setShowHeroPicker(true)}
                      >
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
                  <button
                    type="button"
                    className="btn-secondary w-full"
                    onClick={() => setShowHeroPicker(true)}
                  >
                    <ImageIcon className="h-4 w-4" />
                    {t("media.upload")}
                  </button>
                )}
              </InspectorSection>

              {type === "post" && (
                <InspectorSection title={t("posts.edit.inspector.categories")}>
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
                </InspectorSection>
              )}

              <InspectorSection title={t("posts.edit.inspector.excerpt")}>
                <textarea
                  className="input min-h-[60px]"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </InspectorSection>

              {existing && (
                <InspectorSection title={t("posts.edit.inspector.dates")}>
                  <div>
                    <label className="label">{t("posts.fields.createdAt")}</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={createdAtInput}
                      onChange={(e) => setCreatedAtInput(e.target.value)}
                    />
                  </div>
                  {(existing.publishedAt || existing.status === "online") && (
                    <div>
                      <label className="label">{t("posts.fields.publishedAt")}</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={publishedAtInput}
                        onChange={(e) => setPublishedAtInput(e.target.value)}
                      />
                    </div>
                  )}
                  <div>
                    <label className="label">{t("posts.fields.updatedAt")}</label>
                    <p className="text-xs text-surface-600 dark:text-surface-300">
                      {formatTimestamp(existing.updatedAt, i18n.language)}
                    </p>
                  </div>
                </InspectorSection>
              )}

              <InspectorSection title={t("posts.edit.inspector.seo")}>
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
              </InspectorSection>
            </>
          }
        />
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
      {previewPromise && (
        <PreviewModal
          htmlPromise={previewPromise}
          onClose={() => setPreviewPromise(null)}
        />
      )}
    </>
  );
}
