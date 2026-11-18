# 01 — Section-by-Section Review (V1)

Benchmark: Sotheby's International Realty, Compass, Knight Frank, The Agency. Scores are integers; caps from the brief were applied and are named where they bite. Evidence was gathered from the **production build** (Next.js 16.4.6 / Turbopack, `next start`) at 1440 / 768 / 375 px.

**Context that colours every score:** V1 is a *land-plot brochure* (5 "Sample Typology" parcels, 3 "Coming Soon" concept homes, no prices, no addresses, no agents, no reviews, no blog). Visually it is the strongest part of the project; as a real-estate *product* it is thin and — critically — its enquiry form cannot deliver a lead.

Legend for the SEO row: `n/a` where the section has no independent SEO footprint.

---

## Navbar / header
**Overall: 6/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Transparent-gradient→ivory solid on scroll, tracked small-caps wordmark, terracotta CTA (`components/navigation/Navbar.tsx:54-80`). Tasteful, but the circular emblem in a white disc (`:67`) reads like a sticker, and links are default 13px Manrope. `screenshots/home-1440-fold.png` |
| UX / Usability | 6 | 6 links + CTA, sticky (header top = 0 after 2500px scroll). "Enquire" is hidden below 640px (`hidden sm:inline-flex`, `:126`) so on a phone the primary CTA lives only inside the drawer. No phone / WhatsApp quick action in the header. |
| Responsiveness (1440/768/375) | 6 | Hamburger is 44×44 ✔. **No scroll-lock**: with the drawer open, `wheel 600` moved the page 0→600 and body `overflow: visible` (no lock code anywhere in Navbar.tsx). `screenshots/home-mobile-menu-open-375.png` |
| Functionality | 8 | All 6 links + logo + Enquire (home → `#contact`, inner → `/contact`) pass; active underline animates; drawer closes on link tap, Esc, and route change. |
| Accessibility | 8 | `aria-current`, `aria-expanded`, `aria-controls`, skip link first in tab order (191px wide, visible). Drawer lacks focus trap/return. |
| SEO | n/a | Real `<nav aria-label>` + crawlable `<a href>` ✔ |

**What's wrong:**
1. Mobile menu does not lock page scroll — background scrolls under the open drawer (`Navbar.tsx` has no `overflow` handling; tested 375px).
2. Primary CTA "Enquire" disappears < 640px (`Navbar.tsx:126`).
3. No telephone / WhatsApp / "Book a viewing" action — every luxury benchmark keeps a contact line in the header.
4. Emblem-in-white-circle (`:67`) clashes with the dark transparent state (`screenshots/home-1440-fold.png`).
5. No favicon (see Footer / SEO) — the tab shows a blank globe.

**What's acceptable:** Sticky behaviour, active-state treatment and keyboard support are solid.
**What V2 must do:** Persistent header CTA at all widths (icon button on mobile), add phone/WhatsApp, lock body scroll + trap focus in the drawer, replace the disc with a proper horizontal lock-up, add favicon set.
**Screenshots:** `screenshots/home-1440-fold.png`, `screenshots/home-navbar-scrolled-1440.png`, `screenshots/home-mobile-menu-open-375.png`

---

## Brand intro curtain
**Overall: 4/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 6 | Animated SVG emblem draw on ivory is on-brand, but at 500 ms the screen is a blank cream field with two tiny dots (`screenshots/home-intro-curtain-1440.png`). |
| UX / Usability | 3 | Every first homepage visit shows the curtain for ~3.3 s (+0.5 s start) before any content; a buyer arriving from a search result waits behind an animation. "Skip intro" exists but is small and top-right. |
| Responsiveness | 6 | Scales; skip button remains reachable. |
| Functionality | 7 | Plays once per session (`3veni:intro-played`), replayable from footer, skipped under reduced-motion (verified: curtain count 0 with `reducedMotion: reduce`). |
| Accessibility | 6 | `role="dialog"` + label, Esc skip. A modal dialog that is only decorative traps the first 3 s of screen-reader content. |
| SEO | n/a | LCP impact: Lighthouse mobile LCP 6.0 s on home (see 04). |

**What's wrong:** (1) ~3.3 s of blank screen on first visit (`BrandIntroCurtain.tsx`, test: gone after 3320 ms). (2) Delays LCP / first meaningful content on the page that most needs to convert. (3) The "Replay Brand Intro" footer link (`Footer.tsx`) is a gimmick in a footer where phone/email should be.
**What's acceptable:** Skippable, once per session, honours reduced motion.
**What V2 must do:** Cut to ≤ 1 s or remove; never block LCP content; drop the footer replay link.
**Screenshots:** `screenshots/home-intro-curtain-1440.png`

---

## Hero
**Overall: 6/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 8 | Cormorant Garamond display at `clamp(2.75rem,6.2vw,5.4rem)` with italic gold accent, Devanagari kicker, multi-stop scrims; genuinely editorial. `screenshots/home-1440-fold.png` |
| UX / Usability | 5 | **No property search** (location / type / price) — the brief's own checklist item; CTA "Explore Available Plots" lands on `#plots` correctly, but the hero says "Available" while every parcel is a "Sample Typology". Auto-rotates every 7.5 s (`HeroSection.tsx:81-85`) with no pause button (pauses on mouse hover only; touch users cannot pause). |
| Responsiveness (1440/768/375) | 6 | 375 stacks well (`home-375-fold.png`). At 768 the cookie banner covers the parcel link and prev/next arrows (`home-768-fold.png`). Hero image is a 1376×768 source stretched to a 1574×984 box (parallax scale 1.05) = visibly soft on 1440+ displays. |
| Functionality | 7 | Both CTAs, 3 vista tabs, prev/next, drag-swipe, sample-parcel link all pass. |
| Accessibility | 6 | Tabs have `role=tab`/`aria-selected`; hero tab buttons are 29px tall; auto-rotation lacks WCAG 2.2.2 pause control. |
| SEO | 7 | Exactly one `<h1>` ("Quiet Earth. Enduring Architecture."), `alt` text present, `fetchpriority=high`. H1 contains no keyword (land / plots / location). |

**What's wrong:** (1) No search bar. (2) H1 has no search intent keywords. (3) Image resolution (1376 px) upscaled — `HeroSection.tsx:186` `sizes="100vw"` with a 1376px asset. (4) Auto-rotate with no pause. (5) Imagery looks AI-generated rather than site photography (the repo also ships two stray `public/assets/aistudio/Screenshot_*.png` files, suggesting Google AI Studio origin — origin unverified); a luxury buyer will sense it. (6) Banner overlap at 768.
**What's acceptable:** Typographic hierarchy, scrim contrast over the left text column, CTA clarity.
**What V2 must do:** Real photography/drone/video ≥ 2400px; add location+type+budget search; keyword-bearing H1/sub-head; pause control; reserve space for the consent banner.
**Screenshots:** `screenshots/home-1440-fold.png`, `screenshots/home-768-fold.png`, `screenshots/home-375-fold.png`

---

## Brand intro / "We treat residential land…" statement
**Overall: 6/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 8 | Large serif statement, italic terracotta accent, generous whitespace (`home-1440-00.png` equivalent in `screenshots/home-1440.png`). |
| UX / Usability | 6 | Pure copy; three "01–03" principles with no proof (no numbers, no years, no projects delivered). |
| Responsiveness | 7 | Clean at all three widths. |
| Functionality | 8 | Two text links work. |
| Accessibility | 7 | Axe incomplete on contrast for 88 nodes (human review needed); text sizes ≥ 14px. |
| SEO | 6 | Good prose, but generic ("quiet ground", "patient architecture") — no keywords buyers search. |

**What's wrong:** Marketing abstraction with zero verifiable claims (RERA, years, acres delivered, families) — fails the "trust signals" test for a high-net-worth buyer. Hindi lines ("धरा की गरिमा · स्पष्ट स्वामित्व") are untranslated decoration.
**What V2 must do:** Replace one principle with a real proof row (stats, registrations, press), add translated captions.
**Screenshots:** `screenshots/home-1440.png`

---

## Featured plots — cards, search & filters
**Overall: 5/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Lead-wide card + 2-up grid, mono spec labels, 1px borders (`FeaturedPlotsSection.tsx:608-660`). Handsome, but identical card pattern to every template. |
| UX / Usability | 5 | Filters = 3 category chips + keyword + sort-by-size only. **No price (every card: "Shared Upon Advisory Consultation"), no location filter, no status, no bedrooms.** Filter state is `useState` only (`:415-418`) — not in the URL, lost on refresh/back. Caption reads "SHOWING 05 OF 05" via `0{n}` string-concat (`:575`) — would break at 10+. |
| Responsiveness | 7 | Chips wrap, grid collapses to 1-up; "Quick Preview" is 32px tall at 375. |
| Functionality | 7 | All 4 chips, search, sort ×2, combined filters, empty state and Reset pass (see 02). |
| Accessibility | 6 | `aria-pressed` chips, labelled search/sort, `aria-live` count ✔; search/sort have no outline (border colour only). |
| SEO | 6 | 5 `<article>` cards with real links `/projects/<slug>` ✔; content in SSR HTML ✔; but only 5 listings and no location/neighbourhood taxonomy. |

**What's wrong:** (1) No price anywhere (`data/properties.ts:70`). (2) Filter state not shareable. (3) No location/price/status filters. (4) The cards say "Sample Parcel" — the section proudly shows inventory that does not exist. (5) "View Details" and "Quick Preview" give two competing paths to the same content.
**What's acceptable:** Empty state with a Reset action works and is on-brand.
**What V2 must do:** Real inventory with price band, location, status; URL-synced filters (`?type=&min=&max=`); one card CTA; skeleton loading.
**Screenshots:** `screenshots/home-1440.png`, `screenshots/home-plots-empty-state-1440.png`, `screenshots/home-375-fold.png`

---

## Interactive plot map (SVG masterplan)
**Overall: 5/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 8 | Survey-sheet aesthetic with compass, contour lines, scale legend — distinctive. `screenshots/home-plotmap-keyboard-focus-1440.png` |
| UX / Usability | 6 | Hover/tap/Enter selects parcel, side panel updates, "Open plot dossier". It is a *schematic*, not a real site plan — no geography, no roads names, no map tiles, no "view on Google Maps". |
| Responsiveness | 5 | At 375 the labels shrink to `fontSize="8"` SVG units (`InteractivePlotMap.tsx:259`) = illegibly small; chips under the map compensate. |
| Functionality | 8 | 5 parcels with `role=button`; keyboard focus highlights; Enter opens dossier; modal Esc / backdrop / focus trap / scroll lock all pass. Focus is **not** returned to the SVG trigger after close (lands on `<body>`). |
| Accessibility | 4 | axe: `label-content-name-mismatch` (6 nodes) and `nested-interactive` (1 node, serious) on `/` and `/projects`. |
| SEO | n/a | SVG not indexable; links to parcels exist elsewhere. |

**What's wrong:** (1) Fake masterplan with no real location — high-net-worth buyers want an actual map + distances. (2) axe serious violations ×2. (3) Focus lost on modal close from SVG trigger. (4) 8-unit labels on phone.
**What V2 must do:** Real geo map (Mapbox/Google, custom-styled) with parcel polygons; fix aria-label to start with visible text; restore focus; min label size.
**Screenshots:** `screenshots/home-plotmap-hover-1440.png`, `screenshots/home-plotmap-keyboard-focus-1440.png`, `screenshots/home-project-modal-1440.png`

---

## About / Stewardship (home)
**Overall: 6/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Emblem card + landscape plate with mono caption; consistent chapter folios. |
| UX | 6 | "Our Approach / Our Vision" paragraphs; no team, no founder, no company facts. |
| Responsiveness | 7 | Stacks cleanly. |
| Functionality | 8 | No interactions needed; CTA links pass. |
| Accessibility | 7 | Fine. |
| SEO | 6 | Text in SSR HTML ✔. |

**What's wrong:** Anonymous brand — no people, no address, no registration (RERA/company) in a category where trust is the product. Chapter numbers "CHAPTER 02/03/04/05/06" repeat on inner pages (`/contact` shows "CHAPTER 06 · ADVISORY DESK", `EnquirySection.tsx:160`; `/about` shows "CHAPTER 04").
**What V2 must do:** Named leadership, office address, registration numbers, press/awards; remove chapter folios from standalone pages.
**Screenshots:** `screenshots/home-1440.png`, `screenshots/about-1440.png`, `screenshots/contact-1440.png`

---

## Location & lifestyle carousel
**Overall: 5/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Large plate + numbered thumbnails + caption (`screenshots/home-1440.png`). |
| UX | 5 | "Location" content is entirely about *mood* (Natural Surroundings, Thoughtful Accessibility) — zero distances, travel times, schools, hospitals, connectivity. |
| Responsiveness | 6 | Pagination dots 106×18 at 375. |
| Functionality | 8 | Next/prev, thumbnail jump (counter `01/03 → 02/03 → 01/03`, thumb #3 → `03/03`), keyboard arrows. Never auto-advances (so no WCAG 2.2.2 issue). |
| Accessibility | 7 | Region/tablist roles ✔. |
| SEO | 5 | Section titled "location" contains no place name. |

**What's wrong:** A real-estate "location" section with no location. Imagery appears synthetic (e.g. twilight pavilion).
**What V2 must do:** Real location data: map, drive-times, landmarks, named neighbourhood; location landing pages for SEO.
**Screenshots:** `screenshots/home-1440.png`

---

## Visual storytelling ("Architectural monograph")
**Overall: 5/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Dark charcoal band, serif headline, gold mono caption. |
| UX | 5 | Pure atmosphere; repeats the earlier philosophy messages. |
| Responsiveness | 6 | Fine. |
| Functionality | 8 | n/a. |
| Accessibility | 7 | OK. |
| SEO | 5 | Thin. |

**What's wrong:** Large dark image frame renders as an empty black box until its lazy image loads — captured black in a fast scroll (`screenshots/home-1440.png` earlier pass; resolves after load, no blur placeholder). Third repeat of the same "quiet earth" message.
**What V2 must do:** `placeholder="blur"` with `blurDataURL`; consolidate duplicate messaging.
**Screenshots:** `screenshots/home-1440.png`, `screenshots/home-375.png`

---

## Why choose us / philosophy (olive band)
**Overall: 5/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Olive `#41490D` with gold folios and a woven pattern border. |
| UX | 6 | 4 principles; generic ("Thoughtful Property Selection", "Customer-Focused Advisory"). |
| Responsiveness | 7 | Stacks. |
| Functionality | 8 | None. |
| Accessibility | 4 | axe `color-contrast` serious ×5 on `/` and `/about`: **#C49A50 on #41490D = 3.7:1** (11–12px text) — `WhyChooseSection.tsx:48,69`. |
| SEO | 5 | Copy is the standard "why choose us" boilerplate. |

**What's wrong:** (1) Gold-on-olive 3.7:1 at 11px (needs 4.5:1). (2) "Customer-Focused Advisory… rather than high-pressure sales" is boilerplate any agent could paste.
**What V2 must do:** Lift gold to ≥ #D9B26A or enlarge to ≥ 18px; replace with measurable differentiators.
**Screenshots:** `screenshots/home-1440.png`

---

## Future homes (home section + `/future-homes`)
**Overall: 5/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Concept renders in a slider with spec grid (`screenshots/home-futurehomes-carousel-1440.png`). |
| UX | 5 | "Not currently open for purchase" — a section that sells nothing; 3 pages of the top-level nav spent on it. CTA "Request Future Updates" works (prefills "Mitti Courtyard Residence (Future Updates)"). |
| Responsiveness | 6 | OK. |
| Functionality | 7 | Slider and CTAs pass; but the lead they generate can't be delivered (see Enquiry). |
| Accessibility | 7 | OK. |
| SEO | 5 | Unique title/desc ✔; thin. |

**What's wrong:** Renders (not photos), unpriced, unavailable. Nav real-estate wasted on non-inventory. Frame is black while image loads.
**What V2 must do:** Fold into "Residences" with a real status; or remove until inventory exists.
**Screenshots:** `screenshots/home-futurehomes-carousel-1440.png`, `screenshots/future-homes-1440.png`

---

## Enquiry form / Contact page (home `#contact` and `/contact`)
**Overall: 3/10** *(cap applied: broken core function → max 4; lowest dimension 2 → max 4)*
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Labelled fields, uppercase labels, terracotta submit. `screenshots/contact-1440.png` |
| UX / Usability | 4 | Validation copy is good, but a valid submission ends in "Direct Channel Required … please copy this summary" with a **Copy Enquiry Summary** button — the visitor is told to deliver their own lead. `screenshots/contact-form-valid-submit-result-1440.png` |
| Responsiveness | 7 | Single column, 42–43px inputs at 375. |
| Functionality | 2 | **Valid submit → `POST /api/enquiries` 503** (`services/enquiryService.ts:262-273`, no `CRM_WEBHOOK_URL`/`SMTP_*` set). Fallback WhatsApp/mailto links are `null` (no `WHATSAPP_NUMBER`/`CONTACT_EMAIL`) → **0 contact channels exist anywhere on the site**. Client validation (empty / invalid), double-click guard (1 request), honeypot (400), bad JSON (400), rate-limit (429 after 5) all pass. |
| Accessibility | 7 | `<label for>`, `aria-invalid`, `role=alert`; focus does not move to first invalid field; no outline on fields. |
| SEO | 3 | **`/contact` has no `<h1>` in the server HTML** and only ~760 chars of text: the whole form is inside `<Suspense>` for `useSearchParams` (`EnquirySection.tsx:594-606`) so raw HTML contains only "Loading enquiry form…". Home is affected the same way (form absent from source). |

**What's wrong:** (1) Lead never reaches the client — core conversion broken (`02` row "Submit VALID data"). (2) No tel / email / WhatsApp / address / map anywhere. (3) `/contact` H1 + form are client-rendered only. (4) Leftover "CHAPTER 06 · ADVISORY DESK" label on a standalone page. (5) Placeholders show a fake number "+91 98765 43210".
**What's acceptable:** Validation messages, honeypot, rate-limit, double-submit guard are well built.
**What V2 must do:** Wire CRM/SMTP and verify end-to-end with a delivery receipt; add phone, WhatsApp, address, hours, map; wrap only the `useSearchParams` consumer in Suspense so H1/copy stay in SSR; success state with reference ID; remove chapter folio.
**Screenshots:** `screenshots/contact-1440.png`, `screenshots/contact-form-empty-errors-1440.png`, `screenshots/contact-form-valid-submit-result-1440.png`, `screenshots/contact-no-direct-channels-1440.png`

---

## Footer
**Overall: 4/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Dark charcoal, gold labels, woven top border. |
| UX | 4 | 4 columns; "Advisory Desk" column contains one sentence + one link. No phone, email, address, social, RERA/CIN, newsletter. |
| Responsiveness | 6 | Links 16–20px tall at 375 (tap-target failure). |
| Functionality | 4 | All 14 footer links return 200; **social icons: none** (`siteConfig.socialLinks: []`); mailto/WhatsApp blocks conditional on empty env (`Footer.tsx:140,149`). |
| Accessibility | 6 | Tap targets; contrast OK. |
| SEO | 5 | Good internal links to every parcel; no NAP (name/address/phone) for local SEO. |

**What's wrong:** Missing every standard footer trust element; "Replay Brand Intro" occupies the slot a phone number should. Logo disc appeared blank white in a fast-scroll capture (lazy image; resolves on load).
**What V2 must do:** NAP block, socials, RERA/legal IDs, newsletter, location list; delete "Replay Brand Intro".
**Screenshots:** `screenshots/home-1440.png`, `screenshots/contact-1440.png`

---

## Cookie consent banner & modal
**Overall: 5/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 7 | Compact dark card, three clear actions; modal explains categories. |
| UX | 6 | Reject Optional equal-weight to Accept (good). It sits fixed bottom-right and on 375px takes ~100px (≈13% of viewport). |
| Responsiveness | 4 | At 768 it overlaps the hero's parcel link and arrows (`home-768-fold.png`); at 375 it overlaps gallery captions (`project-aranya-375-fold.png`). Buttons 27–29px tall. |
| Functionality | 9 | Accept/Reject persist across reload; Preferences opens; Esc closes; footer "Cookie Settings" reopens. |
| Accessibility | 7 | Dialog roles, labelled close. |
| SEO | n/a | |

**What's wrong:** Overlaps primary UI; undersized buttons; there is no analytics installed at all, so the banner guards nothing.
**What V2 must do:** Bottom bar that pushes layout / respects safe areas; 44px buttons; install privacy-friendly analytics so consent has purpose.
**Screenshots:** `screenshots/cookie-preferences-modal-1440.png`, `screenshots/home-768-fold.png`

---

## Project detail page (`/projects/[slug]`)
**Overall: 6/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual / Premium feel | 8 | Breadcrumb, large serif H1, gallery with thumbnail captions, spec grid, "Other Sample Parcels". `screenshots/project-aranya-1440.png` |
| UX | 5 | No price, no map/location, no survey sketch/brochure download, no agent, no share, no lightbox; "Pricing guidance: Shared Upon Advisory Consultation". Related block always shows the 2 fixed neighbours. |
| Responsiveness | 7 | Clean at 375 (`project-aranya-375-fold.png`). |
| Functionality | 7 | Gallery next/prev/thumb ✔, CTA passes `?interest=` and preselects parcel ✔, unknown slug → real 404 ✔; no lightbox. |
| Accessibility | 9 | axe: 0 violations; Lighthouse a11y 100. |
| SEO | 6 | Unique title/desc/canonical, BreadcrumbList + `Place` JSON-LD; **not** `RealEstateListing`/`Residence`/`Offer`; no price; OG image = parcel photo ✔. |

**What's wrong:** Thin listing page by luxury standards (5 data fields). JSON-LD type `Place` (`lib/structuredData.ts:419`) cannot trigger listing features.
**What V2 must do:** `RealEstateListing` + `Offer`, price/price range, map, documents, enquiry panel on page, lightbox, similar-by-attribute.
**Screenshots:** `screenshots/project-aranya-1440.png`, `-768.png`, `-375.png` (also vatika/shila/prana/taru)

---

## Projects listing (`/projects`)
**Overall: 5/10**
| Dimension | Score | Evidence |
|---|---|---|
| Visual | 7 | Re-uses the homepage block. |
| UX | 5 | Identical to the homepage section → no new value. |
| Responsiveness | 6 | OK. |
| Functionality | 7 | 5 cards, filters ✔. |
| Accessibility | 6 | axe: `heading-order` (h1 → h3, `app/projects/page.tsx:38`), label-mismatch ×6, nested-interactive ×1. |
| SEO | 6 | Title/desc/breadcrumb ✔. |

**What's wrong:** Skipped heading level; duplicate of home; no pagination architecture.
**What V2 must do:** True listing page with map/list toggle, URL-synced filters, numbered pagination.
**Screenshots:** `screenshots/projects-1440.png`

---

## About page (`/about`)
**Overall: 6/10** — Visual 8 · UX 6 · Responsive 7 · Func 8 · A11y 6 (axe contrast ×5, same olive/gold) · SEO 7.
**What's wrong:** No team, no company facts; "CHAPTER 04 · DISCIPLINE" folio on a standalone page.
**What V2 must do:** Named team, timeline, registrations, press.
**Screenshots:** `screenshots/about-1440.png`, `about-768.png`, `about-375.png`

---

## Buyer guide (`/guides/land-buying-checklist`)
**Overall: 6/10** — Visual 7 · UX 5 · Responsive 7 · Func 6 · A11y 9 (axe 0) · SEO 8 (`FAQPage` JSON-LD ✔, best SEO asset on site).
**What's wrong:** The page is called a *checklist* but renders static text — 0 inputs/buttons/details; cannot tick, save or print. Single guide = no content hub.
**What V2 must do:** Interactive, savable/printable checklist; 10+ guides (locations, legal, taxes).
**Screenshots:** `screenshots/guide-checklist-1440.png`, `-768.png`, `-375.png`

---

## 404 page
**Overall: 7/10** — Visual 8 · UX 7 · Responsive 8 · Func 8 (HTTP **404** ✔, noindex ✔, both buttons work) · A11y 8 · SEO 8.
**What's wrong:** Copy "HTTP 404 · Unmapped Parcel / This terrain coordinate does not exist" is clever but the 404 console log shows an unused preloaded font. Canonical on 404 is `/404`.
**What V2 must do:** Add search/suggested pages; drop the canonical on error pages.
**Screenshots:** `screenshots/404-1440.png`, `-768.png`, `-375.png`

---

## Legal pages (privacy, cookies, terms)
**Overall: 6/10** — Visual 7 · UX 6 · Responsive 7 · Func 8 · A11y 9 · SEO 6 (indexable low-value pages at priority 0.3 in sitemap). Content honest ("illustrative sample parcels"); no legal entity, address or grievance officer named.
**Screenshots:** `screenshots/privacy-1440.png`, `cookies-1440.png`, `terms-1440.png`

---

## Sections that DO NOT EXIST in V1 (scored 1 — "missing")
| Section | Score | Evidence |
|---|---|---|
| Property search by location / price / type (hero or listing) | 1 | Only category + keyword; no price data exists. |
| Agents / team | 1 | No person named anywhere. |
| Testimonials / reviews | 1 | None. |
| Stats / achievements | 1 | None (no years, acres, families). |
| Services | 1 | None. |
| Blog / insights | 1 | One guide only. |
| Newsletter | 1 | None. |
| Map (real geography) | 1 | SVG schematic only. |
| Phone / email / WhatsApp / address | 1 | None rendered. |
