import Link from 'next/link';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import CookieStatusCard from '@/components/consent/CookieStatusCard';
import { SphereCrestDivider } from '@/components/ui/BrandMotifs';

export const metadata = createPageMetadata({
  title: 'Cookie Policy',
  description:
    'Transparent overview of strictly necessary browser storage and optional analytics/marketing cookie controls on 3VENI SPHERE.',
  path: '/cookie-policy',
});

export default function CookiePolicyPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Cookie Policy', path: '/cookie-policy' },
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
          <span className="text-[#24221E] font-medium">Cookie Policy</span>
        </nav>

        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#98400F] mb-3">
          Consent &amp; Storage Transparency
        </p>
        <h1 className="font-editorial text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.08] font-medium text-[#24221E]">
          Cookie Policy
        </h1>

        <div className="mt-6 p-5 bg-[#EDE5D6] border border-[#98400F]/35 text-xs sm:text-sm text-[#493023] leading-relaxed">
          <strong>Transparency Notice:</strong> This policy reflects actual storage behaviour and
          opt-in controls enforced across the 3VENI SPHERE application.
        </div>

        <CookieStatusCard />

        <SphereCrestDivider tone="light" className="my-10" />

        <div className="space-y-8 text-[15px] leading-[1.78] text-[#493023]">
          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              1. Strictly Necessary Storage
            </h2>
            <p>
              Essential for core page delivery and remembering your privacy preference. We store a
              single JSON record in browser <code className="font-mono text-xs">localStorage</code>{' '}
              (<code className="font-mono text-xs">3veni_cookie_consent_v1</code>) containing your
              selected category flags and decision timestamp.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              2. Analytics Cookies (Inactive by Default)
            </h2>
            <p>
              Analytics storage remains turned off unless you choose <strong>Accept All</strong> or
              enable Analytics in <strong>Manage Cookie Preferences</strong>. No third-party
              analytics tracker is loaded prior to explicit consent.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              3. Marketing Cookies (Inactive by Default)
            </h2>
            <p>
              Marketing and attribution cookies remain disabled by default and are never activated
              without prior opt-in consent.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-medium text-[#24221E] mb-3">
              4. Managing or Withdrawing Consent
            </h2>
            <p>
              You can change or withdraw optional consent at any time using the{' '}
              <strong>Update Cookie Preferences</strong> button above or via{' '}
              <strong>Cookie Settings</strong> in the footer.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
