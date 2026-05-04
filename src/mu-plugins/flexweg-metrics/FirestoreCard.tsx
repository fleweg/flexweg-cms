import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { collection, getCountFromServer } from "firebase/firestore";
import { Database, Loader2, RefreshCw } from "lucide-react";
import { collections, getDb } from "../../services/firebase";
import { countPosts } from "../../services/posts";

interface Counts {
  posts: number;
  pages: number;
  terms: number;
  media: number;
  users: number;
  total: number;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ok"; counts: Counts }
  | { kind: "error" };

// Firestore counts via getCountFromServer aggregation queries — one
// read per call, regardless of corpus size. countPosts already
// type-filters internally; the other collections need no filter.
async function loadCounts(): Promise<Counts> {
  const db = getDb();
  const ref = (name: string) => collection(db, name);
  const [posts, pages, termsSnap, mediaSnap, usersSnap] = await Promise.all([
    countPosts({ type: "post" }),
    countPosts({ type: "page" }),
    getCountFromServer(ref(collections.terms)),
    getCountFromServer(ref(collections.media)),
    getCountFromServer(ref(collections.users)),
  ]);
  const terms = termsSnap.data().count;
  const media = mediaSnap.data().count;
  const users = usersSnap.data().count;
  return {
    posts,
    pages,
    terms,
    media,
    users,
    total: posts + pages + terms + media + users,
  };
}

export function FirestoreCard() {
  const { t } = useTranslation("flexweg-metrics");
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    void loadCounts()
      .then((counts) => {
        if (!cancelled) setState({ kind: "ok", counts });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-surface-50">
          <Database className="h-4 w-4 text-surface-500" />
          {t("firestore.title")}
        </h3>
        {state.kind === "ok" && (
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => setReloadKey((k) => k + 1)}
            aria-label={t("common.refresh")}
            title={t("common.refresh")}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {state.kind === "loading" && (
        <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {t("common.loading")}
        </div>
      )}

      {state.kind === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{t("firestore.error")}</p>
      )}

      {state.kind === "ok" && (
        <div className="space-y-2">
          <Row label={t("firestore.posts")} value={state.counts.posts} />
          <Row label={t("firestore.pages")} value={state.counts.pages} />
          <Row label={t("firestore.terms")} value={state.counts.terms} />
          <Row label={t("firestore.media")} value={state.counts.media} />
          <Row label={t("firestore.users")} value={state.counts.users} />
          <div className="pt-2 border-t border-surface-200 dark:border-surface-700">
            <Row label={t("firestore.total")} value={state.counts.total} bold />
          </div>
          <p className="text-xs text-surface-500 dark:text-surface-400 pt-1">
            {t("firestore.freeTierNote")}
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-sm">
      <span className={bold ? "font-semibold" : "text-surface-600 dark:text-surface-300"}>
        {label}
      </span>
      <span className="tabular-nums font-medium text-surface-900 dark:text-surface-50">
        {value}
      </span>
    </div>
  );
}
