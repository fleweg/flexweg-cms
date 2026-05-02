import type { CardPost } from "../../types";
import { pickFormat } from "../../../core/media";

// Editorial featured-post hero shown at the top of the home page.
// 21:9 image, prominent category pill, large Newsreader headline,
// excerpt as lede, formatted date as meta line. Links to the post.
export function HeroFeatured({ post }: { post: CardPost }) {
  // The featured slot deserves the largest variant the theme produces.
  const heroSrc = post.hero ? pickFormat(post.hero, "large") : "";
  return (
    <section className="hero-featured">
      <a className="hero-featured__link" href={`/${post.url}`}>
        {heroSrc && (
          <div className="hero-featured__media">
            <img src={heroSrc} alt={post.hero?.alt ?? ""} />
          </div>
        )}
        <div className="hero-featured__body">
          {post.category && (
            <span className="hero-featured__pill">{post.category.name}</span>
          )}
          <h2 className="hero-featured__title">{post.title}</h2>
          {post.excerpt && <p className="hero-featured__excerpt">{post.excerpt}</p>}
          {post.dateLabel && <p className="hero-featured__date">{post.dateLabel}</p>}
        </div>
      </a>
    </section>
  );
}
