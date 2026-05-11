import type { CardPost } from "@flexweg/cms-runtime";
import { pickFormat } from "@flexweg/cms-runtime";

// Project card — the unit cell of every grid in the theme. Image
// 4:5 aspect, title in serif, category + year metadata in
// uppercase label-sm. Hover scales the image 1.02x.
//
// Cards in a filterable grid (home with showFilters, category page…)
// carry `data-cms-category="<category-slug>"` so filters-loader.js
// can show / hide them. We extract the slug from the category URL
// (`/<slug>/index.html` → `<slug>`) so the publisher doesn't need
// to widen `CardPost.category`.
export function ProjectCard({ card }: { card: CardPost }) {
  const imageUrl = card.hero ? pickFormat(card.hero, "portrait") || pickFormat(card.hero) : "";
  const altText = card.hero?.alt ?? card.title;
  // Firestore timestamps expose `.toMillis()`; CardPost may also have
  // a plain number after publisher pre-resolution. The chained
  // optional call handles both.
  const ms =
    (card.publishedAt as { toMillis?: () => number } | undefined)?.toMillis?.() ??
    (card.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ??
    null;
  const year = ms ? new Date(ms).getUTCFullYear() : "";
  const categoryLabel = card.category?.name?.toUpperCase() ?? "";
  const meta = [categoryLabel, year ? String(year) : ""].filter(Boolean).join(" / ");
  // Pull the slug out of the category URL — `/<slug>/index.html`.
  const categorySlug = card.category?.url
    ? card.category.url.replace(/^\/+/, "").split("/")[0]
    : "";

  return (
    <a
      className="project-card group"
      href={card.url}
      data-cms-category={categorySlug}
    >
      <div className="project-card__image aspect-[4/5]">
        {imageUrl ? (
          <img src={imageUrl} alt={altText} loading="lazy" />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
      <h3 className="project-card__title">{card.title}</h3>
      {meta ? <p className="project-card__meta">{meta}</p> : null}
    </a>
  );
}
