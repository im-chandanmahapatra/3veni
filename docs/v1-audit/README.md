# 3VENI SPHERE — V1 Baseline Audit

**Audit date:** 17 Nov 2026 · **Auditors:** luxury-UX designer + QA engineer + technical SEO (one panel) · **Mode:** read-only — no source file was modified; the only files created are in `docs/v1-audit/`.

## Project info

| | |
|---|---|
| Audited code | V1 = commit `11e6fc8` (code identical on `main`; `main` HEAD `7d181a1` only adds docs). Audited in an **isolated git worktree**, because the checked-out branch `v2` already contains V2 code. |
| Framework | Next.js **16.4.6** (App Router, Turbopack), React 19, Tailwind CSS 4, GSAP 3.15 + ScrollTrigger, Motion 12, lucide-react, nodemailer |
| Routes (15) | `/`, `/about`, `/projects`, `/projects/{aranya-ridge-terraces, vatika-banyan-corner, shila-laterite-crest, prana-valley-sanctuary, taru-ochre-enclave}`, `/future-homes`, `/guides/land-buying-checklist`, `/contact`, `/privacy-policy`, `/cookie-policy`, `/terms-and-conditions`, 404, plus `POST /api/enquiries`, `/robots.txt`, `/sitemap.xml` |
| Install | `npm ci` → 363 packages, OK (prints ERESOLVE *peer-dependency override* warnings: eslint 10 vs `eslint-config-next`) |
| Build | `npm run build` → ✅ compiled (≈ 19 s), TypeScript clean, 19 static pages. *(One earlier build attempt failed with a Turbopack parse error inside `node_modules/nodemailer`; it happened while my own second `npm ci` was still writing to the same folder, and three clean rebuilds afterwards all passed — recorded as a self-inflicted race, not a V1 defect.)* |
| Run | `npm run start -- -p 3100 -H 127.0.0.1` → **http://127.0.0.1:3100** (production build; all performance/SEO numbers are from this, never the dev server) |
| Tooling | Playwright-core + system Chrome (functional, screenshots, overflow probes), Lighthouse (programmatic), axe-core, raw-HTML `fetch` for SEO |
| Evidence | 116 screenshots in `screenshots/` (15 routes × 3 widths × full-page + fold, plus interaction states) |

## Overall V1 score: **5 / 10** (5.45 before rounding)

| Category | Weight | Score | Weighted | Basis |
|---|---|---|---|---|
| Premium Visual Design | 25% | 7 | 1.75 | Real editorial craft (type, palette, motion) but synthetic imagery, template rhythm, and nothing a luxury buyer needs to trust. Capped at "good, not luxury". |
| UX | 20% | 4 | 0.80 | No real search, no price, no way to actually contact the client, scroll-lock/CTA gaps on mobile. |
| Functionality | 20% | 4 | 0.80 | Cap applied: broken core function. 94/121 checks pass, but the one conversion path (enquiry) returns 503. |
| SEO | 15% | 6 | 0.90 | Clean SSG, titles, canonical, sitemap, schema basics — undermined by placeholder domain, CSR-only `/contact` H1, no favicon, `Place`-only schema, thin content. |
| Performance | 10% | 5 | 0.50 | Home mobile Perf 53 / LCP 6.0 s / TBT 900 ms; `/projects` 98–99. |
| Accessibility | 10% | 7 | 0.70 | Good semantics, skip link, reduced-motion; axe serious ×3, weak input focus, 61 small targets. |
| **Total** | 100% | | **5.45 → 5/10** | |

## Section scorecard

| Section | Score | One-line verdict |
|---|---|---|
| Navbar / header | 6 | Elegant and fully working; no scroll-lock, CTA vanishes on phones, no phone/WhatsApp. |
| Brand intro curtain | 4 | ~3.3 s of blank cream before the site — hurts LCP and patience. |
| Hero | 6 | Best-looking section, but no search, upscaled 1376px photo, auto-rotate with no pause, banner overlap. |
| Brand statement (home) | 6 | Beautiful type, zero proof. |
| Featured plots (cards/filters) | 5 | Works, but no price/location filters, state not in URL, "sample" inventory. |
| Interactive plot map | 5 | Distinctive, accessible keyboard flow — but a fake schematic with axe-serious issues. |
| About / stewardship | 6 | Anonymous brand: no team, no registrations. |
| Location & lifestyle carousel | 5 | A "location" section with no location. |
| Visual storytelling | 5 | Atmosphere repeating earlier messages; empty frame while loading. |
| Why choose us (olive) | 5 | Gold-on-olive 3.7:1 contrast; boilerplate copy. |
| Future homes | 5 | Concept renders for things not for sale. |
| **Enquiry form / contact** | **3** | **Valid submit → HTTP 503; no other contact channel exists.** |
| Footer | 4 | No phone/email/address/social/IDs. |
| Cookie consent | 5 | Works well; overlaps UI, tiny buttons, guards no analytics. |
| Project detail page | 6 | Handsome, accessible; thin (no price/map/docs), `Place` schema. |
| Projects listing | 5 | A copy of the homepage block. |
| About page | 6 | Same as home About. |
| Buyer guide | 6 | Good content + FAQ schema; "checklist" isn't interactive. |
| 404 | 7 | On-brand, correct 404 status, working exits. |
| Legal pages | 6 | Honest, thin. |
| Agents / testimonials / stats / services / blog / newsletter / real map / contact details | **1 each** | Do not exist. |

## Top 10 critical issues (most damaging first)

1. **Enquiry form does not deliver leads** — valid submission → `POST /api/enquiries` **503** (`services/enquiryService.ts:262-273`; no CRM/SMTP configured). `screenshots/contact-form-valid-submit-result-1440.png`
2. **Zero contact channels on the site** — 0 `tel:`, 0 `mailto:`, 0 WhatsApp, no address, no map, no socials (`config/siteConfig.ts:215-222`).
3. **No real inventory** — every parcel is a "Sample Typology" with no price or address (`data/properties.ts:4-8,70`).
4. **Canonical / sitemap / OG / JSON-LD use an unverified placeholder domain** `https://3venisphere.com` (`config/siteConfig.ts:178`).
5. **`/contact` has no `<h1>` and no form in the server HTML** (Suspense bailout, `EnquirySection.tsx:594-606`).
6. **Home mobile performance: Lighthouse 53, LCP 6.0 s, TBT 900 ms.**
7. **No favicon / icons / manifest** — 404 on every load.
8. **No trust signals** (team, registrations, reviews, years, press) — fatal for a high-ticket purchase.
9. **No property search or price/location filters; filter state not in the URL.**
10. **Synthetic-looking imagery, hero upscaled from a 1376px source**, plus a ~3.3 s intro curtain gating the landing page.

## Does V1 meet "premium + SEO-friendly"?

**Not yet — it looks premium but behaves like a prototype.** In a screenshot, V1 holds its own: the Cormorant/Manrope pairing, terracotta-olive-ivory palette, mono spec labels and the survey-style map are editorial and intentional, and the technical SEO hygiene (static pages, unique metadata, sitemap, breadcrumb/FAQ schema, 100 Lighthouse SEO) is better than most agency builds. But a luxury client pays for a site that *sells*, and V1 cannot: the enquiry form returns 503, no phone, email, WhatsApp or address exists, there is no price or real location on any parcel, and the "inventory" is explicitly sample content. A high-net-worth buyer finds no team, no registration number, no testimonials and no way to speak to a human, while the imagery reads as generated and the first three seconds are a blank intro animation on a page that scores 53 on mobile performance. On SEO, the placeholder canonical domain, the CSR-only `/contact` heading, the missing favicon and `Place`-only schema mean it is "technically tidy" rather than "built to rank" for the searches a real-estate buyer makes. V2 must start with function and trust (lead delivery, contact channels, real inventory, domain), then performance, then visual refinement.

## Files

| File | Contents |
|---|---|
| `01-section-scores.md` | Section-by-section scoring (template as specified) |
| `02-functionality-test.md` | 121 tested interactive elements, console errors, failed requests |
| `03-seo-audit.md` | Per-page SEO table, site-wide findings, score 6/10 |
| `04-performance-accessibility.md` | Lighthouse (mobile+desktop ×3 pages), Core Web Vitals, axe, keyboard, scores |
| `05-responsive-review.md` | 1440 / 768 / 375 layout bugs |
| `06-v2-priorities.md` | 🔴/🟠/🟡/⚪ ranked fix list |
| `screenshots/` | all evidence images (`<page>-<width>.png`, `<page>-<width>-fold.png`, interaction shots) |

## Limits of this audit
- Single Lighthouse run per cell, laptop hardware, simulated throttling — treat ±5 Perf points as noise (the home-mobile gap is far larger).
- Real-device testing (iOS Safari, Android Chrome, physical swipe), screen readers (NVDA/VoiceOver) and field INP were not possible here; touch was emulated via Chrome device mode.
- CRM/SMTP success path could not be tested because the integrations are not configured (that *is* the finding); the API code path for `delivered` was read but not executed.
- Social links, tel/mailto/WhatsApp links cannot be validated because none exist.

