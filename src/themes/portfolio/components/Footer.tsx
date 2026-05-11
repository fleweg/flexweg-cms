import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import type { PortfolioThemeConfig } from "../config";

// Portfolio footer — wordmark left, socials middle, copyright right.
// Bordered top to separate from the content stream. Socials come from
// the footer menu (data-cms-menu="footer") populated by the runtime
// loader. The wordmark mirrors the header — same source.
export function Footer({ site }: { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-portfolio");
  const themeConfig = site.themeConfig as PortfolioThemeConfig | undefined;
  const wordmark =
    themeConfig?.brand.wordmark?.trim() || settings.title.toUpperCase();
  const copyright =
    themeConfig?.footer.copyright?.trim() ||
    `© ${new Date().getFullYear()} ${settings.title}. ${t("publicBaked.rightsReserved")}`;

  return (
    <footer className="border-t border-primary bg-surface">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-12">
        <a
          className="font-serif text-headline-md text-primary tracking-tight"
          href="/index.html"
        >
          {wordmark}
        </a>
        <nav
          className="flex flex-wrap items-center justify-center gap-8"
          data-cms-menu="footer"
          data-cms-menu-inline
          aria-label="Footer"
        />
        <p className="font-sans text-label-sm uppercase tracking-widest text-secondary text-center md:text-right">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
