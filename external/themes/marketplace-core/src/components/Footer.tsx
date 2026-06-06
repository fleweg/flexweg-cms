import type { SiteContext } from "@flexweg/cms-runtime";
import type { MarketplaceThemeConfig } from "../config";
import { pickItemLabel } from "../lib/locale";

export function Footer({
  site,
  currentLocale,
}: {
  site: SiteContext;
  currentLocale?: string;
}) {
  const { settings, resolvedMenus } = site;
  const themeConfig = site.themeConfig as MarketplaceThemeConfig | undefined;
  const copyright =
    themeConfig?.footer.copyright?.trim() ||
    `© ${new Date().getFullYear()} ${settings.title}.`;
  const homeHref = site.homePath ?? "/index.html";

  return (
    <footer className="mp-footer">
      <div className="mp-footer__inner">
        <a className="mp-brand font-headline" href={homeHref}>
          {themeConfig?.brand.wordmark?.trim() || settings.title}
        </a>
        <nav className="mp-footer__nav" aria-label="Footer">
          {resolvedMenus.footer.map((item) => (
            <a key={item.id} href={item.href}>
              {pickItemLabel(item, currentLocale)}
            </a>
          ))}
        </nav>
        {/* Language switcher mount-point — paired with the one in
            Header. Filled by the multilang plugin when its
            "Show switcher in the site footer" setting is on. */}
        <div
          className="mp-footer__langswitch"
          data-cms-langswitch="footer"
          data-cms-langswitch-empty
        />
        <p className="mp-footer__copyright">{copyright}</p>
      </div>
    </footer>
  );
}
