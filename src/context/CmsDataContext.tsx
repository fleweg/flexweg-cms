import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { subscribeToTerms } from "../services/taxonomies";
import { subscribeToMedia } from "../services/media";
import { subscribeToSettings, DEFAULT_SITE_SETTINGS } from "../services/settings";
import { subscribeToUsers } from "../services/users";
import { subscribeToPosts } from "../services/posts";
import { applyPluginRegistration } from "../plugins";
import { applyThemeRegistration } from "../themes";
import type { Media, Post, SiteSettings, Term, UserRecord } from "../core/types";

// Posts + pages live behind two access patterns, gated by
// `settings.paginationMode`:
//
//   • "global" (default, no Firestore index setup) — a global
//     subscription on the entire `posts` collection populates `posts`
//     and `pages` here. Display hooks (usePostsPage, useAllPosts) and
//     useCountPosts read straight from the context. Best for sites
//     under a few thousand entries.
//
//   • "paginated" (opt-in) — no global subscription; the context
//     exposes empty arrays. Display hooks fall back to
//     subscribeToPostsPaginated (cursor pagination) and fetchAllPosts
//     (one-shot, cached). Requires composite indexes — see README.
//
// Either way the publish pipeline calls fetchAllPosts() in
// services/posts.ts, which is index-free in both modes.
interface CmsDataValue {
  terms: Term[];
  categories: Term[];
  tags: Term[];
  media: Media[];
  // Posts + pages, populated only in paginationMode === "global".
  // Empty arrays in "paginated" mode — display hooks bypass the
  // context in that case. `postsLoaded` flips false → true once the
  // first global snapshot lands so consumers can distinguish "still
  // loading" from "actually empty".
  posts: Post[];
  pages: Post[];
  postsLoaded: boolean;
  // All known user records. Used by publish callers to build an
  // authorLookup that resolves any post's authorId — not just the
  // currently-authenticated user — so AuthorBio renders for every
  // post regardless of who clicks Publish.
  users: UserRecord[];
  settings: SiteSettings;
  loading: boolean;
  error: Error | null;
}

const CmsDataContext = createContext<CmsDataValue | null>(null);

export function CmsDataProvider({ children }: { children: ReactNode }) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [loadingFlags, setLoadingFlags] = useState({
    terms: true,
    media: true,
    users: true,
    settings: true,
  });
  const [error, setError] = useState<Error | null>(null);

  // Wrap setError so Firestore listener errors are also logged. Otherwise a
  // missing index / rules-denied / network failure surfaces silently — a
  // listener just stops emitting, the UI stays empty, and there's no clue
  // in the console.
  function reportError(err: Error) {
    console.error("[CmsData] Firestore listener error:", err);
    setError(err);
  }

  useEffect(() => {
    const unsubs = [
      subscribeToTerms(
        (items) => {
          setTerms(items);
          setLoadingFlags((s) => ({ ...s, terms: false }));
        },
        reportError,
      ),
      subscribeToMedia(
        (items) => {
          setMedia(items);
          setLoadingFlags((s) => ({ ...s, media: false }));
        },
        reportError,
      ),
      subscribeToUsers(
        (items) => {
          setUsers(items);
          setLoadingFlags((s) => ({ ...s, users: false }));
        },
        reportError,
      ),
      subscribeToSettings(
        (s) => {
          setSettings(s);
          setLoadingFlags((s2) => ({ ...s2, settings: false }));
          // Re-register plugins whenever the enabled-flag map changes. Cheap
          // because the registry just rebuilds against in-memory manifests.
          // Plugin re-registration ALSO wipes plugin / theme blocks via
          // resetBlocks(); we then re-register the active theme's blocks
          // immediately after so the editor's inserter stays consistent
          // across both plugin toggles and theme switches.
          applyPluginRegistration(s.enabledPlugins ?? {});
          applyThemeRegistration(s.activeThemeId);
        },
        reportError,
      ),
    ];
    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global posts subscription — only active in paginationMode "global".
  // Re-runs whenever the mode flips (toast asks the user to reload, but
  // we still tear down cleanly if they navigate without reloading).
  const mode = settings.paginationMode ?? "global";
  useEffect(() => {
    if (mode !== "global") {
      setAllPosts([]);
      setPostsLoaded(false);
      return;
    }
    const unsub = subscribeToPosts(
      (items) => {
        setAllPosts(items);
        setPostsLoaded(true);
      },
      reportError,
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const posts = useMemo(() => allPosts.filter((p) => p.type === "post"), [allPosts]);
  const pages = useMemo(() => allPosts.filter((p) => p.type === "page"), [allPosts]);

  const value = useMemo<CmsDataValue>(() => {
    return {
      terms,
      categories: terms.filter((t) => t.type === "category"),
      tags: terms.filter((t) => t.type === "tag"),
      media,
      posts,
      pages,
      postsLoaded,
      users,
      settings,
      loading: Object.values(loadingFlags).some(Boolean),
      error,
    };
  }, [terms, media, posts, pages, postsLoaded, users, settings, loadingFlags, error]);

  return <CmsDataContext.Provider value={value}>{children}</CmsDataContext.Provider>;
}

export function useCmsData(): CmsDataValue {
  const ctx = useContext(CmsDataContext);
  if (!ctx) throw new Error("useCmsData must be used inside <CmsDataProvider>");
  return ctx;
}
