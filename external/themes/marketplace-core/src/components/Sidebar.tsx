import type { SiteContext } from "@flexweg/cms-runtime";
import type { MarketplaceThemeConfig } from "../config";
import { DEFAULT_MARKETPLACE_SIDEBAR } from "../config";

// Persistent left sidebar (lg+). Two groups:
//   - Top items (Featured / New / Top Rated by default)
//   - Categories items
// Each item is { icon, label, href }. Editable from Theme Settings →
// Sidebar tab. Mobile uses the BottomNav instead — the sidebar is
// hidden under lg.
export function Sidebar({ site, currentPath }: { site: SiteContext; currentPath?: string }) {
  const themeConfig = site.themeConfig as MarketplaceThemeConfig | undefined;
  const sidebar = { ...DEFAULT_MARKETPLACE_SIDEBAR, ...(themeConfig?.sidebar ?? {}) };

  function isActive(href: string): boolean {
    if (!currentPath) return false;
    const normHere = ("/" + currentPath).replace(/\/index\.html$/, "/");
    const normThere = href.replace(/\/index\.html$/, "/");
    return normHere === normThere;
  }

  return (
    <aside className="mp-sidebar" aria-label="Sidebar">
      <h2 className="mp-sidebar__heading font-headline">{sidebar.heading}</h2>
      {sidebar.topItems.length > 0 && (
        <div className="mp-sidebar__group">
          {sidebar.topItems.map((item, i) => (
            <a
              key={`top-${i}`}
              className={`mp-sidebar__link${isActive(item.href) ? " is-active" : ""}`}
              href={item.href}
            >
              {item.icon && <span className="material-symbols-outlined">{item.icon}</span>}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}
      {sidebar.categoriesItems.length > 0 && (
        <div className="mp-sidebar__group">
          <span className="mp-sidebar__label">{sidebar.categoriesHeading}</span>
          {sidebar.categoriesItems.map((item, i) => (
            <a
              key={`cat-${i}`}
              className={`mp-sidebar__link${isActive(item.href) ? " is-active" : ""}`}
              href={item.href}
            >
              {item.icon && <span className="material-symbols-outlined">{item.icon}</span>}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}
