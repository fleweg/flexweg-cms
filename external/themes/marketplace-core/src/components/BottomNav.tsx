import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import { localePrefix } from "../lib/locale";

// Mobile bottom-nav bar — visible below 1024px in place of the
// sidebar. 4 fixed items: Home / Themes / Plugins / Authors. The
// hrefs are prefixed with the active locale so secondary-language
// pages (e.g. `/fr/…`) keep visitors inside the localized site.
// Labels come from the theme's i18n bundle and follow the same
// fallback chain as the rest of the shell.
export function BottomNav({
  site,
  currentPath,
  currentLocale,
}: {
  site: SiteContext;
  currentPath?: string;
  currentLocale?: string;
}) {
  const t = i18n.getFixedT(
    pickPublicLocale(currentLocale || site.settings.language),
    "theme-marketplace-core",
  );
  const prefix = localePrefix(site.homePath);
  // 3-item bottom-nav (Home / Themes / Plugins) — Authors was
  // dropped in v1.3.1 since the marketplace doesn't surface
  // dedicated author pages prominently. Re-add a 4th item here if
  // your fork needs one.
  const items = [
    { icon: "home", label: t("publicBaked.nav.home"), href: `${prefix}/index.html` },
    { icon: "palette", label: t("publicBaked.nav.themes"), href: `${prefix}/themes/index.html` },
    { icon: "extension", label: t("publicBaked.nav.plugins"), href: `${prefix}/plugins/index.html` },
  ];

  function isActive(href: string): boolean {
    if (!currentPath) return false;
    const here = ("/" + currentPath).replace(/\/index\.html$/, "/");
    const there = href.replace(/\/index\.html$/, "/");
    return here === there || (href === `${prefix}/index.html` && here === `${prefix || ""}/`);
  }

  return (
    <nav className="mp-bottom-nav" aria-label="Mobile navigation">
      {items.map((item) => (
        <a
          key={item.href}
          className={`mp-bottom-nav__item${isActive(item.href) ? " is-active" : ""}`}
          href={item.href}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
