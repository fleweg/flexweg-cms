interface SingleProps {
  post: { title: string };
  bodyHtml: string;
  author?: { displayName: string };
}

export function SingleTemplate({ post, bodyHtml, author }: SingleProps) {
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        {author && <p className="mt-meta">By {author.displayName}</p>}
      </header>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </article>
  );
}
