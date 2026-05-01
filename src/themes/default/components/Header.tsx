import type { SiteContext } from "../../types";

// Burger-only header. The menu items live exclusively inside the off-canvas
// `#burger-menu` overlay — there is no horizontal desktop nav. The loader
// (themes/default/menu-loader.js) populates the inner <ul> from /menu.json
// and toggles the overlay on click.
//
// We render an *empty* `<ul>` inside `[data-cms-menu="header"]`. The loader
// fills it on DOMContentLoaded; if the fetch fails the container stays
// empty and is hidden by the loader (`hidden` attribute).
export function Header({ site }: { site: SiteContext }) {
  const { settings } = site;
  return (
    <header className="site-header">
      <div className="container">
        <a className="site-brand" href="/index.html">
          {settings.title}
        </a>
        <button
          type="button"
          className="burger-toggle"
          aria-controls="burger-menu"
          aria-expanded="false"
          aria-label="Open menu"
        >
          <span className="burger-icon" aria-hidden="true"></span>
        </button>
      </div>
      <nav id="burger-menu" className="burger-menu" data-cms-menu="header" aria-label="Primary">
        <ul></ul>
      </nav>
    </header>
  );
}
