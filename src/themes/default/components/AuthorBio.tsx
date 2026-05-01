import type { AuthorView } from "../../types";

export function AuthorBio({ author }: { author: AuthorView }) {
  return (
    <aside className="author-bio">
      <p className="author-bio__name">{author.displayName}</p>
    </aside>
  );
}
