import type { SiteContext } from "../../types";

// Footer items are loaded at runtime from /menu.json — same pattern as
// the header. Static markup just provides the empty <ul> container the
// loader populates.
export function Footer({ site }: { site: SiteContext }) {
  const { settings } = site;
  const year = new Date().getFullYear();
  return (
    <footer className="mt-section-gap bg-surface-container-low border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter py-stack-lg">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-md">
          <p className="font-serif text-xl font-bold text-on-surface tracking-tight">
            {settings.title}
          </p>
          <nav data-cms-menu="footer" aria-label="Footer" className="flex-1 md:flex md:justify-end">
            <ul className="flex flex-wrap gap-stack-md text-sm text-on-surface-variant"></ul>
          </nav>
        </div>
        <p className="mt-stack-md pt-stack-md border-t border-outline-variant text-xs text-on-surface-variant tracking-widest uppercase">
          © {year} {settings.title}
        </p>
      </div>
    </footer>
  );
}
