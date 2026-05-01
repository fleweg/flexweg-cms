import { useEffect, useState } from "react";
import { ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import {
  deleteUserRecord,
  setUserDisabled,
  setUserRole,
  subscribeToUsers,
} from "../services/users";
import type { UserRecord } from "../core/types";

export function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserRecord[]>([]);

  useEffect(() => {
    return subscribeToUsers(setUsers);
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <PageHeader title={t("users.title")} />
      {users.length === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {t("users.noUsers")}
        </div>
      ) : (
        <div className="card divide-y divide-surface-200 dark:divide-surface-800">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserRow({ user }: { user: UserRecord }) {
  const { t } = useTranslation();
  const isAdmin = user.role === "admin";
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{user.email}</p>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {isAdmin ? t("common.administrator") : t("common.editor")}
          {user.disabled ? ` · ${t("users.disabled")}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setUserRole(user.id, isAdmin ? "editor" : "admin")}
          title={isAdmin ? t("users.actions.demote") : t("users.actions.promote")}
        >
          <ShieldCheck className={isAdmin ? "h-4 w-4 text-emerald-500" : "h-4 w-4"} />
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setUserDisabled(user.id, !user.disabled)}
          title={user.disabled ? t("users.actions.enable") : t("users.actions.disable")}
        >
          <ShieldOff className={user.disabled ? "h-4 w-4 text-red-500" : "h-4 w-4"} />
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            if (window.confirm(`Delete record for ${user.email}?`)) {
              void deleteUserRecord(user.id);
            }
          }}
          title={t("users.actions.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
