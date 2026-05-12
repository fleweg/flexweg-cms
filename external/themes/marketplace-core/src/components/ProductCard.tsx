import type { CardPost, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickFormat, pickPublicLocale } from "@flexweg/cms-runtime";

// Product card — the unit cell of every grid in the marketplace.
// Wide image up top (16:10), title + excerpt + Free badge below.
// Hover lifts the card slightly via the `.mp-card` CSS rule.
export function ProductCard({ card, site }: { card: CardPost; site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-marketplace-core");
  const imageUrl = card.hero
    ? pickFormat(card.hero, "large") || pickFormat(card.hero, "medium") || pickFormat(card.hero)
    : "";
  const altText = card.hero?.alt ?? card.title;

  return (
    <a className="mp-card" href={card.url}>
      <img className="mp-card__image" src={imageUrl} alt={altText} loading="lazy" />
      <div className="mp-card__body">
        {card.category && <span className="mp-card__category">{card.category.name}</span>}
        <h3 className="mp-card__title">{card.title}</h3>
        {card.excerpt && <p className="mp-card__excerpt">{card.excerpt}</p>}
        <div className="mp-card__footer">
          <span className="mp-badge-free">{t("publicBaked.free")}</span>
        </div>
      </div>
    </a>
  );
}
