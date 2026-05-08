import type { SiteContext } from "@flexweg/cms-runtime";

// Corporate footer — dark navy bar with the wordmark + tagline on the
// left and a runtime-populated menu on the right. Items are loaded by
// menu-loader.js from /data/menu.json — same pattern as magazine /
// default. Static markup just provides the empty <ul> container the
// loader populates. Optional tagline reads from settings.description
// when present so admins can edit it from /settings.
export function Footer({ site }: { site: SiteContext }) {
  const { settings } = site;
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary text-on-primary border-t border-on-primary-fixed-variant/20">
      <div className="w-full px-gutter py-section-padding max-w-container-max mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-stack-lg">
        <div className="max-w-sm">
          <span className="text-h3 font-bold text-secondary-fixed block mb-stack-md">
            {settings.title}
          </span>
          {settings.description && (
            <p className="text-body-md text-on-primary-container/80">
              {settings.description}
            </p>
          )}
        </div>
        <nav
          data-cms-menu="footer"
          aria-label="Footer"
          className="flex-1 md:max-w-md"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-body-md text-on-primary-container/80"></ul>
        </nav>
      </div>
      <div className="max-w-container-max mx-auto px-gutter pb-8">
        <p className="text-on-primary-container/60 text-label-caps font-semibold border-t border-on-primary-fixed-variant/10 pt-8 uppercase tracking-wider">
          © {year} {settings.title}
        </p>
      </div>
    </footer>
  );
}
