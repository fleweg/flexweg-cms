import type { AuthorTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickFormat, pickPublicLocale } from "@flexweg/cms-runtime";
import { ProductCard } from "../components/ProductCard";

// Author profile + works grid. Profile card up top (avatar + name +
// title + bio), 3-col grid of the author's posts below. Filter tabs
// from the mockup (All / Themes / Plugins) are emitted client-side
// against `data-cms-category` — minimal inline script keeps this
// theme dependency-free.
export function AuthorTemplate({
  author,
  posts,
  site,
}: AuthorTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-marketplace-core");
  const avatarUrl = author.avatar
    ? pickFormat(author.avatar, "medium") || pickFormat(author.avatar)
    : "";

  // Unique categories present in the author's posts → filter tabs.
  const slugs = new Map<string, string>();
  posts.forEach((p) => {
    if (!p.category) return;
    const slug = p.category.url.replace(/^\/+/, "").split("/")[0];
    if (slug && !slugs.has(slug)) slugs.set(slug, p.category.name);
  });

  return (
    <article>
      <section className="mp-author-card">
        {avatarUrl ? (
          <img className="mp-author-card__avatar" src={avatarUrl} alt={author.displayName} />
        ) : (
          <div className="mp-author-card__avatar" />
        )}
        <div className="mp-author-card__info">
          <h1 className="mp-author-card__name">{author.displayName}</h1>
          {author.title && <p className="mp-author-card__title">{author.title}</p>}
          {author.bio && <p className="mp-author-card__bio">{author.bio}</p>}
        </div>
      </section>

      {slugs.size > 1 && (
        <div className="mp-tabs" data-cms-author-tabs role="tablist">
          <button type="button" className="mp-tabs__tab is-active" data-cms-author-tab="*">
            {t("publicBaked.seeAll")}
          </button>
          {Array.from(slugs.entries()).map(([slug, name]) => (
            <button
              key={slug}
              type="button"
              className="mp-tabs__tab"
              data-cms-author-tab={slug}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="mp-grid mp-grid--3">
        {posts.map((card) => {
          const slug = card.category
            ? card.category.url.replace(/^\/+/, "").split("/")[0]
            : "";
          return (
            <div key={card.id} data-cms-author-card={slug}>
              <ProductCard card={card} site={site} />
            </div>
          );
        })}
      </div>

      {/* Inline filter script — keeps the theme self-contained
          (no external loader needed) and only fires when the tab
          strip is actually rendered. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var t=document.querySelector('[data-cms-author-tabs]');if(!t)return;t.addEventListener('click',function(e){var b=e.target.closest('[data-cms-author-tab]');if(!b)return;var s=b.getAttribute('data-cms-author-tab');t.querySelectorAll('[data-cms-author-tab]').forEach(function(x){x.classList.toggle('is-active',x===b)});document.querySelectorAll('[data-cms-author-card]').forEach(function(c){var ok=s==='*'||c.getAttribute('data-cms-author-card')===s;c.style.display=ok?'':'none'})});})();`,
        }}
      />
    </article>
  );
}
