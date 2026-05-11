import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import type { PortfolioThemeConfig } from "../config";

// Portfolio header — wordmark left, primary nav middle, CONTACT pill
// right. The wordmark uses settings.title in uppercase by default;
// theme config overrides via `brand.wordmark`. Two menu hosts share
// /data/menu.json:
//   - Inline horizontal nav (md+) with `data-cms-menu-inline` — the
//     loader emits flat <a> with `nav-link` class so the active state
//     gets the 4px rose dot.
//   - Off-canvas burger overlay (always present, opens via burger
//     button on mobile / small viewports).
export function Header({ site }: { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-portfolio");
  const themeConfig = site.themeConfig as PortfolioThemeConfig | undefined;
  const wordmark =
    themeConfig?.brand.wordmark?.trim() || settings.title.toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface border-b border-primary">
        <div className="max-w-container-max mx-auto flex items-center justify-between px-margin-edge-mobile md:px-margin-edge py-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden burger-toggle text-primary"
              aria-controls="burger-menu"
              aria-expanded="false"
              aria-label={t("publicBaked.menu")}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <a
              className="font-serif text-headline-md text-primary tracking-tight"
              href="/index.html"
              data-cms-brand
            >
              {wordmark}
            </a>
          </div>
          <nav
            className="hidden md:flex items-center gap-12"
            data-cms-menu="header"
            data-cms-menu-inline
            aria-label={t("publicBaked.primaryNavMobile")}
          />
          <a
            href="/contact.html"
            className="hidden md:inline-flex portfolio-btn-outline"
          >
            {t("publicBaked.contact")}
          </a>
        </div>
      </header>

      {/* Off-canvas burger overlay — populated by menu-loader.js */}
      <nav
        id="burger-menu"
        className="burger-menu"
        data-cms-menu="header"
        aria-label={t("publicBaked.primaryNavMobile")}
      >
        <ul></ul>
      </nav>
    </>
  );
}
