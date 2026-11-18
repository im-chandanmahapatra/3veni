/**
 * Registry of everything the client still has to provide (V2 brief, rule 4: no fake content).
 *
 *  - In `CONTENT_MODE=preview` an unresolved item renders as a marked [CLIENT TO PROVIDE] slot (components/ui/ClientSlot).
 *  - In `CONTENT_MODE=live` it renders nothing, and `npm run check:launch` fails the build when a *critical* item is unresolved.
 *  - `npm run content:report` prints this registry (it feeds docs/v2/HANDOVER.md).
 */
export type PlaceholderId =
  | 'domain'
  | 'enquiry-delivery'
  | 'contact-channels'
  | 'address'
  | 'registration'
  | 'location-facts'
  | 'coordinates'
  | 'documents'
  | 'prices'
  | 'photography'
  | 'leadership'
  | 'testimonials'
  | 'proof'
  | 'press'
  | 'socials'
  | 'analytics'
  | 'guides';

export interface PlaceholderDef {
  id: PlaceholderId;
  /** short name shown in the slot */
  label: string;
  /** exactly what is needed from the client */
  needs: string;
  /** a live build must not ship without it */
  critical: boolean;
  /** where it appears / is configured */
  where: string;
}

export const PLACEHOLDERS: Record<PlaceholderId, PlaceholderDef> = {
  domain: {
    id: 'domain',
    label: 'Production domain',
    needs: 'the public https domain (NEXT_PUBLIC_SITE_URL) — drives canonical URLs, sitemap, Open Graph and structured data.',
    critical: true,
    where: 'environment: NEXT_PUBLIC_SITE_URL',
  },
  'enquiry-delivery': {
    id: 'enquiry-delivery',
    label: 'Enquiry delivery',
    needs: 'an SMTP account + receiving inbox, or a CRM webhook URL, so enquiries actually reach the team.',
    critical: true,
    where: 'environment: SMTP_* / ENQUIRY_RECIPIENT_EMAIL / CRM_WEBHOOK_URL',
  },
  'contact-channels': {
    id: 'contact-channels',
    label: 'Contact channels',
    needs: 'at least one public phone number, WhatsApp number or email address.',
    critical: true,
    where: 'header, mobile menu, footer, contact page, enquiry panels · content/site.ts or NEXT_PUBLIC_CONTACT_*',
  },
  address: {
    id: 'address',
    label: 'Office address and hours',
    needs: 'registered/office address and opening hours.',
    critical: false,
    where: 'footer, contact page, structured data · content/site.ts',
  },
  registration: {
    id: 'registration',
    label: 'Registration and legal identity',
    needs: 'CIN / entity name and RERA registration number(s) where applicable.',
    critical: false,
    where: 'footer compliance block, about page · content/site.ts',
  },
  'location-facts': {
    id: 'location-facts',
    label: 'Location and connectivity',
    needs: 'the real site location(s), nearby landmarks and drive times.',
    critical: false,
    where: 'home terrain section, parcel pages',
  },
  coordinates: {
    id: 'coordinates',
    label: 'Site coordinates',
    needs: 'latitude/longitude for each parcel (enables the click-to-load map).',
    critical: false,
    where: 'parcel pages · content/parcels.ts (geo)',
  },
  documents: {
    id: 'documents',
    label: 'Parcel documents',
    needs: 'brochure / survey sketch / layout PDFs for each parcel.',
    critical: false,
    where: 'parcel pages · content/parcels.ts (documents)',
  },
  prices: {
    id: 'prices',
    label: 'Prices or price bands',
    needs: 'confirmation whether prices (or "from" prices) may be shown publicly.',
    critical: false,
    where: 'parcel cards and pages · content/parcels.ts (price)',
  },
  photography: {
    id: 'photography',
    label: 'Photography',
    needs: 'original photography or drone/video at 2400 px or wider (current images appear synthetic and top out at 1376 px).',
    critical: false,
    where: 'public/images · content/images.ts',
  },
  leadership: {
    id: 'leadership',
    label: 'Leadership and team',
    needs: 'names, roles, portraits and short biographies you are happy to publish.',
    critical: false,
    where: 'about page · content/proof.ts',
  },
  testimonials: {
    id: 'testimonials',
    label: 'Testimonials',
    needs: 'quote, name, role and written permission to publish.',
    critical: false,
    where: 'home and about · content/proof.ts',
  },
  proof: {
    id: 'proof',
    label: 'Proof points',
    needs: 'verifiable facts only (years operating, acres stewarded, families served, registrations).',
    critical: false,
    where: 'home proof row · content/proof.ts',
  },
  press: {
    id: 'press',
    label: 'Awards and press',
    needs: 'awards, publications or partners you can cite.',
    critical: false,
    where: 'about page · content/proof.ts',
  },
  socials: {
    id: 'socials',
    label: 'Social profiles',
    needs: 'public profile URLs.',
    critical: false,
    where: 'footer · content/site.ts',
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    needs: 'a decision (privacy-friendly analytics or GA) and the account/ID; loads only after consent.',
    critical: false,
    where: 'components/analytics · environment',
  },
  guides: {
    id: 'guides',
    label: 'Further guides',
    needs: 'additional buyer guides/articles (legal accuracy must be reviewed by the client).',
    critical: false,
    where: 'guides hub · content/guides.ts',
  },
};

export const PLACEHOLDER_LIST: PlaceholderDef[] = Object.values(PLACEHOLDERS);
