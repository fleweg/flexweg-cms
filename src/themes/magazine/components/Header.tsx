import type { SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import type { MagazineThemeConfig } from "../config";
import { DEFAULT_MAGAZINE_HEADER } from "../config";

// Editorial header with two silhouette variants (driven by
// site.themeConfig.header.brandPosition):
//
//   • "centered" — burger left, brand absolutely centered, search
//     right. Default; matches the mockup exactly.
//   • "left" — burger + brand inline on the left, search right. Useful
//     for sites with a longer publication name.
//
// The search trigger button carries `[data-cms-search]`; the optional
// flexweg-search plugin wires it up at runtime with a modal. The
// header config can hide the trigger entirely (plugin disabled →
// hide a non-functional affordance from the UI).
//
// Menu items live inside the off-canvas `#burger-menu` overlay,
// populated at runtime by themes/magazine/menu-loader.js (added in a
// later phase) from /menu.json.
export function Header({ site }: { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-magazine");
  const themeConfig = (site.themeConfig as MagazineThemeConfig | undefined);
  const headerConfig = themeConfig?.header ?? DEFAULT_MAGAZINE_HEADER;
  const isCentered = headerConfig.brandPosition !== "left";
  const showSearch = headerConfig.showSearch !== false;

  const burger = (
    <button
      type="button"
      className="burger-toggle text-on-surface"
      aria-controls="burger-menu"
      aria-expanded="false"
      aria-label={t("publicBaked.menu")}
    >
      <span className="material-symbols-outlined">menu</span>
    </button>
  );

  const brand = (
    <a
      className={
        isCentered
          ? "absolute left-1/2 -translate-x-1/2 font-serif text-2xl font-black text-on-surface tracking-tight"
          : "font-serif text-2xl font-black text-on-surface tracking-tight"
      }
      href="/index.html"
      data-cms-brand
    >
      {settings.title}
    </a>
  );

  const search = showSearch ? (
    <button
      type="button"
      className="text-on-surface"
      aria-label={t("publicBaked.search")}
      data-cms-search
    >
      <span className="material-symbols-outlined">search</span>
    </button>
  ) : (
    <span aria-hidden="true" />
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-outline-variant">
        <div className="max-w-container-max mx-auto flex items-center justify-between px-margin-mobile lg:px-gutter py-stack-md">
          {isCentered ? (
            <>
              {burger}
              {brand}
              {search}
            </>
          ) : (
            <>
              <div className="flex items-center gap-stack-md">
                {burger}
                {brand}
              </div>
              {search}
            </>
          )}
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
