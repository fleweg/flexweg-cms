import type { SiteContext } from "@flexweg/cms-runtime";
import type { MarketplaceThemeConfig } from "../config";

export function Footer({ site }: { site: SiteContext }) {
  const { settings, resolvedMenus } = site;
  const themeConfig = site.themeConfig as MarketplaceThemeConfig | undefined;
  const copyright =
    themeConfig?.footer.copyright?.trim() ||
    `© ${new Date().getFullYear()} ${settings.title}.`;

  return (
    <footer className="mp-footer">
      <div className="mp-footer__inner">
        <a className="mp-brand font-headline" href="/index.html">
          {themeConfig?.brand.wordmark?.trim() || settings.title}
        </a>
        <nav className="mp-footer__nav" aria-label="Footer">
          {resolvedMenus.footer.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p className="mp-footer__copyright">{copyright}</p>
      </div>
    </footer>
  );
}
