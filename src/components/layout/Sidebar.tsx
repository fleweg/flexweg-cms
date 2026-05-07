import { NavLink } from "react-router-dom";
import {
  FileText,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Palette,
  Paintbrush,
  Plug,
  Settings,
  Sun,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useCmsData } from "../../context/CmsDataContext";
import { useTheme } from "../../context/ThemeContext";
import { getActiveTheme } from "../../themes";
import { signOut } from "../../services/auth";
import flexwegLogo from "../../assets/flexweg-logo.png";

interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  hidden?: boolean;
}

interface SidebarProps {
  // Mobile-only: when true the drawer slides in over the page; when
  // false it sits off-canvas. Ignored at md+ where the sidebar is
  // statically positioned and always visible.
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { settings } = useCmsData();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const activeTheme = getActiveTheme(settings.activeThemeId);
  const hasThemeSettings = !!activeTheme.settings;

  // Built each render so the "Theme settings" entry can react to the
  // user activating a different theme (different theme = different
  // settings surface) without remounting the sidebar.
  const navItems: NavItem[] = [
    { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
    { to: "/posts", labelKey: "nav.posts", icon: FileText },
    { to: "/pages", labelKey: "nav.pages", icon: ListChecks },
    { to: "/taxonomies", labelKey: "nav.taxonomies", icon: FolderTree },
    { to: "/media", labelKey: "nav.media", icon: ImageIcon },
    { to: "/menus", labelKey: "nav.menus", icon: MenuIcon },
    { to: "/themes", labelKey: "nav.themes", icon: Palette },
    {
      to: "/theme-settings",
      labelKey: "nav.themeSettings",
      icon: Paintbrush,
      hidden: !hasThemeSettings,
    },
    { to: "/plugins", labelKey: "nav.plugins", icon: Plug },
    { to: "/settings", labelKey: "nav.settings", icon: Settings },
    { to: "/users", labelKey: "nav.users", icon: Users, adminOnly: true },
  ];

  const items = navItems.filter(
    (item) => !item.hidden && (!item.adminOnly || isAdmin),
  );

  return (
    <>
      {/* Backdrop visible only when the mobile drawer is open. Tapping
          it dismisses the drawer (matches the OS-native scrim pattern).
          Hidden on md+ because the sidebar is always docked. */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={onMobileClose}
      />
      <aside
        className={cn(
          // Mobile: fixed off-canvas drawer that slides in via
          // translate. Desktop (md+): static positioning, always
          // visible, no transform — explicit `md:translate-x-0`
          // overrides the closed-state -translate-x-full.
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-surface-200 bg-white transition-transform dark:border-surface-800 dark:bg-surface-900",
          "md:static md:z-auto md:w-60 md:max-w-none md:translate-x-0 md:transition-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
      <div className="px-5 h-16 flex items-center gap-2.5 border-b border-surface-200 dark:border-surface-800">
        <img
          src={flexwegLogo}
          alt="Flexweg"
          className="h-8 w-8 rounded-lg shadow-card object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-none">{t("common.appName")}</p>
          <p className="text-[11px] text-surface-500 mt-0.5 dark:text-surface-400">Static publisher</p>
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          aria-label={t("nav.closeMenu")}
          className="md:hidden rounded-md p-1.5 text-surface-500 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map(({ to, labelKey, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface-900 text-white shadow-card dark:bg-surface-100 dark:text-surface-900"
                  : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-surface-200 dark:border-surface-800">
        {user && (
          <div className="px-2 pb-2">
            <p className="text-xs font-medium text-surface-700 truncate dark:text-surface-200">
              {user.email}
            </p>
            <p className="text-[11px] text-surface-400 dark:text-surface-500">
              {isAdmin ? t("common.administrator") : t("common.editor")}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
        >
          <Sun className={cn("h-4 w-4", !isDark && "hidden")} />
          <Moon className={cn("h-4 w-4", isDark && "hidden")} />
          <span>{isDark ? t("common.lightMode") : t("common.darkMode")}</span>
        </button>
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
        >
          <LogOut className="h-4 w-4" />
          {t("common.signOut")}
        </button>
      </div>
      </aside>
    </>
  );
}
