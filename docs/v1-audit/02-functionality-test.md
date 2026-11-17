# 02 — Functionality & Interaction Test Report

**Audit Target:** 3VENI SPHERE V1 (Production Build on port 5174 & Dev on 5173)  
**Testing Methodology:** Automated Playwright/Puppeteer Headless Run, Keyboard Navigation Traversals, Viewport Stress Testing, Form Mutation Testing, Console Log Interception, and Network Proxy Capture.

---

## 1. Interactive Elements Master Test Ledger

| # | Page / Route | Section | Element Tested | Action Taken | Expected Result | Actual Result | Status | Proof / Evidence |
|---|---|---|---|---|---|---|---|---|
| 1 | `/` | Navbar | Logo Brand Anchor | Click brand text / monogram | Navigates to `/` and resets scroll to top | Navigated to `/` cleanly | **PASS** | `href="/"`, active route matched |
| 2 | `/` | Navbar | Nav link "About" | Click link | Navigates to `/about` | Navigated to `/about` (HTTP 200) | **PASS** | `href="/about"` |
| 3 | `/` | Navbar | Nav link "Projects" | Click link | Navigates to `/projects` | Navigated to `/projects` (HTTP 200) | **PASS** | `href="/projects"` |
| 4 | `/` | Navbar | Nav link "Buyer Guide" | Click link | Navigates to `/guides/land-buying-checklist` | Navigated to `/guides/land-buying-checklist` (HTTP 200) | **PASS** | `href="/guides/land-buying-checklist"` |
| 5 | `/` | Navbar | Nav link "Future Homes" | Click link | Navigates to `/future-homes` | Navigated to `/future-homes` (HTTP 200) | **PASS** | `href="/future-homes"` |
| 6 | `/` | Navbar | Nav link "Contact" | Click link | Navigates to `/contact` | Navigated to `/contact` (HTTP 200) | **PASS** | `href="/contact"` |
| 7 | `/` | Navbar | Sticky Blur Transition | Scroll page down 400px | Adds backdrop-blur and border style | Header gained `backdrop-blur-md` class | **PASS** | `header.classList.contains('backdrop-blur-md') === true` |
| 8 | `/` | Hero | Vista Switcher Tabs Count | Query `role="tab"` buttons | 3 distinct landscape vista tabs | Found 10 tab elements with ambiguous bindings | **FAIL** | 10 buttons matching `role="tab"` found |
| 9 | `/` | Hero | Vista Tab 2 Click | Click "Valley Sanctuary" tab | Updates active index, changes vista image, sets `aria-selected="true"` | `aria-selected` remained `"false"`, image transition failed to fire | **FAIL** | `aria-selected: false` after dispatch |
| 10 | `/` | Hero | Next Vista Chevron | Click next chevron button | Advances to subsequent landscape vista | Vista image index advanced | **PASS** | `button[aria-label="Next hero landscape vista"]` |
| 11 | `/` | Hero | Primary CTA ("Explore Available Plots") | Click CTA button | Smooth scrolls to `#plots` section | Jumps immediately to `#plots` with slight title clipping | **PARTIAL** | `href="#plots"`; lacks smooth scroll offset |
| 12 | `/` | Hero | Secondary CTA ("Our Stewardship Philosophy") | Click CTA button | Navigates to `/about` | Navigated to `/about` cleanly | **PASS** | `data-testid="hero-secondary-cta"` |
| 13 | `/` | Masterplan | SVG Plot Polygons | Locate & click SVG polygon parcels | Triggers active parcel card highlight & specs modal | 0 selectable polygon elements with expected test ID | **FAIL** | `Polygons matching data-testid="plot-poly-*": 0` |
| 14 | `/projects` | Filter Bar | Search Input (Zero Results) | Enter non-existent parcel query ("XYZ999") | Shows zero-results message with clear filter button | Renders empty state card with reset option | **PASS** | Empty state text present |
| 15 | `/projects` | Filter Bar | Orientation Filter Pills | Click "East" / "North" filters | Filters parcel grid to matching orientations | Correctly filters listing items | **PASS** | Grid updates dynamically |
| 16 | `/guides/land-buying-checklist` | Checklist | Interactive Checkbox Items | Click verification step checkboxes | Toggles checked state, updates progress percentage, persists to storage | 0 interactive checkboxes found; static text only | **FAIL** | `button[role="checkbox"] count: 0` |
| 17 | `/contact` | Enquiry Form | Empty Form Submission | Click "Submit Enquiry" with blank fields | Prevents submit, highlights required inputs with accessible error text | Form does not highlight empty inputs; 0 error callouts rendered | **FAIL** | `Validation elements count: 0` |
| 18 | `/contact` | Enquiry Form | Valid Form Submission | Fill valid Name, Email, Phone, Plot Interest and submit | Submits to API, shows luxury confirmation message | Returns 503 fallback state due to missing SMTP; displays technical warning container | **FAIL** | Direct fallback container rendered |
| 19 | `/` (375px) | Mobile Nav | Hamburger Menu Toggle | Tap hamburger button at 375px width | Opens full-screen slideout menu with focus lock | Slideout opened with 7 links | **PASS** | Mobile navigation links verified |
| 20 | `/` (375px) | Cookie Banner | Viewport Clearance | Inspect banner positioning against page content | Floating banner does not block interactive form buttons | Banner covers bottom 35% of viewport, collides with contact submit CTA | **FAIL** | `aside[data-testid="cookie-consent-banner"]` obstruction |
| 21 | `/` | Footer | Regulatory / Legal Links | Click Privacy, Terms, Cookie links | Navigates to respective legal pages | All 3 legal routes load with HTTP 200 | **PASS** | `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy` |
| 22 | `/` | Footer | Social Icons | Click Instagram, LinkedIn, YouTube links | Opens external profiles in new tab with secure `rel` attributes | Links navigate to generic domain roots | **PARTIAL** | Missing specific branded handle deep-links |
| 23 | `/` | Global | 404 Route Handling | Request non-existent URL `/non-existent-luxury-parcel` | Returns HTTP 404 status with branded error page and home CTA | HTTP 404 returned; branded error layout rendered | **PASS** | HTTP 404 verified via server response |

---

## 2. Console Errors & Warnings Log

During automated traversals across all 15 routes on the production build (`http://localhost:5174`), the following console messages were captured:

### Critical Errors
1. **HTTP 404 on Favicon:**
   - **URI:** `http://localhost:5174/favicon.ico`
   - **Error Message:** `Failed to load resource: the server responded with a status of 404 (Not Found)`
   - **Frequency:** Fires on **every single route load** across the application.
   - **Root Cause:** Next.js metadata references `favicon.ico`, but the physical binary is either absent in `/public` or improperly routed through `app/icon.svg`.

2. **Hydration Warning on Development Server:**
   - **Trigger:** Browser extensions injecting attributes (e.g., `cz-shortcut-listen="true"` from ColorZilla).
   - **Mitigation Status:** Suppressed via `suppressHydrationWarning` on `<body>` in `app/layout.tsx:91`.

---

## 3. Network Requests & Asset Diagnostics

- **Total Requests per Initial Load (Home Desktop):** 38 requests
- **Total Initial Page Weight:** 1,732 KiB (1.73 MB)
- **Image Payload:** 1,380 KiB (~80% of total transfer)
- **Script Payload:** 295 KiB
- **Failed Requests:**
  - `GET /favicon.ico` &rarr; `404 Not Found` (0 bytes)
- **Oversized / Unoptimized Assets Identified:**
  - Hero landscape background images are delivered at full resolution (up to 1920x1080 WebP) simultaneously on mobile viewports, contributing directly to the 6.0s mobile LCP.
  - Absence of responsive `<picture>` srcset sizing on background vistas.

---

## 4. Mobile vs. Desktop Functional Discrepancies

1. **Masterplan Interaction Collapse:**
   - *Desktop:* The SVG map can be inspected with cursor hover, displaying parcel boundary outlines.
   - *Mobile (375px):* Zoom and pan are disabled. Parcel outlines are too small to tap reliably with finger touch target (<24px width vs. WCAG minimum 48px).
2. **Cookie Banner Viewport Lockout:**
   - *Desktop:* Cookie consent bar sits unobtrusively at the bottom right.
   - *Mobile:* Fixed banner occupies over 250px vertical height on a 667px screen (37%), completely occluding the footer and contact submission buttons.
3. **Hero Carousel Main-Thread Contention:**
   - *Desktop:* Parallax transitions execute smoothly at 60fps on GPU.
   - *Mobile:* Total Blocking Time spikes to **830ms** due to simultaneous touch event listeners and CSS filter calculations.
