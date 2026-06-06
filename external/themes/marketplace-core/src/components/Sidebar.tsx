import type { SiteContext } from "@flexweg/cms-runtime";
import type { MarketplaceSidebarItem, MarketplaceThemeConfig } from "../config";
import { DEFAULT_MARKETPLACE_SIDEBAR } from "../config";
import { localePrefix } from "../lib/locale";

// Persistent left sidebar (lg+). Three groups (Discover / Categories /
// Documentation). Each item is { icon, label, href } with optional
// per-language overrides ({ translations.<lang>.label / .href }).
// Editable from Theme Settings → Sidebar tab. Mobile uses the
// BottomNav instead — the sidebar is hidden under lg.
//
// Why per-item href overrides matter: docs categories have DIFFERENT
// slugs per language (`/get-started/` ↔ `/demarrer/`, `/install/` ↔
// `/installer/`, …). The locale-prefix step only adds `/fr` to the
// front; it can't translate the slug itself. Without the override,
// the FR sidebar would link at `/fr/get-started/` which 404s.
// Categories with identical slugs across languages (e.g. Themes /
// Plugins) can leave the `href` override blank and carry only a
// translated `label`.
export function Sidebar({
  site,
  currentPath,
  currentLocale,
}: {
  site: SiteContext;
  currentPath?: string;
  currentLocale?: string;
}) {
  const themeConfig = site.themeConfig as MarketplaceThemeConfig | undefined;
  const sidebar = { ...DEFAULT_MARKETPLACE_SIDEBAR, ...(themeConfig?.sidebar ?? {}) };
  const prefix = localePrefix(site.homePath);
  // Both the primary language (`"en"`) and any secondary one go through
  // the same lookup; the primary side simply has no `translations.en`
  // entries on its items so every field falls back to `item.label` /
  // `item.href` which ARE the primary-language values.
  const lang = currentLocale ?? "";
  const headingT = lang ? sidebar.headingTranslations?.[lang] : undefined;

  function pickItem(item: MarketplaceSidebarItem): { label: string; href: string } {
    const tr = lang ? item.translations?.[lang] : undefined;
    return {
      label: tr?.label ?? item.label,
      href: tr?.href ?? item.href,
    };
  }

  function localizeHref(href: string): string {
    if (!href) return href;
    if (/^[a-z]+:/i.test(href)) return href;
    if (!href.startsWith("/")) return href;
    return prefix ? `${prefix}${href}` : href;
  }

  function isActive(href: string): boolean {
    if (!currentPath) return false;
    const normHere = ("/" + currentPath).replace(/\/index\.html$/, "/");
    const normThere = href.replace(/\/index\.html$/, "/");
    return normHere === normThere;
  }

  return (
    <aside className="mp-sidebar" aria-label="Sidebar">
      <h2 className="mp-sidebar__heading font-headline">
        {headingT?.heading ?? sidebar.heading}
      </h2>
      {sidebar.topItems.length > 0 && (
        <div className="mp-sidebar__group">
          {sidebar.topItems.map((item, i) => {
            const { label, href: rawHref } = pickItem(item);
            const href = localizeHref(rawHref);
            return (
              <a
                key={`top-${i}`}
                className={`mp-sidebar__link${isActive(href) ? " is-active" : ""}`}
                href={href}
              >
                {item.icon && <span className="material-symbols-outlined">{item.icon}</span>}
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      )}
      {sidebar.categoriesItems.length > 0 && (
        <div className="mp-sidebar__group">
          <span className="mp-sidebar__label">
            {headingT?.categoriesHeading ?? sidebar.categoriesHeading}
          </span>
          {sidebar.categoriesItems.map((item, i) => {
            const { label, href: rawHref } = pickItem(item);
            const href = localizeHref(rawHref);
            return (
              <a
                key={`cat-${i}`}
                className={`mp-sidebar__link${isActive(href) ? " is-active" : ""}`}
                href={href}
              >
                {item.icon && <span className="material-symbols-outlined">{item.icon}</span>}
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      )}
      {sidebar.docsItems && sidebar.docsItems.length > 0 && (
        <div className="mp-sidebar__group">
          <span className="mp-sidebar__label">
            {headingT?.docsHeading ?? sidebar.docsHeading}
          </span>
          {sidebar.docsItems.map((item, i) => {
            const { label, href: rawHref } = pickItem(item);
            const href = localizeHref(rawHref);
            return (
              <a
                key={`doc-${i}`}
                className={`mp-sidebar__link${isActive(href) ? " is-active" : ""}`}
                href={href}
              >
                {item.icon && <span className="material-symbols-outlined">{item.icon}</span>}
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      )}
    </aside>
  );
}
