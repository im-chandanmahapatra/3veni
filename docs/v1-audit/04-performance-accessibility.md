# 04 — Performance & Accessibility Audit

**Audit Date:** November 17, 2026  
**Auditor Panel:** Principal QA Engineer & Senior Accessibility Specialist  
**Test Harness:** Google Lighthouse v12.4+ (Chromium Headless Production Run), axe-core Accessibility Engine, Chrome DevTools Performance Profiler.  
**Tested Host:** `http://localhost:5174` (Production Next.js Server)

---

## 1. Master Lighthouse Audit Scorecard

All scores are extracted directly from production builds with active compression and asset bundling:

| Page Tested | Device Viewport | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Total Transfer Weight |
|---|---|---|---|---|---|---|---|---|---|---|
| **Home (`/`)** | **Mobile (Moto G4 / 375px)** | **55** 🔴 | **97** 🟢 | **96** 🟢 | **100** 🟢 | 2.4s | **6.0s** 🔴 | **830ms** 🔴 | 0.00 🟢 | 861 KiB |
| **Home (`/`)** | **Desktop (1440px)** | **78** 🟡 | **97** 🟢 | **96** 🟢 | **100** 🟢 | 0.8s | 1.3s 🟢 | 340ms 🟡 | 0.00 🟢 | 1,732 KiB |
| **Projects (`/projects`)** | **Mobile (375px)** | **99** 🟢 | **99** 🟢 | **96** 🟢 | **100** 🟢 | 0.9s | 1.1s 🟢 | 100ms 🟢 | 0.00 🟢 | 1,226 KiB |
| **Projects (`/projects`)** | **Desktop (1440px)** | **99** 🟢 | **99** 🟢 | **96** 🟢 | **100** 🟢 | 0.6s | 0.9s 🟢 | 0ms 🟢 | 0.00 🟢 | 1,906 KiB |
| **Project Detail (`/projects/aranya...`)** | **Mobile (375px)** | **79** 🟡 | **100** 🟢 | **96** 🟢 | **100** 🟢 | 1.8s | **4.7s** 🔴 | 240ms 🟢 | 0.00 🟢 | 1,422 KiB |
| **Project Detail (`/projects/aranya...`)** | **Desktop (1440px)** | **99** 🟢 | **100** 🟢 | **96** 🟢 | **100** 🟢 | 0.6s | 0.9s 🟢 | 10ms 🟢 | 0.00 🟢 | 1,853 KiB |

---

## 2. Core Web Vitals Diagnostic: Why Mobile Home Collapsed to 55

While inner routes (`/projects`, `/future-homes`) demonstrate top-tier performance, the flagship landing page crashes into red on mobile devices due to three specific architectural bottlenecks:

```
+-------------------------------------------------------------------------------+
| HOME MOBILE CORE BOTTLENECK ANALYSIS                                          |
+-------------------------------------------------------------------------------+
| 1. LCP (Largest Contentful Paint): 6.0 SECONDS (Good <= 2.5s)                 |
|    - Hero vista background element evaluates as LCP candidate.                 |
|    - 3 simultaneous high-resolution landscape images are loaded eagerly       |
|      in the hero vista carousel DOM before user interaction.                  |
|    - Overlapping SVG scrim gradients delay image rasterization.                |
|                                                                               |
| 2. TBT (Total Blocking Time): 830 MILLISECONDS (Good <= 200ms)                |
|    - Continuous GSAP & Framer Motion scroll and pointer event listeners       |
|      monopolize the mobile CPU main thread.                                   |
|    - Simultaneous backdrop-filter blur calculations on fixed headers and      |
|      floating banners trigger costly GPU compositing recalcs.                 |
+-------------------------------------------------------------------------------+
```

### Specific Technical Triggers in Code:
1. `components/sections/HeroSection.tsx`: All background vista images are rendered into the DOM simultaneously without `priority={false}` or responsive mobile viewport image sizing.
2. `components/layout/Navbar.tsx` & `components/modals/CookieConsent.tsx`: Multiple simultaneous CSS `backdrop-filter: blur(12px)` overlays create severe paint invalidate loops during mobile touch scrolling.

---

## 3. Web Accessibility (WCAG 2.1 AA) Audit

The platform achieves strong headline scores (97–100) due to clean HTML5 landmark structures and a functional skip link (`#main-content`), but deep testing identified critical accessibility deficiencies:

### A. Color Contrast Failures
- **Warm Beige Background (`#F6F1E7`) vs. Muted Captions:**  
  Secondary metadata labels, plot status captions, and orientation badges use `#8C8275` and `#98400F` at font sizes under 13px. These produce contrast ratios between **3.8:1 and 4.2:1**, failing the WCAG AA minimum requirement of **4.5:1** for regular body text.
- **Hero Landscape Sub-captions:**  
  White typography overlaid on dynamic landscape photographs without an opaque scrim drops below 3:1 contrast when viewing bright cloud vistas.

### B. Keyboard Navigation & Focus Indicators
- **Skip Link:** Working correctly. Pressing `Tab` immediately focuses "Skip to main content" and jumps to `<main id="main-content">`.
- **Focus Rings:** Most buttons provide native or Tailwind `focus:ring-2` outlines. However, the custom radio selector cards in `EnquiryForm.tsx` and the plot cards in `FeaturedPlotsSection.tsx` lack high-contrast visible focus indicators for keyboard-only users.
- **Interactive SVG Masterplan Focus Trap:** The plot polygons inside `components/property/InteractivePlotMap.tsx` cannot be reached or focused via keyboard `Tab` navigation. There are no `tabindex="0"`, `role="button"`, or `aria-label` attributes on individual parcel paths.

### C. Screen Reader & ARIA Deficiencies
- **Hero Vista Switcher:** In `HeroSection.tsx`, 10 elements declare `role="tab"` without an encompassing `role="tablist"` container and without `aria-controls` bindings to the active slides.
- **Checklist Guide:** In `app/guides/land-buying-checklist/page.tsx`, verification steps are rendered as static text. Screen reader users cannot discern that this is meant to be an actionable checklist.

---

## 4. Asset Weight & Network Payload Breakdown

| Resource Category | Desktop Transfer Size | Mobile Transfer Size | Optimization Opportunity |
|---|---|---|---|
| **Images (WebP)** | 1,380 KiB | 590 KiB | Implement next-gen AVIF encoding and responsive `sizes` to save ~35% transfer weight. |
| **JavaScript Chunks** | 295 KiB | 215 KiB | Dynamic code splitting on heavy client components (Interactive Map, Motion carousels). |
| **Fonts (WOFF2)** | 42 KiB | 42 KiB | Cormorant Garamond, Manrope, JetBrains Mono are subsetted and served locally via `next/font`. |
| **CSS (Tailwind v4)** | 15 KiB | 14 KiB | Efficiently compiled utility classes. |
| **Total Transfer** | **1,732 KiB** | **861 KiB** | Mobile budget should be targeted under 450 KiB for luxury real estate. |
