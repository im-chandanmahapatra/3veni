import test from 'node:test';
import assert from 'node:assert/strict';
import { LAND_PLOTS } from '@/data/properties';
import {
  filterAndSortPlots,
  formatPlotArea,
  sanitizeEnquiryValues,
  validateEnquiryForm,
} from '@/lib/propertyFilters';

test('filterAndSortPlots filters by category cleanly', () => {
  const corners = filterAndSortPlots(LAND_PLOTS, 'Corner Parcels', 'featured');
  assert.equal(corners.length, 2);
  assert.ok(corners.every((p) => p.category === 'Corner Parcels'));

  const acreage = filterAndSortPlots(LAND_PLOTS, 'Estate Acreage', 'featured');
  assert.equal(acreage.length, 1);
  assert.equal(acreage[0]?.id, 'plot-prana-meadow');
});

test('filterAndSortPlots sorts by area descending and ascending', () => {
  const desc = filterAndSortPlots(LAND_PLOTS, 'All', 'area-desc');
  assert.equal(desc[0]?.areaSqFt, 10890);
  assert.equal(desc[desc.length - 1]?.areaSqFt, 2800);

  const asc = filterAndSortPlots(LAND_PLOTS, 'All', 'area-asc');
  assert.equal(asc[0]?.areaSqFt, 2800);
  assert.equal(asc[asc.length - 1]?.areaSqFt, 10890);
});

test('filterAndSortPlots filters case-insensitively by search query', () => {
  const matched = filterAndSortPlots(LAND_PLOTS, 'All', 'featured', 'banyan');
  assert.equal(matched.length, 1);
  assert.equal(matched[0]?.slug, 'vatika-banyan-corner');
});

test('formatPlotArea formats standard and quarter-acre sizes', () => {
  assert.equal(formatPlotArea(4800), '4,800 sq. ft.');
  assert.equal(formatPlotArea(10890), '10,890 sq. ft. (0.25 Acre)');
  assert.equal(formatPlotArea(0), 'Area on request');
});

test('validateEnquiryForm rejects invalid input and accepts complete details', () => {
  const invalidErrors = validateEnquiryForm({
    fullName: 'A',
    phone: '123',
    email: 'invalid-email',
    interestedIn: '',
    preferredLocation: '',
    message: 'hi',
  });
  assert.ok(invalidErrors.fullName);
  assert.ok(invalidErrors.phone);
  assert.ok(invalidErrors.email);
  assert.ok(invalidErrors.interestedIn);
  assert.ok(invalidErrors.preferredLocation);
  assert.ok(invalidErrors.message);

  const validErrors = validateEnquiryForm({
    fullName: 'Raghavendra Rao',
    phone: '+91 98765 43210',
    email: 'raghav@example.com',
    interestedIn: 'Aranya Ridge Terraces',
    preferredLocation: 'Elevated Ridge / Hillcrest Terraces',
    message: 'Looking for site layout documentation and soil profile.',
  });
  assert.deepEqual(validErrors, {});
});

test('sanitizeEnquiryValues trims and bounds oversized strings', () => {
  const sanitized = sanitizeEnquiryValues({
    fullName: '   Ananya Sen   ',
    phone: '  +91 98765 00001  ',
    email: '  ananya@example.com  ',
    message: 'a'.repeat(2000),
    companyWebsite: '   ',
  });
  assert.equal(sanitized.fullName, 'Ananya Sen');
  assert.equal(sanitized.phone, '+91 98765 00001');
  assert.equal(sanitized.email, 'ananya@example.com');
  assert.equal(sanitized.message.length, 1500);
  assert.equal(sanitized.companyWebsite, '');
});
