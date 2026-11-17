# 05 — Responsive Design & Cross-Device Review

**Audit Date:** November 17, 2026  
**Auditor:** Luxury UI/UX Director & QA Test Engineer  
**Tested Viewports:**
- **Desktop:** 1440 × 900 px (Standard high-res desktop)
- **Tablet:** 768 × 1024 px (iPad portrait)
- **Mobile:** 375 × 667 px (iPhone SE / compact mobile standard)

---

## 1. Breakpoint-by-Breakpoint Analysis

### A. Desktop Viewport (1440px)
- **Overall Quality:** Clean, balanced, and visually spacious. Max-width constraints (`max-w-7xl`, `max-w-6xl`) effectively prevent text lines from extending beyond comfortable reading measures.
- **Visual Balance:** Earth tones (`#F6F1E7`) and editorial Cormorant Garamond typography present an authentic quiet luxury atmosphere.
- **Deficiencies:**
  - The hero vista switcher tabs look like generic pill buttons floating at the bottom rather than an architectural element.
  - The masterplan SVG map appears flat and schematic compared to the rich photographic realism of the surrounding sections.
- **Reference Screenshots:**
  - Homepage: `screenshots/home-1440.png`
  - Projects Listing: `screenshots/projects-1440.png`
  - Project Detail: `screenshots/project-aranya-1440.png`
  - Future Homes: `screenshots/future-homes-1440.png`
  - Contact: `screenshots/contact-1440.png`

---

### B. Tablet Viewport (768px)
- **Overall Quality:** Functional adaptation. Grid systems collapse from 3-column to 2-column smoothly.
- **Deficiencies:**
  - **Masterplan Map Squeeze:** The SVG plot map is compressed horizontally, rendering parcel dimensions and orientation labels difficult to read without zooming.
  - **Card Height Mismatches:** In `FeaturedPlotsSection.tsx`, plot cards with varying description lengths produce uneven card heights, disrupting the grid baseline.
  - **Header Transition:** At 768px, the navigation links switch to a compact row that crowds against the brand logo on intermediate tablet widths (768px–900px).
- **Reference Screenshots:**
  - Homepage: `screenshots/home-768.png`
  - Projects Listing: `screenshots/projects-768.png`
  - About: `screenshots/about-768.png`

---

### C. Mobile Viewport (375px) — Critical Findings
Mobile is where the V1 implementation suffers its most severe UX, accessibility, and performance regressions:

```
+-------------------------------------------------------------------------------+
| CRITICAL MOBILE VIEWPORT DEFECTS (375px)                                      |
+-------------------------------------------------------------------------------+
| 1. COOKIE CONSENT BANNER VIEWPORT HIJACKING                                   |
|    - Occupies 35% of vertical screen height.                                  |
|    - Directly overlaps contact enquiry form submission buttons and            |
|      plot interest selectors.                                                 |
|    - Evidence: screenshots/home-375.png & contact-375.png                     |
|                                                                               |
| 2. UNUSABLE MASTERPLAN MAP                                                    |
|    - Shrunk to 340px width with no pan, zoom, or centering controls.          |
|    - Parcel polygon touch targets are under 20px wide (WCAG requires >= 48px).|
|    - Plot numbers and compass markings are completely illegible.              |
|                                                                               |
| 3. HERO PERFORMANCE DRAG                                                      |
|    - Mobile LCP collapses to 6.0 seconds.                                     |
|    - Parallax event listeners cause touch scroll stuttering and frame drops.  |
|                                                                               |
| 4. EXTENSIVE FOOTER SCROLL FATIGUE                                            |
|    - 16 links rendered in stacked vertical lists without accordions,          |
|      adding over 700px of scrolling distance to reach bottom legal notes.     |
+-------------------------------------------------------------------------------+
```

- **Reference Screenshots:**
  - Homepage: `screenshots/home-375.png`
  - Projects: `screenshots/projects-375.png`
  - Contact Form Viewport Collision: `screenshots/contact-375.png`
  - Due Diligence Checklist: `screenshots/guide-checklist-375.png`
  - 404 Error: `screenshots/404-375.png`

---

## 2. Touch Target Size Compliance Audit (WCAG 2.5.5 / 2.5.8)

| Interactive Element | Measured Mobile Target Size | Required Minimum | Compliance Status | Corrective Action for V2 |
|---|---|---|---|---|
| Hamburger Menu Button | 40 × 40 px | 48 × 48 px | **FAIL** | Add `p-2` or `min-h-[48px] min-w-[48px]` touch padding. |
| Vista Carousel Prev/Next Chevrons | 36 × 36 px | 48 × 48 px | **FAIL** | Expand bounding box to 48px with transparent touch bleed. |
| SVG Plot Polygons (Masterplan) | ~18 × 24 px | 48 × 48 px | **FAIL** | Implement mobile bottom-sheet parcel selector with list fallback. |
| Primary CTAs ("Explore Available Plots") | 48 × 48 px | 48 × 48 px | **PASS** | Meets touch target guidelines. |
| Mobile Navigation Links (Drawer) | 48 × 44 px | 48 × 48 px | **PASS** | Generous vertical padding applied. |
| Form Input Fields | 44 × 44 px | 48 × 48 px | **PARTIAL** | Increase height to `h-12` (48px) to prevent iOS auto-zoom. |

---

## 3. Horizontal Overflow & Layout Integrity

- **Horizontal Scroll Check (`overflow-x`):**  
  Tested on all 15 routes at 1440px, 768px, and 375px.  
  **Result:** `document.documentElement.scrollWidth === window.innerWidth` across all pages. **Zero horizontal layout leakage detected.**
- **Safe Area Insets:**  
  Missing `viewport-fit=cover` and CSS `env(safe-area-inset-bottom)` padding on the floating cookie banner and mobile sticky elements, which risks clipping on iPhone home indicators.
