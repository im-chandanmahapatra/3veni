# 01 — Section-by-Section Audit & Scorecard

**Audit Date:** November 17, 2026  
**Auditor Panel:** Luxury UI/UX Director, Principal QA Engineer, Lead Technical SEO Architect  
**Evaluation Standard:** Sotheby's International Realty, Knight Frank, Compass, The Agency  
**Scoring Rule:** Ruthless Integer Scoring (1–10). Automatic caps applied for broken functionality (max 4), templated aesthetic (max 6), mobile breakage (max 5), and dimension spread cap.

---

## 1. Navbar & Header

- **Visual Design:** 7/10
- **UX & Interaction:** 6/10
- **Responsive Design:** 7/10
- **Functionality:** 8/10
- **Accessibility:** 8/10
- **SEO:** 8/10
- **Overall Section Score:** 7/10

### What's Wrong
- **Absence of Bespoke Luxury Elevation:** The navigation uses a standard horizontal flex layout with generic sans-serif links (`components/layout/Navbar.tsx:88-105`). It lacks high-end micro-interactions (e.g., editorial underline draws, smooth indicator bars, or luxury concierge contact triggers seen on Aman or Sotheby's Private Residences).
- **Missing Direct Concierge CTA:** In luxury real estate, high-net-worth buyers expect direct phone/WhatsApp private client access in the header. The header only contains a generic "Inquire" button navigating to `#contact`.
- **Contrast Margin on Muted State:** Prior to scrolling, the navigation text on top of certain photographic vista backdrops sits close to the 4.5:1 WCAG AA boundary depending on image luminance.

### What's Acceptable
- Sticky glassmorphism header transitions reliably (`backdrop-blur-md` activated when scroll exceeds 50px).
- Clean brand mark with bilingual/devanagari typography integration.
- Navigation links correctly route to all main landing points (`/`, `/about`, `/projects`, `/guides/land-buying-checklist`, `/future-homes`, `/contact`).

### What V2 Must Do
- Add an elevated concierge quick-dial / WhatsApp link with bespoke luxury gold badge.
- Implement an editorial mega-menu or flyout overlay for property parcels with live parcel availability indicators.
- Refine hover states with elegant serif italic accents or bespoke gold hairline borders.

### Screenshots
- Desktop 1440px: `screenshots/home-1440.png`
- Tablet 768px: `screenshots/home-768.png`
- Mobile 375px: `screenshots/home-375.png`

---

## 2. Hero Section

- **Visual Design:** 7/10
- **UX & Interaction:** 4/10
- **Responsive Design:** 4/10
- **Functionality:** 4/10
- **Accessibility:** 6/10
- **SEO:** 8/10
- **Overall Section Score:** 4/10  
*(Score capped at 4 due to broken vista tab interactive selection state, mobile LCP degradation to 6.0s, and TBT of 830ms).*

### What's Wrong
- **Broken Tab Switcher Selection State:** In `components/sections/HeroSection.tsx:142-168`, clicking Tab 2 ("Valley Sanctuary") fails to update `aria-selected` to `"true"` in automated headless testing. Ten separate tab elements share ambiguous roles without a properly bound `role="tablist"`.
- **Catastrophic Mobile Performance Impact:** The hero section is the single largest contributor to the Mobile Lighthouse Performance score collapsing to **55/100** (LCP: 6.0s, TBT: 830ms). It loads multiple high-resolution backdrop vistas, three simultaneous SVG scrim gradients, and persistent GSAP/Framer Motion parallax event listeners that throttle the main thread on mobile CPUs.
- **Abrupt Anchor Scroll:** Clicking the primary CTA "Explore Available Plots" jumps to `#plots` without accounting for the fixed header height, momentarily clipping the section title.

### What's Acceptable
- Compelling editorial copy: *"Quiet Earth. Enduring Architecture."* captures a sophisticated land stewardship tone.
- High-resolution landscape photography provides an evocative sense of place.
- Single semantic `<h1>` tag properly exposed for search crawlers.

### What V2 Must Do
- Completely refactor the hero carousel for mobile: lazy-load non-active vista images, disable continuous parallax listeners on mobile viewports, and eliminate duplicate gradient draw passes.
- Fix the tab selection state and ARIA bindings to comply with WAI-ARIA Tabs pattern.
- Implement smooth CSS scroll-margin-top on all anchor targets (`#plots`, `#contact`).

### Screenshots
- Desktop 1440px: `screenshots/home-1440.png`
- Mobile 375px: `screenshots/home-375.png`

---

## 3. Brand Intro & Stewardship Philosophy

- **Visual Design:** 7/10
- **UX & Interaction:** 7/10
- **Responsive Design:** 7/10
- **Functionality:** 8/10
- **Accessibility:** 8/10
- **SEO:** 8/10
- **Overall Section Score:** 7/10

### What's Wrong
- **Static Editorial Flow:** The section reads as flat editorial text without interactive discovery elements (e.g., interactive timeline of ecological conservation, soil study samples, or before/after aerial reforestation sliders).
- **Typography Sizing Inconsistencies:** The quote in `Cormorant Garamond` drops down abruptly in font-size on mobile, losing its visual grandeur.

### What's Acceptable
- Tasteful warm earth palette (`#F6F1E7` background with `#24221E` deep charcoal body text).
- Clear, respectful articulation of land stewardship vs. commercial overdevelopment.
- High contrast and fully accessible reading hierarchy.

### What V2 Must Do
- Introduce an interactive "Philosophy in Practice" slider showcasing physical stewardship milestones (water table retention, indigenous flora conservation, natural stone grading).
- Add subtle scroll-driven parallax typography elevation.

### Screenshots
- Desktop 1440px: `screenshots/home-1440.png`
- Tablet 768px: `screenshots/home-768.png`

---

## 4. Interactive Masterplan Map & Featured Plots

- **Visual Design:** 6/10
- **UX & Interaction:** 4/10
- **Responsive Design:** 4/10
- **Functionality:** 4/10
- **Accessibility:** 5/10
- **SEO:** 7/10
- **Overall Section Score:** 4/10  
*(Score capped at 4 due to polygon interaction failure, illegible mobile scaling, and complete absence on `/projects`).*

### What's Wrong
- **Interactive SVG Polygon Interaction Failure:** In `components/property/InteractivePlotMap.tsx`, SVG polygon elements representing individual land parcels failed to register click events in headless tests due to stacking context overlays and unlinked IDs (`data-testid="plot-poly-*"` not selectable).
- **Unusable on Mobile (375px):** The entire SVG masterplan is shrunk to fit 375px width without pinch-to-zoom, pan controls, or coordinate centering. Plot numbers and boundary pins become microscopic and untappable.
- **Missing from Main Projects Directory:** While present on the homepage under `#plots`, the masterplan map is completely omitted from the dedicated `/projects` route (`app/projects/page.tsx`), leaving buyers with only a standard card grid.
- **Basic 2D CAD Aesthetic:** The map looks like a basic technical schematic rather than a luxury architectural site plan. It lacks elevation contour lines, seasonal sun paths, tree canopy density, and road access rendering.

### What's Acceptable
- Property listing cards below the map display key metrics (Plot area in Sq. Ft. / Sq. Yds, elevation, orientation, and price guide).
- Clear status badges ("Available", "Reserved", "Under Advisory").

### What V2 Must Do
- Replace the static SVG wrapper with a high-performance vector/canvas interactive map (e.g., Mapbox GL or custom Panzoom SVG) featuring touch gestures, zoom-in parcel inspection, and elevation cross-sections.
- Embed the interactive masterplan on both the homepage and `/projects`.
- Add an accessible table-view alternative with keyboard navigation and ARIA attributes for screen readers.

### Screenshots
- Desktop 1440px: `screenshots/home-1440.png`
- Projects Page Desktop: `screenshots/projects-1440.png`
- Mobile 375px: `screenshots/home-375.png`

---

## 5. About / Leadership / Storytelling

- **Visual Design:** 7/10
- **UX & Interaction:** 7/10
- **Responsive Design:** 7/10
- **Functionality:** 8/10
- **Accessibility:** 8/10
- **SEO:** 8/10
- **Overall Section Score:** 7/10

### What's Wrong
- **Templated Executive Grid:** The leadership bios on `/about` (`app/about/page.tsx:112-164`) adhere to a standard corporate agency 3-column card pattern. For ultra-luxury real estate, leadership sections require signature editorial profiles, published thought-leadership references, and personal advisory direct contacts.
- **Missing Video / Voice Editorial:** No founder statement video or audio narrative on the heritage of the region.

### What's Acceptable
- Clear and professional imagery with appropriate `alt` attributes.
- Cohesive typography and strong grounding in regional architectural tradition.
- Clean semantic markup with proper `<h2>` and `<h3>` tags.

### What V2 Must Do
- Redesign the founders' section into an editorial monograph layout featuring pull-quotes, signed stewardship commitments, and video interviews.
- Add accreditation details (RERA numbers, bar associations, council memberships).

### Screenshots
- About Page 1440px: `screenshots/about-1440.png`
- About Page 375px: `screenshots/about-375.png`

---

## 6. Location & Terrain Study

- **Visual Design:** 6/10
- **UX & Interaction:** 6/10
- **Responsive Design:** 7/10
- **Functionality:** 8/10
- **Accessibility:** 8/10
- **SEO:** 7/10
- **Overall Section Score:** 6/10  
*(Score capped at 6: looks templated and generic).*

### What's Wrong
- **Static Distance Metric Grid:** The section relies on static cards stating distance (e.g., "45 mins from International Airport"). It lacks an interactive map, live traffic toggles, or topographic elevation profiles.
- **No Satellite or Drone Media:** Luxury land buyers require high-altitude drone footage, topographic contour overlays, and view corridor simulations.
- **Missing Schema GeoCoordinates:** The location metadata in the DOM lacks Schema.org `GeoCoordinates` or `Place` bounding coordinates.

### What's Acceptable
- Clean 3-column responsive card layout that collapses cleanly on tablet and mobile.
- Legible typography and clear distance markers.

### What V2 Must Do
- Embed an interactive satellite map layer showing arterial connectivity, private helipad proximity, upcoming infrastructure corridors, and eco-sensitive buffer zones.
- Add downloadable high-resolution Topographic Survey PDFs.

### Screenshots
- Desktop 1440px: `screenshots/home-1440.png`
- Mobile 375px: `screenshots/home-375.png`

---

## 7. Architectural Concepts (Future Homes)

- **Visual Design:** 7/10
- **UX & Interaction:** 6/10
- **Responsive Design:** 7/10
- **Functionality:** 7/10
- **Accessibility:** 8/10
- **SEO:** 8/10
- **Overall Section Score:** 7/10

### What's Wrong
- **Static Concept Renderings:** Located at `/future-homes`, the residential concepts (Laterite Villa, Timber Pavilion) are presented as static single-image cards. There are no interactive floor plan toggles, material swatch selectors, or 3D exterior/interior orbital viewers.
- **Disconnected from Plot Selection:** No clear UX mechanism linking an architectural typology directly to compatible land parcels (e.g., "Build this Laterite Villa on Plot 04").

### What's Acceptable
- Striking architectural visualization demonstrating climate-responsive design.
- Clear technical specifications (built-up area, courtyards, natural ventilation index).
- Fast page load on desktop (Lighthouse Performance 99).

### What V2 Must Do
- Build an interactive "Parcel + Residence Configurator" allowing buyers to pair land parcels with architectural typologies.
- Provide downloadable architectural lookbooks and high-resolution CAD schematics behind an advisory gate.

### Screenshots
- Future Homes 1440px: `screenshots/future-homes-1440.png`
- Future Homes 375px: `screenshots/future-homes-375.png`

---

## 8. Why Choose Us / Value Proposition

- **Visual Design:** 6/10
- **UX & Interaction:** 6/10
- **Responsive Design:** 7/10
- **Functionality:** 8/10
- **Accessibility:** 8/10
- **SEO:** 7/10
- **Overall Section Score:** 6/10  
*(Score capped at 6: looks templated and generic).*

### What's Wrong
- **Generic 3-Box Corporate Layout:** The layout uses standard icon-plus-heading cards that resemble generic SaaS marketing rather than an exclusive private land acquisition service.
- **Stock Advisory Badges:** Icons lack bespoke luxury illustration craft.

### What's Acceptable
- Clear messaging emphasizing legal title sanctity, clear boundary demarcation, and ecological covenants.
- Strong text readability and contrast.

### What V2 Must Do
- Replace generic card grids with an editorial asymmetric layout combining high-resolution material textures (laterite stone, beaten brass, hand-pressed terracotta) with narrative case studies.

### Screenshots
- Desktop 1440px: `screenshots/home-1440.png`

---

## 9. Buyer Due-Diligence Checklist

- **Visual Design:** 6/10
- **UX & Interaction:** 2/10
- **Responsive Design:** 6/10
- **Functionality:** 2/10
- **Accessibility:** 6/10
- **SEO:** 8/10
- **Overall Section Score:** 3/10  
*(Score capped at 3: complete functional failure of advertised interactive utility; overall score cannot exceed lowest dimension + 2).*

### What's Wrong
- **Zero Interactive Checkboxes:** Advertised in the navigation and hero as the "Land Buying Checklist" (`app/guides/land-buying-checklist/page.tsx`), the page contains **0 interactive checkbox elements** (`button[role="checkbox"] count: 0`). It is entirely static prose and bullet points.
- **Deceptive UX:** Users expect a functional due diligence tool where they can check off legal verifications (7/12 extract, encumbrance certificate, demarcation pillars), track completion percentages, and export a personalized verification dossier.
- **No Progress Persistence or PDF Export:** No local storage persistence and no printable/downloadable legal packet.

### What's Acceptable
- Comprehensive legal and technical due-diligence content that demonstrates profound domain knowledge.
- Excellent SEO copy that ranks for land acquisition keywords.

### What V2 Must Do
- Rebuild as a fully interactive legal due diligence application with persistent state, progress bars, legal document upload placeholders, and one-click PDF audit export.

### Screenshots
- Guide Checklist 1440px: `screenshots/guide-checklist-1440.png`
- Guide Checklist 375px: `screenshots/guide-checklist-375.png`

---

## 10. Contact & Advisory Enquiry Form

- **Visual Design:** 7/10
- **UX & Interaction:** 4/10
- **Responsive Design:** 4/10
- **Functionality:** 4/10
- **Accessibility:** 6/10
- **SEO:** 8/10
- **Overall Section Score:** 4/10  
*(Score capped at 4 due to mobile viewport collision, missing empty validation blocks, and technical fallback error status).*

### What's Wrong
- **Mobile Viewport Collision:** On mobile devices (375px), the sticky bottom Cookie Consent banner overlaps the form submit button and lower input fields, preventing smooth user interaction until dismissed.
- **Missing Client-Side Required Field Validation:** Submitting an empty form did not display visible error callouts on individual fields in automated testing (`components/forms/EnquiryForm.tsx`).
- **503 Technical Fallback Presentation:** Submitting without active SMTP credentials returns HTTP 503 and exposes a direct copyable fallback container that looks like a technical server failure rather than a seamless luxury concierge experience.

### What's Acceptable
- Elegant form styling with custom radio pills for preferred plot parcel selection.
- Clear disclosure of privacy policy and data stewardship.

### What V2 Must Do
- Implement client-side Zod validation with real-time accessible inline error indicators.
- Redesign the fallback state to present an immediate VIP concierge phone number, WhatsApp button, and dedicated advisory email link.
- Ensure all forms automatically calculate viewport padding above sticky banners.

### Screenshots
- Contact Page 1440px: `screenshots/contact-1440.png`
- Contact Page 375px: `screenshots/contact-375.png`

---

## 11. Footer & Brand Replay

- **Visual Design:** 7/10
- **UX & Interaction:** 7/10
- **Responsive Design:** 7/10
- **Functionality:** 8/10
- **Accessibility:** 8/10
- **SEO:** 9/10
- **Overall Section Score:** 7/10

### What's Wrong
- **Dense Link Grouping on Mobile:** The footer lists 16 links in multiple columns. On mobile viewports, this creates an excessively long scroll without collapsible accordion headers.
- **Generic Social Links:** Social media icons link to generic profile roots rather than verified branded channels.

### What's Acceptable
- Rich internal linking structure benefiting site-wide crawl equity.
- Complete regulatory and legal disclaimers clearly visible.
- Excellent color contrast with deep charcoal background and muted gold text.

### What V2 Must Do
- Implement collapsible accordions for footer link groups on mobile viewports.
- Add formal RERA registration certificate badges and digital signatures.

### Screenshots
- Desktop 1440px: `screenshots/home-1440.png`
- Mobile 375px: `screenshots/home-375.png`

---

## 12. Consent & Privacy Modals

- **Visual Design:** 6/10
- **UX & Interaction:** 4/10
- **Responsive Design:** 4/10
- **Functionality:** 8/10
- **Accessibility:** 7/10
- **SEO:** 8/10
- **Overall Section Score:** 5/10  
*(Score capped at 5 due to mobile screen disruption).*

### What's Wrong
- **Excessive Mobile Viewport Footprint:** The cookie consent banner (`components/modals/CookieConsent.tsx`) occupies over 35% of the vertical screen height on 375px screens, obstructing critical hero CTAs and form submit buttons.
- **Lack of Granular Cookie Controls:** Offers only basic Accept / Reject without granular category toggles (Analytics, Marketing, Preferences).

### What's Acceptable
- Functional persistence in `localStorage`.
- Direct links to dedicated Cookie Policy, Privacy Policy, and Terms pages.

### What V2 Must Do
- Redesign as a compact floating luxury badge with an expandable modal for detailed preference management.
- Prevent the banner from obscuring fixed action bars on mobile.

### Screenshots
- Mobile 375px: `screenshots/home-375.png`
- Cookie Policy 1440px: `screenshots/cookies-1440.png`
