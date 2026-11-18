import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { GUIDES } from '@/content/guides';
import { buildMetadata } from '@/lib/seo';

/** Hub for buyer guides. Indexable only once there are at least three guides (thin-content rule, plan §4). */
export const metadata = buildMetadata({
  title: 'Buyer guides',
  description: 'Practical, plain-language guidance for buyers evaluating plotted residential land.',
  path: '/guides',
  noindex: GUIDES.length < 3,
});

export default function GuidesHubPage() {
  return (
    <div className="page-top">
      <div className="wrap wrap--reading">
        <header className="listing-head">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Buyer guides' }]} />
          <p className="t-overline">Buyer guides</p>
          <h1 className="t-display-lg">Ask disciplined questions before you buy land.</h1>
        </header>
        <ul className="guide-list">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <p className="t-overline">{g.eyebrow}</p>
              <h2 className="t-display-md">
                <Link href={`/guides/${g.slug}`}>{g.metaTitle}</Link>
              </h2>
              <p className="t-body">{g.metaDescription}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="section--tight" />
    </div>
  );
}
