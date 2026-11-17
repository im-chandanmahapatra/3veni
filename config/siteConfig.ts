export interface PublicSocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  description: string;
  emblemPath: string;
  logoPath: string;
  heroFallbackPath: string;
  siteUrl: string;
  hasVerifiedSiteUrl: boolean;
  isDemoInventory: boolean;
  registeredEntityName: string;
  serviceFocusLabel: string;
  publicEmail: string;
  publicWhatsApp: string;
  socialLinks: PublicSocialLink[];
}

const DEFAULT_CANONICAL_FALLBACK = 'https://3venisphere.com';

function resolveSiteUrl(): { url: string; verified: boolean } {
  const candidate = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '').trim();
  if (!candidate) {
    return { url: DEFAULT_CANONICAL_FALLBACK, verified: false };
  }
  try {
    const parsed = new URL(candidate);
    const isLocalOrPreview =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.endsWith('.run.app');
    if (isLocalOrPreview || parsed.protocol !== 'https:') {
      return { url: DEFAULT_CANONICAL_FALLBACK, verified: false };
    }
    return { url: parsed.origin, verified: true };
  } catch {
    return { url: DEFAULT_CANONICAL_FALLBACK, verified: false };
  }
}

const resolvedSite = resolveSiteUrl();

export const SITE_CONFIG: SiteConfig = {
  brandName: '3VENI SPHERE',
  tagline: 'Invest With Confidence',
  description:
    '3VENI SPHERE — Invest With Confidence. Curated plotted land developments and future architectural residences.',
  emblemPath: '/images/brand/3veni-emblem.webp',
  logoPath: '/images/brand/3veni-logo.webp',
  heroFallbackPath: '/images/plots/aranya-ridge.webp',
  siteUrl: resolvedSite.url,
  hasVerifiedSiteUrl: resolvedSite.verified,
  isDemoInventory: process.env.NEXT_PUBLIC_DEMO_INVENTORY !== 'false',
  registeredEntityName: '3VENI SPHERE',
  serviceFocusLabel: 'Contoured Residential Land & Architectural Planning',
  publicEmail: (process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || '').trim(),
  publicWhatsApp: (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.WHATSAPP_NUMBER ||
    ''
  ).trim(),
  socialLinks: [],
};

export function buildWhatsAppHref(number: string, message: string): string | null {
  const digits = number.replace(/[^\d]/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoHref(email: string, subject: string, body: string): string | null {
  const clean = email.trim();
  if (!clean) return null;
  return `mailto:${clean}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
