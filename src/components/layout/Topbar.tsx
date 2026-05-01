import { LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { signOut } from "../../services/auth";
import { LocaleSwitcher } from "../ui/LocaleSwitcher";

export function Topbar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-surface-200 dark:bg-surface-900/80 dark:border-surface-800">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-2 min-w-0 md:hidden">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
            <LayoutDashboard className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="text-sm font-semibold truncate">{t("common.appName")}</p>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <LocaleSwitcher />
          {user && (
            <span className="hidden md:inline text-xs text-surface-500 truncate max-w-[200px] dark:text-surface-400">
              {user.email}
            </span>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors dark:text-surface-400 dark:hover:text-surface-50 dark:hover:bg-surface-800 md:hidden"
            aria-label={isDark ? t("common.lightMode") : t("common.darkMode")}
          >
            <Sun className={cn("h-4 w-4", !isDark && "hidden")} />
            <Moon className={cn("h-4 w-4", isDark && "hidden")} />
          </button>
          <button
            type="button"
            onClick={() => signOut()}
            className="p-1.5 rounded-md text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors dark:text-surface-400 dark:hover:text-surface-50 dark:hover:bg-surface-800 md:hidden"
            aria-label={t("common.signOut")}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
