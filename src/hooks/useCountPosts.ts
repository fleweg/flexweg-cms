// Count hook with mode dispatch. Used by the dashboard stat cards
// and any other surface that wants a live "how many posts of type X
// in status Y?" without subscribing to the full corpus.
//
//   • "global" (default) — counts in memory from the CmsDataContext
//     posts/pages arrays. No Firestore round-trip; updates instantly
//     as the global subscription receives changes.
//
//   • "paginated" (opt-in) — runs a Firestore aggregation query via
//     countPosts(). Re-runs on every (type, status) change. Status-
//     filtered queries require the composite (type, status) index.

import { useEffect, useMemo, useState } from "react";
import { countPosts } from "../services/posts";
import { useCmsData } from "../context/CmsDataContext";
import type { PostStatus, PostType } from "../core/types";

export interface UseCountPostsOpts {
  type: PostType;
  status?: PostStatus;
}

export function useCountPosts(opts: UseCountPostsOpts): {
  count: number;
  loading: boolean;
} {
  const { settings, posts, pages, postsLoaded } = useCmsData();
  const mode = settings.paginationMode ?? "global";

  // Compute the in-memory count regardless of mode — it's effectively
  // free and keeping the hook order stable matters more than the few
  // CPU cycles saved by branching.
  const memCount = useMemo(() => {
    const source = opts.type === "post" ? posts : pages;
    return opts.status ? source.filter((p) => p.status === opts.status).length : source.length;
  }, [opts.type, opts.status, posts, pages]);

  const [serverCount, setServerCount] = useState(0);
  const [serverLoading, setServerLoading] = useState(mode === "paginated");

  useEffect(() => {
    if (mode !== "paginated") return;
    let cancelled = false;
    setServerLoading(true);
    void countPosts(opts).then((n) => {
      if (cancelled) return;
      setServerCount(n);
      setServerLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // opts is plain enough that destructuring keeps the deps stable
  }, [mode, opts.type, opts.status]);

  if (mode === "global") {
    return { count: memCount, loading: !postsLoaded };
  }
  return { count: serverCount, loading: serverLoading };
}
