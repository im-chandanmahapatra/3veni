'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import ModalDialog, { type ModalDialogHandle } from '@/components/ui/ModalDialog';
import { IMG } from '@/content/images';
import type { Channel } from '@/lib/site';
import { NAV_ITEMS, isActivePath } from '@/components/layout/nav';

interface HeaderProps {
  brandName: string;
  channels: { phone?: Channel; whatsapp?: Channel; email?: Channel };
}

function subscribeScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}
const scrolledSnapshot = () => window.scrollY > 24;
const scrolledServerSnapshot = () => false;

/**
 * Header (DESIGN §8.5, audit H6/L3): transparent over the home hero until 24 px of scroll, solid ivory everywhere else.
 * The Enquire CTA is visible at every width. The mobile menu is a native <dialog>: focus trap, Esc, inert page,
 * focus return and scroll lock all come from the platform.
 */
export default function Header({ brandName, channels }: HeaderProps) {
  const pathname = usePathname() ?? '/';
  const isHome = pathname === '/';
  const scrolled = useSyncExternalStore(subscribeScroll, scrolledSnapshot, scrolledServerSnapshot);
  const solid = !isHome || scrolled;

  const menu = useRef<ModalDialogHandle>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // close the sheet whenever the route changes
  useEffect(() => {
    menu.current?.close();
  }, [pathname]);

  const enquireHref = isHome ? '#enquire' : '/contact';

  return (
    <header className="site-header" data-solid={solid} data-testid="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="brand" aria-label={`${brandName} home`}>
          <span className="brand__mark">
            <Image src={IMG.emblem} alt="" width={36} height={36} />
          </span>
          <span>{brandName}</span>
        </Link>

        <nav aria-label="Primary" className="site-nav">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link" aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          {channels.phone ? (
            <a href={channels.phone.href} className="icon-btn header-channel" aria-label={`Call ${channels.phone.display}`}>
              <Icon name="phone" />
            </a>
          ) : null}
          {channels.whatsapp ? (
            <a href={channels.whatsapp.href} className="icon-btn header-channel" aria-label="Message us on WhatsApp" target="_blank" rel="noopener noreferrer">
              <Icon name="chat" />
            </a>
          ) : null}
          <Button href={enquireHref} variant={solid ? 'primary' : 'on-dark'}>
            Enquire
          </Button>
          <button
            type="button"
            className="icon-btn menu-button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="menu-sheet"
            onClick={() => {
              setMenuOpen(true);
              menu.current?.open();
            }}
          >
            <Icon name="menu" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <ModalDialog id="menu-sheet" label="Menu" className="menu-sheet" handle={menu} onClose={() => setMenuOpen(false)} closeOnBackdrop={false}>
        <div className="contents">
          <div className="menu-sheet__bar">
            <Link href="/" className="brand" onClick={() => menu.current?.close()} aria-label={`${brandName} home`}>
              <span className="brand__mark">
                <Image src={IMG.emblem} alt="" width={36} height={36} />
              </span>
              <span>{brandName}</span>
            </Link>
            <button type="button" className="icon-btn" onClick={() => menu.current?.close()}>
              <Icon name="close" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div className="menu-sheet__body">
            <nav aria-label="Mobile">
              <ul className="menu-sheet__links">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => menu.current?.close()} aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}>
                      <span>{item.label}</span>
                      <Icon name="arrow-right" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/future-homes" onClick={() => menu.current?.close()} aria-current={isActivePath(pathname, '/future-homes') ? 'page' : undefined}>
                    <span>Future homes</span>
                    <Icon name="arrow-right" />
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="grid gap-4">
              <Button href={enquireHref} block size="lg" onClick={() => menu.current?.close()}>
                Enquire now
              </Button>
              {channels.phone || channels.whatsapp || channels.email ? (
                <div className="menu-sheet__channels">
                  {channels.phone ? (
                    <a href={channels.phone.href}>
                      <Icon name="phone" />
                      <span>{channels.phone.display}</span>
                    </a>
                  ) : null}
                  {channels.whatsapp ? (
                    <a href={channels.whatsapp.href} target="_blank" rel="noopener noreferrer">
                      <Icon name="chat" />
                      <span>WhatsApp {channels.whatsapp.display}</span>
                    </a>
                  ) : null}
                  {channels.email ? (
                    <a href={channels.email.href}>
                      <Icon name="mail" />
                      <span>{channels.email.display}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </ModalDialog>
    </header>
  );
}
