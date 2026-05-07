interface CardPost {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  dateLabel?: string;
}

interface CategoryProps {
  term: { name: string; description?: string };
  posts: CardPost[];
}

export function CategoryTemplate({ term, posts }: CategoryProps) {
  return (
    <article>
      <header>
        <h1>{term.name}</h1>
        {term.description && <p className="mt-meta">{term.description}</p>}
      </header>
      <ul className="mt-list">
        {posts.map((post) => (
          <li key={post.id}>
            <h2>
              <a href={`/${post.url}`}>{post.title}</a>
            </h2>
            {post.dateLabel && <p className="mt-meta">{post.dateLabel}</p>}
            {post.excerpt && <p>{post.excerpt}</p>}
          </li>
        ))}
      </ul>
    </article>
  );
}
