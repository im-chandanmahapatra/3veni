# 04 — Performance & Accessibility (V2, clean-room production build)

Setup: fresh worktree + `npm ci`, `next build` + `next start` on 127.0.0.1:3500, Lighthouse 13 (programmatic, system Chrome headless), default mobile profile (simulated slow-4G, 4× CPU — **identical to the V1 method**) and the V1 desktop profile, **3 runs per cell, median reported**, caches warmed before measuring (a cold `/_next/image` cache adds ≈ 0.6 s of server time that Lighthouse's simulation multiplies). axe-core 4.x on 14 routes at 1440 and 375 after scrolling the full page, plus 2 routes with the consent bar visible.

## Scores (median of 3)

| Page | Form factor | Perf | A11y | BP | SEO | LCP | FCP | CLS | TBT | Speed Index | Weight |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | **Mobile** | **80** | 97 | 100 | 100 | **3.8 s** | 0.9 s | 0 | 386 ms | 2.1 s | 432 KiB |
| `/` | Desktop | 99 | 100 | 100 | 100 | 0.8 s | 0.3 s | 0.005 | 0 ms | 0.8 s | 506 KiB |
| `/projects` | Mobile | 86 | 97 | 100 | 100 | 3.7 s | 0.9 s | 0 | 158 ms | 1.6 s | 505 KiB |
| `/projects` | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.3 s | 0 | 3 ms | 0.5 s | 499 KiB |
| `/projects/aranya-ridge-terraces` | Mobile | 88 | 97 | 100 | 100 | 3.5 s | 1.0 s | 0 | 182 ms | 1.7 s | 366 KiB |
| `/projects/aranya-ridge-terraces` | Desktop | 100 | 100 | 100 | 100 | 0.8 s | 0.3 s | 0 | 1 ms | 0.7 s | 445 KiB |
| `/contact` | Mobile | 99 | 100 | 100 | 100 | 0.8 s | 0.8 s | 0 | 143 ms | 1.6 s | 280 KiB |
| `/contact` | Desktop | 100 | 100 | 100 | 100 | 0.2 s | 0.2 s | 0 | 2 ms | 0.5 s | 303 KiB |
| `/guides/land-buying-checklist` | Mobile | 100 | 97 | 100 | 100 | 0.8 s | 0.8 s | 0 | 68 ms | 1.6 s | 281 KiB |
| `/guides/land-buying-checklist` | Desktop | 100 | 100 | 100 | 100 | 0.2 s | 0.2 s | 0 | 3 ms | 0.5 s | 302 KiB |
| `/about` | Mobile | 99 | 97 | 100 | 100 | 0.9 s | 0.9 s | 0 | 134 ms | 1.4 s | 404 KiB |
| `/about` | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.3 s | 0 | 0 ms | 0.6 s | 414 KiB |

Confirmation re-run (3 runs, mobile): home 79 · listing 86 · dossier 90. **Earlier, quieter-machine runs of the same code** (dev session, 3-run medians): home 90 / LCP 3.6 s, listing 88→91, dossier 93→92. Running the previous build next to the final one in the same minute gave 78–86 vs 77–82 — i.e. the spread is the machine, not a regression. Treat ±8 points as noise; the claim I am willing to make is **home mobile ≈ 80–90, never 53**.

### V1 → V2 (same method; V1 re-measured with `sharp` working = "corrected baseline")

| Page · mobile | V1 (original) | V1 (corrected) | **V2** |
|---|---|---|---|
| `/` Perf · LCP · TBT | 53 · 6.0 s · 900 ms | 62 · 5.0 s · 604 ms | **80 · 3.8 s · 386 ms** (80–90 across sessions) |
| `/projects` | 98 · 1.0 s | 98 · 1.0 s | 86 · 3.7 s |
| `/projects/aranya…` | 81 · 4.8 s | 83 · 4.6 s | **88 · 3.5 s** |
| Desktop `/` · `/projects` · detail | 81 · 99 · 93 | 91 · 99 · 99 | **99 · 100 · 100** |
| Best Practices | 96 (favicon 404) | 96 | **100** |
| A11y | 97–100 | 97–100 | 97–100 (axe: 0 violations) |

**The listing regressed on mobile** (98 → 86) *by design*: V1's LCP element was text because its images were lazy and far down; V2 puts a real photograph (the first plot card) in the first mobile viewport and preloads it, so Lighthouse now measures an image LCP. Observed (un-throttled) LCP is 0.4 s; the simulated figure is dominated by shared-bandwidth modelling of ≈ 170 KB of framework JavaScript (see below).

## Performance score: **7 / 10** (V1: 5)

### What was fixed
- The 3.3 s intro curtain, GSAP, ScrollTrigger, Motion and lucide-react are gone; `/` ships **one** static hero plate (preloaded, `fetchpriority=high`, AVIF/WebP via `next/image`, 17–27 KB at mobile width) — LCP element confirmed as that `<img>`; "resource load delay" 12 ms, TTFB 13 ms.
- Self-hosted fonts: 51 KB preloaded (Newsreader 300 + Instrument Sans) instead of V1's 274 KB; Devanagari (51 KB), Newsreader 400 and latin-ext are lazy via `unicode-range`.
- CLS **0.000** on every page (static imports give intrinsic size + blur placeholder; `content-visibility` sections reserve space; fallback fonts are metric-matched).
- Production dependencies: 6 (`next`, `react`, `react-dom`, `nodemailer`, `@tailwindcss/postcss`, `@types/nodemailer`); V1 also shipped GSAP, Motion, lucide-react and the lint toolchain; `npm audit --omit=dev` → 0 advisories.
- Below-the-fold sections use `content-visibility: auto`; anchor navigation to `#enquire` re-verified at 1440 and 375.

### What is still short, and why
| Item | Measured | Cause | Not fixed because |
|---|---|---|---|
| Lab LCP on image-led pages | 3.5–3.8 s (bar 2.5 s) | Lighthouse's Lantern model includes every script that finished before the observed LCP (≈ 167 KB gz: React-DOM 74 KB, Next client 50 KB, ours ≈ 25 KB) and scales CPU ×4 on a 1.6 Mbps link; image itself is 17 KB and arrives in 24 ms locally. With **real DevTools throttling** the same page measures FCP 2.2 s / **LCP 2.3–2.4 s** (home) and 2.5 s (dossier). | The remaining cost is framework hydration; removing it means leaving React/Next or the App Router. I tried: font preload off (no change), preload tuning, hero q60, deferring the statement section, listing preload (+LCP for text → image). Only a text-led mobile hero would hit the bar by *changing what Lighthouse sees as LCP*, which I judged to be gaming the metric and worse design. |
| Home mobile TBT 386 ms (bar: INP < 200 ms proxy) | hydration of ≈ 15 `Reveal` + header/consent/form islands under 4× CPU | framework + islands | acceptable on real devices; field INP unmeasured |
| Mobile Lighthouse A11y 97 | 4 `color-contrast` hits on the first four footer "Plots" links | **Evaluation artefact:** in an un-scrolled mobile page axe resolves those links' background through the fixed header (`#F7F3EC`) instead of the footer (`#14120F`). Scrolled to the footer, axe reports **0** (`axe3c`). Real contrast is ≥ 9 : 1 (`#C7BEAD` on night). | cosmetic; documented, not hidden |

## Accessibility

### axe-core (4.x, wcag2a/aa + best-practice rules)
**0 violations on 30 / 30 runs** — 14 routes × (1440, 375) with consent stored, plus `/` and a dossier at 1440 with the consent bar visible and the masterplan view. (V1: `serious ×3` — nested-interactive in the map, contrast ×2 — and 61 small targets.) First run found 3 serious contrast violations on the dark footer slots (2.0 : 1) and one `heading-order` on the plan panel — both fixed (iterations 1 and 3).

### Contrast (DESIGN.md §2, measured)
Computed from the tokens: ink on canvas 15.5 : 1 · ink-3 on canvas 7.0 : 1 · on-night-2 on night 10.1 : 1 · footer links (`#C7BEAD` on `#14120F`) ≥ 9 : 1 · brass is never used as text on light. Primary button text (paper on clay) 6.6 : 1 · clay on canvas 6.2 : 1 · brass-soft on night 10.4 : 1 · on-night on night 15.2 : 1.

### Keyboard & motion
| Check | Result |
|---|---|
| Tab walk of `/` (≤ 150 presses) | 49 stops, every one with a ≥ 2-px focus indicator (card links show the ring on the whole card via `:has`), reaches the footer cookie button, no trap |
| Skip link | visible on first Tab, 44 px, moves focus to `#main` |
| Menu / lightbox / preferences | native `<dialog>`: focus moves in, background inert, Esc closes, focus returns to the opener |
| Listing filters | change a select by keyboard → auto-submit; works without JS (Apply button; `<noscript>` keeps panel open) |
| Checklist | native checkboxes, Space toggles, status `aria-live` |
| `prefers-reduced-motion` | 0 elements at opacity 0; no reveal hiding; nothing auto-moves in any case |
| Consent bar | never covers content (`--consent-h` padding) or focused elements (`scroll-padding-bottom`) |
| Targets | all interactive controls ≥ 44 px at 375 except inline text links and stretched card links (their hit area is the whole card) |
| Not possible here | NVDA / JAWS / VoiceOver, real iOS/Android, field INP |
