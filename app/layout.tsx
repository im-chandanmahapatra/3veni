import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/siteConfig';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import CookieBanner from '@/components/consent/CookieBanner';
import CookiePreferencesModal from '@/components/consent/CookiePreferencesModal';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';
import JsonLd from '@/components/ui/JsonLd';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/structuredData';
import MotionRootProvider from '@/components/motion/MotionRootProvider';
import BrandIntroCurtain from '@/components/motion/BrandIntroCurtain';
import '@/styles/globals.css';
import { fontClassName } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.brandName}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: SITE_CONFIG.brandName,
    title: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.heroFallbackPath,
        width: 1376,
        height: 768,
        alt: `${SITE_CONFIG.brandName} — Quiet Earth. Enduring Architecture.`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.heroFallbackPath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={fontClassName}
    >
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[#F6F1E7] text-[#24221E] antialiased selection:bg-[#98400F] selection:text-[#F6F1E7]">
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildWebSiteJsonLd()} />

        <MotionRootProvider>
          <CookieConsentProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[#98400F] focus:text-[#F6F1E7] focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.1em] focus:shadow-xl"
            >
              Skip to main content
            </a>

            <ScrollProgressBar />
            <BrandIntroCurtain />

            <div id="app-shell" className="min-h-screen flex flex-col">
              <Navbar />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>

            <CookieBanner />
            <CookiePreferencesModal />
          </CookieConsentProvider>
        </MotionRootProvider>
      </body>
    </html>
  );
}
