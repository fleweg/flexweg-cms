import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/layout/PageHeader";
import { countPosts } from "../services/posts";
import { listDashboardCards } from "../core/dashboardCardRegistry";

interface Stats {
  posts: number;
  pages: number;
  online: number;
  drafts: number;
}

// Dashboard pulls four numbers via Firestore aggregation queries
// (single read each, regardless of corpus size). With the global
// posts subscription gone, this is the only practical way to get
// stats without dragging the full collection into memory.
export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      countPosts({ type: "post" }),
      countPosts({ type: "page" }),
      countPosts({ type: "post", status: "online" }),
      countPosts({ type: "page", status: "online" }),
      countPosts({ type: "post", status: "draft" }),
      countPosts({ type: "page", status: "draft" }),
    ]).then(([posts, pages, postsOnline, pagesOnline, postsDraft, pagesDraft]) => {
      if (cancelled) return;
      setStats({
        posts,
        pages,
        online: postsOnline + pagesOnline,
        drafts: postsDraft + pagesDraft,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Snapshot the registered plugin cards once per mount. The registry
  // can change when a plugin is toggled, but the dashboard re-mounts
  // on navigation away/back so a cheap snapshot is enough; we don't
  // need to subscribe.
  const pluginCards = useMemo(() => listDashboardCards(), []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.welcome", { email: user?.email ?? "" })}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label={t("dashboard.stats.totalPosts")} value={stats?.posts ?? 0} />
        <StatCard label={t("dashboard.stats.totalPages")} value={stats?.pages ?? 0} />
        <StatCard label={t("dashboard.stats.online")} value={stats?.online ?? 0} />
        <StatCard label={t("dashboard.stats.drafts")} value={stats?.drafts ?? 0} />
      </div>
      {pluginCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pluginCards.map(({ id, component: Card }) => (
            <Card key={id} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-surface-500 dark:text-surface-400">{label}</p>
      <p className="text-2xl font-semibold text-surface-900 mt-1 dark:text-surface-50">{value}</p>
    </div>
  );
}
