import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useCmsData } from "../context/CmsDataContext";
import { StatusBadge } from "../components/publishing/StatusBadge";
import type { PostStatus } from "../core/types";
import { formatDate } from "../lib/utils";

type Filter = "all" | PostStatus;

export function PostsListPage() {
  const { t, i18n } = useTranslation();
  const { posts } = useCmsData();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = posts.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title={t("posts.title")}
        actions={
          <Link to="/posts/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            {t("posts.newPost")}
          </Link>
        }
      />

      <div className="mb-4 inline-flex rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
        {(["all", "draft", "online"] as Filter[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={
              filter === value
                ? "px-3 py-1 rounded-md text-sm font-medium bg-white text-surface-900 shadow-card dark:bg-surface-900 dark:text-surface-50"
                : "px-3 py-1 rounded-md text-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-300"
            }
          >
            {t(`posts.filters.${value}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {t("posts.noPosts")}
        </div>
      ) : (
        <div className="card divide-y divide-surface-200 dark:divide-surface-800">
          {filtered.map((post) => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/40"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate dark:text-surface-50">
                  {post.title || "(untitled)"}
                </p>
                <p className="text-xs text-surface-500 mt-0.5 dark:text-surface-400">
                  {post.slug || "—"} · {formatDate(post.updatedAt, i18n.resolvedLanguage)}
                </p>
              </div>
              <StatusBadge status={post.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
