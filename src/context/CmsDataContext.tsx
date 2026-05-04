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
import { applyPluginRegistration } from "../plugins";
import { applyThemeRegistration } from "../themes";
import type { Media, SiteSettings, Term, UserRecord } from "../core/types";

// Posts + pages are NOT in this context. They live behind two
// access patterns instead:
//
//   • Display-side (PostsListPage, PagesListPage, hero block, …) →
//     `usePostsPage()` + `subscribeToPostsPaginated()` for cursor-
//     based pagination, or the search mode's `fetchAllPosts()`.
//
//   • Publish-side (publisher pipeline, plugin force-regenerate
//     buttons, importer) → `fetchAllPosts()` from
//     `services/posts.ts` (cached for 30 s, invalidated on every
//     write).
//
// Removing posts/pages from this context lets sites with thousands
// of posts run the admin without paying a multi-MB initial fetch
// just to render the sidebar.
interface CmsDataValue {
  terms: Term[];
  categories: Term[];
  tags: Term[];
  media: Media[];
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

  const value = useMemo<CmsDataValue>(() => {
    return {
      terms,
      categories: terms.filter((t) => t.type === "category"),
      tags: terms.filter((t) => t.type === "tag"),
      media,
      users,
      settings,
      loading: Object.values(loadingFlags).some(Boolean),
      error,
    };
  }, [terms, media, users, settings, loadingFlags, error]);

  return <CmsDataContext.Provider value={value}>{children}</CmsDataContext.Provider>;
}

export function useCmsData(): CmsDataValue {
  const ctx = useContext(CmsDataContext);
  if (!ctx) throw new Error("useCmsData must be used inside <CmsDataProvider>");
  return ctx;
}
