import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Mobile bottom-nav bar — visible below 1024px in place of the
// sidebar. 4 fixed items: Home / Themes / Plugins / Authors. Adapt
// these in the i18n bundle if a site needs a different surface.
export function BottomNav({ site, currentPath }: { site: SiteContext; currentPath?: string }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-marketplace-core");
  const items = [
    { icon: "home", label: t("publicBaked.nav.home"), href: "/index.html" },
    { icon: "palette", label: t("publicBaked.nav.themes"), href: "/themes/index.html" },
    { icon: "extension", label: t("publicBaked.nav.plugins"), href: "/plugins/index.html" },
    { icon: "groups", label: t("publicBaked.nav.authors"), href: "/authors/index.html" },
  ];

  function isActive(href: string): boolean {
    if (!currentPath) return false;
    const here = ("/" + currentPath).replace(/\/index\.html$/, "/");
    const there = href.replace(/\/index\.html$/, "/");
    return here === there || (href === "/index.html" && here === "/");
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
