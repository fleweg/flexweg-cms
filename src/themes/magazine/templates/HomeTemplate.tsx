import type { HomeTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Magazine home layout — fidelity to the editorial mockup.
//
// Top section: full-width 8/4 hero (publisher pre-renders heroHtml via
// magazineHero block — featured big article + 2 mini cards).
//
// Below: 8/4 grid with "Latest Intelligence" stories on the left and a
// sidebar on the right. The sidebar holds 0–2 widgets (mostReadHtml +
// promoCardHtml) — slots are filled or hidden based on the theme
// config (sidebarTop / sidebarBottom). When neither widget is set, the
// latest list expands to the full width via lg:col-span-12.
export function HomeTemplate({
  staticPage,
  archivesLink,
  heroHtml,
  listHtml,
  mostReadHtml,
  promoCardHtml,
  site,
}: HomeTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-magazine");

  if (staticPage) {
    return (
      <article className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter">
        <h1 className="font-serif text-4xl text-on-surface mb-stack-md">{staticPage.post.title}</h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: staticPage.bodyHtml }}
        />
      </article>
    );
  }

  const hasContent =
    (heroHtml && heroHtml.length > 0) || (listHtml && listHtml.length > 0);
  if (!hasContent) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter">
        <p className="text-on-surface-variant">No posts yet.</p>
      </div>
    );
  }

  const hasSidebar = !!mostReadHtml || !!promoCardHtml;
  const latestColSpan = hasSidebar ? "lg:col-span-8" : "lg:col-span-12";

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter">
      {heroHtml && <div dangerouslySetInnerHTML={{ __html: heroHtml }} />}

      {listHtml && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          <div className={latestColSpan}>
            <div className="flex items-center justify-between mb-stack-md pb-2 border-b border-on-surface">
              <h3 className="font-serif text-2xl italic text-on-surface">
                {t("publicBaked.latestListHeading")}
              </h3>
            </div>
            <div dangerouslySetInnerHTML={{ __html: listHtml }} />
            {archivesLink && (
              <div className="mt-stack-lg flex justify-center">
                <a
                  className="border border-on-surface px-stack-lg py-stack-sm text-xs uppercase tracking-widest font-semibold hover:bg-on-surface hover:text-on-primary transition-colors"
                  href={archivesLink.href}
                >
                  {archivesLink.label}
                </a>
              </div>
            )}
          </div>

          {hasSidebar && (
            <aside className="lg:col-span-4 space-y-stack-lg">
              {mostReadHtml && (
                <div
                  className="bg-surface p-stack-md border border-outline-variant"
                  dangerouslySetInnerHTML={{ __html: mostReadHtml }}
                />
              )}
              {promoCardHtml && (
                <div dangerouslySetInnerHTML={{ __html: promoCardHtml }} />
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
