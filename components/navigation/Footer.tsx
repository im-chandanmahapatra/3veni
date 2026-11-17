'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SITE_CONFIG, buildWhatsAppHref } from '@/config/siteConfig';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { FolkBandPattern } from '@/components/ui/BrandMotifs';
import { INTRO_REPLAY_EVENT } from '@/lib/introSession';

export default function Footer() {
  const { openPreferences } = useCookieConsent();
  const whatsappHref = buildWhatsAppHref(
    SITE_CONFIG.publicWhatsApp,
    'Hello 3VENI SPHERE, I would like to enquire about land developments.'
  );

  return (
    <footer className="bg-[#24221E] text-[#F6F1E7]">
      <FolkBandPattern color="#C49A50" opacity={0.22} />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-[#C49A50]/50 shrink-0 p-0.5">
                <Image
                  src={SITE_CONFIG.logoPath}
                  alt="3VENI SPHERE official logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] uppercase group-hover:text-white transition-colors">
                  {SITE_CONFIG.brandName}
                </p>
                <p className="text-xs tracking-[0.12em] uppercase text-[#C49A50] mt-1">
                  {SITE_CONFIG.tagline}
                </p>
              </div>
            </Link>
            <p className="mt-6 text-sm text-[#C8BCA9] leading-relaxed max-w-sm">
              Plotted land developments and future architectural living concepts grounded in natural
              terrain, transparency, and enduring stewardship.
            </p>
            <p className="mt-4 text-xs text-[#A39889]">{SITE_CONFIG.serviceFocusLabel}</p>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C49A50] mb-5">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-[#EDE5D6]">
              <li>
                <Link href="/" className="editorial-link hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="editorial-link hover:text-white transition-colors">
                  About 3VENI
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="editorial-link hover:text-white transition-colors"
                >
                  Projects &amp; Plots
                </Link>
              </li>
              <li>
                <Link
                  href="/future-homes"
                  className="editorial-link hover:text-white transition-colors"
                >
                  Future Homes
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/land-buying-checklist"
                  className="editorial-link hover:text-white transition-colors"
                >
                  Land Buying Guide
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C49A50] mb-5">
              Sample Formats
            </h3>
            <ul className="space-y-3 text-sm text-[#EDE5D6]">
              <li>
                <Link
                  href="/projects/aranya-ridge-terraces"
                  className="editorial-link hover:text-white transition-colors"
                >
                  Ridge Terraces
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/vatika-banyan-corner"
                  className="editorial-link hover:text-white transition-colors"
                >
                  Corner Parcels
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/prana-valley-sanctuary"
                  className="editorial-link hover:text-white transition-colors"
                >
                  Estate Acreage
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/taru-ochre-enclave"
                  className="editorial-link hover:text-white transition-colors"
                >
                  Orchard Enclaves
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C49A50] mb-5">
              Advisory Desk
            </h3>
            <div className="space-y-3 text-sm text-[#EDE5D6]">
              {SITE_CONFIG.publicEmail && (
                <p>
                  Email:{' '}
                  <a href={`mailto:${SITE_CONFIG.publicEmail}`} className="hover:text-white underline underline-offset-4 decoration-[#C49A50]/50">
                    {SITE_CONFIG.publicEmail}
                  </a>
                </p>
              )}
              {whatsappHref && (
                <p>
                  WhatsApp:{' '}
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="tabular-nums hover:text-white underline underline-offset-4 decoration-[#C49A50]/50"
                  >
                    {SITE_CONFIG.publicWhatsApp}
                  </a>
                </p>
              )}
              <p className="text-xs text-[#C8BCA9] leading-relaxed">
                Submit a private consultation request through our{' '}
                <Link
                  href="/contact"
                  className="text-[#F6F1E7] underline underline-offset-4 decoration-[#C49A50]/65 hover:text-white"
                >
                  Contact Desk
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#A39889]">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.brandName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy-policy"
              className="hover:text-[#F6F1E7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookie-policy"
              className="hover:text-[#F6F1E7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
            >
              Cookie Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:text-[#F6F1E7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
            >
              Terms &amp; Conditions
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent(INTRO_REPLAY_EVENT))}
              data-testid="replay-brand-intro"
              className="text-[#EDE5D6] hover:text-[#F6F1E7] transition-colors underline underline-offset-4 decoration-[#C49A50]/40 focus-visible:outline-2 focus-visible:outline-[#C49A50]"
            >
              Replay Brand Intro
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="text-[#C49A50] hover:text-[#F6F1E7] transition-colors underline underline-offset-4 decoration-[#C49A50]/50 focus-visible:outline-2 focus-visible:outline-[#C49A50]"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
