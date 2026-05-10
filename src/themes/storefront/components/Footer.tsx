import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import type { StorefrontThemeConfig } from "../config";
import { DEFAULT_STOREFRONT_CONFIG } from "../config";

// Storefront footer — multi-column layout.
//
//   [ wordmark + tagline + socials ]   [ menu list ]
//
// The menu list is populated at runtime by menu-loader.js from
// `/data/menu.json` (footer entries).
export function Footer({ site }: { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-storefront");
  const themeConfig = (site.themeConfig as StorefrontThemeConfig | undefined) ?? DEFAULT_STOREFRONT_CONFIG;
  const footer = themeConfig.footer;
  const tagline = footer.tagline.trim() || settings.description || "";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-highest/40 border-t border-outline-variant/40 pt-section-gap-mobile md:pt-section-gap-desktop pb-stack-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-lg px-gutter md:px-gutter-desktop max-w-container-max mx-auto">
        <div className="md:col-span-4">
          <span className="font-serif text-headline-sm text-primary block mb-stack-md font-bold">
            {settings.title}
          </span>
          {tagline && (
            <p className="text-body-md text-on-surface-variant mb-stack-lg max-w-xs">
              {tagline}
            </p>
          )}
          {footer.showSocials && (
            <div className="flex gap-3" data-cms-footer-socials>
              {/* Populated optionally by posts-loader.js — for now a
                  decorative placeholder pair until a sitewide socials
                  config lands. */}
              <a
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-transparent transition-all"
                href="#"
                aria-label={t("publicBaked.website")}
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
              </a>
              <a
                className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-transparent transition-all"
                href="#"
                aria-label={t("publicBaked.share")}
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </a>
            </div>
          )}
        </div>

        <nav
          data-cms-menu="footer"
          aria-label={t("publicBaked.footerNav")}
          className="md:col-span-4 md:col-start-5"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-body-md text-on-surface-variant"></ul>
        </nav>

        <div className="md:col-span-12 mt-stack-lg pt-stack-md border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-stack-sm">
          <p className="text-body-md text-on-surface-variant opacity-70">
            © {year} {settings.title}
          </p>
        </div>
      </div>
    </footer>
  );
}
