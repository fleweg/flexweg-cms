import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import type { MarketplaceThemeConfig } from "../config";
import { pickItemLabel } from "../lib/locale";

// Sticky topbar. Brand wordmark on the left, primary nav middle,
// search input on the right. The nav links come from
// resolvedMenus.header — same source the other themes use, but here
// rendered server-side instead of via a runtime loader. Per-language
// menu labels come from `ResolvedMenuItem.labels[currentLocale]`
// (projected by the core resolver from `MenuItem.translations`); on
// mono-lingual sites the `labels` map is absent and we just use
// `item.label`.
export function Header({
  site,
  currentPath,
  currentLocale,
}: {
  site: SiteContext;
  currentPath?: string;
  currentLocale?: string;
}) {
  const { settings, resolvedMenus } = site;
  const t = i18n.getFixedT(
    pickPublicLocale(currentLocale || settings.language),
    "theme-marketplace-core",
  );
  const themeConfig = site.themeConfig as MarketplaceThemeConfig | undefined;
  const wordmark = themeConfig?.brand.wordmark?.trim() || settings.title;
  const items = resolvedMenus.header.slice(0, 5);
  // Brand link respects the current locale: on `/fr/…` pages it points
  // at `/fr/index.html` instead of `/index.html`. The publisher hands
  // `homePath` to every render and we just pass it through.
  const homeHref = site.homePath ?? "/index.html";

  function isActive(href: string): boolean {
    if (!currentPath) return false;
    const normHere = ("/" + currentPath).replace(/\/index\.html$/, "/");
    const normThere = href.replace(/\/index\.html$/, "/");
    return normHere === normThere;
  }

  return (
    <header className="mp-header">
      <div className="mp-header__inner">
        <a className="mp-brand font-headline" href={homeHref}>
          {wordmark}
        </a>
        <nav className="mp-header__nav" aria-label="Primary">
          {items.map((item) => (
            <a
              key={item.id}
              className={`mp-nav-link${isActive(item.href) ? " is-active" : ""}`}
              href={item.href}
            >
              {pickItemLabel(item, currentLocale)}
            </a>
          ))}
        </nav>
        {/* Language switcher mount-point — filled at runtime by the
            flexweg-multilang plugin's body-end script when the site
            has more than one locale enabled AND the plugin's
            "Show switcher in the site header" setting is on. When
            those conditions aren't met the container stays empty
            (the plugin sets `data-cms-langswitch-empty` for CSS
            collapse). Don't remove the attribute even if you don't
            run multilang — having it costs nothing and keeps the
            theme drop-in for any future i18n plugin. */}
        <div
          className="mp-header__langswitch"
          data-cms-langswitch="header"
          data-cms-langswitch-empty
        />
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
