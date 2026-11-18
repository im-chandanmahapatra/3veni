import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import InteractiveChecklist from '@/components/forms/InteractiveChecklist';
import JsonLd from '@/components/seo/JsonLd';
import { GUIDES, getGuideBySlug } from '@/content/guides';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Guide not found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    type: 'article',
    image: { path: '/og/guide.jpg', alt: 'Honed sandstone steps and rammed earth garden wall in afternoon light' },
  });
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <article className="page-top guide">
      <JsonLd data={articleJsonLd(guide, '/og/guide.jpg')} />
      <JsonLd data={faqJsonLd(guide.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Buyer guides', path: '/guides' },
          { name: guide.metaTitle, path: `/guides/${guide.slug}` },
        ])}
      />
      <div className="wrap wrap--reading">
        <header className="guide__head">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Buyer guides', href: '/guides' }, { name: guide.eyebrow }]} />
          <p className="t-overline">{guide.eyebrow}</p>
          <h1 className="t-display-lg">{guide.title}</h1>
          <p className="t-lead">{guide.intro}</p>
          <p className="t-caption">
            Educational reference — last reviewed{' '}
            <time dateTime={guide.updatedAt}>
              {new Date(`${guide.updatedAt}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
            </time>
            .
          </p>
        </header>

        <InteractiveChecklist slug={guide.slug} sections={guide.sections} />

        <section className="guide__faq" aria-labelledby="faq-title">
          <p className="t-overline">Common buyer questions</p>
          <h2 id="faq-title" className="t-display-md">
            Frequently asked questions
          </h2>
          <div className="faq">
            {guide.faqs.map((f) => (
              <details key={f.question}>
                <summary>
                  <span>{f.question}</span>
                  <Icon name="plus" />
                </summary>
                <p className="t-body">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <aside className="guide__next no-print" aria-label="Next step">
          <p className="t-overline">Explore sample masterplans</p>
          <p className="t-display-md">Inspect plot proportions and contours on the schematic masterplan.</p>
          <div className="guide__next-actions">
            <Button href="/projects?view=plan">View the masterplan</Button>
            <Button href="/contact" variant="secondary" icon={null}>
              Contact the desk
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}
