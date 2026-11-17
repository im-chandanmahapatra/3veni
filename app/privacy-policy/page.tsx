import Link from 'next/link';
import { SITE_CONFIG } from '@/config/siteConfig';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import { SphereCrestDivider } from '@/components/ui/BrandMotifs';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description:
    'Privacy and data handling notice for 3VENI SPHERE covering enquiry submissions, browser consent storage, and hosting.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
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
          <span className="text-[#24221E] font-medium">Privacy Policy</span>
        </nav>

        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#98400F] mb-3">
          Privacy &amp; Data Notice
        </p>
        <h1 className="font-editorial text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.08] font-medium text-[#24221E]">
          Privacy Policy
        </h1>

        <div className="mt-6 p-5 bg-[#EDE5D6] border border-[#98400F]/35 text-xs sm:text-sm text-[#493023] leading-relaxed">
          <strong>Policy Governance Notice:</strong> This policy reflects actual data processing
          implemented on the {SITE_CONFIG.brandName} web application. Statutory entity details,
          registered office address, data retention periods, and grievance contact details must be
          confirmed by legal counsel and published prior to live commercial launch.
        </div>

        <SphereCrestDivider tone="light" className="my-10" />

        <div className="space-y-8 text-[15px] leading-[1.78] text-[#493023]">
          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              1. Controller &amp; Website Identity
            </h2>
            <p>
              This website is presented for <strong>{SITE_CONFIG.brandName}</strong>. Formal
              corporate registration particulars, registered office address, and designated contact
              person details are pending final client verification before commercial launch.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              2. Enquiry Form Submissions
            </h2>
            <p>
              When you submit an enquiry on the Homepage or Contact page, our server endpoint
              validates your name, phone number, email address, land parcel interest, preferred
              format, and optional message solely to respond to your advisory request.
            </p>
            <p className="mt-3">
              When configured by the website operator, validated enquiries are forwarded via secure
              server-to-server channels to authorized advisory email or CRM workflows. If automated
              server channels are not configured, the application informs you transparently rather
              than storing unacknowledged submissions.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              3. Cookies &amp; Consent Storage
            </h2>
            <p>
              Your consent preferences are stored locally in browser storage under the key{' '}
              <code className="font-mono text-xs bg-[#EDE5D6] px-1.5 py-0.5">
                3veni_cookie_consent_v1
              </code>
              . Optional analytics and marketing categories stay off unless you explicitly opt in.
              Full controls are explained on our{' '}
              <Link
                href="/cookie-policy"
                className="text-[#98400F] underline underline-offset-4 hover:text-[#7A310A]"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              4. Server Logs &amp; Security Controls
            </h2>
            <p>
              Standard web server request metadata (such as transient IP addresses evaluated in
              memory for enquiry rate limiting and spam protection) is processed to keep the
              platform reliable and secure. Typography files are self-hosted with the application so
              your browser does not transmit font requests to external third-party CDNs.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              5. Updating or Withdrawing Consent
            </h2>
            <p>
              You may review, modify, or withdraw optional cookie preferences at any time via the{' '}
              <strong>Cookie Settings</strong> button in the website footer, or reach out via the{' '}
              <Link
                href="/contact"
                className="text-[#98400F] underline underline-offset-4 hover:text-[#7A310A]"
              >
                Contact page
              </Link>{' '}
              for assistance regarding an enquiry you previously sent.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
