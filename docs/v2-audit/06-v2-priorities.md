# 06 — What is left after V2 (ranked)

Format: **item — where — what unblocks it.** Engineering items are done unless listed under 🟡/⚪; almost everything open is **content only the client can provide**. Nothing here is invented to look finished: each appears on the site as a marked `[CLIENT TO PROVIDE]` slot in preview and disappears in live mode, and `npm run check:launch` blocks a live build until the critical three exist.

## 🔴 Critical — blocks a real launch (client input)

| # | Item | Where it shows | Needed |
|---|---|---|---|
| C1 | **Enquiry delivery destination** | enquiry panels everywhere; `/api/health` shows `configured:false` | `SMTP_*` + `ENQUIRY_RECIPIENT_EMAIL`, or `CRM_WEBHOOK_URL` (path verified end-to-end against a local SMTP sink and covered by tests) |
| C2 | **Contact channels** | header, menu sheet, footer, contact page, enquiry panels | at least one of phone, WhatsApp, email (`CONTACT_PHONE`, `WHATSAPP_NUMBER`, `CONTACT_EMAIL` or `content/site.ts`) |
| C3 | **Production domain** | canonicals, sitemap, OG, JSON-LD, indexability | `NEXT_PUBLIC_SITE_URL=https://…` (https, not localhost); until then the site is `noindex` |

## 🟠 High — needed to reach 8.6+

| # | Item | Needed |
|---|---|---|
| H1 | Real inventory: prices (→ `Offer` schema, price filter), status, coordinates (click-to-load map is built), parcel documents, RERA IDs | per-parcel facts in `content/parcels.ts` |
| H2 | Trust: leadership, CIN/RERA/entity, testimonials with permission, proof figures, press | `content/proof.ts`, `content/site.ts` |
| H3 | Photography: site/team/process images ≥ 2400 px (current imagery reads as generated and caps visual design at 8) | image set + licences |
| H4 | Location facts: site location, connectivity, drive times | copy for the terrain section + `geo` |
| H5 | Counsel review of the three legal pages (text unchanged by instruction) | reviewed text, entity name, grievance contact |

## 🟡 Medium — engineering, deferred with reason

| # | Item | Reason |
|---|---|---|
| M1 | Lab LCP on image-led mobile pages (3.5–3.8 s vs 2.5 s) and home mobile TBT | framework hydration cost; see `04`. Re-measure on the real host/CDN (HTTP/2, edge-cached images) before judging |
| M2 | Consent-gated analytics loader | no provider chosen; the consent store and `analytics` gate exist (`NEXT_PUBLIC_ANALYTICS_PROVIDER` is reported by `check:launch`) |
| M3 | Scroll restoration after back navigation (V1 M6) | V1's `template.tsx` was deleted; no failing case reproduced in V2 (filters survive reload/back, anchors verified). Real-device check outstanding |
| M4 | Footer is an always-expanded 2-level list, not the accordion drafted in the plan | simpler, accessible, no JS; decision logged in `HANDOVER.md` |

## ⚪ Low

| # | Item |
|---|---|
| L1 | Real-device and screen-reader pass (NVDA/VoiceOver, iOS Safari, Android Chrome) |
| L2 | `npm audit` reports 14 *dev-only* advisories in the ESLint toolchain (picomatch ReDoS in build-time globbing); production install is clean |
| L3 | More buyer guides (hub is `noindex` until three exist) |
| L4 | Linux/Vercel `npm ci` not exercised locally (lockfile contains linux `sharp`) |
| L5 | ESLint 9 is deprecated upstream; plan an upgrade when `eslint-config-next` supports 10 |

## Closed from V1 (🔴 C1–C8, all engineering parts)
C1 delivery verified · C2 channels wired (slots until supplied) · C3 sample status shown as text, price line explicit · C4 domain gate · C5 SSR H1 + form · C6 home mobile 53 → 80–90 · C7 favicon/manifest · C8 trust *components* built (slots).
