interface CardPost {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  dateLabel?: string;
}

interface HomeProps {
  posts: CardPost[];
}

export function HomeTemplate({ posts }: HomeProps) {
  return (
    <article>
      <h1>Latest posts</h1>
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
