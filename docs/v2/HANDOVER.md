# V2 handover

## 1. Run it

```bash
npm ci
npm run dev                 # http://localhost:3000
npm run lint                # eslint + tsc + design-token lint
npm test                    # 29 tests
npm run build && npm run start
npm run content:report      # what the client still has to provide
```

Requires Node ≥ 20. `npm run build` runs `check:launch` first.

## 2. Modes and configuration (`.env.example` documents every variable)

| Variable | Meaning |
|---|---|
| `CONTENT_MODE=preview` (default) | marked `[CLIENT TO PROVIDE]` slots visible; site is `noindex` + `Disallow: /` |
| `CONTENT_MODE=live` | empty slots hidden; **build fails** until domain + a contact channel + enquiry delivery exist |
| `NEXT_PUBLIC_SITE_URL` | verified public https domain (drives canonicals, sitemap, OG, JSON-LD, indexability) |
| `CONTACT_PHONE`, `WHATSAPP_NUMBER`, `CONTACT_EMAIL` (+ `NEXT_PUBLIC_*`), `NEXT_PUBLIC_OFFICE_ADDRESS/HOURS` | or edit `content/site.ts` |
| `SMTP_*` + `ENQUIRY_RECIPIENT_EMAIL`, `CRM_WEBHOOK_URL`, `CRM_API_KEY` | enquiry delivery (either or both) |
| `EMBED_ALLOWED_ORIGINS` | https origins allowed to iframe the site (default none) |
| `LISTING_PAGE_SIZE` | plots per page (default 6) |
| `FORCE_INDEXABLE=true` | **audit only** — never in production |

Test delivery locally without a mail account: `node scripts/smtp-sink.mjs 2525 scratch/sink`, then run the site with `SMTP_HOST=127.0.0.1 SMTP_PORT=2525 SMTP_USER=sink SMTP_PASS=sink SMTP_FROM=web@example.test ENQUIRY_RECIPIENT_EMAIL=team@example.test`.

## 3. What the client must still provide (registry: `content/placeholders.ts`, report: `npm run content:report`)

**Critical (live build blocked without these):**
1. **Production domain** → `NEXT_PUBLIC_SITE_URL`
2. **Enquiry delivery** → SMTP account + receiving inbox, or CRM webhook
3. **Contact channels** → at least one of phone / WhatsApp / email

**Important (lifts the score; each is a marked slot today):**
4. Office address and opening hours → `content/site.ts`
5. CIN / entity name / RERA numbers → `content/site.ts`
6. Real site location, landmarks, drive times (home terrain section, parcel pages)
7. Per-parcel latitude/longitude (enables the click-to-load OpenStreetMap embed) → `content/parcels.ts` `geo`
8. Per-parcel documents (brochure/survey/layout PDFs) → `documents`
9. Confirmation whether prices may be public (`price` → also enables `Offer` markup)
10. **Original photography** (≥ 2400 px; current imagery appears synthetic, tops out at 1376 px) → `public/images`, `content/images.ts`
11. Leadership/team, testimonials (with written permission), proof figures, awards/press → `content/proof.ts`
12. Social profile URLs → `content/site.ts`
13. Analytics decision (privacy-friendly or GA) — loader not wired; consent gate exists
14. More buyer guides (legal accuracy to be reviewed by the client) → `content/guides.ts`
15. Counsel review of the three legal pages (text unchanged by instruction), entity name and grievance contact

## 4. Editing content
- Parcels: `content/parcels.ts` (typed; optional fields `price`, `address`, `geo`, `reraId`, `documents` switch features on). Status `sample` → `available | reserved | sold` when real.
- Copy: `content/copy.ts`; guides: `content/guides.ts`; proof/team: `content/proof.ts`; site identity: `content/site.ts`.
- Adding a guide adds the page, schema, sitemap entry; the hub becomes indexable at three guides.
- Regenerate OG images after changing titles: `python scripts/gen-og.py`.

## 5. Deviations from the plan (be aware)
- Footer ships as always-expanded link lists, not accordions (simpler, no JS).
- Consent-gated analytics loader (plan L1) not built — no provider chosen.
- `/styleguide` page not built (token lint + `docs/v2/DESIGN.md` cover it).
- ESLint 9 (flat config) is used because ESLint 10 broke the plugin chain; upstream deprecation notice is expected.
- The repo's local `.env.local` exists with values I did not read; audits ran on a clean worktree without it.
- Lab LCP / mobile Perf bar not met on image-led pages — see `docs/v2-audit/04`; re-measure on the production host/CDN.
- Linux/Vercel `npm ci` was not exercised locally (lockfile includes linux `sharp`).
- `scratch/` (git-ignored) holds throwaway screenshots/logs and may be deleted.

## 6. Verification trail
`docs/v2-audit/` (scores, 125-check matrix, SEO, Lighthouse, axe, responsive, remaining list), `docs/v1-vs-v2-comparison.md`, `docs/v2/CHANGELOG.md`, design in `docs/v2/DESIGN.md`, plan + traceability matrix in `docs/v2/00-v2-plan.md`.
