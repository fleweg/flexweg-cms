interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} aria-current={isLast ? "page" : undefined}>
              {item.href && !isLast ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
