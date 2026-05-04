import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, Loader2, Plus, Send, Square, Trash2, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useCmsData } from "../context/CmsDataContext";
import { StatusBadge } from "../components/publishing/StatusBadge";
import { toast } from "../lib/toast";
import {
  buildPublishContext,
  deletePostAndUnpublish,
  publishPost,
  unpublishPost,
} from "../services/publisher";
import { deletePost } from "../services/posts";
import { buildAuthorLookup } from "../services/users";
import type { PostStatus } from "../core/types";
import { formatDate } from "../lib/utils";

type Filter = "all" | PostStatus;
type BulkAction = "publish" | "unpublish" | "delete";

export function PostsListPage() {
  const { t, i18n } = useTranslation();
  const { posts, pages, terms, settings, users, media } = useCmsData();
  const [filter, setFilter] = useState<Filter>("all");
  // Selection lives at the page level; persists across filter changes
  // so a user can switch filters mid-selection (filter to "online" →
  // pick 3, switch to "draft" → pick 2 more, then act on all 5).
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<BulkAction | null>(null);

  const filtered = useMemo(
    () => posts.filter((p) => filter === "all" || p.status === filter),
    [posts, filter],
  );

  const selectedPosts = useMemo(
    () => posts.filter((p) => selected.has(p.id)),
    [posts, selected],
  );
  const selectedCount = selectedPosts.length;
  const draftSelected = selectedPosts.filter((p) => p.status === "draft").length;
  const onlineSelected = selectedPosts.filter((p) => p.status === "online").length;

  const allInViewSelected =
    filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  function toggleOne(id: string, on: boolean): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllInView(): void {
    setSelected((prev) => {
      const next = new Set(prev);
      const everyChecked = filtered.every((p) => next.has(p.id));
      if (everyChecked) {
        for (const p of filtered) next.delete(p.id);
      } else {
        for (const p of filtered) next.add(p.id);
      }
      return next;
    });
  }

  function clearSelection(): void {
    setSelected(new Set());
  }

  // Single ctx reused across the batch — applyPostStatusInCtx
  // patches it in place after each publish/unpublish, so subsequent
  // iterations see the previous post's transition without us having
  // to rebuild from scratch.
  async function buildCtx() {
    return buildPublishContext({
      posts,
      pages,
      terms,
      settings,
      users,
      authorLookup: buildAuthorLookup(users, media),
    });
  }

  async function runBatch(
    action: BulkAction,
    targets: { id: string; title: string }[],
  ): Promise<void> {
    if (targets.length === 0) return;
    setBusy(action);
    let ok = 0;
    let failed = 0;
    try {
      const ctx = await buildCtx();
      for (const target of targets) {
        try {
          if (action === "publish") {
            await publishPost(target.id, ctx, () => {});
            ok++;
          } else if (action === "unpublish") {
            await unpublishPost(target.id, ctx, () => {});
            ok++;
          } else {
            // Two-phase delete:
            //   1. deletePostAndUnpublish wipes Flexweg files +
            //      patches the in-memory ctx so subsequent loop
            //      iterations don't see the post in listings.
            //   2. deletePost removes the Firestore doc, which is
            //      what makes the post disappear from the admin's
            //      live subscription.
            //
            // Phase 1 is best-effort — if it throws (transient
            // Flexweg API error, missing config, etc.) we still
            // proceed to phase 2 so the user's intent — "this post
            // is gone from my CMS" — is honored. Orphan files on
            // the public site are recoverable; a phantom Firestore
            // doc that won't go away isn't.
            try {
              await deletePostAndUnpublish(target.id, ctx, () => {});
            } catch (err) {
              console.error(
                `[bulk-delete] Flexweg cleanup failed for "${target.title}", deleting Firestore doc anyway:`,
                err,
              );
            }
            await deletePost(target.id);
            ok++;
          }
        } catch (err) {
          failed++;
          console.error(`[bulk-${action}] failed on "${target.title}":`, err);
        }
      }
      const msgKey =
        action === "publish"
          ? "posts.bulk.publishedCount"
          : action === "unpublish"
            ? "posts.bulk.unpublishedCount"
            : "posts.bulk.deletedCount";
      if (failed > 0) {
        toast.warn(t(msgKey, { ok, failed }));
      } else {
        toast.success(t(msgKey, { ok, failed }));
      }
      // Drop selection of items we just operated on. For delete we
      // remove them all (they're gone). For publish/unpublish we
      // also drop them — the "next bulk action" usage rarely wants
      // to keep operating on the same set after a transition.
      setSelected((prev) => {
        const next = new Set(prev);
        for (const target of targets) next.delete(target.id);
        return next;
      });
    } finally {
      setBusy(null);
    }
  }

  async function handlePublish(): Promise<void> {
    const targets = selectedPosts
      .filter((p) => p.status === "draft")
      .map((p) => ({ id: p.id, title: p.title }));
    await runBatch("publish", targets);
  }

  async function handleUnpublish(): Promise<void> {
    const targets = selectedPosts
      .filter((p) => p.status === "online")
      .map((p) => ({ id: p.id, title: p.title }));
    await runBatch("unpublish", targets);
  }

  async function handleDelete(): Promise<void> {
    if (selectedCount === 0) return;
    if (!window.confirm(t("posts.bulk.confirmDelete", { count: selectedCount }))) {
      return;
    }
    const targets = selectedPosts.map((p) => ({ id: p.id, title: p.title }));
    await runBatch("delete", targets);
  }

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title={t("posts.title")}
        actions={
          <Link to="/posts/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            {t("posts.newPost")}
          </Link>
        }
      />

      <div className="mb-4 inline-flex rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
        {(["all", "draft", "online"] as Filter[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={
              filter === value
                ? "px-3 py-1 rounded-md text-sm font-medium bg-white text-surface-900 shadow-card dark:bg-surface-900 dark:text-surface-50"
                : "px-3 py-1 rounded-md text-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-300"
            }
          >
            {t(`posts.filters.${value}`)}
          </button>
        ))}
      </div>

      {/* Action bar — only when something is selected. Pinned above
          the list so it's always reachable while the user scrolls. */}
      {selectedCount > 0 && (
        <div className="mb-3 sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-md border border-surface-200 bg-white px-3 py-2 shadow-card dark:border-surface-700 dark:bg-surface-900">
          <span className="text-sm font-medium">
            {t("posts.bulk.selectedCount", { count: selectedCount })}
          </span>
          <div className="flex flex-wrap gap-2 ml-auto">
            <button
              type="button"
              className="btn-ghost"
              onClick={handlePublish}
              disabled={busy !== null || draftSelected === 0}
              title={
                draftSelected === 0 ? t("posts.bulk.noDraftSelected") : undefined
              }
            >
              {busy === "publish" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {busy === "publish"
                ? t("posts.bulk.publishing")
                : t("posts.bulk.publish", { count: draftSelected })}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={handleUnpublish}
              disabled={busy !== null || onlineSelected === 0}
              title={
                onlineSelected === 0 ? t("posts.bulk.noOnlineSelected") : undefined
              }
            >
              {busy === "unpublish" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Undo2 className="h-4 w-4" />
              )}
              {busy === "unpublish"
                ? t("posts.bulk.unpublishing")
                : t("posts.bulk.unpublish", { count: onlineSelected })}
            </button>
            <button
              type="button"
              className="btn-ghost text-red-600 hover:text-red-700 dark:text-red-400"
              onClick={handleDelete}
              disabled={busy !== null}
            >
              {busy === "delete" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {busy === "delete" ? t("posts.bulk.deleting") : t("posts.bulk.delete")}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={clearSelection}
              disabled={busy !== null}
            >
              {t("posts.bulk.clear")}
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {t("posts.noPosts")}
        </div>
      ) : (
        <div className="card divide-y divide-surface-200 dark:divide-surface-800">
          {/* Header row with select-all-in-view checkbox. Lives in
              the same card as the rows so the visual rhythm of the
              list isn't broken. */}
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-50 dark:bg-surface-900/40">
            <button
              type="button"
              onClick={toggleAllInView}
              className="flex items-center gap-2 text-xs text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50"
              aria-label={
                allInViewSelected
                  ? t("posts.bulk.deselectAllInView")
                  : t("posts.bulk.selectAllInView")
              }
            >
              {allInViewSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>
                {allInViewSelected
                  ? t("posts.bulk.deselectAllInView")
                  : t("posts.bulk.selectAllInView")}
              </span>
            </button>
          </div>
          {filtered.map((post) => {
            const checked = selected.has(post.id);
            return (
              <div
                key={post.id}
                className={
                  "flex items-center gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/40 " +
                  (checked ? "bg-surface-50 dark:bg-surface-800/40" : "")
                }
              >
                {/* Checkbox cell — explicit label wraps an
                    invisible-but-functional <input> so the click
                    target is generous and accessible. Keep it OUT
                    of the Link below so checking doesn't navigate. */}
                <label className="flex items-center cursor-pointer p-1 -m-1 shrink-0">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleOne(post.id, e.target.checked)}
                    className="h-4 w-4 cursor-pointer"
                    aria-label={t("posts.bulk.selectOne", { title: post.title || "(untitled)" })}
                  />
                </label>
                <Link
                  to={`/posts/${post.id}`}
                  className="flex flex-1 items-center justify-between gap-3 min-w-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate dark:text-surface-50">
                      {post.title || "(untitled)"}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5 dark:text-surface-400">
                      {post.slug || "—"} · {formatDate(post.updatedAt, i18n.resolvedLanguage)}
                    </p>
                  </div>
                  <StatusBadge status={post.status} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
