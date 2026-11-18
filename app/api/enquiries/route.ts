import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEnquiry, validateEnquiry } from '@/lib/enquiry/validation';
import { processEnquiry } from '@/lib/enquiry/service';
import { checkSlidingWindowRateLimit } from '@/lib/rateLimit';
import type { EnquiryResponse } from '@/types/enquiry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip')?.trim() || 'unknown-client';
}

function reply(payload: EnquiryResponse, status: number, headers?: Record<string, string>) {
  return NextResponse.json(payload, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export async function POST(request: NextRequest) {
  try {
    const rate = checkSlidingWindowRateLimit(`enquiry:${clientIp(request)}`, { windowMs: 10 * 60 * 1000, maxRequests: 5 });
    if (!rate.allowed) {
      return reply(
        {
          status: 'rate_limited',
          delivered: false,
          message: `Too many enquiry attempts in a short period. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
        },
        429,
        { 'Retry-After': String(rate.retryAfterSeconds) },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return reply({ status: 'validation_error', delivered: false, message: 'Invalid JSON request payload.' }, 400);
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return reply({ status: 'validation_error', delivered: false, message: 'Enquiry payload must be a JSON object.' }, 400);
    }

    const values = sanitizeEnquiry(body as Record<string, unknown>);

    // honeypot: bots fill the hidden field; humans never see it. Rejected without delivery.
    if (values.companyWebsite) {
      return reply({ status: 'validation_error', delivered: false, message: 'Unable to verify the submission.' }, 400);
    }

    const fieldErrors = validateEnquiry(values);
    if (Object.keys(fieldErrors).length > 0) {
      return reply(
        { status: 'validation_error', delivered: false, message: 'Please correct the highlighted fields and try again.', fieldErrors },
        400,
      );
    }

    const result = await processEnquiry(values);
    return reply(result.payload, result.httpStatus);
  } catch (err) {
    console.error('[POST /api/enquiries] unhandled error:', err instanceof Error ? err.message : err);
    return reply({ status: 'error', delivered: false, message: 'An unexpected server error occurred while processing your enquiry.' }, 500);
  }
}
