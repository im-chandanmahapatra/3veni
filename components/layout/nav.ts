/** Primary navigation (DESIGN §8.5). "Future Homes" moves to the footer + home teaser (audit H11); "Home" is the logo. */
export const NAV_ITEMS = [
  { label: 'Plots', href: '/projects' },
  { label: 'Buyer’s guide', href: '/guides/land-buying-checklist' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  // the guide lives under /guides/…; plots under /projects/…
  const base = href.startsWith('/guides') ? '/guides' : href;
  return pathname === base || pathname.startsWith(`${base}/`);
}
