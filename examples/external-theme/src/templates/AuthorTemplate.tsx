interface CardPost {
  id: string;
  title: string;
  url: string;
  dateLabel?: string;
}

interface AuthorProps {
  author: { displayName: string; bio?: string };
  posts: CardPost[];
}

export function AuthorTemplate({ author, posts }: AuthorProps) {
  return (
    <article>
      <header>
        <h1>{author.displayName}</h1>
        {author.bio && <p>{author.bio}</p>}
      </header>
      <h2>Posts</h2>
      <ul className="mt-list">
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/${post.url}`}>{post.title}</a>
            {post.dateLabel && (
              <span className="mt-meta"> — {post.dateLabel}</span>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}
