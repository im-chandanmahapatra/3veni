import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { listingHref, type ListingQuery } from '@/lib/listing';

/** Numbered pagination as real, crawlable links (DESIGN §8.7). Rendered only when there is more than one page. */
export default function Pagination({ query, page, pageCount }: { query: ListingQuery; page: number; pageCount: number }) {
  if (pageCount <= 1) return null;
  const href = (n: number) => listingHref({ ...query, page: n });
  return (
    <nav aria-label="Pagination">
      <ul className="pagination">
        <li>
          {page > 1 ? (
            <Link href={href(page - 1)} rel="prev" aria-label="Previous page">
              <Icon name="chevron-left" />
            </Link>
          ) : (
            <span aria-disabled="true">
              <Icon name="chevron-left" />
            </span>
          )}
        </li>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page">
                <span className="sr-only">Page </span>
                {n}
              </span>
            ) : (
              <Link href={href(n)}>
                <span className="sr-only">Page </span>
                {n}
              </Link>
            )}
          </li>
        ))}
        <li>
          {page < pageCount ? (
            <Link href={href(page + 1)} rel="next" aria-label="Next page">
              <Icon name="chevron-right" />
            </Link>
          ) : (
            <span aria-disabled="true">
              <Icon name="chevron-right" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
