# 3VENI SPHERE — V2 Self-Audit

**Audit date:** 19 Nov 2026 · **Auditors:** the same three-person panel and the same rubric/scale/caps as `docs/v1-audit/` · **Mode:** read-only against a **clean-room build** — the audited code was never the working tree.

## Project info

| | |
|---|---|
| Audited code | Branch `v2`, last commit before this audit's doc commit (`git log` in `docs/v2/CHANGELOG.md`). Built in a **separate git worktree** with a fresh `npm ci` and **no `.env.local`** (the working tree contains one with values I am not allowed to read). |
| Framework | Next.js 16.4.6 (App Router, Turbopack), React 19, Tailwind 4, nodemailer. **Removed vs V1:** GSAP, Motion, lucide-react. `npm audit --omit=dev` → **0 vulnerabilities** (V1: lint toolchain in `dependencies`). |
| Routes (13 pages + 5 endpoints) | `/`, `/about`, `/projects` (+`?format|size|terrain|q|sort|view|page`), `/projects/{5 slugs}`, `/future-homes`, `/guides`, `/guides/land-buying-checklist`, `/contact`, `/privacy-policy`, `/cookie-policy`, `/terms-and-conditions`, 404; `POST /api/enquiries`, `GET /api/health`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, icons, 11 OG images |
| Build env | `CONTENT_MODE=preview FORCE_INDEXABLE=true NEXT_PUBLIC_SITE_URL=https://staging.3venisphere.invalid` (the `FORCE_INDEXABLE` switch exists only so Lighthouse SEO can be measured on a preview; a normal preview build is `noindex` + `Disallow: /`). Contact env vars deliberately blank. |
| Run | `next start -p 3500` (+ local SMTP sink on :2525 for the delivery test; second server on :3501 with `LISTING_PAGE_SIZE=2` and no SMTP for pagination / honest-failure tests) |
| Tooling | Playwright-core + system Chrome, Lighthouse 13 (programmatic, ×3 median, mobile + desktop, simulated throttling = V1's method), axe-core 4.x, raw-HTML `fetch` for SEO, unit tests (`npm test`: 29 pass) |
| Evidence | 83 screenshots in `screenshots/` (12 routes × 3 widths × fold+full, plus 11 interaction states) |
| Iterations | 3 (see "Iteration log") |

## Overall V2 score: **8 / 10** (8.0 before rounding) — V1 was 5 / 10

| Category | Weight | V1 | **V2** | Weighted | Basis |
|---|---|---|---|---|---|
| Premium Visual Design | 25% | 7 | **8** | 2.00 | Disciplined token system, 2-family type pairing with real Devanagari, square hairline language, no template rhythm, no auto-motion. **Capped at 8**: imagery is unchanged V1 artwork that still reads as generated; no team/place/people photography exists. |
| UX | 20% | 4 | **8** | 1.60 | Real search (hero + listing), URL-state filters/sort/pagination, one card = one link, persistent Enquire CTA, docked consent bar, honest empty/error/success states. Held at 8: no price, no real location, no human contact channel yet. |
| Functionality | 20% | 4 | **8** | 1.60 | **124/125 pass, 0 fail** (V1: 94/121, 18 fail). Lead delivery verified end-to-end against an SMTP sink; honest 503 when unconfigured. Held at 8 because *no real contact channel and no delivery destination are configured* (client-supplied). |
| SEO | 15% | 6 | **8** | 1.20 | Verified-domain gate, per-page canonical/OG (1200×630), `RealEstateListing`/`CollectionPage`/`Article`/`FAQPage`/`ContactPage`/`BreadcrumbList`, real `lastmod`, noindex rules for filters/hub/404, SSR H1+form on `/contact`, favicon set, manifest. Held at 8: no NAP / address, no location pages, 1 guide, placeholder domain until the client supplies one. |
| Performance | 10% | 5 | **7** | 0.70 | Desktop 99–100 everywhere; mobile 99–100 on 3 pages, **home 80 / listing 86 / dossier 88**, lab LCP 3.5–3.8 s (V1: 5.0 s corrected). **Lab LCP bar (< 2.5 s) not met** on image-led pages — see 04. |
| Accessibility | 10% | 7 | **9** | 0.90 | axe-core **0 violations on 30/30 page×viewport×consent runs**, Lighthouse A11y 100 desktop / 97 mobile (artefact explained in 04), native `<dialog>`s, 44-px targets, ≥ 2-px focus rings, reduced motion, skip link. Held at 9: no screen-reader or real-device pass possible here. |
| **Total** | 100% | 5.45 | | **8.00 → 8/10** | |

> **Honest framing (as agreed in the plan):** content-dependent work is *engineering-complete, content-blocked*. With client-supplied contact channels, delivery inbox, domain, prices/inventory, location facts, team/registration data and photography I expect 8.6–8.9. Without them 8.0 is the ceiling and I am not claiming more.

## Quality bar scorecard

| Bar | Target | Result | Met |
|---|---|---|---|
| No section < 8 | all ≥ 8 | 8 sections < 8, **every one capped by missing client content** (Footer 6, Enquiry/contact 7, About ×2 7, Location 7, Project detail 7, Legal 7, absent-features 1) — see `01` | ❌ (content-blocked) |
| Overall ≥ 8.5 | 8.5 | 8.0 | ❌ (content-blocked) |
| Zero 🔴 | 0 | **0** open 🔴 in engineering terms; 3 client-content 🔴 remain in `06` (contact channels, delivery inbox, real domain) | ⚠️ |
| Zero failing interactions / console errors | 0 | **0 fail** of 125; 0 JS errors (only deliberate 404/503 network statuses) | ✅ |
| Lighthouse mobile Perf ≥ 90 | 90 | home 80, listing 86, dossier 88; contact/guide/about 99–100 | ❌ (3 of 6) |
| Lighthouse mobile A11y ≥ 95 | 95 | 97–100 | ✅ |
| Lighthouse mobile BP ≥ 95 / SEO 100 | | 100 / 100 on all | ✅ |
| LCP < 2.5 s | 2.5 s | text-led pages 0.8–0.9 s ✅; image-led pages 3.5–3.8 s simulated (0.4 s observed locally; 2.3–2.5 s with real DevTools throttling) | ❌ lab / ⚠️ real |
| CLS < 0.1 | 0.1 | 0.000 (one 0.005 desktop run) | ✅ |
| INP < 200 ms | 200 ms | not measurable in lab; TBT 0–5 ms desktop, 68–386 ms mobile (4× CPU) | ⚠️ unmeasured |
| Valid JSON-LD on home / listing / detail | valid | parsed with `JSON.parse` on every page; types in `03` | ✅ |

## Section comparison (V1 → V2)

| Section | V1 | V2 | Note |
|---|---|---|---|
| Navbar / header | 6 | **9** | CTA at every width, native-dialog menu with scroll lock/focus return, phone/WhatsApp slots |
| Brand intro curtain | 4 | **removed** | 3.3 s blank screen deleted; no replay link |
| Hero | 6 | **8** | static plate, real search, keyword H1 retained; imagery cap |
| Brand statement | 6 | **8** | one statement + 3 principles, Hindi with English caption |
| Featured plots | 5 | **8** | one-link cards, status text, price line, "View all" |
| Interactive plot map | 5 | **8** | schematic labelled "not to scale", real links, no nested-interactive axe errors |
| About / stewardship (home) | 6 | **7** | proof row is a marked slot |
| Location & lifestyle | 5 | **7** | merged into the terrain mosaic; location facts slot |
| Visual storytelling | 5 | **8** | merged into /about as a typographic section |
| Why choose us | 5 | **8** | night band, 10.4:1 numerals (was 3.7:1) |
| Future homes | 5 | **8** | clearly "Concept — not for sale", register-interest deep link |
| **Enquiry form / contact** | **3** | **7** | delivers (verified); capped: no channel/inbox supplied |
| Footer | 4 | **6** | identity block + marked slots; capped: no phone/email/address/IDs exist |
| Cookie consent | 5 | **9** | docked bar, 44-px equal-weight actions, native-dialog preferences |
| Project detail | 6 | **7** | gallery+lightbox, specs, sticky enquiry, similar/prev-next, `RealEstateListing`; capped: price/map/documents are slots |
| Projects listing | 5 | **9** | server-rendered URL-state filters, sort, pagination, chips, empty state, plan view |
| About page | 6 | **7** | leadership/registration slots |
| Buyer guide | 6 | **9** | interactive checklist (persisted, printable), details/summary FAQ |
| 404 | 7 | **9** | search, popular links, correct status |
| Legal pages | 6 | **7** | text unchanged by instruction; still awaiting counsel review |
| Agents / testimonials / stats / services / blog / newsletter / real map / contact details | 1 each | 1 (slots) | cannot exist without client content |

## Iteration log

| # | Found | Fixed |
|---|---|---|
| 1 | axe: footer-slot contrast 2.0:1 on dark (3 serious ×14 pages); LCP element on listing was a lazy image; cold-cache LCP; Lighthouse scroll under consent bar | slot label colour; first card `preload`; `scroll-padding-bottom` for the consent bar; hero q60 |
| 2 | Functional matrix 15 non-pass: success-confirmation focus did not move (state set before commit), sticky dossier panel did not stick, `/projects` skeleton flashed on dossier navigation, 320-px header + two pages overflowed, 41-px skip link; test-script timing bugs | focus via `useEffect`; stretched aside; skeleton moved to route group `(listing)`; header/cards wrap; skip link 44 px; scripts fixed |
| 3 | 1 non-pass: lightbox mouse-swipe cancelled by native image drag; 320-px concept button; masterplan panel `h3` heading-order | `draggable={false}`; wrapping buttons; panel title is a `<p>` → **125 checks 124 ✅ / 1 ⚠️, axe 30/30 clean** |
| — | **Not fixable in 3 iterations:** lab LCP on image-led mobile pages and home mobile TBT (framework hydration ≈ 125 KB gz + our ≈ 25 KB). Measured, explained, reported. | |

## Limits of this audit
- Lighthouse numbers drift ±5–10 Perf points on this machine between sessions (the same build scored 88–91 on a quiet run and 77–86 minutes later; two builds scored identically within a run). Medians of 3 are reported; the earlier quiet-machine figures are in `04`.
- No real-device or screen-reader testing (NVDA/VoiceOver/iOS Safari); touch is emulated. INP is a field metric.
- SMTP success path was tested against a local sink, not a real mail account; CRM webhook path is covered by unit/integration tests only.
- Linux/Vercel install was not exercised locally (the lockfile contains win32 + linux `sharp` binaries).

## Files

| File | Contents |
|---|---|
| `01-section-scores.md` | Section-by-section scoring with evidence and what remains |
| `02-functionality-test.md` | 125 executed checks, console/network findings |
| `03-seo-audit.md` | Per-page SEO table, structured data, indexation rules, score 8/10 |
| `04-performance-accessibility.md` | Lighthouse ×3 mobile+desktop on 6 pages, vs V1, axe, keyboard |
| `05-responsive-review.md` | 320 / 375 / 768 / 1440 findings |
| `06-v2-priorities.md` | What is left, ranked (almost all client-content) |
| `screenshots/` | evidence (`<page>-<width>[-fold].jpg`, `x-*.jpg` interaction states) |
