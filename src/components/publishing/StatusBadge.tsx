import { useTranslation } from "react-i18next";
import type { PostStatus } from "../../core/types";

interface StatusBadgeProps {
  status: PostStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  return (
    <span className={status === "online" ? "badge-online" : "badge-draft"}>
      {t(`posts.status.${status}`)}
    </span>
  );
}
