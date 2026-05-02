import type { SiteContext } from "../../types";

// Sticky editorial header. Burger sits on the left, brand wordmark is
// absolutely centered (Newsreader italic). The right slot stays empty so
// the centered wordmark anchors the layout — characteristic literary
// journal silhouette.
//
// Menu items live exclusively inside the off-canvas `#burger-menu`
// overlay, populated at runtime by themes/default/menu-loader.js from
// /menu.json. We render an empty <ul> here; the loader fills it on
// DOMContentLoaded and hides the container if the fetch fails.
//
// IMPORTANT: `<nav id="burger-menu">` is rendered as a SIBLING of
// `<header>` (via React Fragment) rather than a child. The site-header
// uses `z-index: 50` for its sticky behavior, which creates a stacking
// context — if the burger menu lived inside it, its `z-index: 60` would
// only rank against header siblings, and the runtime-injected
// `.burger-backdrop` (`z-index: 55`, attached to body) would render
// ABOVE the menu. Pulling the menu up to body level fixes that.
export function Header({ site }: { site: SiteContext }) {
  const { settings } = site;
  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <button
            type="button"
            className="burger-toggle"
            aria-controls="burger-menu"
            aria-expanded="false"
            aria-label="Open menu"
          >
            <BurgerIcon />
          </button>
          <a className="site-brand" href="/index.html">
            {settings.title}
          </a>
        </div>
      </header>
      <nav
        id="burger-menu"
        className="burger-menu"
        data-cms-menu="header"
        aria-label="Primary"
      >
        <ul></ul>
      </nav>
    </>
  );
}

function BurgerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
