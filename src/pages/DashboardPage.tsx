import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useCmsData } from "../context/CmsDataContext";
import { PageHeader } from "../components/layout/PageHeader";

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { posts, pages } = useCmsData();

  const stats = useMemo(() => {
    const all = [...posts, ...pages];
    return {
      posts: posts.length,
      pages: pages.length,
      online: all.filter((p) => p.status === "online").length,
      drafts: all.filter((p) => p.status === "draft").length,
    };
  }, [posts, pages]);

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.welcome", { email: user?.email ?? "" })}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label={t("dashboard.stats.totalPosts")} value={stats.posts} />
        <StatCard label={t("dashboard.stats.totalPages")} value={stats.pages} />
        <StatCard label={t("dashboard.stats.online")} value={stats.online} />
        <StatCard label={t("dashboard.stats.drafts")} value={stats.drafts} />
      </div>
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
