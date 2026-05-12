interface NotFoundProps {
  message?: string;
}

export function NotFoundTemplate({ message }: NotFoundProps) {
  return (
    <article>
      <h1>404 — Not found</h1>
      <p>{message || "The page you're looking for doesn't exist."}</p>
      <p>
        <a href="/index.html">Back to home</a>
      </p>
    </article>
  );
}
