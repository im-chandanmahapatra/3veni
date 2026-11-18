import LegalPage from '@/components/layout/LegalPage';
import { SITE } from '@/content/site';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Terms and Conditions',
  description: 'Terms governing website access, illustrative sample parcel disclosures, and future residential concepts on 3VENI SPHERE.',
  path: '/terms-and-conditions',
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      eyebrow="Website Terms of Use"
      path="/terms-and-conditions"
      notice={
        <>
          <strong>Legal Governance Notice:</strong> These terms describe the informational scope of this digital experience. Corporate jurisdiction,
          statutory registration references, and commercial contract terms require client legal counsel finalization prior to commercial transactions.
        </>
      }
    >
      <h2>1. Informational &amp; Sample Scope</h2>
      <p>
        Parcel diagrams, sample dimensions, masterplan schematics, and architectural concepts shown on <strong>{SITE.brandName}</strong> are presented
        for design overview and preliminary evaluation. Verified project-specific surveys, exact measurements, and approved layouts are provided
        separately when live phases open.
      </p>

      <h2>2. No Binding Offer or Legal/Financial Advice</h2>
      <p>
        Nothing published on this website constitutes a binding offer for sale, reservation contract, investment return guarantee, or statutory
        certification. Official disclosures, applicable regulatory registrations (such as RERA registration details where applicable), and transaction
        agreements are issued exclusively through signed written documentation.
      </p>

      <h2>3. Future Homes Collection</h2>
      <p>
        Architectural residences presented under the <strong>Future Homes</strong> collection are conceptual design studies labeled &ldquo;Coming Soon
        · Future Collection&rdquo; and are not currently offered for sale or booking.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        The {SITE.brandName} wordmark, circular emblem artwork, editorial copy, and masterplan visuals remain proprietary brand materials.
        Unauthorized reproduction or commercial reuse is prohibited.
      </p>
    </LegalPage>
  );
}
