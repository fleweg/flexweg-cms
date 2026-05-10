import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Storefront header — sticky bar with the brand wordmark centered, a
// burger toggle on the left, and search + cart icons on the right.
// Two menu hosts share the same `/data/menu.json` (populated by
// menu-loader.js):
//   - Inline horizontal nav, visible md+. Carries
//     `data-cms-menu-inline` so menu-loader.js renders flat <a> links
//     instead of <ul>/<li>. Sits left of the wordmark.
//   - Off-canvas burger overlay (always present, opens via the burger
//     button). Uses the standard `[data-cms-menu="header"]` + <ul>
//     contract.
//
// Cart icon is a static affordance (Flexweg is statically hosted —
// no real cart). Default href points at the catalog page when the
// catalog feature is enabled, falls back to /contact.html otherwise.
export function Header({ site }: { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-storefront");

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 h-16">
        <div className="flex justify-between items-center w-full px-gutter md:px-gutter-desktop max-w-container-max mx-auto h-full">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="burger-toggle text-primary"
              aria-controls="burger-menu"
              aria-expanded="false"
              aria-label={t("publicBaked.menu")}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <a
            className="font-serif text-headline-sm font-bold text-primary tracking-tight"
            href="/index.html"
            data-cms-brand
          >
            {settings.title}
          </a>

          <div className="flex items-center gap-3">
            {/* Search trigger — paired with the flexweg-search plugin
                which scans `[data-cms-search]` buttons and opens its
                modal on click. When the plugin is disabled the button
                renders inert (no-op click). */}
            <button
              type="button"
              data-cms-search
              aria-label={t("publicBaked.search")}
              className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Off-canvas burger overlay — populated by menu-loader.js. */}
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
