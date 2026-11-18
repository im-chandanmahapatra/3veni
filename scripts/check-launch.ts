/**
 * Launch gate + client-content report (plan §5.4).
 *
 *   npm run check:launch       exit 1 in CONTENT_MODE=live when a CRITICAL item is unresolved (runs before `next build`)
 *   npm run content:report     prints the full registry as Markdown (feeds docs/v2/HANDOVER.md)
 *
 * Preview mode (default) never fails: it prints what the marked [CLIENT TO PROVIDE] slots stand for.
 */
import { getContentMode, getSiteUrl } from '../lib/config';
import { getSite } from '../lib/site';
import { getEnquiryIntegration } from '../lib/enquiry/config';
import { PLACEHOLDERS, type PlaceholderId } from '../content/placeholders';
import { LEADERSHIP, PRESS, PROOF_STATS, TESTIMONIALS } from '../content/proof';
import { PARCELS } from '../content/parcels';
import { GUIDES } from '../content/guides';

const site = getSite();
const resolved: Record<PlaceholderId, boolean> = {
  domain: getSiteUrl().verified,
  'enquiry-delivery': getEnquiryIntegration().configured,
  'contact-channels': site.hasChannel,
  address: Boolean(site.addressLine),
  registration: Boolean(site.cin || site.reraNumbers.length),
  'location-facts': false, // no data model yet: always outstanding until the client supplies real sites
  coordinates: PARCELS.every((p) => p.geo),
  documents: PARCELS.every((p) => p.documents && p.documents.length > 0),
  prices: PARCELS.some((p) => p.price),
  photography: false, // cannot be detected automatically: confirm manually with the client
  leadership: LEADERSHIP.length > 0,
  testimonials: TESTIMONIALS.length > 0,
  proof: PROOF_STATS.length > 0,
  press: PRESS.length > 0,
  socials: site.socials.length > 0,
  analytics: Boolean(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER),
  guides: GUIDES.length >= 3,
};

const mode = getContentMode();
const wantReport = process.argv.includes('--report');
const all = Object.values(PLACEHOLDERS);
const missingCritical = all.filter((p) => p.critical && !resolved[p.id]);
const missingOther = all.filter((p) => !p.critical && !resolved[p.id]);

if (wantReport) {
  console.log('| Item | Needed from the client | Critical | Status |');
  console.log('|---|---|---|---|');
  for (const p of all) console.log(`| **${p.label}** (\`${p.id}\`) | ${p.needs} (${p.where}) | ${p.critical ? 'yes' : 'no'} | ${resolved[p.id] ? 'provided' : 'outstanding'} |`);
  process.exit(0);
}

const line = (p: (typeof all)[number]) => `  - ${p.label}: ${p.needs}`;
if (mode === 'live') {
  if (missingCritical.length) {
    console.error(`\n✖ CONTENT_MODE=live: ${missingCritical.length} critical item(s) are missing — refusing to build.\n`);
    console.error(missingCritical.map(line).join('\n'));
    if (missingOther.length) console.error(`\n  (+ ${missingOther.length} non-critical items outstanding; run "npm run content:report")`);
    console.error('');
    process.exit(1);
  }
  console.log(`✔ launch gate passed (live). ${missingOther.length} non-critical item(s) outstanding — they render nothing until provided.`);
} else {
  console.log(
    `ℹ CONTENT_MODE=preview: ${missingCritical.length} critical and ${missingOther.length} other client-content item(s) show as marked slots; site is noindex. Run "npm run content:report" for the list.`,
  );
}
