import Link from 'next/link';
import LegalPage from '@/components/layout/LegalPage';
import { SITE } from '@/content/site';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Privacy and data handling notice for 3VENI SPHERE covering enquiry submissions, browser consent storage, and hosting.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      eyebrow="Privacy & Data Notice"
      path="/privacy-policy"
      notice={
        <>
          <strong>Policy Governance Notice:</strong> This policy reflects actual data processing implemented on the {SITE.brandName} web application.
          Statutory entity details, registered office address, data retention periods, and grievance contact details must be confirmed by legal
          counsel and published prior to live commercial launch.
        </>
      }
    >
      <h2>1. Controller &amp; Website Identity</h2>
      <p>
        This website is presented for <strong>{SITE.brandName}</strong>. Formal corporate registration particulars, registered office address, and
        designated contact person details are pending final client verification before commercial launch.
      </p>

      <h2>2. Enquiry Form Submissions</h2>
      <p>
        When you submit an enquiry on the Homepage or Contact page, our server endpoint validates your name, phone number, email address, land
        parcel interest, preferred format, and optional message solely to respond to your advisory request.
      </p>
      <p>
        When configured by the website operator, validated enquiries are forwarded via secure server-to-server channels to authorized advisory email
        or CRM workflows. If automated server channels are not configured, the application informs you transparently rather than storing
        unacknowledged submissions.
      </p>

      <h2>3. Cookies &amp; Consent Storage</h2>
      <p>
        Your consent preferences are stored locally in browser storage under the key <code>3veni_cookie_consent_v1</code>. Optional analytics and
        marketing categories stay off unless you explicitly opt in. Full controls are explained on our{' '}
        <Link href="/cookie-policy" className="link-inline">
          Cookie Policy
        </Link>
        .
      </p>

      <h2>4. Server Logs &amp; Security Controls</h2>
      <p>
        Standard web server request metadata (such as transient IP addresses evaluated in memory for enquiry rate limiting and spam protection) is
        processed to keep the platform reliable and secure. Typography files are self-hosted with the application so your browser does not transmit
        font requests to external third-party CDNs.
      </p>

      <h2>5. Updating or Withdrawing Consent</h2>
      <p>
        You may review, modify, or withdraw optional cookie preferences at any time via the <strong>Cookie Settings</strong> button in the website
        footer, or reach out via the{' '}
        <Link href="/contact" className="link-inline">
          Contact page
        </Link>{' '}
        for assistance regarding an enquiry you previously sent.
      </p>
    </LegalPage>
  );
}
