import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Origins allowed to embed this site in an iframe (audit M12). Default: none but ourselves. Comma-separated list of
 * https origins in EMBED_ALLOWED_ORIGINS (e.g. a preview tool); anything that is not an https origin is ignored.
 */
const embedOrigins = (process.env.EMBED_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter((o) => /^https:\/\/[a-z0-9*.-]+(:\d+)?$/i.test(o));

const cspDirectives = [
  "default-src 'self'",
  isProduction
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // the click-to-load parcel map is the only third-party frame, and only after the visitor asks for it
  "frame-src https://www.openstreetmap.org",
  `frame-ancestors 'self'${embedOrigins.length ? ` ${embedOrigins.join(' ')}` : ''}`,
].join('; ');

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspDirectives,
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  ...(isProduction
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440],
    imageSizes: [40, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
