import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import type { MarketplaceThemeConfig } from "../config";

// Sticky topbar. Brand wordmark on the left, primary nav middle,
// search input on the right. The nav links come from the
// resolvedMenus.header — same source other themes use.
export function Header({ site, currentPath }: { site: SiteContext; currentPath?: string }) {
  const { settings, resolvedMenus } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-marketplace-core");
  const themeConfig = site.themeConfig as MarketplaceThemeConfig | undefined;
  const wordmark = themeConfig?.brand.wordmark?.trim() || settings.title;
  const items = resolvedMenus.header.slice(0, 5);

  function isActive(href: string): boolean {
    if (!currentPath) return false;
    const normHere = ("/" + currentPath).replace(/\/index\.html$/, "/");
    const normThere = href.replace(/\/index\.html$/, "/");
    return normHere === normThere;
  }

  return (
    <header className="mp-header">
      <div className="mp-header__inner">
        <a className="mp-brand font-headline" href="/index.html">
          {wordmark}
        </a>
        <nav className="mp-header__nav" aria-label="Primary">
          {items.map((item) => (
            <a
              key={item.id}
              className={`mp-nav-link${isActive(item.href) ? " is-active" : ""}`}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {/* Search trigger — looks like an input but acts as a button.
            The flexweg-search plugin attaches a click handler to every
            `[data-cms-search]` element and opens its modal. When the
            plugin is disabled the trigger stays inert. `readOnly` +
            `cursor: pointer` keeps the visible-input aesthetic
            without letting the user type directly in the header (the
            actual typing happens in the modal). */}
        <div className="mp-header__search">
          <input
            type="search"
            className="mp-search-input"
            placeholder={t("publicBaked.nav.themes") + " · " + t("publicBaked.nav.plugins")}
            aria-label="Search"
            data-cms-search
            readOnly
            role="button"
          />
        </div>
      </div>
    </header>
  );
}
