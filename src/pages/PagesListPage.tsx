import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useCmsData } from "../context/CmsDataContext";
import { StatusBadge } from "../components/publishing/StatusBadge";
import { formatDate } from "../lib/utils";

export function PagesListPage() {
  const { t, i18n } = useTranslation();
  const { pages } = useCmsData();

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title={t("pages.title")}
        actions={
          <Link to="/pages/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            {t("pages.newPage")}
          </Link>
        }
      />

      {pages.length === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {t("pages.noPages")}
        </div>
      ) : (
        <div className="card divide-y divide-surface-200 dark:divide-surface-800">
          {pages.map((page) => (
            <Link
              key={page.id}
              to={`/pages/${page.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/40"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate dark:text-surface-50">
                  {page.title || "(untitled)"}
                </p>
                <p className="text-xs text-surface-500 mt-0.5 dark:text-surface-400">
                  {page.slug || "—"} · {formatDate(page.updatedAt, i18n.resolvedLanguage)}
                </p>
              </div>
              <StatusBadge status={page.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
