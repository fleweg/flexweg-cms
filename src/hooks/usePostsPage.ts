// Real-time paginated subscription hook for the post / page list
// pages. Maintains a *list of cursors* — one per page already
// visited — so navigating back to a previously-loaded page is
// instant (we still re-subscribe so the data is fresh, but the
// cursor is already known).
//
// State machine:
//   page 1: cursor = undefined
//   page 2: cursor = result of page 1's subscription
//   page 3: cursor = result of page 2's subscription
//   …
//
// `nextPage` is gated on the current subscription having delivered
// `nextCursor` — which only happens once `posts.length === pageSize`.
// If the current page is the last (fewer docs than pageSize), the
// hook reports `hasNext: false` and `nextPage` is a no-op.
//
// Total count for "Showing X–Y of Z" comes from `countPosts()` and
// is refreshed alongside the page subscription.

import { useEffect, useMemo, useRef, useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  countPosts,
  subscribeToPostsPaginated,
  type PaginatedQueryResult,
} from "../services/posts";
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
  // True when there's data available beyond the current page (the
  // current page returned a full pageSize of docs and a usable
  // nextCursor exists).
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: () => void;
  prevPage: () => void;
  // Jump to page 1 — the caller does this when the filter changes
  // (otherwise the cursor stack may not match the new filter).
  resetToFirst: () => void;
}

export function usePostsPage(opts: UsePostsPageOpts): UsePostsPageResult {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  // cursors[i] is the cursor that, when used, returns page i+1.
  // cursors[0] is always `undefined` (page 1 has no cursor).
  const cursorsRef = useRef<(QueryDocumentSnapshot<DocumentData> | undefined)[]>([
    undefined,
  ]);
  // Reset cursor stack + page index whenever the filter shape
  // changes — old cursors don't transfer to a different filter.
  const filterKey = `${opts.type}:${opts.status ?? "all"}:${opts.pageSize}`;
  useEffect(() => {
    cursorsRef.current = [undefined];
    setPage(1);
  }, [filterKey]);

  // Refresh the total count whenever the filter changes. Cheap
  // (single-read aggregation query); we do NOT refresh on every
  // page change — the count doesn't depend on page.
  useEffect(() => {
    let cancelled = false;
    void countPosts({ type: opts.type, status: opts.status }).then((n) => {
      if (!cancelled) setTotalCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [opts.type, opts.status]);

  // Subscribe to the current page. Re-subscribes whenever `page`
  // changes; the unsubscribe in the cleanup keeps Firestore from
  // streaming docs we no longer care about.
  useEffect(() => {
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
        // Memoize the cursor for the *next* page so the user can
        // click Next without us doing extra round-trips.
        if (result.nextCursor) {
          cursorsRef.current[page] = result.nextCursor;
        } else {
          // No more pages — trim any stale cursor that's beyond
          // this page (e.g. previous filter had more pages).
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
  }, [opts.type, opts.status, opts.pageSize, page]);

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
