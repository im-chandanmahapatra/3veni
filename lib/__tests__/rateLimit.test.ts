import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkSlidingWindowRateLimit,
  clearRateLimitBucketsForTest,
} from '@/lib/rateLimit';

test('checkSlidingWindowRateLimit enforces max requests per window and resets after expiry', () => {
  clearRateLimitBucketsForTest();
  const baseTime = 1_700_000_000_000;

  for (let i = 0; i < 3; i++) {
    const res = checkSlidingWindowRateLimit('192.0.2.10', {
      windowMs: 60_000,
      maxRequests: 3,
      nowMs: baseTime + i * 1000,
    });
    assert.equal(res.allowed, true);
  }

  const blocked = checkSlidingWindowRateLimit('192.0.2.10', {
    windowMs: 60_000,
    maxRequests: 3,
    nowMs: baseTime + 5_000,
  });
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfterSeconds >= 50);

  const afterWindow = checkSlidingWindowRateLimit('192.0.2.10', {
    windowMs: 60_000,
    maxRequests: 3,
    nowMs: baseTime + 61_000,
  });
  assert.equal(afterWindow.allowed, true);
});
