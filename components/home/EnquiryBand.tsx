import Link from 'next/link';
import ClientSlot from '@/components/ui/ClientSlot';
import Icon from '@/components/ui/Icon';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { ENQUIRY_COPY } from '@/content/copy';
import { PREFERRED_LOCATIONS } from '@/lib/enquiry/validation';
import { getEnquiryIntegration } from '@/lib/enquiry/config';
import { getInterestOptions } from '@/lib/interests';
import { getSite } from '@/lib/site';

/**
 * Enquiry band (plan B9): copy + direct channels + the form, all server-rendered (audit C5). `headingAs="h1"` is used
 * on /contact; the home page uses h2. Direct channels show real values only — slots in preview, nothing in live.
 */
export default function EnquiryBand({
  defaultInterest,
  headingAs: Heading = 'h2',
  id = 'enquire',
  idPrefix = 'enq',
}: {
  defaultInterest?: string;
  headingAs?: 'h1' | 'h2';
  id?: string;
  idPrefix?: string;
}) {
  const site = getSite();
  return (
    <section id={id} className="section section--sunken" aria-labelledby={`${id}-title`}>
      <div className="wrap enquiry">
        <div className="enquiry__copy">
          <p className="t-overline">{ENQUIRY_COPY.eyebrow}</p>
          <Heading id={`${id}-title`} className="t-display-lg">
            {ENQUIRY_COPY.heading}
          </Heading>
          <p className="t-lead">{ENQUIRY_COPY.body}</p>

          {site.hasChannel ? (
            <ul className="enquiry__channels">
              {site.phone ? (
                <li>
                  <a href={site.phone.href}>
                    <Icon name="phone" />
                    <span>{site.phone.display}</span>
                  </a>
                </li>
              ) : null}
              {site.whatsapp ? (
                <li>
                  <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
                    <Icon name="chat" />
                    <span>WhatsApp {site.whatsapp.display}</span>
                  </a>
                </li>
              ) : null}
              {site.email ? (
                <li>
                  <a href={site.email.href}>
                    <Icon name="mail" />
                    <span>{site.email.display}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          ) : (
            <ClientSlot id="contact-channels" />
          )}

          <p className="notice enquiry__privacy">
            <span>
              <strong>Privacy commitment.</strong> {ENQUIRY_COPY.privacy} <Link href="/privacy-policy" className="link-inline">Privacy Policy</Link>.
            </span>
          </p>
        </div>

        <div className="enquiry__form">
          <EnquiryForm
            idPrefix={idPrefix}
            interests={getInterestOptions()}
            defaultInterest={defaultInterest}
            terrainOptions={PREFERRED_LOCATIONS}
            deliveryConfigured={getEnquiryIntegration().configured}
            channels={{ phone: site.phone, whatsapp: site.whatsapp, email: site.email }}
          />
        </div>
      </div>
    </section>
  );
}
