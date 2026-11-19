# V1 vs V2 — comparison

V1 = commit `11e6fc8` (audited in `docs/v1-audit/`). V2 = branch `v2`. Same panel, rubric, scale and caps; V2 numbers come from the clean-room audit in `docs/v2-audit/`. V1 performance uses the **corrected baseline** (re-measured with `sharp` working; the original run is in parentheses).

## Overall

| | V1 | V2 |
|---|---|---|
| **Overall score** | **5 / 10** (5.45) | **8 / 10** (8.00) |
| Premium visual design (25 %) | 7 | 8 (capped: imagery) |
| UX (20 %) | 4 | 8 |
| Functionality (20 %) | 4 (cap: broken core function) | 8 |
| SEO (15 %) | 6 | 8 |
| Performance (10 %) | 5 | 7 |
| Accessibility (10 %) | 7 | 9 |
| Functional checks | 94 / 121 pass, 18 fail | 124 / 125 pass, 0 fail, 1 partial |
| axe-core | serious ×3, 61 small targets | 0 violations on 30 / 30 runs |
| Lighthouse SEO / Best Practices | 100 / 96 | 100 / 100 |
| Production dependencies | incl. GSAP, Motion, lucide-react and the lint toolchain | 6; `npm audit --omit=dev` = 0 |

## Section comparison

| Section | V1 | V2 | What changed |
|---|---|---|---|
| Navbar / header | 6 | 9 | persistent Enquire CTA, native-dialog menu with scroll lock |
| Brand intro curtain | 4 | removed | 3.3 s blank screen deleted |
| Hero | 6 | 8 | static plate + real search; imagery still synthetic (cap) |
| Brand statement | 6 | 8 | one statement, three principles, translated Hindi |
| Featured plots | 5 | 8 | one-link cards, status as text |
| Plot map | 5 | 8 | honest schematic with real links |
| About / stewardship (home) | 6 | 7 | proof row = marked slot |
| Location & lifestyle | 5 | 7 | mosaic + lightbox; facts slot |
| Visual storytelling | 5 | 8 | moved to /about, typographic |
| Why choose us | 5 | 8 | night band, contrast 3.7 → 10.4 : 1 |
| Future homes | 5 | 8 | "Concept — not for sale", register deep link |
| **Enquiry / contact** | **3** | **7** | delivers (verified), SSR H1 + form, honest failure; capped: no channels/inbox |
| Footer | 4 | 6 | identity block + slots; capped |
| Cookie consent | 5 | 9 | docked, 44-px actions, native dialog |
| Project detail | 6 | 7 | gallery/lightbox, sticky enquiry, `RealEstateListing`; price/map/docs = slots |
| Projects listing | 5 | 9 | URL-state filters, sort, pagination, plan view |
| About page | 6 | 7 | slots for team/registration |
| Buyer guide | 6 | 9 | real interactive, printable checklist |
| 404 | 7 | 9 | search + suggestions |
| Legal pages | 6 | 7 | text unchanged, awaiting counsel |

## Lighthouse (median of 3, simulated throttling, same method)

| Page | Form | V1 Perf · LCP | V2 Perf · LCP | A11y V1 → V2 | BP V1 → V2 | SEO |
|---|---|---|---|---|---|---|
| `/` | Mobile | 62 · 5.0 s (53 · 6.0 s) | **80 · 3.8 s** | 97 → 97 | 96 → 100 | 100 → 100 |
| `/` | Desktop | 91 · 1.1 s (81 · 1.3 s) | **99 · 0.8 s** | 97 → 100 | 96 → 100 | 100 |
| `/projects` | Mobile | 98 · 1.0 s | 86 · 3.7 s * | 99 → 97 | 96 → 100 | 100 |
| `/projects` | Desktop | 99 · 1.0 s | **100 · 0.3 s** | 99 → 100 | 96 → 100 | 100 |
| `/projects/aranya-ridge-terraces` | Mobile | 83 · 4.6 s (81 · 4.8 s) | **88 · 3.5 s** | 100 → 97 | 96 → 100 | 100 |
| `/projects/aranya-ridge-terraces` | Desktop | 99 · 0.9 s (93 · 1.7 s) | **100 · 0.8 s** | 100 → 100 | 96 → 100 | 100 |
| `/contact` · `/guides/…` · `/about` | Mobile | – (not measured in V1) | 99 · 0.8 s / 100 · 0.8 s / 99 · 0.9 s | | | 100 |

\* The listing's V1 LCP was a text node (images lazy, far below); V2 deliberately shows and preloads a photograph in the first mobile viewport, so the lab now measures image LCP. Mobile A11y 97 on four pages is a Lighthouse/axe evaluation artefact (footer links resolved through the fixed header); axe itself reports 0 violations (`docs/v2-audit/04`).

Home mobile varied 74–91 across sessions on identical code (machine noise); V1 never exceeded 62. CLS 0 → 0; TBT home mobile 604 → 386 ms.

## Not at the quality bar (and why)

| Bar | Result | Reason |
|---|---|---|
| Overall ≥ 8.5 | 8.0 | five client inputs missing (channels, inbox, domain, inventory/price/location, team/registration/photography) |
| No section < 8 | 8 rows below 8 | each capped by those same inputs |
| Mobile Perf ≥ 90 | home 80 · listing 86 · dossier 88 | lab LCP/TBT dominated by ≈ 150 KB of framework JavaScript; tuned and measured, not removable without leaving the framework |
| LCP < 2.5 s | 3.5–3.8 s lab on image pages (0.8–0.9 s on text pages; 2.3–2.5 s with real DevTools throttling) | same |
| INP < 200 ms | unmeasured | field metric |

## What the client must still provide
See `docs/v2/HANDOVER.md` §3 (full registry; critical three: delivery inbox, contact channels, domain).
