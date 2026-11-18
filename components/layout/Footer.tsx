import Image from 'next/image';
import Link from 'next/link';
import ClientSlot from '@/components/ui/ClientSlot';
import Icon from '@/components/ui/Icon';
import CookieSettingsButton from '@/components/layout/CookieSettingsButton';
import { IMG } from '@/content/images';
import { PARCELS } from '@/content/parcels';
import { getSite } from '@/lib/site';

/**
 * Footer (DESIGN §8.14, audit C2/C8/L6): brand + registered-identity block (name, address, channels, RERA/CIN — slots
 * until the client supplies them), plots, company, legal. No "Replay brand intro", no invented contact details.
 */
export default function Footer() {
  const site = getSite();
  const year = new Date().getFullYear();
  const hasIdentity = Boolean(site.addressLine || site.hasChannel || site.cin || site.reraNumbers.length);

  return (
    <footer className="site-footer on-dark section--defer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label={`${site.brandName} home`}>
              <span className="brand__mark">
                <Image src={IMG.emblem} alt="" width={36} height={36} />
              </span>
              <span>{site.brandName}</span>
            </Link>
            <p className="t-body-sm">
              Plotted land developments and future architectural living concepts grounded in natural terrain, transparency, and
              enduring stewardship.
            </p>
            <p className="t-caption">
              {site.serviceFocusLabel}
            </p>

            {hasIdentity ? (
              <address className="footer-identity">
                <span>{site.registeredEntityName}</span>
                {site.addressLine ? <span>{site.addressLine}</span> : null}
                {site.hours ? <span>{site.hours}</span> : null}
                {site.phone ? (
                  <a href={site.phone.href}>
                    <Icon name="phone" />
                    <span>{site.phone.display}</span>
                  </a>
                ) : null}
                {site.whatsapp ? (
                  <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
                    <Icon name="chat" />
                    <span>WhatsApp {site.whatsapp.display}</span>
                  </a>
                ) : null}
                {site.email ? (
                  <a href={site.email.href}>
                    <Icon name="mail" />
                    <span>{site.email.display}</span>
                  </a>
                ) : null}
                {site.cin ? <span>CIN {site.cin}</span> : null}
                {site.reraNumbers.length ? <span>RERA {site.reraNumbers.join(' · ')}</span> : null}
              </address>
            ) : null}
            {!site.hasChannel ? <ClientSlot id="contact-channels" /> : null}
            {!site.addressLine ? <ClientSlot id="address" /> : null}
            {!site.cin && !site.reraNumbers.length ? <ClientSlot id="registration" /> : null}
          </div>

          <nav aria-label="Plots">
            <h2 className="footer-title">Plots</h2>
            <ul className="footer-links">
              {PARCELS.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/projects">All plots</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="footer-title">Company</h2>
            <ul className="footer-links">
              <li>
                <Link href="/about">About 3VENI</Link>
              </li>
              <li>
                <Link href="/guides/land-buying-checklist">Buyer’s guide</Link>
              </li>
              <li>
                <Link href="/future-homes">Future homes</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
            {site.socials.length ? (
              <ul className="footer-links mt-5">
                {site.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </nav>

          <nav aria-label="Legal">
            <h2 className="footer-title">Legal</h2>
            <ul className="footer-links">
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookie-policy">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
              </li>
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {site.brandName}. All rights reserved.
          </p>
          <p>Plots and concept studies shown are illustrative sample typologies unless stated otherwise.</p>
        </div>
      </div>
    </footer>
  );
}
