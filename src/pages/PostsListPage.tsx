import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Search,
  Send,
  Square,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
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
import type { Post, PostStatus } from "../core/types";
import { formatDate } from "../lib/utils";

type Filter = "all" | PostStatus;
type BulkAction = "publish" | "unpublish" | "delete";

const PAGE_SIZE = 100;

// Substring match across title + slug + excerpt. Multi-token: every
// whitespace-separated token must appear somewhere in the haystack.
// Case-insensitive. Cheap enough to run on every keystroke for tens
// of thousands of posts.
function matchesSearch(post: Post, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = `${post.title} ${post.slug} ${post.excerpt ?? ""}`.toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

export function PostsListPage() {
  const { t, i18n } = useTranslation();
  const { posts, pages, terms, settings, users, media } = useCmsData();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  // Selection lives at the page level; persists across filter / search /
  // page changes so a user can narrow the view, select, navigate, and
  // bulk-act on the cumulative set without the selection vanishing.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<BulkAction | null>(null);

  // ─── Filter chain: status → search → pagination ────────────────
  const filtered = useMemo(
    () => posts.filter((p) => filter === "all" || p.status === filter),
    [posts, filter],
  );

  const tokens = useMemo(
    () =>
      search
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean),
    [search],
  );

  const matching = useMemo(
    () => filtered.filter((p) => matchesSearch(p, tokens)),
    [filtered, tokens],
  );

  const totalPages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  // Clamp the requested page to the valid range. Combined with the
  // useEffect below that resets to 1 on filter/search changes this
  // protects against the "user was on page 5, refined search, page
  // 5 doesn't exist anymore" UX glitch.
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pagedPosts = useMemo(
    () => matching.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [matching, safePage],
  );

  // Reset to page 1 whenever the result set is filtered down.
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  // ─── Selection state derivation ────────────────────────────────
  const selectedPosts = useMemo(
    () => posts.filter((p) => selected.has(p.id)),
    [posts, selected],
  );
  const selectedCount = selectedPosts.length;
  const draftSelected = selectedPosts.filter((p) => p.status === "draft").length;
  const onlineSelected = selectedPosts.filter((p) => p.status === "online").length;

  // True when every post on the current page is selected. Drives the
  // master-checkbox icon and the "select all matching" banner trigger.
  const allOnPageSelected =
    pagedPosts.length > 0 && pagedPosts.every((p) => selected.has(p.id));

  // True when every matching post (across every page) is selected.
  const allMatchingSelected =
    matching.length > 0 && matching.every((p) => selected.has(p.id));

  // Gmail-style banner: shown when the user has selected the whole
  // current page AND there are more matching posts on other pages.
  // Hides itself once all matching posts are explicitly selected.
  const showSelectAllMatchingBanner =
    allOnPageSelected && matching.length > pagedPosts.length && !allMatchingSelected;

  // ─── Handlers ──────────────────────────────────────────────────
  function toggleOne(id: string, on: boolean): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  // Master checkbox toggles the *current page* only. Power-user path
  // for selecting every matching post is the banner below.
  function toggleAllOnPage(): void {
    setSelected((prev) => {
      const next = new Set(prev);
      const everyChecked = pagedPosts.every((p) => next.has(p.id));
      if (everyChecked) {
        for (const p of pagedPosts) next.delete(p.id);
      } else {
        for (const p of pagedPosts) next.add(p.id);
      }
      return next;
    });
  }

  function selectAllMatching(): void {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const p of matching) next.add(p.id);
      return next;
    });
  }

  function clearSelection(): void {
    setSelected(new Set());
  }

  function clearSearch(): void {
    setSearch("");
  }

  // ─── Bulk action runner ────────────────────────────────────────
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

  // ─── Render ────────────────────────────────────────────────────
  const fromIdx = matching.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const toIdx = Math.min(safePage * PAGE_SIZE, matching.length);

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

      {/* Search + status filter on the same row. Search grows to fill;
          filter buttons stay compact. */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("posts.search.placeholder")}
            className="input pl-8 pr-8"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
              aria-label={t("posts.search.clear")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="inline-flex rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
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
      </div>

      {/* Action bar — only when something is selected. */}
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

      {/* Empty-state copy varies depending on whether we're empty
          because the corpus is empty, or empty because of a filter /
          search. */}
      {matching.length === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {posts.length === 0 ? (
            t("posts.noPosts")
          ) : tokens.length > 0 ? (
            <>
              {t("posts.search.noResults")}{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline dark:text-blue-400"
                onClick={clearSearch}
              >
                {t("posts.search.clear")}
              </button>
            </>
          ) : (
            t("posts.noPostsInFilter")
          )}
        </div>
      ) : (
        <div className="card divide-y divide-surface-200 dark:divide-surface-800">
          {/* Master checkbox + select-all-matching banner */}
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-50 dark:bg-surface-900/40">
            <button
              type="button"
              onClick={toggleAllOnPage}
              className="flex items-center gap-2 text-xs text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50"
              aria-label={
                allOnPageSelected
                  ? t("posts.bulk.deselectPage")
                  : t("posts.bulk.selectPage")
              }
            >
              {allOnPageSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>
                {allOnPageSelected
                  ? t("posts.bulk.deselectPage")
                  : t("posts.bulk.selectPage", { count: pagedPosts.length })}
              </span>
            </button>

            {showSelectAllMatchingBanner && (
              <span className="ml-auto text-xs text-surface-600 dark:text-surface-400">
                {t("posts.bulk.allOnPageSelected", { count: pagedPosts.length })}{" "}
                <button
                  type="button"
                  onClick={selectAllMatching}
                  className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                >
                  {t("posts.bulk.selectAllMatching", { count: matching.length })}
                </button>
              </span>
            )}
            {allMatchingSelected && matching.length > pagedPosts.length && (
              <span className="ml-auto text-xs text-surface-600 dark:text-surface-400">
                {t("posts.bulk.allMatchingSelected", { count: matching.length })}{" "}
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                >
                  {t("posts.bulk.clear")}
                </button>
              </span>
            )}
          </div>

          {pagedPosts.map((post) => {
            const checked = selected.has(post.id);
            return (
              <div
                key={post.id}
                className={
                  "flex items-center gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/40 " +
                  (checked ? "bg-surface-50 dark:bg-surface-800/40" : "")
                }
              >
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

          {/* Pagination footer. Hidden when the entire result set fits
              on one page — the controls would be no-ops anyway. */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-surface-50 dark:bg-surface-900/40">
              <span className="text-xs text-surface-600 dark:text-surface-400">
                {t("posts.pagination.showing", {
                  from: fromIdx,
                  to: toIdx,
                  total: matching.length,
                })}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("posts.pagination.previous")}
                </button>
                <span className="text-xs text-surface-600 dark:text-surface-400">
                  {t("posts.pagination.pageOf", { page: safePage, total: totalPages })}
                </span>
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  {t("posts.pagination.next")}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
