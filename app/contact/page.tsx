import EnquiryBand from '@/components/home/EnquiryBand';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ClientSlot from '@/components/ui/ClientSlot';
import JsonLd from '@/components/seo/JsonLd';
import { resolveInterest } from '@/lib/interests';
import { breadcrumbJsonLd, contactPageJsonLd } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { getSite } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Contact & Advisory Enquiry',
  description: 'Connect with the 3VENI SPHERE advisory desk to discuss land plot typologies, dimensions, or future residential concepts.',
  path: '/contact',
  image: { path: '/og/contact.jpg', alt: 'Stone-lined avenue at golden hour' },
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** `?interest=` is accepted only when it matches a real option (V1 echoed arbitrary text into the form). */
export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const interest = resolveInterest((await searchParams).interest);
  const site = getSite();
  return (
    <div className="page-top">
      <JsonLd data={contactPageJsonLd(site)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <div className="wrap">
        <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Contact' }]} />
      </div>
      <EnquiryBand headingAs="h1" id="enquire" idPrefix="contact" defaultInterest={interest} />
      <section className="section--tight" aria-label="Office details">
        <div className="wrap contact-facts">
          {site.addressLine ? (
            <div>
              <h2 className="t-overline">Office</h2>
              <p className="t-body">{site.addressLine}</p>
            </div>
          ) : (
            <ClientSlot id="address" />
          )}
          {site.hours ? (
            <div>
              <h2 className="t-overline">Hours</h2>
              <p className="t-body">{site.hours}</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
