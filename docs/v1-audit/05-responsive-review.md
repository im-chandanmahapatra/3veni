# 05 — Responsive Review (V1)

Viewports: **1440×900**, **768×1024**, **375×812** (touch, mobile UA); extra overflow probe at 320. Every route was captured full-page + above-the-fold at each width (`screenshots/<page>-<width>.png`, `…-fold.png`).

**Capture notes (so nothing is mis-read):** the fixed header, cookie banner and scroll-progress bar appear mid-image in full-page captures — that is a stitching artefact of `fullPage` screenshots, not a layout bug. The 375px full-page home capture also repeats the hero at the very bottom; the live DOM has exactly one `#home` (verified), so that is a capture artefact too. The *fold* shots and the DOM measurements are the evidence for the findings below.

**Overall responsive verdict: 6/10.** No horizontal scroll at any width on any of the 15 routes (scrollWidth == clientWidth at 1440/768/375/320). The layout system (12-col grid, `clamp()` type) is competent. The defects are overlap with the cookie banner, tap-target size, a missing mobile scroll-lock, and image resolution.

## 1440 px (desktop)

| # | Bug | Where | Evidence |
|---|---|---|---|
| D1 | Hero photo is upscaled: 1376×768 source rendered into a 1574×984 box (parallax scale 1.05) → soft/blurry on 1440+ and Retina | Hero, `HeroSection.tsx:179-190` (`sizes="100vw"`) | `imgcheck`: `nw 1376 / rw 1574` ; `screenshots/home-1440-fold.png` |
| D2 | Cookie banner permanently floats over the bottom-right of every page's content (hero datum strip had to be shortened by `md:max-w-[calc(100%-460px)]` to avoid it) | Global | `screenshots/home-1440-fold.png`, `project-aranya-1440.png` (covers "Site & planning highlights" text) |
| D3 | Plot-map side panel and the lead card directly below show the **same parcel twice** (P-01 Aranya) at 1440 and at 768 | Featured plots | `screenshots/home-1440.png`, `home-768.png` |
| D4 | Large black/empty image frames until lazy images load (no blur placeholder): "Architectural monograph" plate, Future-homes slide, footer logo disc | Home | `screenshots/home-1440.png` (fast-scroll capture) |
| D5 | Headline measure: "Curated land parcels prepared for generational ownership." breaks to 3 lines in a half-column while the right column floats low-aligned — uneven rhythm | Featured plots header | `screenshots/home-1440.png` |
| D6 | Footer "Advisory Desk" column is one sentence — columns are visibly unbalanced | Footer | `screenshots/contact-1440.png` |

## 768 px (tablet)

| # | Bug | Where | Evidence |
|---|---|---|---|
| T1 | Cookie banner overlaps hero parcel link ("Aranya Ridge T…" clipped) and hides the prev/next vista arrows | Hero | `screenshots/home-768-fold.png` |
| T2 | Header shows Enquire + hamburger but the 6 nav links vanish (breakpoint is `lg` = 1024), so a 768 iPad has a 2-tap path to every page | Navbar `Navbar.tsx:82` (`hidden lg:flex`) | `screenshots/home-768-fold.png` |
| T3 | Lead card goes full-width: 4800 sq ft parcel photo ≈ 730×410 from a 1021px source = fine, but the lead + map panel duplication makes the section ≈ 1,900 px tall for one parcel | Featured plots | `screenshots/home-768.png` |
| T4 | Hero vista labels wrap onto three stacked lines, parcel link wraps below | Hero | `home-768-fold.png` |

## 375 px (mobile)

| # | Bug | Where | Evidence |
|---|---|---|---|
| M1 | **No scroll lock** behind the mobile drawer: page scrolled 0→600 with the menu open; body `overflow: visible` | Navbar | tested; `screenshots/home-mobile-menu-open-375.png` |
| M2 | Header "Enquire" button hidden (`hidden sm:inline-flex`) → no persistent CTA on phones | Navbar `:126` | `screenshots/home-375-fold.png` |
| M3 | **61 tap targets < 44×44**: hero vista tabs 29px tall; hero text link 33px; parcel chips 31px; "Quick Preview" 32px; carousel dots 106×18; footer links 16–20px tall; cookie buttons 27–29px | Home | measured list in `02-functionality-test.md` |
| M4 | Cookie banner consumes ≈ 80px (10% of the viewport) at the bottom on every page and overlaps gallery captions on detail pages | Global | `screenshots/project-aranya-375-fold.png` |
| M5 | Plot-map parcel labels shrink to SVG `fontSize="8"` / `10.5` units (→ ≈ 4–5px rendered) — unreadable; chips below compensate | Plot map | `InteractivePlotMap.tsx:199-259`; `home-375-01` crop |
| M6 | Hero H1 is 44px with the 100svh hero at 812px: text block, CTAs and tabs fill the screen with no breathing room; the sample-parcel link is below the fold on a 667px-high phone | Hero | `screenshots/home-375-fold.png` |
| M7 | Hero uses a desktop-crop photo (1376px wide) on mobile — the subject (terraces) is cropped by `object-cover object-center` and the 210 KB asset is the LCP | Hero | Lighthouse: LCP 6.0 s |
| M8 | Page length: home is 18,093 px tall at 375 (≈ 22 screens) — 9 sections of copy-heavy brand story before the form | Home | `crawl-report` docH |
| M9 | Select boxes in the form truncate long option text ("Aranya Ridge Terraces (4,800 sq. ft" cut) | Contact form | `screenshots/contact-375.png` |
| M10 | At 320px: no horizontal overflow ✔ (322/322) | — | probe |

## Per-route summary (no horizontal overflow on any)

| Route | 1440 | 768 | 375 | Notes |
|---|---|---|---|---|
| `/` | ⚠️ D1–D4 | ⚠️ T1–T4 | ⚠️ M1–M9 | most issues |
| `/about` | ✅ | ✅ | ✅ | cookie banner overlap only |
| `/projects` | ✅ | ✅ | ⚠️ M3/M5 | duplicate of home block |
| `/projects/[slug]` ×5 | ✅ | ✅ | ⚠️ M4 | clean grids |
| `/future-homes` | ✅ | ✅ | ✅ | black slide frame while loading |
| `/guides/land-buying-checklist` | ✅ | ✅ | ✅ | |
| `/contact` | ⚠️ D6 | ✅ | ⚠️ M9 | |
| legal ×3 | ✅ | ✅ | ✅ | |
| 404 | ✅ | ✅ | ✅ | |

## What V2 must do
1. Provide hero/plot art at ≥ 2400 px (desktop) and separately cropped ≤ 900 px mobile images via `<picture>`/`sizes`.
2. Replace the floating consent card with a docked bar that reserves space (and 44px buttons).
3. Show the desktop nav from 900px or add an always-visible "Menu" + "Enquire"; add scroll-lock and focus trap to the drawer.
4. Raise every interactive target to ≥ 44px at ≤ 768px (chips, tabs, footer links, pagination).
5. Remove the duplicated map-panel + lead card; one parcel presentation per viewport.
6. Blur placeholders for every lazy image; shorten the mobile home (collapse brand story into 2 sections).
