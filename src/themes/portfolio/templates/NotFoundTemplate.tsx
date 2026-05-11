import type { NotFoundTemplateProps, SiteContext } from "@flexweg/cms-runtime";

// Minimalist 404 — giant charcoal numeral, single line of body, single
// outline back-to-home link. No illustration, no shadow, no radius —
// the whole point of the theme.
export function NotFoundTemplate(_props: NotFoundTemplateProps & { site: SiteContext }) {
  return (
    <article className="max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap min-h-[60vh] flex flex-col items-center justify-center text-center gap-12">
      <h1 className="font-serif text-[120px] md:text-[200px] text-on-surface leading-none display-serif">
        404
      </h1>
      <p className="font-sans text-body-lg text-secondary max-w-md">
        This page does not exist. The page may have moved, or you typed an
        address that was never published here.
      </p>
      <a href="/index.html" className="portfolio-btn-outline">
        Return home
      </a>
    </article>
  );
}
