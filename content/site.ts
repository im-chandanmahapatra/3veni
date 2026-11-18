/**
 * Site identity and public contact details (typed, all optional).
 *
 * RULE 4/5 (V2 brief): nothing here is invented. Brand name, tagline, description and the registered
 * entity name are V1's existing values. Phone / email / WhatsApp / address / registration IDs / socials are
 * NOT in the repository — they are [CLIENT TO PROVIDE] (see content/placeholders.ts). Fill them here, or set
 * the matching environment variables (env wins; see lib/site.ts).
 */
export interface PostalAddress {
  street?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}

export interface SiteContent {
  brandName: string;
  tagline: string;
  description: string;
  /** V1 value, kept: the registered entity name is the brand name until the client supplies the legal one */
  registeredEntityName: string;
  serviceFocusLabel: string;
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    address?: PostalAddress;
    hours?: string;
  };
  registration: {
    cin?: string;
    reraNumbers?: string[];
  };
  socials: { label: string; href: string }[];
}

export const SITE: SiteContent = {
  brandName: '3VENI SPHERE',
  tagline: 'Invest With Confidence',
  description:
    '3VENI SPHERE — Invest With Confidence. Curated plotted land developments and future architectural residences.',
  registeredEntityName: '3VENI SPHERE',
  serviceFocusLabel: 'Contoured Residential Land & Architectural Planning',
  contact: {},
  registration: {},
  socials: [],
};
