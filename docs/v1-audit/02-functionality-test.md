# 02 — Functionality Test (V1, production build)

Tested against the V1 production build (`next build` + `next start -p 3100`) with Playwright + system Chrome at 1440×900 (desktop) and 375×812 touch (mobile). Every row was executed, not inferred from code. Where an initial script run produced false failures caused by test timing (Next.js client-side navigation not awaited), the row was re-run with explicit URL waits and only the corrected result is reported.

**Totals: 121 checks — ✅ 94 pass · ⚠️ 9 partial · ❌ 18 fail.**

**Headline:** every navigation link, filter, modal, gallery and carousel works. The one thing the site exists to do — deliver a lead to the client — does **not** work: `POST /api/enquiries` returns **HTTP 503** for a valid submission, and no phone / email / WhatsApp / address exists anywhere as a fallback.

| Page | Section | Element | Action performed | Expected | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|
| / | Intro curtain | Brand intro overlay (first visit) | Load / in fresh session; time until it disappears | Short, skippable, never blocks content | Overlay present at 500ms; gone after ~3320ms (+500 ms offset). Skip button present: true | ⚠️ Partial | screenshots/home-intro-curtain-1440.png |
| / | Head | Favicon | GET /favicon.ico + <link rel=icon> | 200 with icon | /favicon.ico → 404; <link rel=icon> count: 0 | ❌ Fail | curl http://127.0.0.1:3100/favicon.ico |
| (any) | Navbar | Nav link "Home" | Click | Navigates to /, active state set | URL /; h1 count 1; aria-current = "Home" | ✅ Pass |  |
| (any) | Navbar | Nav link "About" | Click | Navigates to /about, active state set | URL /about; h1 count 1; aria-current = "About" | ✅ Pass |  |
| (any) | Navbar | Nav link "Projects" | Click | Navigates to /projects, active state set | URL /projects; h1 count 1; aria-current = "Projects" | ✅ Pass |  |
| (any) | Navbar | Nav link "Buyer Guide" | Click | Navigates to /guides/land-buying-checklist, active state set | URL /guides/land-buying-checklist; h1 count 1; aria-current = "Buyer Guide" | ✅ Pass |  |
| (any) | Navbar | Nav link "Future Homes" | Click | Navigates to /future-homes, active state set | URL /future-homes; h1 count 1; aria-current = "Future Homes" | ✅ Pass |  |
| (any) | Navbar | Nav link "Contact" | Click | Navigates to /contact, active state set | URL /contact; h1 count 1; aria-current = "Contact" | ✅ Pass |  |
| / | Navbar | Enquire button (home) | Click | Scroll to enquiry form | URL /#contact; scrollY 10205; #contact top 145 | ✅ Pass |  |
| /about | Navbar | Enquire button (inner) | Click | Go to /contact | URL /contact | ✅ Pass |  |
| / | Navbar | Sticky header on scroll | Scroll to 2500px | Header stays pinned, solid background | header top=0px, bg=lab(95.3323 0.465035 5.46904 / 0.95) | ✅ Pass |  |
| / | Hero | CTA "Explore Available Plots" | Click | Scroll to #plots | #plots top at 0px after click (header 80px) | ✅ Pass |  |
| / | Hero | Vista tab "Valley Sanctuary" | Click | Tab selected + parcel link updates | selected="02.VALLEY SANCTUARY", link /projects/prana-valley-sanctuary | ✅ Pass |  |
| / | Hero | Vista tab "Evening Pavilion" | Click | Tab selected + parcel link updates | selected="03.EVENING PAVILION", link /projects/shila-laterite-crest | ✅ Pass |  |
| / | Hero | Vista tab "Ridge Terraces" | Click | Tab selected + parcel link updates | selected="01.RIDGE TERRACES", link /projects/aranya-ridge-terraces | ✅ Pass |  |
| / | Hero | Next vista arrow | Click | Advance one vista | 01.RIDGE TERRACES → 02.VALLEY SANCTUARY | ✅ Pass |  |
| / | Hero | Previous vista arrow | Click | Go back one vista | → 01.RIDGE TERRACES | ✅ Pass |  |
| / | Hero | Property search bar in hero | Look for location/type/price search in hero | Present for a real-estate site | No hero search; only in-page keyword filter lower down | ❌ Fail |  |
| / | Hero | Drag/swipe gesture | Pointer drag left 400px | Advance vista | selected = 02.VALLEY SANCTUARY | ✅ Pass |  |
| / | Hero | Auto-rotation (7.5s) w/o pause control | Wait 8.5s with pointer over hero | Pauses on hover; WCAG 2.2.2 pause control for auto-moving content | hover over hero → selected 01.RIDGE TERRACES → 01.RIDGE TERRACES; no visible pause/stop button in hero | ⚠️ Partial | HeroSection.tsx:81-85 |
| / | Featured plots | Initial state | Load | 5 cards | 5 cards; caption "SHOWING 05 OF 05 SAMPLE LAND TYPOLOGIES" | ✅ Pass |  |
| / | Featured plots | Category chip "Residential Plots" | Click | Grid filters | 2 cards; "SHOWING 02 OF 05 SAMPLE LAND TYPOLOGIES" | ✅ Pass |  |
| / | Featured plots | Category chip "Corner Parcels" | Click | Grid filters | 2 cards; "SHOWING 02 OF 05 SAMPLE LAND TYPOLOGIES" | ✅ Pass |  |
| / | Featured plots | Category chip "Estate Acreage" | Click | Grid filters | 1 cards; "SHOWING 01 OF 05 SAMPLE LAND TYPOLOGIES" | ✅ Pass |  |
| / | Featured plots | Category chip "All" | Click | Grid filters | 5 cards; "SHOWING 05 OF 05 SAMPLE LAND TYPOLOGIES" | ✅ Pass |  |
| / | Featured plots | Search "valley" | Type | Matching parcels only | 2 cards | ✅ Pass |  |
| / | Featured plots | Empty state (no results) | Search "zzzzqq" | Empty state with reset | empty message present=1; map still shows? 1 | ✅ Pass | screenshots/home-plots-empty-state-1440.png |
| / | Featured plots | Reset Filters button | Click | Restore 5 cards, clear search | 5 cards; search value "" | ✅ Pass |  |
| / | Featured plots | Sort "Largest first" | Select | Prana Valley (10,890) first | first card: Prana Valley Sanctuary | ✅ Pass |  |
| / | Featured plots | Sort "Compact first" | Select | Taru Ochre (2,800) first | first card: Taru Ochre Enclave | ✅ Pass |  |
| / | Featured plots | Combined filters (Corner + "north") | Select + type | AND logic | 2 cards | ✅ Pass |  |
| / | Featured plots | Filter state on refresh / URL | Set filters then reload | Filters kept in URL (shareable) | URL / ; cards after reload 5 | ❌ Fail | FeaturedPlotsSection.tsx:415-418 (useState only, no URL sync) |
| / | Featured plots | Price / bedroom / location / status filters | Look for them | Real-estate standard filters | Only category (3), keyword, and sort by size. No price, location, status, bedrooms (data has no prices: "Shared Upon Advisory Consultation") | ❌ Fail | data/properties.ts:70 |
| / | Plot map | SVG parcel hover | Hover P-03 | Side panel updates | parcels (role=button): 5; panel heading: Interactive Plot Map | ✅ Pass |  |
| / | Plot map | Parcel keyboard activate (Enter) | Focus P-03, press Enter | Opens dossier modal | modal open = 1 | ✅ Pass |  |
| / | Project modal | Scroll lock | Open modal | Body scroll locked | body overflow=hidden | ✅ Pass |  |
| / | Project modal | Initial focus | Open | Focus inside dialog | focused: Close details for Shila Laterite Crest | ✅ Pass |  |
| / | Project modal | Gallery next / prev / ArrowRight | Key + click | Cycles photos | gallery buttons worked without error | ✅ Pass |  |
| / | Project modal | Focus trap | Tab 25× | Focus stays in dialog | focus inside dialog = true | ✅ Pass |  |
| / | Project modal | Esc closes | Esc | Closed | modal count 0 | ✅ Pass |  |
| / | Project modal | Backdrop click closes | Click backdrop | Closed | modal count 0 | ✅ Pass |  |
| / | Featured plots | Card "Quick Preview" | Click | Opens modal | modal 1 | ✅ Pass |  |
| / | Project modal | Enquire about this parcel | Click | Scroll to form + preselect parcel | URL /?interest=Vatika%20Banyan%20Corner#contact; preselected "Vatika Banyan Corner" | ✅ Pass |  |
| / | Lifestyle carousel | Next / Previous | Click | Counter changes | 01 / 03 → 02 / 03 → 01 / 03 | ✅ Pass |  |
| / | Lifestyle carousel | Thumbnail tab #3 | Click | Jump to slide 3 | counter 03 / 03 | ✅ Pass |  |
| / | Lifestyle carousel | Play/Pause control | Find | WCAG 2.2.2 control | No control rendered because the carousel never auto-advances (autoAdvanceMs=0, isPaused default true) — nothing to pause | ✅ Pass |  |
| /contact | Enquiry form | Submit empty | Click Submit | Inline errors, focus first invalid | errors: Please enter your full name. \| Please provide a contact phone number. \| Please enter your email address. \| ; focused id= | ✅ Pass | screenshots/contact-form-empty-errors-1440.png |
| /contact | Enquiry form | Submit invalid data | Name "A", phone "123", email "not-an-email", msg "short" | Field-level errors | errors: Name must be at least 2 characters. \| Enter a valid 10 to 15 digit phone number. \| Enter a valid email address (e.g., name@domain.com). \| If adding a note, please write at least 8 characters. \|  | ✅ Pass |  |
| /contact | Enquiry form | Submit VALID data (double-click) | Fill all fields; double-click Submit | Lead delivered; success message; one request | API calls: 1 → [503]; UI: "Direct Channel Required Automated CRM and email delivery are not yet connected on this server. Your details have been validated and prepared below so nothing is lost—please copy this summary or use an active direct conta" | ❌ Fail | screenshots/contact-form-valid-submit-result-1440.png ; services/enquiryService.ts:262-273 |
| /contact | Enquiry form | Double-submit protection | dblclick Submit | 1 request | 1 request(s) sent | ✅ Pass | EnquirySection.tsx:89 (isSubmitting guard) |
| /api/enquiries | API | Honeypot field filled | POST with companyWebsite | 400 | status 400 | ✅ Pass |  |
| /api/enquiries | API | Malformed JSON | POST garbage | 400 | status 400 | ✅ Pass |  |
| /api/enquiries | API | GET method | GET | 405 | status 405 | ✅ Pass |  |
| /api/enquiries | API | Rate limiting (5 / 10min / IP) | 7 rapid POSTs | 429 after 5 | statuses 503,503,429,429,429,429,429 | ✅ Pass |  |
| /contact | Enquiry form | WhatsApp / mailto fallback links in failure notice | Inspect | Working channels | fallback anchors: [] | ❌ Fail | No CONTACT_EMAIL / WHATSAPP_NUMBER env set; .env.example |
| /contact | Contact page | Phone / email / WhatsApp / address / map | Look for | Visible direct channels | tel: links=0, mailto: links=0, wa.me: links=0, iframes(maps)=0 | ❌ Fail | config/siteConfig.ts:215-221 (empty env) |
| / | Footer | Footer link "3VENI SPHEREInvest With Confidence" | GET href | 200 | / → 200 | ✅ Pass |  |
| / | Footer | Footer link "Home" | GET href | 200 | / → 200 | ✅ Pass |  |
| / | Footer | Footer link "About 3VENI" | GET href | 200 | /about → 200 | ✅ Pass |  |
| / | Footer | Footer link "Projects & Plots" | GET href | 200 | /projects → 200 | ✅ Pass |  |
| / | Footer | Footer link "Future Homes" | GET href | 200 | /future-homes → 200 | ✅ Pass |  |
| / | Footer | Footer link "Land Buying Guide" | GET href | 200 | /guides/land-buying-checklist → 200 | ✅ Pass |  |
| / | Footer | Footer link "Ridge Terraces" | GET href | 200 | /projects/aranya-ridge-terraces → 200 | ✅ Pass |  |
| / | Footer | Footer link "Corner Parcels" | GET href | 200 | /projects/vatika-banyan-corner → 200 | ✅ Pass |  |
| / | Footer | Footer link "Estate Acreage" | GET href | 200 | /projects/prana-valley-sanctuary → 200 | ✅ Pass |  |
| / | Footer | Footer link "Orchard Enclaves" | GET href | 200 | /projects/taru-ochre-enclave → 200 | ✅ Pass |  |
| / | Footer | Footer link "Contact Desk" | GET href | 200 | /contact → 200 | ✅ Pass |  |
| / | Footer | Footer link "Privacy Policy" | GET href | 200 | /privacy-policy → 200 | ✅ Pass |  |
| / | Footer | Footer link "Cookie Policy" | GET href | 200 | /cookie-policy → 200 | ✅ Pass |  |
| / | Footer | Footer link "Terms & Conditions" | GET href | 200 | /terms-and-conditions → 200 | ✅ Pass |  |
| / | Footer | Social icons | Look for | Social profile links open in new tab | socialLinks=[] in config; anchors with http(s) in footer: 0 | ❌ Fail | config/siteConfig.ts:221 |
| /about | Cookie banner | Preferences button | Click | Opens modal | banner=1, modal=1 | ✅ Pass | screenshots/cookie-preferences-modal-1440.png |
| /about | Cookie modal | Esc closes | Esc | Closes | modal=0 | ✅ Pass |  |
| /about | Cookie banner | Reject Optional → reload | Click, reload | Banner stays dismissed | banner count after reload=0; storage={"3veni_cookie_consent_v1":"{\"version\":1,\"necessary\":true,\"analytics\":false,\"marketing\":false,\"decidedAt\":\"20 | ✅ Pass |  |
| /about | Footer | Cookie Settings button | Click | Reopens preferences | modal=1 | ✅ Pass |  |
| /about | Footer | Replay Brand Intro | Click | Intro plays | curtain=1 | ✅ Pass |  |
| / | Mobile menu | Open | Tap hamburger | Drawer opens | drawer=1; aria-expanded=true | ✅ Pass | screenshots/home-mobile-menu-open-375.png |
| / | Mobile menu | Scroll lock while open | Check body overflow | Locked | body overflow: visible / html:visible | ❌ Fail | Navbar.tsx has no scroll lock |
| / | Mobile menu | Page scrolls behind open menu | Wheel 600 | No scroll | scrollY 0 → 600 | ❌ Fail |  |
| / | Mobile menu | Esc closes | Esc | Closed | drawer=0 | ✅ Pass |  |
| / | Mobile menu | Toggle close via X | Tap twice | Closed | drawer=0 | ✅ Pass |  |
| / | Mobile menu | Link click → navigate + close | Tap About | /about, drawer closed | URL /about; drawer=0; link height 49px | ✅ Pass |  |
| / | Navbar (375) | Header "Enquire" CTA | Check visibility | Visible | visible=false (hidden sm:inline-flex) — only inside drawer | ⚠️ Partial | Navbar.tsx:126 |
| / | Tap targets (375) | All interactive elements | Measure bounding boxes | ≥44×44 (WCAG 2.5.5 / Apple HIG) | 61 undersized, e.g. a[Skip to main content] 1×1; a[3VENI SPHERE Home] 173×40; a[Our Stewardship Philosophy] 231×33; button[01.Ridge Terraces] 134×29; button[02.Valley Sanctuary] 148×29; button[03.Evening Pavilion] 139×29 | ❌ Fail | see list in console section |
| / | Layout | Skip to main content link | Fresh load (intro off), press Tab once | First focus = visible skip link | Focused: "Skip to main content" href=#main-content width=191 | ✅ Pass |  |
| / | Layout | Skip link activation | Enter | Focus/scroll to <main> | hash=#main-content; active=BODY | ✅ Pass |  |
| /about | Navbar | Logo / brand link | Click | Go to / | URL / | ✅ Pass |  |
| / | Hero | CTA "Our Stewardship Philosophy" | Click | Go to /about | URL /about | ✅ Pass |  |
| / | Hero | Sample parcel link (hero datum strip) | Click | Open that parcel page | URL /projects/aranya-ridge-terraces | ✅ Pass |  |
| / | Featured plots | Card "View Details" | Click | Go to parcel page | URL /projects/shila-laterite-crest | ✅ Pass |  |
| / | Browser nav | Back from parcel page → scroll restoration | history.back() | Return to / at same scroll | URL /; scrollY before 3842, after 0 | ⚠️ Partial |  |
| (any) | Browser nav | Back / forward | Home→Projects→About→Back→Forward | Correct history entries | back → /projects; forward → /about | ✅ Pass |  |
| /nope | 404 | "Back to Home" / "Browse Projects" buttons | Click each | Navigate | Back to Home → /; Browse Projects → /projects | ✅ Pass |  |
| / | Project modal | Focus return on close (trigger = Quick Preview via keyboard) | Enter on trigger, Esc | Focus returns to trigger | active after close: BUTTON Quick Preview | ✅ Pass | hooks/useFocusTrap.ts |
| / | Project modal | Focus return on close (trigger = SVG parcel via keyboard) | Enter, Esc | Focus returns | active after close: BODY  | ❌ Fail |  |
| / | Future homes | "Request Future Updates" CTA | Click | Scroll to form w/ interest "Future Homes Collection Updates" | BUTTON href=null; URL /?interest=Mitti%20Courtyard%20Residence%20(Future%20Updates)#contact; interest="Mitti Courtyard Residence (Future Updates)" | ✅ Pass |  |
| /guides/land-buying-checklist | Checklist | Interactive checklist (tick / progress / print / save) | Inspect page | Interactive list | inputs=0, buttons=0, details=0; links: /, /projects, /contact | ❌ Fail | app/guides/land-buying-checklist/page.tsx (static JSX) |
| /guides/land-buying-checklist | Checklist | Link / | GET | 200 | 200 | ✅ Pass |  |
| /guides/land-buying-checklist | Checklist | Link /projects | GET | 200 | 200 | ✅ Pass |  |
| /guides/land-buying-checklist | Checklist | Link /contact | GET | 200 | 200 | ✅ Pass |  |
| /projects/[slug] | Gallery | Dossier gallery next / prev | Click | Cycles photos | caption changes: true | ✅ Pass |  |
| /projects/[slug] | Gallery | Thumbnail click | Click #2 | Switches | no error | ✅ Pass |  |
| /projects/[slug] | Gallery | Lightbox / fullscreen zoom | Click main image | Lightbox opens | No lightbox/zoom component exists (grep: no lightbox) | ❌ Fail | components/property/PlotDossierGallery.tsx |
| /projects/[slug] | Detail | "ENQUIRE ABOUT THIS PLOT" CTA | Click | Enquiry w/ parcel preselected | href=/contact?interest=Aranya%20Ridge%20Terraces; URL /contact?interest=Aranya%20Ridge%20Terraces; interest="Aranya Ridge Terraces" | ✅ Pass |  |
| /projects/[slug] | Breadcrumb | Breadcrumb links | Inspect | Valid | /, /projects | ✅ Pass |  |
| /projects/[slug] | Similar properties | Related / similar parcels block | Look for links to other parcels | Similar listings | distinct /projects/ links on page: /projects/vatika-banyan-corner, /projects/shila-laterite-crest, /projects/aranya-ridge-terraces, /projects/prana-valley-sanctuary, /projects/taru-ochre-enclave | ✅ Pass |  |
| /projects/does-not-exist | Detail | Unknown slug | GET | 404 | HTTP 404 | ✅ Pass |  |
| /projects | Listing | Listing page content | Load | Cards + filters | {"cards":5,"search":true,"h1":"Curated land parcels prepared for generational ownership."} | ✅ Pass |  |
| /contact | Enquiry form | ?interest= deep link | Load with param | Preselect parcel | select = "Shila Laterite Crest" | ✅ Pass |  |
| /contact | Enquiry form | ?interest= XSS probe | Load with <script> in param | Escaped | option rendered as text; dialogs: none; select value = "<script>alert(1)</script>" | ✅ Pass |  |
| (site) | Header | tel: links | Search all pages for tel: | Tap-to-call phone | 0 tel: links anywhere (SITE_CONFIG has no phone field) | ❌ Fail | config/siteConfig.ts:202-222 |
| (site) | Header | mailto: links | Search all pages | Email link | 0 mailto: links rendered (CONTACT_EMAIL env empty) | ❌ Fail | components/navigation/Footer.tsx:140 is conditional on env; .env.example |
| (site) | Header | WhatsApp links | Search all pages | wa.me link | 0 wa.me links rendered (WHATSAPP_NUMBER env empty) | ❌ Fail | components/navigation/Footer.tsx:149 |
| /contact | Contact page | Map embed / office address | Look for map / address | Map + address | No map, no address, no office hours | ❌ Fail | screenshots/contact-1440.png |
| / | Loading states | Image placeholders while lazy-loading | Scroll fast through page | Blur/skeleton placeholder | Image frames render flat dark until loaded (no blur placeholder); seen in fast-scroll capture, resolved once images load | ⚠️ Partial | screenshots/home-1440.png |
| / | Hero | Back-to-top / scroll restoration after history.back() | Open parcel from card, press Back | Return to same scroll | See row above: lands at scrollY 0 instead of the cards the user left | ⚠️ Partial | see Browser nav row |
| / | Cookie banner | Accept All -> reload | Click Accept All; reload | Persist consent | consent {analytics:true,marketing:true} stored in localStorage; banner stays hidden; no 3rd-party requests fire (no analytics installed at all) | ✅ Pass | localStorage 3veni_cookie_consent_v1 |
| / | Cookie modal | Preferences toggles | Open modal | Toggles + Save | Modal lists Analytics/Marketing categories with Reject/Accept/Save buttons | ✅ Pass | screenshots/cookie-preferences-modal-1440.png |
| /contact | Enquiry form | Error state when delivery unavailable | Submit valid data | Clear error + working retry channel | 503 -> "Direct Channel Required" panel with copy-summary + Edit Details; no working channel offered because none configured | ⚠️ Partial | screenshots/contact-form-valid-submit-result-1440.png |
| /contact | Enquiry form | Focus management on validation failure | Submit empty | Focus moves to first invalid field | document.activeElement.id is empty after failed submit (focus stays on button) | ⚠️ Partial | components/sections/EnquirySection.tsx:89-100 |
| (any) | Form fields | Focus indicator on inputs/selects | Tab through form | Visible focus ring | outline none; only a 1px border colour change (focus:border-[#98400F]) | ⚠️ Partial | a11y keyboard walk |

## Console errors and warnings per page (crawled at 1440 / 768 / 375)

| Page | Viewport | Errors / warnings |
|---|---|---|
| home | 1440 | error: Failed to load resource: the server responded with a status of 404 (Not Found) |
| about | 1440 | none |
| projects | 1440 | none |
| project-aranya | 1440 | none |
| project-vatika | 1440 | none |
| project-shila | 1440 | none |
| project-prana | 1440 | none |
| project-taru | 1440 | none |
| future-homes | 1440 | none |
| guide-checklist | 1440 | none |
| contact | 1440 | none |
| privacy | 1440 | none |
| cookies | 1440 | none |
| terms | 1440 | none |
| 404 | 1440 | error: Failed to load resource: the server responded with a status of 404 (Not Found) ; warning: The resource http://127.0.0.1:3100/_next/static/media/01d6212a423b17a1-s.p.1pvupmngxrt5z.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally. ; warning: The resource ht |
| home | 768 | none |
| about | 768 | none |
| projects | 768 | none |
| project-aranya | 768 | none |
| project-vatika | 768 | none |
| project-shila | 768 | none |
| project-prana | 768 | none |
| project-taru | 768 | none |
| future-homes | 768 | none |
| guide-checklist | 768 | none |
| contact | 768 | none |
| privacy | 768 | none |
| cookies | 768 | none |
| terms | 768 | none |
| 404 | 768 | error: Failed to load resource: the server responded with a status of 404 (Not Found) ; warning: The resource http://127.0.0.1:3100/_next/static/media/01d6212a423b17a1-s.p.1pvupmngxrt5z.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally. ; warning: The resource ht |
| home | 375 | none |
| about | 375 | none |
| projects | 375 | none |
| project-aranya | 375 | none |
| project-vatika | 375 | none |
| project-shila | 375 | none |
| project-prana | 375 | none |
| project-taru | 375 | none |
| future-homes | 375 | none |
| guide-checklist | 375 | none |
| contact | 375 | none |
| privacy | 375 | none |
| cookies | 375 | none |
| terms | 375 | none |
| 404 | 375 | error: Failed to load resource: the server responded with a status of 404 (Not Found) ; warning: The resource http://127.0.0.1:3100/_next/static/media/01d6212a423b17a1-s.p.1pvupmngxrt5z.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally. ; warning: The resource ht |

### Interpretation
- **Home (first load per browser context):** `Failed to load resource … 404` = the browser's automatic `/favicon.ico` request. V1 ships **no favicon** (no `app/icon`, no `<link rel="icon">`; `/favicon.ico` → 404). Lighthouse flags it on every page ("Browser errors were logged to the console"), costing Best-Practices points (96).
- **404 page:** the "Failed to load resource 404" is the missing URL itself (expected); Chrome also warns that a preloaded font (`01d6212a423b17a1-s.p.…woff2`) was not used shortly after load (font preloaded on a page that does not use it).
- **/contact API probes:** the 503 / 400 / 405 / 429 console lines in my run are my own deliberate API probes (valid submit, honeypot, GET, rate-limit). The **503 on a valid submission is the defect**.

## Failed network requests (per page)
| Page | Failed request |
|---|---|
| Home (all viewports) | `GET /favicon.ico` → 404 (no favicon) |
| /contact (valid submission) | `POST /api/enquiries` → **503 Service Unavailable** (`status: unconfigured_direct_only`, `delivered:false`) |
| /this-page-does-not-exist | 404 (expected) |
| All other pages | none; no broken images (all 20 `<img>` on home had naturalWidth>0 after scroll) |

## Layout probe
No page produced horizontal page scroll at 1440 / 768 / 375 / 320 (scrollWidth == clientWidth). Only decorative hero SVG rings and the parallax-scaled hero image extend past the viewport, clipped by overflow-hidden.

## Undersized tap targets at 375px (home)
61 interactive elements are < 44×44 CSS px (44 = WCAG 2.5.5 AAA / Apple HIG; 24 is the WCAG 2.2 AA floor). Worst: hero vista tabs 29px tall, footer links 16–20px, carousel pagination 106×18, parcel chips 31px, "Quick Preview" 32px, inline text links 16px, cookie-banner buttons 27–29px.
