import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/layout/PageHeader";
import { useCountPosts } from "../hooks/useCountPosts";
import {
  listDashboardCards,
  subscribeDashboardCards,
} from "../core/dashboardCardRegistry";

// Dashboard stat cards. In paginationMode "global" (default) the
// counts come from CmsDataContext's in-memory list — instant and
// no Firestore round-trip. In "paginated" mode the hook falls back
// to Firestore aggregation queries.
export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const totalPosts = useCountPosts({ type: "post" });
  const totalPages = useCountPosts({ type: "page" });
  const postsOnline = useCountPosts({ type: "post", status: "online" });
  const pagesOnline = useCountPosts({ type: "page", status: "online" });
  const postsDraft = useCountPosts({ type: "post", status: "draft" });
  const pagesDraft = useCountPosts({ type: "page", status: "draft" });

  // Subscribe to the dashboard card registry. The registry is populated
  // asynchronously by applyPluginRegistration() (after the settings
  // Firestore snapshot lands), so a single mount-time snapshot used to
  // miss the cards on the very first dashboard render — the user had
  // to navigate away and back to see them. The subscription wakes us
  // up every time a plugin registers / unregisters a card.
  const [pluginCards, setPluginCards] = useState(() => listDashboardCards());
  useEffect(
    () => subscribeDashboardCards(() => setPluginCards(listDashboardCards())),
    [],
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.welcome", { email: user?.email ?? "" })}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label={t("dashboard.stats.totalPosts")} value={totalPosts.count} />
        <StatCard label={t("dashboard.stats.totalPages")} value={totalPages.count} />
        <StatCard
          label={t("dashboard.stats.online")}
          value={postsOnline.count + pagesOnline.count}
        />
        <StatCard
          label={t("dashboard.stats.drafts")}
          value={postsDraft.count + pagesDraft.count}
        />
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
