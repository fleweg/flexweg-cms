import type { SingleTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickFormat, pickPublicLocale } from "@flexweg/cms-runtime";

// Sibling shape resolved by the `post.template.props` filter
// registered in manifest.tsx. Carried alongside the standard
// SingleTemplateProps so the DocSingle component doesn't have to
// re-resolve them from `getCurrentPublishContext()` (which is null at
// template render time — the publisher clears it before
// renderPageToHtml runs).
interface DocSibling {
  id: string;
  title: string;
  url: string;
}
type EnrichedSingleProps = SingleTemplateProps & {
  site: SiteContext;
  docSiblings?: DocSibling[];
};

// Single product — split layout (image gallery left, info right) +
// description + specs + features sections. Pages (`type === "page"`)
// bypass the chrome and render in `.mp-page-body`. Posts with no hero
// image (documentation pages) fall through to a centered single-column
// reading layout with prev/next navigation between siblings in the
// same category.
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
  docSiblings,
}: EnrichedSingleProps) {
  const isPage = post.type === "page";

  if (isPage) {
    return (
      <article className="mp-page-body">
        <h1>{post.title}</h1>
        <div className="mp-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </article>
    );
  }

  // Documentation-style single layout: no product chrome (no
  // download/CTA slot, no gallery, no Free badge). Used for any post
  // that doesn't carry a hero image — typical for the imported docs
  // under Get Started / Install / Use / Develop / Extend. Includes a
  // category breadcrumb at the top and prev/next sibling navigation
  // at the bottom.
  if (!hero) {
    return (
      <DocSingle
        post={post}
        bodyHtml={bodyHtml}
        primaryTerm={primaryTerm}
        site={site}
        siblings={docSiblings ?? []}
      />
    );
  }

  const heroUrl = pickFormat(hero, "large") || pickFormat(hero, "medium") || pickFormat(hero);

  return (
    <article>
      <section className="mp-product">
        <div className="mp-product__gallery">
          <img className="mp-product__hero-image" src={heroUrl} alt={hero.alt ?? post.title} />
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
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Documentation-style single. No product chrome; centered reading
// column; prev/next bar at the bottom that walks siblings inside the
// same primary category (the imported docs are organized in 5
// top-level categories — Get Started, Install, Use, Develop, Extend —
// each with a natural reading order).
// ─────────────────────────────────────────────────────────────────────

function DocSingle({
  post,
  bodyHtml,
  primaryTerm,
  site,
  siblings,
}: Pick<SingleTemplateProps, "post" | "bodyHtml" | "primaryTerm"> & {
  site: SiteContext;
  siblings: DocSibling[];
}) {
  const t = i18n.getFixedT(
    pickPublicLocale(site.settings.language),
    "theme-marketplace-core",
  );
  const homeHref = site.homePath ?? "/index.html";
  const currentIndex = siblings.findIndex((s) => s.id === post.id);
  const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < siblings.length - 1
      ? siblings[currentIndex + 1]
      : null;

  return (
    <article className="mp-doc">
      <nav className="mp-breadcrumb" aria-label="Breadcrumb">
        <a href={homeHref}>{t("publicBaked.home")}</a>
        {primaryTerm && (
          <>
            <span className="mp-breadcrumb__sep">/</span>
            <a href={withLeadingSlash(`${primaryTerm.slug}/index.html`)}>{primaryTerm.name}</a>
          </>
        )}
        <span className="mp-breadcrumb__sep">/</span>
        <span>{post.title}</span>
      </nav>

      <header className="mp-doc__header">
        <h1 className="mp-doc__title">{post.title}</h1>
        {post.excerpt && <p className="mp-doc__excerpt">{post.excerpt}</p>}
      </header>

      <div className="mp-doc__body mp-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      {(prev || next) && (
        <nav className="mp-doc__pagerow" aria-label={t("publicBaked.docPager.aria")}>
          {prev ? (
            <a className="mp-doc__pager mp-doc__pager--prev" href={withLeadingSlash(prev.url)}>
              <span className="mp-doc__pager-label">← {t("publicBaked.docPager.prev")}</span>
              <span className="mp-doc__pager-title">{prev.title}</span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a className="mp-doc__pager mp-doc__pager--next" href={withLeadingSlash(next.url)}>
              <span className="mp-doc__pager-label">{t("publicBaked.docPager.next")} →</span>
              <span className="mp-doc__pager-title">{next.title}</span>
            </a>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}

function withLeadingSlash(path: string): string {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

