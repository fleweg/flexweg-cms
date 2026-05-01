interface PaginationProps {
  currentPage: number;
  totalPages: number;
  // Builds the href for a given page number. Page 1 typically resolves to
  // the term/home root URL, deeper pages may use a pattern like
  // "/category/page/2/index.html".
  hrefForPage: (page: number) => string;
}

export function Pagination({ currentPage, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="pagination" aria-label="Pagination">
      <ul>
        {pages.map((page) => (
          <li key={page} aria-current={page === currentPage ? "page" : undefined}>
            <a href={hrefForPage(page)}>{page}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
