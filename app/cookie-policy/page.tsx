import CookieStatus from '@/components/layout/CookieStatus';
import LegalPage from '@/components/layout/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Cookie Policy',
  description: 'Transparent overview of strictly necessary browser storage and optional analytics/marketing cookie controls on 3VENI SPHERE.',
  path: '/cookie-policy',
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      eyebrow="Consent & Storage Transparency"
      path="/cookie-policy"
      notice={
        <>
          <strong>Transparency Notice:</strong> This policy reflects actual storage behaviour and opt-in controls enforced across the 3VENI SPHERE
          application.
        </>
      }
    >
      <CookieStatus />

      <h2>1. Strictly Necessary Storage</h2>
      <p>
        Essential for core page delivery and remembering your privacy preference. We store a single JSON record in browser <code>localStorage</code> (
        <code>3veni_cookie_consent_v1</code>) containing your selected category flags and decision timestamp.
      </p>

      <h2>2. Analytics Cookies (Inactive by Default)</h2>
      <p>
        Analytics storage remains turned off unless you choose <strong>Accept All</strong> or enable Analytics in{' '}
        <strong>Manage Cookie Preferences</strong>. No third-party analytics tracker is loaded prior to explicit consent.
      </p>

      <h2>3. Marketing Cookies (Inactive by Default)</h2>
      <p>Marketing and attribution cookies remain disabled by default and are never activated without prior opt-in consent.</p>

      <h2>4. Managing or Withdrawing Consent</h2>
      <p>
        You can change or withdraw optional consent at any time using the <strong>Update Cookie Preferences</strong> button above or via{' '}
        <strong>Cookie Settings</strong> in the footer.
      </p>
    </LegalPage>
  );
}
