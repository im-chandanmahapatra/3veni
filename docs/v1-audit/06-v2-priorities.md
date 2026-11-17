# 06 — Version 2 Priority Roadmap & Action Plan

**Audit Reference:** 3VENI SPHERE V1 Baseline Audit  
**Target:** Transform V1 from a "noticeably mediocre" prototype into an undisputed **top-tier luxury real estate benchmark** (competing with Sotheby's International Realty, Knight Frank, Compass, and Aman Private Residences).

---

## 1. Prioritization Matrix

```
IMPACT
  ▲
  │   [P0: Mobile Perf]    [P0: Interactive Map]
  │   [P0: Favicon 404]    [P0: Checklist UX]
  │   [P1: RealEstate Schema] [P1: Zod Validation]
  │
  │   [P1: Touch Targets]  [P1: Luxury Micro-interactions]
  │   [P2: Terrain Maps]   [P2: Villa Configurator]
  │
  │   [P2: Footer Accordion] [P3: Twilight Mode]
  │   [P2: Alt Text Fix]     [P3: PDF Surveys]
  └──────────────────────────────────────────────► EFFORT
```

---

## 2. Ranked Action Items

### 🔴 P0 — Critical (Must Fix Before Any Public Launch)

#### P0-1: Resolve Missing Favicon (HTTP 404)
- **Problem:** Every single page view generates a `GET /favicon.ico 404 Not Found` in the browser console.
- **Root Cause:** Next.js metadata points to a physical `favicon.ico` that does not exist in `/public`.
- **V2 Action:** Place a high-resolution branded multi-size `.ico` in `/public/favicon.ico` and configure `app/icon.svg` + `app/apple-icon.png` for complete cross-platform iconography.
- **Estimated Effort:** 15 minutes.

#### P0-2: Overhaul Mobile Flagship Performance (Cut LCP from 6.0s to <1.8s)
- **Problem:** Mobile Lighthouse score on Home is **55/100** with 6.0s LCP and 830ms TBT.
- **Root Cause:** Loading 3 heavy landscape background images eagerly, running heavy CSS blur filters (`backdrop-blur-md`), and binding active GSAP/Framer Motion mouse/scroll listeners on mobile devices.
- **V2 Action:**
  1. Eagerly load only the initial active vista image; set `priority={false}` and `loading="lazy"` on subsequent slides.
  2. Disable GSAP pointer-tracking and parallax listeners on viewports `< 768px`.
  3. Replace dynamic multi-layer SVG scrims with pre-computed CSS linear gradients.
- **Estimated Effort:** 4 hours.

#### P0-3: Eliminate Mobile Cookie Banner Viewport Occlusion
- **Problem:** On 375px mobile screens, the fixed cookie consent banner consumes 35% of the viewport and collides with contact submit buttons and plot interest selectors.
- **V2 Action:** Redesign the mobile banner into a compact floating badge (e.g., bottom-left circular privacy icon) that expands into a full modal only when tapped, never blocking interactive CTAs.
- **Estimated Effort:** 2 hours.

#### P0-4: Build True Interactive Due-Diligence Checklist
- **Problem:** The checklist page (`/guides/land-buying-checklist`) is 100% static prose with 0 interactive checkboxes, deceiving users who arrive looking for a functional due diligence verification tool.
- **V2 Action:**
  1. Convert all legal verification steps into interactive checkboxes (`role="checkbox"`).
  2. Implement local storage persistence so buyers retain checked items between visits.
  3. Display a live "Diligence Score" progress ring (e.g., "7/12 items verified").
  4. Provide a "Download Due Diligence Dossier" button that compiles a branded PDF checklist.
- **Estimated Effort:** 6 hours.

#### P0-5: Modernize Interactive Masterplan Map & Restore to `/projects`
- **Problem:** The SVG plot map is missing from the main `/projects` directory, fails to register polygon clicks reliably in tests, and shrinks to an illegible 340px width on mobile.
- **V2 Action:**
  1. Implement a responsive Canvas/SVG Panzoom container supporting pinch-to-zoom and touch drag on mobile.
  2. Ensure parcel polygons have direct bidirectional binding with property listing cards (clicking a polygon scrolls to and highlights the card; hovering a card illuminates the plot boundary).
  3. Embed the masterplan prominently at the top of `/projects` with filter sync.
- **Estimated Effort:** 8 hours.

---

### 🟠 P1 — High (Required for Luxury Benchmark & SEO Dominance)

#### P1-1: Implement Schema.org `RealEstateListing` & Rich Structured Data
- **Problem:** Project detail pages currently emit only generic `Place` or `Organization` schema. Google cannot parse individual parcel prices, availability, acreage, or location coordinates.
- **V2 Action:**
  1. Emit Schema.org `RealEstateListing` on all parcel detail pages with embedded `Offer` (price, priceCurrency: "INR", availability: "InStock"), `geo` (`GeoCoordinates`), and `PostalAddress`.
  2. Implement `BreadcrumbList` schema across `/projects` and `/projects/[slug]`.
  3. Add `FAQPage` schema on `/guides/land-buying-checklist` to capture accordion rich snippets in Google search results.
- **Estimated Effort:** 4 hours.

#### P1-2: Fix Hero Vista Tabs ARIA Semantics
- **Problem:** 10 duplicate `role="tab"` buttons exist without a proper `role="tablist"` wrapper; clicking Tab 2 fails to toggle `aria-selected="true"`.
- **V2 Action:** Refactor to standard WAI-ARIA tab pattern: 1 `tablist`, exactly 3 `tab` elements, active `aria-selected` synchronization, and `aria-controls` bindings.
- **Estimated Effort:** 1.5 hours.

#### P1-3: Client-Side Form Validation & Luxury VIP Fallback State
- **Problem:** Submitting an empty form does not flag required fields with accessible error callouts. Submitting without active SMTP returns a technical 503 error box that damages client trust.
- **V2 Action:**
  1. Add client-side Zod validation with instantaneous inline feedback and `aria-invalid` attributes.
  2. Replace the 503 error box with an elegant luxury concierge fallback: *"Your private inquiry has been logged. Our Senior Land Director is available immediately via Direct Private Line [+91 ...] or WhatsApp."*
- **Estimated Effort:** 3 hours.

#### P1-4: Touch Target Compliance (Enlarge to >= 48px)
- **Problem:** Mobile hamburger menu (40px) and carousel chevrons (36px) fail WCAG 2.5.5 minimum touch dimensions.
- **V2 Action:** Add transparent padding bounds ensuring all interactive mobile targets occupy at least 48 × 48 px.
- **Estimated Effort:** 1 hour.

#### P1-5: Luxury Editorial Choreography
- **Problem:** Generic sans-serif links and static 3-box corporate card grids feel like a generic SaaS template rather than a multimillion-dollar land stewardship portal.
- **V2 Action:** Introduce subtle luxury micro-interactions: smooth gold hairline dividers, Cormorant Garamond serif italic pull-quotes, and high-resolution material textures (laterite stone, beaten brass).
- **Estimated Effort:** 6 hours.

---

### 🟡 P2 — Medium (Refinements & Feature Upgrades)

#### P2-1: Interactive Terrain & Satellite Study
- Embed an interactive Mapbox satellite layer with contour line toggles, road access lines, and elevation cross-sections to replace static distance cards.

#### P2-2: Land + Villa Architectural Configurator
- Allow buyers on `/future-homes` to select an architectural typology (Laterite Villa, Timber Pavilion) and visualize it virtually placed on compatible land parcels.

#### P2-3: Mobile Collapsible Footer Accordions
- Collapse the 16 footer links into neat expandable category headers on mobile viewports to eliminate 700px of excessive scroll fatigue.

#### P2-4: Clean Up Missing Image Alt Attributes
- Supply descriptive, keyword-rich `alt` attributes to the 4 decorative/background images currently missing them on the homepage.

---

### ⚪ P3 — Low (Polish & Long-Term Enhancements)

#### P3-1: Downloadable Topographic Survey CAD/PDF Packets
- Provide downloadable PDF survey maps behind an advisory sign-in gate.

#### P3-2: Twilight / Evening Lighting Mode
- Provide a day/night toggle that shifts landscape photography and atmospheric color palette between morning mist and golden-hour sunset.
