import type { Post } from "../../../core/types";
import type { MediaView } from "../../types";

interface CardProps {
  post: Post;
  url: string;
  hero?: MediaView;
}

export function Card({ post, url, hero }: CardProps) {
  return (
    <article className="card-post">
      <a className="card-post__link" href={`/${url}`}>
        {hero && (
          <div className="card-post__media">
            <img src={hero.url} alt={hero.alt ?? ""} />
          </div>
        )}
        <div className="card-post__body">
          <h3 className="card-post__title">{post.title}</h3>
          {post.excerpt && <p className="card-post__excerpt">{post.excerpt}</p>}
        </div>
      </a>
    </article>
  );
}
