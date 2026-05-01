import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { subscribeToPosts } from "../services/posts";
import { subscribeToTerms } from "../services/taxonomies";
import { subscribeToMedia } from "../services/media";
import { subscribeToSettings, DEFAULT_SITE_SETTINGS } from "../services/settings";
import { applyPluginRegistration } from "../plugins";
import type { Media, Post, SiteSettings, Term } from "../core/types";

interface CmsDataValue {
  posts: Post[];
  pages: Post[];
  terms: Term[];
  categories: Term[];
  tags: Term[];
  media: Media[];
  settings: SiteSettings;
  loading: boolean;
  error: Error | null;
}

const CmsDataContext = createContext<CmsDataValue | null>(null);

export function CmsDataProvider({ children }: { children: ReactNode }) {
  // Two separate subscriptions for posts vs pages because each is filtered
  // server-side. Keeps the working set small even when the site grows.
  const [posts, setPosts] = useState<Post[]>([]);
  const [pages, setPages] = useState<Post[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loadingFlags, setLoadingFlags] = useState({
    posts: true,
    pages: true,
    terms: true,
    media: true,
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
      subscribeToPosts(
        { type: "post" },
        (items) => {
          setPosts(items);
          setLoadingFlags((s) => ({ ...s, posts: false }));
        },
        reportError,
      ),
      subscribeToPosts(
        { type: "page" },
        (items) => {
          setPages(items);
          setLoadingFlags((s) => ({ ...s, pages: false }));
        },
        reportError,
      ),
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
      subscribeToSettings(
        (s) => {
          setSettings(s);
          setLoadingFlags((s2) => ({ ...s2, settings: false }));
          // Re-register plugins whenever the enabled-flag map changes. Cheap
          // because the registry just rebuilds against in-memory manifests.
          applyPluginRegistration(s.enabledPlugins ?? {});
        },
        reportError,
      ),
    ];
    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<CmsDataValue>(() => {
    return {
      posts,
      pages,
      terms,
      categories: terms.filter((t) => t.type === "category"),
      tags: terms.filter((t) => t.type === "tag"),
      media,
      settings,
      loading: Object.values(loadingFlags).some(Boolean),
      error,
    };
  }, [posts, pages, terms, media, settings, loadingFlags, error]);

  return <CmsDataContext.Provider value={value}>{children}</CmsDataContext.Provider>;
}

export function useCmsData(): CmsDataValue {
  const ctx = useContext(CmsDataContext);
  if (!ctx) throw new Error("useCmsData must be used inside <CmsDataProvider>");
  return ctx;
}
