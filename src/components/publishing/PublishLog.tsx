import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "../../lib/utils";
import type { PublishLogEntry } from "../../services/publisher";

interface PublishLogProps {
  entries: PublishLogEntry[];
}

export function PublishLog({ entries }: PublishLogProps) {
  if (entries.length === 0) return null;
  return (
    <ul className="card divide-y divide-surface-200 dark:divide-surface-800 max-h-64 overflow-y-auto">
      {entries.map((entry, i) => (
        <li key={i} className="flex items-start gap-2 px-3 py-2 text-sm">
          <Icon level={entry.level} />
          <span
            className={cn(
              entry.level === "error" && "text-red-700 dark:text-red-300",
              entry.level === "warn" && "text-amber-700 dark:text-amber-300",
              entry.level === "success" && "text-emerald-700 dark:text-emerald-300",
              entry.level === "info" && "text-surface-600 dark:text-surface-300",
            )}
          >
            {entry.message}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Icon({ level }: { level: PublishLogEntry["level"] }) {
  if (level === "success")
    return <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />;
  if (level === "warn")
    return <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />;
  if (level === "error")
    return <XCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />;
  return <Info className="h-4 w-4 mt-0.5 text-surface-400 shrink-0" />;
}
