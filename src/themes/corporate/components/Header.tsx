import type { SiteContext } from "../../types";
import i18n, { pickPublicLocale } from "../../../i18n";

// Corporate header — sticky bar with backdrop blur (Glass Lite per
// DESIGN.md). Two menu hosts share the same `/data/menu.json`:
//   - Inline horizontal nav, visible md+. Carries
//     `data-cms-menu-inline` so menu-loader.js renders flat <a> links
//     instead of <ul>/<li>.
//   - Off-canvas burger overlay (always present, opens via the
//     burger button on every viewport). Uses the standard
//     `[data-cms-menu="header"]` + <ul> contract.
//
// The "Get Started" button is a static affordance for now — it points
// at /contact.html which the user creates as a static page composed of
// the contact-info + contact-form blocks (see DESIGN.md decision 2).
// Localised via `publicBaked.getStarted`.
export function Header({ site }: { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-corporate");

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-20"
      >
        <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-full">
          <div className="flex items-center gap-4">
            {/* Burger toggle — visible at every viewport. The burger
                overlay is the mobile menu and a secondary entry point
                on desktop (matches the Stitch mockup). */}
            <button
              type="button"
              className="burger-toggle text-primary"
              aria-controls="burger-menu"
              aria-expanded="false"
              aria-label={t("publicBaked.menu")}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <a
              className="text-h3 font-bold text-primary tracking-tight"
              href="/index.html"
              data-cms-brand
            >
              {settings.title}
            </a>
          </div>

          {/* Inline horizontal nav — populated by menu-loader.js with
              the same items as the burger overlay. Hidden on mobile;
              the burger handles small viewports. */}
          <nav
            className="hidden md:flex items-center gap-8"
            data-cms-menu="header"
            data-cms-menu-inline
            aria-label="Primary"
          />

          <a
            href="/contact.html"
            className="bg-secondary text-on-secondary px-6 py-2 rounded-lg text-button font-semibold hover:opacity-90 active:opacity-80 transition-all"
          >
            {t("publicBaked.getStarted")}
          </a>
        </div>
      </header>

      {/* Off-canvas burger overlay — populated by menu-loader.js. The
          loader injects the close button + backdrop on first open. */}
      <nav
        id="burger-menu"
        className="burger-menu"
        data-cms-menu="header"
        aria-label="Primary mobile"
      >
        <ul></ul>
      </nav>
    </>
  );
}
