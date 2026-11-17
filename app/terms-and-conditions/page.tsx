import Link from 'next/link';
import { SITE_CONFIG } from '@/config/siteConfig';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import { SphereCrestDivider } from '@/components/ui/BrandMotifs';

export const metadata = createPageMetadata({
  title: 'Terms and Conditions',
  description:
    'Terms governing website access, illustrative sample parcel disclosures, and future residential concepts on 3VENI SPHERE.',
  path: '/terms-and-conditions',
});

export default function TermsPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Terms & Conditions', path: '/terms-and-conditions' },
  ]);

  return (
    <article className="pt-28 pb-24 bg-[#F6F1E7] text-[#24221E]">
      <JsonLd data={breadcrumb} />

      <div className="max-w-[880px] mx-auto px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[#5E554B] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#98400F] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#24221E] font-medium">Terms &amp; Conditions</span>
        </nav>

        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#98400F] mb-3">
          Website Terms of Use
        </p>
        <h1 className="font-editorial text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.08] font-medium text-[#24221E]">
          Terms and Conditions
        </h1>

        <div className="mt-6 p-5 bg-[#EDE5D6] border border-[#98400F]/35 text-xs sm:text-sm text-[#493023] leading-relaxed">
          <strong>Legal Governance Notice:</strong> These terms describe the informational scope of
          this digital experience. Corporate jurisdiction, statutory registration references, and
          commercial contract terms require client legal counsel finalization prior to commercial
          transactions.
        </div>

        <SphereCrestDivider tone="light" className="my-10" />

        <div className="space-y-8 text-[15px] leading-[1.78] text-[#493023]">
          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              1. Informational &amp; Sample Scope
            </h2>
            <p>
              Parcel diagrams, sample dimensions, masterplan schematics, and architectural concepts
              shown on <strong>{SITE_CONFIG.brandName}</strong> are presented for design overview
              and preliminary evaluation. Verified project-specific surveys, exact measurements, and
              approved layouts are provided separately when live phases open.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              2. No Binding Offer or Legal/Financial Advice
            </h2>
            <p>
              Nothing published on this website constitutes a binding offer for sale, reservation
              contract, investment return guarantee, or statutory certification. Official
              disclosures, applicable regulatory registrations (such as RERA registration details
              where applicable), and transaction agreements are issued exclusively through signed
              written documentation.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              3. Future Homes Collection
            </h2>
            <p>
              Architectural residences presented under the <strong>Future Homes</strong> collection
              are conceptual design studies labeled &ldquo;Coming Soon · Future Collection&rdquo; and
              are not currently offered for sale or booking.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              4. Intellectual Property
            </h2>
            <p>
              The {SITE_CONFIG.brandName} wordmark, circular emblem artwork, editorial copy, and
              masterplan visuals remain proprietary brand materials. Unauthorized reproduction or
              commercial reuse is prohibited.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
