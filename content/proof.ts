/**
 * Trust content that only the client can supply (audit C8). All arrays are intentionally EMPTY:
 * V2 never invents testimonials, awards, statistics or team members. Components render real entries when
 * present and a marked slot (preview) / nothing (live) when empty. Add entries here — no code change needed.
 */
import type { StaticImageData } from 'next/image';

export interface Person {
  name: string;
  role: string;
  bio?: string;
  portrait?: StaticImageData;
  portraitAlt?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  /** the client must hold written permission before an entry is added */
  permissionConfirmed: true;
}

export interface ProofStat {
  /** e.g. "12" or "2009" — only verifiable facts */
  value: string;
  label: string;
}

export interface PressItem {
  title: string;
  source: string;
  href?: string;
}

export const LEADERSHIP: Person[] = [];
export const TESTIMONIALS: Testimonial[] = [];
export const PROOF_STATS: ProofStat[] = [];
export const PRESS: PressItem[] = [];
