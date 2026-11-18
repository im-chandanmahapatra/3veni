import Link from 'next/link';

export interface Crumb {
  name: string;
  /** omit on the current page */
  href?: string;
}

export default function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={['breadcrumb', className ?? ''].filter(Boolean).join(' ')}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`}>
              {item.href && !last ? (
                <Link href={item.href}>{item.name}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
