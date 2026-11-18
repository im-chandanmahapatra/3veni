/**
 * Runtime/build configuration contract (plan §5.4, audit RC1: V1 shipped green with every business fact empty).
 *
 *  CONTENT_MODE=preview (default)  unresolved client content renders as a marked [CLIENT TO PROVIDE] slot; the site is noindex.
 *  CONTENT_MODE=live               unresolved slots render nothing; `npm run check:launch` (runs before `next build`)
 *                                  fails the build if a critical item is missing.
 *  FORCE_INDEXABLE=true            audit/staging switch: emit indexable output even in preview (needs a verified https URL).
 */
export type ContentMode = 'preview' | 'live';

export function getContentMode(): ContentMode {
  return (process.env.CONTENT_MODE ?? '').trim() === 'live' ? 'live' : 'preview';
}

export function isPreview(): boolean {
  return getContentMode() === 'preview';
}

export interface SiteUrlInfo {
  /** origin without trailing slash */
  url: string;
  /** true only for a real, public https origin supplied through NEXT_PUBLIC_SITE_URL / SITE_URL */
  verified: boolean;
}

const LOCAL_FALLBACK = 'http://localhost:3000';

export function resolveSiteUrl(raw: string | undefined = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL): SiteUrlInfo {
  const candidate = (raw ?? '').trim();
  if (!candidate) return { url: LOCAL_FALLBACK, verified: false };
  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname;
    const isLocal =
      host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.localhost') || host.endsWith('.run.app');
    if (parsed.protocol !== 'https:' || isLocal) return { url: LOCAL_FALLBACK, verified: false };
    return { url: parsed.origin, verified: true };
  } catch {
    return { url: LOCAL_FALLBACK, verified: false };
  }
}

export function getSiteUrl(): SiteUrlInfo {
  return resolveSiteUrl();
}

/**
 * Search engines may index this build only when the domain is verified AND the site is live
 * (or the audit switch FORCE_INDEXABLE is set). Prevents a staging/preview site from being indexed
 * under a placeholder domain (audit C4).
 */
export function isIndexable(): boolean {
  if (!getSiteUrl().verified) return false;
  return getContentMode() === 'live' || (process.env.FORCE_INDEXABLE ?? '').trim() === 'true';
}

/** Origins allowed to embed the site in a frame (audit M12). Default: same origin only. */
export function getEmbedOrigins(): string[] {
  return (process.env.EMBED_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function absoluteUrl(path: string): string {
  return new URL(path.startsWith('/') ? path : `/${path}`, getSiteUrl().url).toString();
}
