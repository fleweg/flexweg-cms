import type { SingleTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickFormat, pickPublicLocale } from "@flexweg/cms-runtime";

// Single product — split layout (image gallery left, info right) +
// description + specs + features sections. Pages (`type === "page"`)
// bypass the chrome and render in `.mp-page-body`.
//
// The Description / Specs / Features sections come from blocks
// embedded in the post body — the publisher's transformBodyHtml has
// already swapped each marker for its rendered HTML. We just dump
// the resulting `bodyHtml` into `.mp-prose`.
export function SingleTemplate({
  post,
  bodyHtml,
  hero,
  primaryTerm,
  site,
}: SingleTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-marketplace-core");
  const isPage = post.type === "page";

  if (isPage) {
    return (
      <article className="mp-page-body">
        <h1>{post.title}</h1>
        <div className="mp-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </article>
    );
  }

  const heroUrl = hero
    ? pickFormat(hero, "large") || pickFormat(hero, "medium") || pickFormat(hero)
    : "";

  return (
    <article>
      <section className="mp-product">
        <div className="mp-product__gallery">
          {heroUrl ? (
            <img className="mp-product__hero-image" src={heroUrl} alt={hero?.alt ?? post.title} />
          ) : (
            <div className="mp-product__hero-image" />
          )}
          {/* Thumbnail strip — populated by the gallery block if
              present in the body, otherwise hidden. The block's
              transform leaves a marker that the runtime DOM rewires
              into thumbnails — Phase 1 leaves this slot empty. */}
          <div className="mp-product__thumbs" data-cms-mp-thumbs hidden />
        </div>
        <div className="mp-product__info">
          {primaryTerm && (
            <span className="mp-product__category">{primaryTerm.name}</span>
          )}
          <h1 className="mp-product__title">{post.title}</h1>
          {/* Byline slot — the header-buttons block injects the
              "by <creator>" line here at runtime. Free-form,
              decoupled from the CMS post author. */}
          <div data-cms-mp-byline-slot />
          {post.excerpt && <p className="mp-product__excerpt">{post.excerpt}</p>}
          {/* CTA slot — Free badge + Download / Preview buttons
              come from the same block, relocated here at runtime. */}
          <div data-cms-mp-cta-slot />
        </div>
      </section>

      <div className="mp-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      {/* SEO / accessibility data block */}
      <p className="sr-only">
        {t("publicBaked.free")} · {t("publicBaked.description")}
      </p>
    </article>
  );
}
