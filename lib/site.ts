import { SITE, type PostalAddress } from '@/content/site';

/** A public contact channel, ready to render: display text + safe href. Plain data, so it can cross the server/client boundary. */
export interface Channel {
  display: string;
  href: string;
}

export interface ResolvedSite {
  brandName: string;
  tagline: string;
  description: string;
  registeredEntityName: string;
  serviceFocusLabel: string;
  phone?: Channel;
  email?: Channel;
  whatsapp?: Channel;
  address?: PostalAddress;
  addressLine?: string;
  hours?: string;
  cin?: string;
  reraNumbers: string[];
  socials: { label: string; href: string }[];
  /** at least one of phone / email / WhatsApp exists */
  hasChannel: boolean;
}

function clean(v: string | undefined | null): string | undefined {
  const s = (v ?? '').trim();
  return s ? s : undefined;
}

export function digitsOnly(v: string): string {
  return v.replace(/[^\d]/g, '');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function buildPhone(raw: string | undefined): Channel | undefined {
  const display = clean(raw);
  if (!display) return undefined;
  const digits = digitsOnly(display);
  if (digits.length < 7) return undefined;
  return { display, href: `tel:${display.trim().startsWith('+') ? '+' : ''}${digits}` };
}

export function buildEmail(raw: string | undefined): Channel | undefined {
  const display = clean(raw);
  if (!display || !EMAIL_RE.test(display)) return undefined;
  return { display, href: `mailto:${display}` };
}

export function buildWhatsApp(raw: string | undefined): Channel | undefined {
  const display = clean(raw);
  if (!display) return undefined;
  const digits = digitsOnly(display);
  if (digits.length < 7) return undefined;
  return { display, href: `https://wa.me/${digits}` };
}

/** Environment wins over content/site.ts so deployments can set channels without a code change. */
export function getSite(env: NodeJS.ProcessEnv = process.env): ResolvedSite {
  const phone = buildPhone(env.NEXT_PUBLIC_CONTACT_PHONE || env.CONTACT_PHONE || SITE.contact.phone);
  const email = buildEmail(env.NEXT_PUBLIC_CONTACT_EMAIL || env.CONTACT_EMAIL || SITE.contact.email);
  const whatsapp = buildWhatsApp(env.NEXT_PUBLIC_WHATSAPP_NUMBER || env.WHATSAPP_NUMBER || SITE.contact.whatsapp);
  const address = SITE.contact.address;
  const addressLine =
    clean(env.NEXT_PUBLIC_OFFICE_ADDRESS) ??
    (address
      ? [address.street, address.locality, address.region, address.postalCode, address.country].filter(Boolean).join(', ') ||
        undefined
      : undefined);
  return {
    brandName: SITE.brandName,
    tagline: SITE.tagline,
    description: SITE.description,
    registeredEntityName: SITE.registeredEntityName,
    serviceFocusLabel: SITE.serviceFocusLabel,
    phone,
    email,
    whatsapp,
    address,
    addressLine,
    hours: clean(env.NEXT_PUBLIC_OFFICE_HOURS) ?? clean(SITE.contact.hours),
    cin: clean(SITE.registration.cin),
    reraNumbers: SITE.registration.reraNumbers ?? [],
    socials: SITE.socials,
    hasChannel: Boolean(phone || email || whatsapp),
  };
}

/** WhatsApp deep link with a pre-filled message (used by the enquiry failure state and contact page). */
export function whatsappHrefWithMessage(channel: Channel, message: string): string {
  return `${channel.href}?text=${encodeURIComponent(message)}`;
}

export function mailtoHrefWithMessage(channel: Channel, subject: string, body: string): string {
  return `${channel.href}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
