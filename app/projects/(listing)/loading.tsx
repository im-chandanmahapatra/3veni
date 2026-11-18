import Skeleton from '@/components/ui/Skeleton';

/** Instant skeleton while the server renders a filtered listing (DESIGN §8.12). */
export default function Loading() {
  return (
    <div className="page-top" aria-busy="true" aria-label="Loading plots">
      <div className="wrap">
        <div className="listing-head">
          <Skeleton style={{ height: '1rem', width: '9rem' }} />
          <Skeleton style={{ height: '3.5rem', width: 'min(100%, 38rem)' }} />
          <Skeleton style={{ height: '3.5rem', width: 'min(100%, 28rem)' }} />
        </div>
        <ul className="listing-grid">
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <Skeleton style={{ aspectRatio: '3 / 2' }} />
              <Skeleton style={{ height: '8rem', marginTop: '0.5rem' }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
