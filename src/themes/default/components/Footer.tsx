import type { SiteContext } from "../../types";

// Footer items are also loaded at runtime from /menu.json — same pattern
// as the header. The static markup just provides the empty <ul>
// container the loader will populate.
export function Footer({ site }: { site: SiteContext }) {
  const { settings } = site;
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__brand">{settings.title}</p>
        <nav className="site-footer__nav" data-cms-menu="footer" aria-label="Footer">
          <ul></ul>
        </nav>
        <p className="site-footer__copy">
          © {year} {settings.title}
        </p>
        {/* Language switcher footer mount point. Hidden until the
            multilang plugin populates it (or removed when the
            footer-switcher setting is off). See Header.tsx for
            the symmetric header mount. */}
        <div className="site-footer__langswitch" data-cms-langswitch="footer" aria-hidden="true" />
      </div>
    </footer>
  );
}
