import type { CardPost, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickFormat, pickPublicLocale } from "@flexweg/cms-runtime";

// Product card — the unit cell of every grid in the marketplace.
// Wide image up top (16:10), title + excerpt + Free badge below.
// Hover lifts the card slightly via the `.mp-card` CSS rule.
//
// When the post has no hero image (typical for documentation posts
// imported via `flexweg-cms-docs`), we drop the image slot entirely
// and shift to a text-first card via the `.mp-card--no-image`
// modifier — no awkward grey placeholder, no off-screen title, more
// room for the excerpt. The free badge also gives way (docs aren't
// products).
export function ProductCard({ card, site }: { card: CardPost; site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-marketplace-core");
  const hasImage = Boolean(card.hero);
  const imageUrl = hasImage
    ? pickFormat(card.hero!, "large") || pickFormat(card.hero!, "medium") || pickFormat(card.hero!)
    : "";
  const altText = card.hero?.alt ?? card.title;

  // `card.url` is produced by the publisher as a path RELATIVE to the
  // site root (e.g. "plugins/foo.html" or "fr/plugins/foo.html"). Browsers
  // resolve <a href="…"> values RELATIVE TO THE CURRENT PAGE URL, so on
  // a category archive at `/plugins/index.html` the relative href would
  // resolve to `/plugins/plugins/foo.html` → 404. Forcing a leading `/`
  // promotes the href to a root-relative URL so navigation stays in the
  // current locale's tree no matter what depth the visitor is at.
  // Same workaround the in-tree default theme applies.
  const href = card.url.startsWith("/") ? card.url : `/${card.url}`;
  const className = hasImage ? "mp-card" : "mp-card mp-card--no-image";

  return (
    <a className={className} href={href}>
      {hasImage && (
        <img className="mp-card__image" src={imageUrl} alt={altText} loading="lazy" />
      )}
      <div className="mp-card__body">
        {card.category && <span className="mp-card__category">{card.category.name}</span>}
        <h3 className="mp-card__title">{card.title}</h3>
        {card.excerpt && <p className="mp-card__excerpt">{card.excerpt}</p>}
        {hasImage && (
          <div className="mp-card__footer">
            <span className="mp-badge-free">{t("publicBaked.free")}</span>
          </div>
        )}
      </div>
    </a>
  );
}
