import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEnquiryValues, validateEnquiryForm } from '@/lib/propertyFilters';
import { checkSlidingWindowRateLimit } from '@/lib/rateLimit';
import { processEnquirySubmission } from '@/services/enquiryService';
import type { EnquiryApiResponse, EnquiryFormValues } from '@/types/property';

function extractClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return 'unknown-client';
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = extractClientIp(request);
    const rate = checkSlidingWindowRateLimit(`enquiry:${clientIp}`, {
      windowMs: 10 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rate.allowed) {
      const payload: EnquiryApiResponse = {
        status: 'rate_limited',
        delivered: false,
        message: `Too many enquiry attempts in a short period. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
      };
      return NextResponse.json(payload, {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSeconds) },
      });
    }

    let rawBody: Partial<EnquiryFormValues>;
    try {
      rawBody = (await request.json()) as Partial<EnquiryFormValues>;
    } catch {
      const payload: EnquiryApiResponse = {
        status: 'validation_error',
        delivered: false,
        message: 'Invalid JSON request payload.',
      };
      return NextResponse.json(payload, { status: 400 });
    }

    if (!rawBody || typeof rawBody !== 'object') {
      const payload: EnquiryApiResponse = {
        status: 'validation_error',
        delivered: false,
        message: 'Enquiry payload must be a JSON object.',
      };
      return NextResponse.json(payload, { status: 400 });
    }

    const sanitized = sanitizeEnquiryValues(rawBody);

    // Honeypot check: silently reject automated spam submissions without delivering to CRM
    if (sanitized.companyWebsite && sanitized.companyWebsite.length > 0) {
      const payload: EnquiryApiResponse = {
        status: 'validation_error',
        delivered: false,
        message: 'Unable to verify automated form submission.',
      };
      return NextResponse.json(payload, { status: 400 });
    }

    const fieldErrors = validateEnquiryForm(sanitized);
    if (Object.keys(fieldErrors).length > 0) {
      const payload: EnquiryApiResponse = {
        status: 'validation_error',
        delivered: false,
        message: 'Please correct the highlighted fields and try again.',
        fieldErrors,
      };
      return NextResponse.json(payload, { status: 400 });
    }

    const result = await processEnquirySubmission(sanitized);
    return NextResponse.json(result.payload, { status: result.httpStatus });
  } catch (err) {
    console.error('[POST /api/enquiries] Unhandled exception:', err);
    const payload: EnquiryApiResponse = {
      status: 'error',
      delivered: false,
      message: 'An unexpected server error occurred while processing your enquiry.',
    };
    return NextResponse.json(payload, { status: 500 });
  }
}
