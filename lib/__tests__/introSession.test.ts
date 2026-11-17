import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeSlideIndex,
  resolveSwipeAction,
  shouldPlayBrandIntro,
} from '../introSession';

test('shouldPlayBrandIntro plays only on homepage first visit without reduced motion', () => {
  assert.equal(
    shouldPlayBrandIntro({
      pathname: '/',
      hasPlayedInSession: false,
      prefersReducedMotion: false,
    }),
    true
  );

  assert.equal(
    shouldPlayBrandIntro({
      pathname: '/projects',
      hasPlayedInSession: false,
      prefersReducedMotion: false,
    }),
    false
  );

  assert.equal(
    shouldPlayBrandIntro({
      pathname: '/',
      hasPlayedInSession: true,
      prefersReducedMotion: false,
    }),
    false
  );

  assert.equal(
    shouldPlayBrandIntro({
      pathname: '/',
      hasPlayedInSession: false,
      prefersReducedMotion: true,
    }),
    false
  );
});

test('normalizeSlideIndex wraps seamlessly forward and backward', () => {
  assert.equal(normalizeSlideIndex(0, -1, 4), 3);
  assert.equal(normalizeSlideIndex(3, 1, 4), 0);
  assert.equal(normalizeSlideIndex(1, 2, 4), 3);
  assert.equal(normalizeSlideIndex(0, 1, 1), 0);
});

test('resolveSwipeAction distinguishes intentional swipes from micro-drags', () => {
  assert.equal(resolveSwipeAction(-60), 'next');
  assert.equal(resolveSwipeAction(60), 'prev');
  assert.equal(resolveSwipeAction(20), null);
  assert.equal(resolveSwipeAction(-43), null);
});
