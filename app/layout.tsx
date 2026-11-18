import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { fontClassName } from './fonts';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConsentBar from '@/components/layout/ConsentBar';
import PreferencesDialog from '@/components/layout/PreferencesDialog';
import JsonLd from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/config';
import { getSite } from '@/lib/site';
import { organizationJsonLd, websiteJsonLd } from '@/lib/schema';

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl().url),
  applicationName: site.brandName,
  title: {
    default: `${site.brandName} — ${site.tagline}`,
    template: `%s | ${site.brandName}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F3EC',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={fontClassName}>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <CookieConsentProvider>
          <Header brandName={site.brandName} channels={{ phone: site.phone, whatsapp: site.whatsapp, email: site.email }} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <ConsentBar />
          <PreferencesDialog />
        </CookieConsentProvider>
        <JsonLd data={[organizationJsonLd(site), websiteJsonLd(site)]} />
      </body>
    </html>
  );
}
