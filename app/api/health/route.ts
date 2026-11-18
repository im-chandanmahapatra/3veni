import { NextResponse } from 'next/server';
import { getContentMode, getSiteUrl, isIndexable } from '@/lib/config';
import { getEnquiryIntegration } from '@/lib/enquiry/config';
import { getSite } from '@/lib/site';

export const dynamic = 'force-dynamic';

/**
 * Deployment health + configuration booleans only (never values, never secrets) — lets the team verify after a
 * deploy that the domain, contact channels and enquiry delivery are really wired (audit C1/C2/C4).
 */
export function GET() {
  const enquiry = getEnquiryIntegration();
  const site = getSite();
  return NextResponse.json(
    {
      status: 'ok',
      contentMode: getContentMode(),
      siteUrlVerified: getSiteUrl().verified,
      indexable: isIndexable(),
      enquiryDelivery: { smtp: enquiry.smtp, crm: enquiry.crm, configured: enquiry.configured },
      contactChannels: { phone: Boolean(site.phone), email: Boolean(site.email), whatsapp: Boolean(site.whatsapp) },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
