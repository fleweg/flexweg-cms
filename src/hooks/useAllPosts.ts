// Loads the full post or page corpus on mount. Behaviour depends on
// `settings.paginationMode`:
//
//   • "global" (default) — reads straight from CmsDataContext. The
//     global subscription is already running, so this is a zero-cost
//     read with live updates.
//
//   • "paginated" (opt-in) — calls fetchAllPosts (index-free, cached
//     for 30 s). Snapshot at mount; not a live subscription.
//
// Used by display surfaces that NEED to show the full list at once
// (menu item picker, hero block inspector, static-home page selector,
// post / page edit page slug-collision check).

import { useEffect, useState } from "react";
import { fetchAllPosts } from "../services/posts";
import { useCmsData } from "../context/CmsDataContext";
import type { Post, PostType } from "../core/types";

export function useAllPosts(type: PostType): {
  posts: Post[];
  loading: boolean;
} {
  const { settings, posts: ctxPosts, pages: ctxPages, postsLoaded } = useCmsData();
  const mode = settings.paginationMode ?? "global";

  // Both branches must be invoked unconditionally to keep the hook
  // call order stable across mode flips. The inactive branch returns
  // empty values which we ignore below.
  const fetched = useFetchedPosts(type, mode === "paginated");

  if (mode === "global") {
    return {
      posts: type === "post" ? ctxPosts : ctxPages,
      loading: !postsLoaded,
    };
  }
  return fetched;
}

function useFetchedPosts(
  type: PostType,
  active: boolean,
): { posts: Post[]; loading: boolean } {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(active);

  useEffect(() => {
    if (!active) {
      setPosts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void fetchAllPosts({ type }).then((all) => {
      if (cancelled) return;
      setPosts(all);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [active, type]);

  return { posts, loading };
}
