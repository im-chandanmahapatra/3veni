export interface CookieConsentPreferences {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

export const CONSENT_STORAGE_KEY = '3veni_cookie_consent_v1';
export const CONSENT_VERSION = 1;

export const DEFAULT_OPTIONAL_CONSENT = {
  analytics: false,
  marketing: false,
} as const;

export function createConsentRecord(options: {
  analytics: boolean;
  marketing: boolean;
  now?: Date;
}): CookieConsentPreferences {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: Boolean(options.analytics),
    marketing: Boolean(options.marketing),
    decidedAt: (options.now ?? new Date()).toISOString(),
  };
}

export function parseStoredConsent(raw: string | null): CookieConsentPreferences | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean' ||
      typeof parsed.decidedAt !== 'string'
    ) {
      return null;
    }
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      decidedAt: parsed.decidedAt,
    };
  } catch {
    return null;
  }
}

export function isCategoryConsented(
  consent: CookieConsentPreferences | null,
  category: 'necessary' | 'analytics' | 'marketing'
): boolean {
  if (category === 'necessary') return true;
  if (!consent) return false;
  return Boolean(consent[category]);
}
