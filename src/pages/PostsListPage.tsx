import { useEffect, useMemo, useRef, useState } from "react";
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
import { usePostsPage } from "../hooks/usePostsPage";
import { StatusBadge } from "../components/publishing/StatusBadge";
import { toast } from "../lib/toast";
import {
  buildPublishContext,
  deletePostAndUnpublish,
  publishPost,
  unpublishPost,
} from "../services/publisher";
import { deletePost, fetchAllPosts } from "../services/posts";
import { buildAuthorLookup } from "../services/users";
import type { Post, PostStatus } from "../core/types";
import { formatDate } from "../lib/utils";

type Filter = "all" | PostStatus;
type BulkAction = "publish" | "unpublish" | "delete";

const PAGE_SIZE = 100;

// Substring match across title + slug + excerpt. Multi-token
// (whitespace-separated): every token must appear somewhere in the
// haystack. Case-insensitive.
function matchesSearch(post: Post, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = `${post.title} ${post.slug} ${post.excerpt ?? ""}`.toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

export function PostsListPage() {
  const { t, i18n } = useTranslation();
  const { terms, settings, users, media } = useCmsData();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  // Selection persists across mode switches (browse ↔ search) and
  // across pages — IDs are stable, the filter can move underneath.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<BulkAction | null>(null);

  // ─── Mode switch: browse (paginated subscription) vs search ────
  // Any non-empty search query flips into search mode. Search mode
  // fetches the full corpus once (cached for 30 s in services/
  // posts.ts) and runs the substring filter client-side. Returning
  // to an empty search reverts to the lightweight paginated
  // subscription.
  const isSearchMode = search.trim().length > 0;

  // Browse mode: real-time paginated subscription via usePostsPage.
  const browse = usePostsPage({
    type: "post",
    status: filter === "all" ? undefined : filter,
    pageSize: PAGE_SIZE,
  });

  // Search mode: hold the full list + a separate page index so the
  // browse subscription's state isn't disturbed.
  const [searchAll, setSearchAll] = useState<Post[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  useEffect(() => {
    if (!isSearchMode) {
      // Drop the cached snapshot when leaving search mode so the
      // browse view is what's on screen.
      setSearchAll(null);
      setSearchPage(1);
      return;
    }
    let cancelled = false;
    setSearchLoading(true);
    void fetchAllPosts({ type: "post" }).then((all) => {
      if (cancelled) return;
      setSearchAll(all);
      setSearchLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isSearchMode]);

  // Reset search-mode page on filter/search change.
  useEffect(() => {
    setSearchPage(1);
  }, [search, filter]);

  // ─── Filter pipeline (search mode only) ────────────────────────
  const tokens = useMemo(
    () => search.toLowerCase().split(/\s+/).filter(Boolean),
    [search],
  );

  const matching = useMemo<Post[]>(() => {
    if (!isSearchMode || !searchAll) return [];
    const byStatus =
      filter === "all" ? searchAll : searchAll.filter((p) => p.status === filter);
    return byStatus.filter((p) => matchesSearch(p, tokens));
  }, [isSearchMode, searchAll, filter, tokens]);

  // ─── Unified view (whichever mode is active) ───────────────────
  const searchTotalPages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const searchSafePage = Math.min(Math.max(searchPage, 1), searchTotalPages);
  const searchPagedPosts = useMemo(
    () => matching.slice((searchSafePage - 1) * PAGE_SIZE, searchSafePage * PAGE_SIZE),
    [matching, searchSafePage],
  );

  const view = isSearchMode
    ? {
        posts: searchPagedPosts,
        loading: searchLoading,
        page: searchSafePage,
        totalCount: matching.length,
        totalPages: searchTotalPages,
        hasNext: searchSafePage < searchTotalPages,
        hasPrev: searchSafePage > 1,
        nextPage: () => setSearchPage((p) => Math.min(searchTotalPages, p + 1)),
        prevPage: () => setSearchPage((p) => Math.max(1, p - 1)),
      }
    : browse;

  // ─── Loaded-posts cache for bulk actions ───────────────────────
  // Bulk actions need full Post objects keyed by id. This Map grows
  // as the user paginates / searches, so resolving the selected set
  // is usually instant. Misses fall through to fetchAllPosts.
  const loadedPostsRef = useRef(new Map<string, Post>());
  useEffect(() => {
    for (const p of browse.posts) loadedPostsRef.current.set(p.id, p);
  }, [browse.posts]);
  useEffect(() => {
    if (searchAll) {
      for (const p of searchAll) loadedPostsRef.current.set(p.id, p);
    }
  }, [searchAll]);

  // ─── Selection helpers ─────────────────────────────────────────
  const selectedCount = selected.size;

  // Counts per status across the selection — drives the "Publish (N)"
  // label and the disabled state of action buttons. Computed from the
  // loaded cache; an id we can't resolve locally just isn't counted
  // (the bulk action resolves it via fetchAllPosts before running).
  const { draftSelected, onlineSelected } = useMemo(() => {
    let draft = 0;
    let online = 0;
    for (const id of selected) {
      const p = loadedPostsRef.current.get(id);
      if (!p) continue;
      if (p.status === "draft") draft++;
      else if (p.status === "online") online++;
    }
    return { draftSelected: draft, onlineSelected: online };
  }, [selected]);

  const allOnPageSelected =
    view.posts.length > 0 && view.posts.every((p) => selected.has(p.id));

  // In search mode we know the full matching set; in browse mode
  // the total count is just totalCount. The "Select all matching N"
  // banner shows when:
  //   - the user has selected the whole current page
  //   - AND there are more matching posts beyond the current page
  //   - AND not already in "all matching" state
  const hasMoreMatching = view.totalCount > view.posts.length;
  const allMatchingSelected = isSearchMode
    ? matching.length > 0 && matching.every((p) => selected.has(p.id))
    : view.totalCount > 0 && selectedCount >= view.totalCount; // browse mode best-effort

  const showSelectAllMatchingBanner =
    allOnPageSelected && hasMoreMatching && !allMatchingSelected;

  function toggleOne(id: string, on: boolean): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllOnPage(): void {
    setSelected((prev) => {
      const next = new Set(prev);
      const everyChecked = view.posts.every((p) => next.has(p.id));
      if (everyChecked) {
        for (const p of view.posts) next.delete(p.id);
      } else {
        for (const p of view.posts) next.add(p.id);
      }
      return next;
    });
  }

  // Selects every matching post across every page. In browse mode
  // we need to fetch the full filtered corpus first (one-shot,
  // cached). In search mode we already have it locally.
  async function selectAllMatching(): Promise<void> {
    if (isSearchMode && matching.length > 0) {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const p of matching) next.add(p.id);
        return next;
      });
      return;
    }
    // Browse mode — need to fetch.
    const all = await fetchAllPosts({ type: "post" });
    const filteredByStatus =
      filter === "all" ? all : all.filter((p) => p.status === filter);
    // Populate the cache while we have it — avoids a second fetch
    // when the bulk action runs.
    for (const p of filteredByStatus) loadedPostsRef.current.set(p.id, p);
    setSelected((prev) => {
      const next = new Set(prev);
      for (const p of filteredByStatus) next.add(p.id);
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
      terms,
      settings,
      users,
      authorLookup: buildAuthorLookup(users, media),
    });
  }

  // Resolves selected ids → Post[]. Cache-first; misses force a
  // full fetch (rare — only happens if the user selected something
  // and then navigated away enough that even the global cache went
  // cold).
  async function resolveSelected(): Promise<Post[]> {
    const cached: Post[] = [];
    const missing: string[] = [];
    for (const id of selected) {
      const p = loadedPostsRef.current.get(id);
      if (p) cached.push(p);
      else missing.push(id);
    }
    if (missing.length === 0) return cached;
    const all = await fetchAllPosts({ type: "post" });
    const byId = new Map(all.map((p) => [p.id, p]));
    for (const p of all) loadedPostsRef.current.set(p.id, p);
    const found: Post[] = cached.slice();
    for (const id of missing) {
      const p = byId.get(id);
      if (p) found.push(p);
    }
    return found;
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
    const all = await resolveSelected();
    const targets = all
      .filter((p) => p.status === "draft")
      .map((p) => ({ id: p.id, title: p.title }));
    await runBatch("publish", targets);
  }

  async function handleUnpublish(): Promise<void> {
    const all = await resolveSelected();
    const targets = all
      .filter((p) => p.status === "online")
      .map((p) => ({ id: p.id, title: p.title }));
    await runBatch("unpublish", targets);
  }

  async function handleDelete(): Promise<void> {
    if (selectedCount === 0) return;
    if (!window.confirm(t("posts.bulk.confirmDelete", { count: selectedCount }))) {
      return;
    }
    const all = await resolveSelected();
    const targets = all.map((p) => ({ id: p.id, title: p.title }));
    await runBatch("delete", targets);
  }

  // ─── Render ────────────────────────────────────────────────────
  const fromIdx = view.totalCount === 0 ? 0 : (view.page - 1) * PAGE_SIZE + 1;
  const toIdx = Math.min(view.page * PAGE_SIZE, view.totalCount);

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
              title={draftSelected === 0 ? t("posts.bulk.noDraftSelected") : undefined}
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
              title={onlineSelected === 0 ? t("posts.bulk.noOnlineSelected") : undefined}
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

      {view.loading && view.posts.length === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
          {t("scan.scanning", { defaultValue: "Loading…" })}
        </div>
      ) : view.totalCount === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {isSearchMode ? (
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
          ) : filter === "all" ? (
            t("posts.noPosts")
          ) : (
            t("posts.noPostsInFilter")
          )}
        </div>
      ) : (
        <div className="card divide-y divide-surface-200 dark:divide-surface-800">
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-50 dark:bg-surface-900/40">
            <button
              type="button"
              onClick={toggleAllOnPage}
              className="flex items-center gap-2 text-xs text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50"
              aria-label={
                allOnPageSelected
                  ? t("posts.bulk.deselectPage")
                  : t("posts.bulk.selectPage", { count: view.posts.length })
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
                  : t("posts.bulk.selectPage", { count: view.posts.length })}
              </span>
            </button>

            {showSelectAllMatchingBanner && (
              <span className="ml-auto text-xs text-surface-600 dark:text-surface-400">
                {t("posts.bulk.allOnPageSelected", { count: view.posts.length })}{" "}
                <button
                  type="button"
                  onClick={() => void selectAllMatching()}
                  className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                >
                  {t("posts.bulk.selectAllMatching", { count: view.totalCount })}
                </button>
              </span>
            )}
            {allMatchingSelected && view.totalCount > view.posts.length && (
              <span className="ml-auto text-xs text-surface-600 dark:text-surface-400">
                {t("posts.bulk.allMatchingSelected", { count: view.totalCount })}{" "}
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

          {view.posts.map((post) => {
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

          {view.totalPages > 1 && (
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-surface-50 dark:bg-surface-900/40">
              <span className="text-xs text-surface-600 dark:text-surface-400">
                {t("posts.pagination.showing", {
                  from: fromIdx,
                  to: toIdx,
                  total: view.totalCount,
                })}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={view.prevPage}
                  disabled={!view.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("posts.pagination.previous")}
                </button>
                <span className="text-xs text-surface-600 dark:text-surface-400">
                  {t("posts.pagination.pageOf", {
                    page: view.page,
                    total: view.totalPages,
                  })}
                </span>
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={view.nextPage}
                  disabled={!view.hasNext}
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
