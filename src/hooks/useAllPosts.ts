// Loads the full post or page corpus on mount — single React-shaped
// wrapper around fetchAllPosts() from services/posts.ts.
//
// Used by display surfaces that NEED to show the full list at once
// (menu item picker, hero block inspector, static-home page
// selector). The underlying fetchAllPosts has a 30 s cache, so
// multiple components mounting on the same admin session share a
// single Firestore read.
//
// NOT a real-time subscription — these surfaces re-fetch on remount
// (or when the cache expires). The list pages (PostsListPage /
// PagesListPage) use the live `usePostsPage` hook instead.

import { useEffect, useState } from "react";
import { fetchAllPosts } from "../services/posts";
import type { Post, PostType } from "../core/types";

export function useAllPosts(type: PostType): {
  posts: Post[];
  loading: boolean;
} {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [type]);

  return { posts, loading };
}
