export const INTRO_SESSION_STORAGE_KEY = '3veni:intro-played';
export const INTRO_REPLAY_EVENT = '3veni:replay-intro';

export interface IntroPlaybackContext {
  pathname: string;
  hasPlayedInSession: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Determines whether the branded 3VENI curtain should play automatically.
 * Only plays on first arrival to the homepage when reduced motion is not active.
 */
export function shouldPlayBrandIntro({
  pathname,
  hasPlayedInSession,
  prefersReducedMotion,
}: IntroPlaybackContext): boolean {
  if (prefersReducedMotion) return false;
  if (hasPlayedInSession) return false;
  return pathname === '/';
}

/**
 * Safely wraps carousel indices forward or backward across any slide collection.
 */
export function normalizeSlideIndex(
  currentIndex: number,
  delta: number,
  total: number
): number {
  if (total <= 1) return 0;
  return (((currentIndex + delta) % total) + total) % total;
}

/**
 * Maps horizontal pointer swipe distance to a discrete carousel navigation direction.
 */
export function resolveSwipeAction(
  deltaX: number,
  threshold = 44
): 'next' | 'prev' | null {
  if (Math.abs(deltaX) < threshold) return null;
  return deltaX < 0 ? 'next' : 'prev';
}
