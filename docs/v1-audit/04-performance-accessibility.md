# 04 — Performance & Accessibility (V1, production build)

Setup: `next build` + `next start` on 127.0.0.1:3100, Lighthouse (programmatic, system Chrome headless), default mobile profile (Moto-class emulation, simulated slow-4G / 4× CPU) and a desktop profile. Single run per cell on a developer laptop — expect ±5 points of noise on Performance; the home-mobile gap to the other rows is far larger than that. axe-core 4.x run on 8 pages at 1440px after scrolling the full page. Raw Lighthouse JSON was kept in the audit scratch area (not committed).

## Scores

| Page | Form factor | Perf | A11y | Best Practices | SEO | LCP | FCP | CLS | TBT | Speed Index | Weight | Requests |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | **Mobile** | **53** | 97 | 96 | 100 | **6.0 s** | 0.9 s | 0 | **900 ms** | 5.8 s | 861 KiB | 36 |
| `/` | Desktop | 81 | 97 | 96 | 100 | 1.3 s | 0.4 s | 0 | 300 ms | 1.8 s | 1,732 KiB | 50 |
| `/projects` | Mobile | 98 | 99 | 96 | 100 | 1.0 s | 1.0 s | 0 | 160 ms | 1.9 s | 1,226 KiB | 32 |
| `/projects` | Desktop | 99 | 99 | 96 | 100 | 0.9 s | 0.3 s | 0 | 0 ms | 0.7 s | 1,906 KiB | 47 |
| `/projects/aranya-ridge-terraces` | Mobile | 81 | 100 | 96 | 100 | **4.8 s** | 0.9 s | 0 | 140 ms | 2.3 s | 1,421 KiB | 40 |
| `/projects/aranya-ridge-terraces` | Desktop | 93 | 100 | 96 | 100 | 1.7 s | 0.3 s | 0 | 0 ms | 0.7 s | 1,853 KiB | 50 |

INP is a field metric (not measurable in lab Lighthouse); TBT is the lab proxy. Best-Practices 96 on every page = single failure "Browser errors were logged to the console" → the `/favicon.ico` 404.

## Performance score: **5 / 10**
Reasoning: the page everyone lands on (`/`, mobile) scores **53 with LCP 6.0 s and TBT 900 ms** — "poor" on both Core Web Vitals lab proxies. Listing and detail pages are healthy on desktop. CLS is a clean 0 everywhere (good), images are optimised through `next/image` with explicit dimensions.

### Why home-mobile is slow (evidence)
- **Main-thread work 5.0 s**, JS bootup 1.5 s, 12 long tasks (largest 419 ms at document eval, 266 ms and 207 ms in two shared chunks `092r-mewpaf3q.js` / `1i-ejymjz0ztb.js`). Source: GSAP + ScrollTrigger + Motion + the hero/intro timelines all hydrate on `/` (`HeroSection.tsx`, `BrandIntroCurtain.tsx`, `FeaturedPlotsSection.tsx`).
- LCP element is the hero `<img>` (eager, `fetchpriority=high`, discoverable — all good) but its *render delay* is the long pole (774 ms observed vs 15 ms TTFB + 27 ms load delay + 66 ms load): the browser is busy hydrating while the image is ready. The cream intro curtain (≈3.3 s) also sits above it for first-time visitors.
- Legacy-JS polyfills ≈ 14 KiB, unused JS ≈ 53–56 KiB, one render-blocking CSS file (14 KB, ≈ 160 ms).
- Image delivery insight flags ≈ 177 KiB savings on the hero asset (1376×768 WebP served at 210 KB for every requested width — the optimizer returns the original because the source is already small; the hero is therefore both large for mobile *and* too small for desktop).

### Heaviest assets (home, desktop)
| Asset | Transfer |
|---|---|
| `/_next/image … vatika-banyan.webp&w=750` | 241 KB |
| `aranya-ridge.webp` (hero, w=1440) | 210 KB |
| `aranya-ridge.webp` w=640 and w=828 (same photo fetched 3× at different widths: hero, lead card, map panel) | 210 KB each |
| `shila-crest.webp&w=750` | 167 KB |
| Largest font file `a582…woff2` | 118 KB |
| JS chunk `092r-mewpaf3q.js` | 71 KB |

Fonts: 6 woff2 files ≈ 274 KB (Cormorant Garamond ×2 styles, Manrope, JetBrains Mono, Noto Sans Devanagari) — four families for one site.
Total page weight 0.86 MB (mobile, above-fold only) → 1.7–1.9 MB (desktop, whole page scrolled during LH).

## Accessibility score: **7 / 10**
Lighthouse a11y: 97 (home), 99 (projects), 100 (detail). Real-world pass is weaker than the number suggests.

### axe-core results (serious/moderate)
| Page | Violations |
|---|---|
| `/` | `color-contrast` ×5 (serious) · `label-content-name-mismatch` ×6 (serious) · `nested-interactive` ×1 (serious) |
| `/about` | `color-contrast` ×5 (serious) |
| `/projects` | `heading-order` ×1 (moderate) · label-mismatch ×6 · nested-interactive ×1 |
| `/contact` | `heading-order` ×1 (moderate) |
| `/projects/aranya-ridge-terraces`, `/future-homes`, `/guides/land-buying-checklist`, `/privacy-policy` | none |

1. **Contrast:** `#C49A50` gold on `#41490D` olive = **3.7:1** at 11–12px (`WhyChooseSection.tsx:48,69`). axe flags a further 88 "needs review" contrast nodes on `/` (text over photos).
2. **label-content-name-mismatch:** SVG parcels' `aria-label="P-01: Aranya Ridge Terraces (4,800 sq. ft.) — open parcel details"` does not start with the visible text ("Aranya Ridge") → voice-control users cannot say "click Aranya Ridge" (`InteractivePlotMap.tsx:150-152`).
3. **nested-interactive:** an interactive container with focusable descendants on `/` and `/projects` (map `g role=button` region).
4. **heading-order:** `/projects` h1 → h3 (`app/projects/page.tsx:38`); `/contact` same pattern on the client-rendered form.

### Keyboard (home, 86 tab stops until footer)
- ✔ Skip link is the first stop and becomes visible (191px). Activating it moves the hash to `#main-content` but focus stays on `<body>` (main lacks `tabindex=-1`).
- ✔ Nav, hero tabs, cards, modal, carousel all reachable and operable; modal traps focus and restores focus to a *button* trigger.
- ❌ Focus is **not** restored when the modal was opened from an SVG parcel (activeElement = BODY).
- ⚠️ Inputs/selects/textarea use `outline: none` with only a border-colour change (`focus:border-[#98400F]`, 1px) — weak indicator.
- ⚠️ No focus move to first invalid field after failed submit.
- ❌ Mobile drawer: no focus trap, no body scroll-lock.

### Other checks
- **Tap targets:** 61 interactive elements < 44×44 at 375px (list in `02-functionality-test.md`).
- **Reduced motion:** ✔ honoured — with `prefers-reduced-motion: reduce` the intro curtain does not render, hero does not auto-rotate, 0 running CSS animations (`globals.css:31,120,172`).
- **Hero auto-rotation (7.5 s):** pauses on mouse hover only; no visible pause control (WCAG 2.2.2).
- **Forms:** every field has `<label for>`, errors are `role="alert"` and `aria-describedby`-linked, `aria-invalid` set ✔.
- **Buttons/links names:** all have text or `aria-label` ✔.
- **Language:** `<html lang="en">`; Devanagari strings are not marked `lang="hi"`.
- **Colour contrast on hero:** headline white on 92%→14% dark scrim passes visually; gold kicker `#E5C185` over bright terrain at right is borderline but not inside the scrimmed column.

## Scores by area
| Area | Score | Basis |
|---|---|---|
| Performance (mobile home) | 4 | LCP 6.0 s, TBT 900 ms, Perf 53 |
| Performance (listing/detail) | 7 | 98–99 desktop/mobile on `/projects`; detail mobile LCP 4.8 s |
| **Performance overall** | **5** | weighted to the landing page |
| Accessibility | 7 | axe serious ×3 types, weak input focus, no mobile trap/lock; strong semantics |
| Best practices | 7 | Strict CSP + HSTS + nosniff + Referrer/Permissions-Policy ✔ (`next.config.ts`); favicon 404 ✘; `frame-ancestors` allows `aistudio.google.com` and `*.google.com` (AI-Studio leftover) |

## What V2 must do
1. Cut home JS: lazy-load GSAP/ScrollTrigger below the fold, drop Motion `layoutId` animations from first paint, remove or shorten the intro; target mobile LCP ≤ 2.5 s, TBT ≤ 200 ms.
2. Ship ≥ 2400px hero source + AVIF; art-directed mobile crop (≤ 900px, ≤ 120 KB).
3. Fix the 3 axe serious classes; lift gold-on-olive; rename SVG labels; fix h1→h3 skips.
4. Visible 2px focus rings on all form controls; focus management on validation failure and modal restore from SVG.
5. Add `tabindex="-1"` to `<main>`; 44px minimum targets on mobile; scroll-lock + trap in drawer.
6. Reduce to 2 font families (display serif + sans); subset Devanagari only where used.
