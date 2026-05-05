// Page hook for the post / page list pages. Has two implementations
// internally, dispatched on `settings.paginationMode`:
//
//   • "global" (default) — reads `posts`/`pages` from CmsDataContext,
//     filters by status, slices in memory. No Firestore round-trips
//     beyond the global subscription that's already running.
//
//   • "paginated" (opt-in) — real-time cursor pagination via
//     subscribeToPostsPaginated + countPosts. Requires composite
//     Firestore indexes — see README "Firestore indexes".
//
// Both expose the same public shape so the consuming page components
// (PostsListPage, PagesListPage) don't branch.

import { useEffect, useMemo, useRef, useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  countPosts,
  subscribeToPostsPaginated,
  type PaginatedQueryResult,
} from "../services/posts";
import { useCmsData } from "../context/CmsDataContext";
import type { Post, PostStatus, PostType } from "../core/types";

export interface UsePostsPageOpts {
  type: PostType;
  status?: PostStatus;
  pageSize: number;
}

export interface UsePostsPageResult {
  posts: Post[];
  loading: boolean;
  // 1-based current page index. Starts at 1.
  page: number;
  // Total number of posts matching the current filter (across every
  // page). Updates alongside the page itself.
  totalCount: number;
  // Approximate total pages. Computed from totalCount / pageSize so
  // the user can see "Page 3 of 12" up-front instead of having to
  // paginate to discover the end.
  totalPages: number;
  // True when there's data available beyond the current page.
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: () => void;
  prevPage: () => void;
  // Jump to page 1 — the caller does this when the filter changes.
  resetToFirst: () => void;
}

export function usePostsPage(opts: UsePostsPageOpts): UsePostsPageResult {
  const { settings } = useCmsData();
  const mode = settings.paginationMode ?? "global";
  const globalResult = useGlobalPostsPage(opts, mode === "global");
  const paginatedResult = usePaginatedPostsPage(opts, mode === "paginated");
  return mode === "global" ? globalResult : paginatedResult;
}

// ─── Global mode (in-memory filter + slice) ─────────────────────────

function useGlobalPostsPage(opts: UsePostsPageOpts, active: boolean): UsePostsPageResult {
  const { posts, pages, postsLoaded } = useCmsData();
  const [page, setPage] = useState(1);

  const filterKey = `${opts.type}:${opts.status ?? "all"}:${opts.pageSize}`;
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const filtered = useMemo(() => {
    if (!active) return [] as Post[];
    const source = opts.type === "post" ? posts : pages;
    return opts.status ? source.filter((p) => p.status === opts.status) : source;
  }, [active, opts.type, opts.status, posts, pages]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / opts.pageSize));
  const safePage = Math.min(page, totalPages);
  const sliced = useMemo(
    () => filtered.slice((safePage - 1) * opts.pageSize, safePage * opts.pageSize),
    [filtered, safePage, opts.pageSize],
  );

  return {
    posts: sliced,
    // The first global snapshot may not have landed yet — show a
    // loading indicator until then so the page doesn't briefly say
    // "0 results" before snapping to its real count.
    loading: active && !postsLoaded,
    page: safePage,
    totalCount,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
    nextPage: () => setPage((p) => Math.min(totalPages, p + 1)),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    resetToFirst: () => setPage(1),
  };
}

// ─── Paginated mode (cursor subscriptions, requires indexes) ────────

function usePaginatedPostsPage(
  opts: UsePostsPageOpts,
  active: boolean,
): UsePostsPageResult {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  // cursors[i] is the cursor that, when used, returns page i+1.
  // cursors[0] is always `undefined` (page 1 has no cursor).
  const cursorsRef = useRef<(QueryDocumentSnapshot<DocumentData> | undefined)[]>([
    undefined,
  ]);
  const filterKey = `${opts.type}:${opts.status ?? "all"}:${opts.pageSize}`;
  useEffect(() => {
    cursorsRef.current = [undefined];
    setPage(1);
  }, [filterKey]);

  // Refresh the total count whenever the filter changes.
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    void countPosts({ type: opts.type, status: opts.status }).then((n) => {
      if (!cancelled) setTotalCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [active, opts.type, opts.status]);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    const cursor = cursorsRef.current[page - 1];
    const unsub = subscribeToPostsPaginated(
      {
        type: opts.type,
        status: opts.status,
        pageSize: opts.pageSize,
        cursor,
      },
      (result: PaginatedQueryResult) => {
        setPosts(result.posts);
        if (result.nextCursor) {
          cursorsRef.current[page] = result.nextCursor;
        } else {
          cursorsRef.current = cursorsRef.current.slice(0, page);
        }
        setLoading(false);
      },
      (err) => {
        console.error("[usePostsPage] subscription error:", err);
        setLoading(false);
      },
    );
    return unsub;
  }, [active, opts.type, opts.status, opts.pageSize, page]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / opts.pageSize)),
    [totalCount, opts.pageSize],
  );

  const hasNext = page < totalPages && !!cursorsRef.current[page];
  const hasPrev = page > 1;

  return {
    posts,
    loading,
    page,
    totalCount,
    totalPages,
    hasNext,
    hasPrev,
    nextPage: () => setPage((p) => Math.min(totalPages, p + 1)),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    resetToFirst: () => setPage(1),
  };
}
