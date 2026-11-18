import type { SVGProps } from 'react';

/**
 * Custom icon set (DESIGN.md §7): 20-px grid, 1.5 px stroke, square caps, mitre joins, currentColor.
 * Replaces lucide-react (generic icons + dependency). Decorative by default (aria-hidden); pass `title`
 * only for the rare standalone icon.
 */
const PATHS = {
  'arrow-right': ['M3 10h13', 'M11 5l5 5-5 5'],
  'arrow-left': ['M17 10H4', 'M9 5l-5 5 5 5'],
  'arrow-up-right': ['M6 14L14 6', 'M7 6h7v7'],
  'arrow-down': ['M10 3v13', 'M5 11l5 5 5-5'],
  'chevron-down': ['M5 8l5 5 5-5'],
  'chevron-left': ['M12 5l-5 5 5 5'],
  'chevron-right': ['M8 5l5 5-5 5'],
  close: ['M5 5l10 10', 'M15 5L5 15'],
  menu: ['M3 7h14', 'M3 13h14'],
  plus: ['M10 4v12', 'M4 10h12'],
  minus: ['M4 10h12'],
  check: ['M4 10.5l4 4 8-9'],
  alert: ['M10 3L18 17H2z', 'M10 8v4', 'M10 14.2v.1'],
  pin: ['M10 18s6-5.2 6-9.5a6 6 0 1 0-12 0C4 12.8 10 18 10 18z', 'M10 6.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'],
  ruler: ['M3 7h14v6H3z', 'M6 7v3', 'M9 7v2', 'M12 7v3', 'M15 7v2'],
  compass: ['M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z', 'M13.5 6.5l-2 5-5 2 2-5z'],
  phone: ['M5 3h3l1.5 4-2 1.2a9 9 0 0 0 4.3 4.3L13 10.5l4 1.5v3a2 2 0 0 1-2 2A12 12 0 0 1 3 5a2 2 0 0 1 2-2z'],
  mail: ['M3 5h14v10H3z', 'M3 6l7 5 7-5'],
  chat: ['M3 4h14v10H9l-4 3v-3H3z'],
  download: ['M10 3v9', 'M6 8.5l4 4 4-4', 'M4 16h12'],
  expand: ['M4 8V4h4', 'M16 8V4h-4', 'M4 12v4h4', 'M16 12v4h-4'],
  print: ['M6 7V3h8v4', 'M4 7h12v7h-3v3H7v-3H4z', 'M7 12h6'],
} as const;

export type IconName = keyof typeof PATHS;

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  /** adds a nudge-on-hover hook for arrows inside buttons/links */
  nudge?: boolean;
  title?: string;
};

export default function Icon({ name, nudge, title, className, ...rest }: IconProps) {
  const cls = ['icon', nudge ? 'icon--nudge' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={cls}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
