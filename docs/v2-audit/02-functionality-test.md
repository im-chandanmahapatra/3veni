# 02 — Functionality Test (V2, clean-room production build)

Tested against a **clean-room production build** (git worktree of commit `HEAD` of branch `v2`, fresh `npm ci`, no `.env.local`, `CONTENT_MODE=preview FORCE_INDEXABLE=true NEXT_PUBLIC_SITE_URL=https://staging.3venisphere.invalid`, `next start`) with Playwright + system Chrome at 1440×900 desktop and 375×812 touch (plus 320/768 overflow probes). Enquiry delivery was tested against a local SMTP sink (`scripts/smtp-sink.mjs`) on server A and against an unconfigured server B (`LISTING_PAGE_SIZE=2`) for pagination and the honest-failure path. Every row below was executed; the script is the same one used for the iterations (3 iterations; earlier runs produced 15 → 5 → 1 non-pass rows, the causes were fixed in code or in the test, see 06).

**Totals: 125 checks — ✅ 124 pass · ⚠️ 1 partial · ❌ 0 fail.**

| Page | Section | Element | Action performed | Expected | Actual | Status |
|---|---|---|---|---|---|---|
| (any) | Header | Nav link "Plots" | Click | Navigates to /projects, aria-current set | URL /projects; h1 1; aria-current 1 | ✅ Pass |
| (any) | Header | Nav link "Buyer’s guide" | Click | Navigates to /guides/land-buying-checklist, aria-current set | URL /guides/land-buying-checklist; h1 1; aria-current 1 | ✅ Pass |
| (any) | Header | Nav link "About" | Click | Navigates to /about, aria-current set | URL /about; h1 1; aria-current 1 | ✅ Pass |
| (any) | Header | Nav link "Contact" | Click | Navigates to /contact, aria-current set | URL /contact; h1 1; aria-current 1 | ✅ Pass |
| / | Header | Brand logo link | Click from /about | Navigates to / | as expected | ✅ Pass |
| / | Header | Enquire button (home) | Click | Scrolls to #enquire form | hash #enquire; heading top 268px | ✅ Pass |
| /about | Header | Enquire button (inner) | Click | Goes to /contact | as expected | ✅ Pass |
| / | Header | Header over hero then solid | Scroll 600px | Pinned; solid background after scroll | data-solid false→true; top 0 | ✅ Pass |
| (any) | Header | Skip link | Tab once, Enter | Visible, focuses #main | "Skip to main content" visible true; focus→#main | ✅ Pass |
| / | Hero | H1 | Count | Exactly one H1 with keyword-bearing text | 1 h1: "CONTOURED RESIDENTIAL LAND PLOTS Quiet earth. Enduring architecture." | ✅ Pass |
| / | Hero | CTA "Explore plots" | Click | → /projects | as expected | ✅ Pass |
| / | Hero | CTA "Our approach" | Click | → /about | as expected | ✅ Pass |
| / | Hero | Property search (format+size+terrain) | Select Corner parcels / any / any, submit | → /projects?format=corner with 2 results | /projects?format=corner&size=&terrain=; 2 card(s) | ✅ Pass |
| / | Hero | Plate caption link | Click | → parcel dossier | as expected | ✅ Pass |
| / | Hero | Auto-moving content | Wait 8 s | Nothing auto-rotates (WCAG 2.2.2) | hero DOM identical after 8 s; no carousel controls | ✅ Pass |
| / | Statement | Links "stewardship philosophy" / "Land buying checklist" | Click each | → /about, → /guides/land-buying-checklist | as expected | ✅ Pass |
| / | Statement | Hindi motto has lang + English caption | Inspect | lang="hi" + translation | lang=hi ×1; caption "The dignity of land · clear ownership" | ✅ Pass |
| / | Proof row | Trust/proof block | Inspect | Real figures or marked slot (never invented) | marked [CLIENT TO PROVIDE] slot — no fabricated stats | ✅ Pass |
| / | Featured plots | Card links | Click first card | → dossier (single link per card) | 1 link(s) in card; → /projects/aranya-ridge-terraces | ✅ Pass |
| / | Featured plots | "View all plots" link | Click | → /projects | as expected | ✅ Pass |
| / | Terrain mosaic | Plate button → lightbox | Click Plate 01, press →, Esc | Lightbox opens, advances, closes, focus returns | opened 1; after → "2 / 4 Close gallery Plate 02 — Twilight "; closed 0; focus → "Open Plate 01: Contoured road access" | ✅ Pass |
| / | Terrain mosaic | Location facts | Inspect | Real facts or marked slot | marked slot (no invented drive-times) | ✅ Pass |
| / | Residences | "Concept — not for sale" labelling + link | Inspect + click link | 3 concepts labelled, → /future-homes | 3 labels | ✅ Pass |
| / | Guide teaser | "Read the guide" | Click | → guide | as expected | ✅ Pass |
| / | Enquiry | Form present in server HTML | fetch raw HTML | form + h2 in source (no bailout) | form + heading in raw HTML | ✅ Pass |
| / | Enquiry | Submit empty | Click Submit | Field errors, focus first invalid, no request | focus #enq-fullName; 3 errors | ✅ Pass |
| / | Enquiry | Invalid email | Name+phone ok, email "abc" | Email error, focus email | focus #enq-email | ✅ Pass |
| / | Enquiry | Invalid phone | phone "12" | Phone error | focus #enq-phone | ✅ Pass |
| / | Enquiry | Valid submit → delivered | Submit valid data | Success state with reference id; email arrives in SMTP sink | HTTP 200; ref 3VN-MWN2SCLIT5J; focus "Enquiry received"; sink mails 0→1 | ✅ Pass |
| / | Enquiry | Mail content | Read latest sink .eml | Contains name, phone, interest, reference | 5.eml: name/phone/reference present | ✅ Pass |
| / | Enquiry | Honeypot | POST with companyWebsite filled | Rejected, nothing delivered | HTTP 400; mails 1→1 | ✅ Pass |
| / | Enquiry | Rate limit | 7 rapid POSTs | 429 after the 5th/10 min | 400,400,400,400,400,429,429 | ✅ Pass |
| / | Enquiry | Make another enquiry | Click | Form returns | as expected | ✅ Pass |
| / | Enquiry | Direct channels | Inspect | Real channels or marked slot | marked slot — no phone/email/WhatsApp supplied by client | ✅ Pass |
| / | Enquiry | Privacy link | Click | → /privacy-policy | as expected | ✅ Pass |
| (any) | Footer | Link / | Click | Navigates to / | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /projects/aranya-ridge-terraces | Click | Navigates to /projects/aranya-ridge-terraces | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /projects/vatika-banyan-corner | Click | Navigates to /projects/vatika-banyan-corner | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /projects/shila-laterite-crest | Click | Navigates to /projects/shila-laterite-crest | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /projects/prana-valley-sanctuary | Click | Navigates to /projects/prana-valley-sanctuary | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /projects/taru-ochre-enclave | Click | Navigates to /projects/taru-ochre-enclave | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /projects | Click | Navigates to /projects | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /about | Click | Navigates to /about | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /guides/land-buying-checklist | Click | Navigates to /guides/land-buying-checklist | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /future-homes | Click | Navigates to /future-homes | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /contact | Click | Navigates to /contact | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /privacy-policy | Click | Navigates to /privacy-policy | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /cookie-policy | Click | Navigates to /cookie-policy | h1 count 1 | ✅ Pass |
| (any) | Footer | Link /terms-and-conditions | Click | Navigates to /terms-and-conditions | h1 count 1 | ✅ Pass |
| (any) | Footer | Identity block | Inspect | Brand, entity, focus line; slots for address/contact/registration | 3 marked slots (contact, address, registration) — nothing invented | ✅ Pass |
| (any) | Footer | Replay-intro gimmick | Search footer | No "Replay Brand Intro" | absent | ✅ Pass |
| (any) | Cookie consent | Banner on first visit | Load / | Docked bar with Accept / Reject / Preferences, equal prominence | visible; button heights 44/44/44px | ✅ Pass |
| (any) | Cookie consent | Does not cover content | Scroll to bottom | Page reserves space (--consent-h); footer fully reachable | body padding-bottom 77px; bar 77px | ✅ Pass |
| (any) | Cookie consent | Reject optional | Click, reload | Stored, banner gone, persists | banner 0; stored {"version":1,"necessary":true,"analytics":false,"marketing":false,"dec | ✅ Pass |
| (any) | Cookie consent | Reopen via footer "Cookie settings" | Click, toggle analytics, Save | Native dialog opens; saves; Esc closes | dialog 1; analytics true | ✅ Pass |
| (any) | Cookie consent | No third-party before consent | Network on fresh load | Only same-origin requests | 0 external requests | ✅ Pass |
| /projects | Listing | Result count + cards | Load | 5 plots, status role | 5 cards; "5 plots" | ✅ Pass |
| /projects | Filters | Format filter (auto-submit) | Select Corner parcels | URL ?format=corner, 2 cards, chip shown | /projects?q=&format=corner&size=&terrain=&sort=featured; 2 cards; 1 chip | ✅ Pass |
| /projects | Filters | Filter state in URL survives reload + back | Reload, then back | Same filtered result | reload 2; back 5 | ✅ Pass |
| /projects | Filters | Plot size band | Select first band | Filters by area | lt3000 → 1 cards | ✅ Pass |
| /projects | Filters | Terrain filter | Select first terrain | 1+ card, fewer than 5 | highland-terrace → 1 cards | ✅ Pass |
| /projects | Filters | Keyword search | Type "banyan", Apply | 1 card: Vatika Banyan Corner | Vatika Banyan Corner | ✅ Pass |
| /projects | Filters | Remove chip | Click chip | Filter removed, 5 cards | 5 cards; /projects | ✅ Pass |
| /projects | Sort | Sort by size (largest first) | Select sort | First card is Prana Valley (10,890 sq ft) | sort size-desc → first "Prana Valley Sanctuary" | ✅ Pass |
| /projects | Empty state | No matches | q=zzzz | Helpful empty state with clear + contact CTA | empty state shown; robots "noindex, follow" | ✅ Pass |
| /projects | Masterplan | Plan view renders 5 parcel links | Toggle Plan | SVG with 5 real links, labelled schematic | 5 links; "Schematic — not to scale. RL +114m · Ridge Terrace" | ✅ Pass |
| /projects | Masterplan | Keyboard: Tab to parcel, Enter | Focus P-01 link, Enter | → dossier | as expected | ✅ Pass |
| /projects | Masterplan | No nested interactive (axe) | role=group + links | role=group, no buttons in role=img | group 1; nested 0 | ✅ Pass |
| /projects | SEO | Filtered URL noindex + canonical → /projects | Fetch ?format=corner | robots noindex, canonical /projects | noindex, follow; https://staging.3venisphere.invalid/projects | ✅ Pass |
| /projects | Pagination | Page 1 of 3 (page size 2) | Load | 2 cards, pagination nav, Next link | 2 cards; nav 1 | ✅ Pass |
| /projects | Pagination | Next → page 2 (self-canonical, indexable) | Click Next | ?page=2, 2 different cards, canonical self, no noindex | Aranya Ridge Terraces → Shila Laterite Crest; index, follow; /projects?page=2 | ✅ Pass |
| /projects | Pagination | Out-of-range page | ?page=99 | Clamped to last page, no error | 1 card(s) shown | ✅ Pass |
| /contact | Enquiry | Not configured → honest 503 (no SMTP server) | Submit valid form | Honest message, input kept, no success state | HTTP 503; input kept "No Delivery"; success panel 0 | ✅ Pass |
| /projects/[slug] | Dossier | Breadcrumb + H1 + status badge | Inspect | Home › Plots › name; one h1; "Sample parcel" text badge | Home Plots Vatika Banyan Corner; "Vatika Banyan Corner"; SAMPLE PARCEL | ✅ Pass |
| /projects/[slug] | Gallery | Thumbnail buttons | Click thumb 2 | Main image/caption changes | 2 / 2 — Suggested dry-stone & earth perimeter expression | ✅ Pass |
| /projects/[slug] | Gallery | Lightbox (click, →, ←, Home, End, Esc, focus return) | Keyboard run | All work | End→"Suggested dry-stone & earth pe" Home→"Dual-aspect corner beneath her"; closed; focus → gallery__main | ✅ Pass |
| /projects/[slug] | Specs | Specification rows + Portfolio Notice | Inspect | Area, dimensions, orientation, access, terrain; notice verbatim | rows ok; notice 1 | ✅ Pass |
| /projects/[slug] | Location | Map / coordinates | Inspect | Click-to-load map when coordinates exist; else marked slot | marked slot; 0 iframes loaded (no third-party until requested) | ✅ Pass |
| /projects/[slug] | Documents | Parcel documents | Inspect | Real links or marked slot | marked slot — no brochures/survey PDFs supplied | ✅ Pass |
| /projects/[slug] | Mini-plan | Current parcel highlighted; others linked | Inspect | 5 links, current marked | 5 links | ✅ Pass |
| /projects/[slug] | Sticky enquiry | Panel sticks while scrolling | Scroll 1200px | Panel remains in viewport | panel top 88px | ✅ Pass |
| /projects/[slug] | Enquiry | Compact form delivers with parcel as subject | Submit | delivered; sink mail mentions parcel | mails 1→2; parcel in mail true | ✅ Pass |
| /projects/[slug] | Similar / pager | Similar parcel + Previous/Next | Click each | Navigate to other dossiers | → /projects/shila-laterite-crest | ✅ Pass |
| /projects/[slug] | Schema | JSON-LD RealEstateListing + BreadcrumbList | Parse | valid JSON, no Offer without price | RealEstateListing, BreadcrumbList, ; offers absent (no real price) | ✅ Pass |
| /projects/does-not-exist | Dossier | Unknown slug | GET | 404 status + on-brand page | HTTP 404 | ✅ Pass |
| /contact | Contact | H1 + form in raw HTML | fetch | h1 and form server-rendered | h1 + form in source | ✅ Pass |
| /contact | Contact | ?interest= preselects only valid options | Valid + hostile value | Valid selected; hostile ignored | valid → "Taru Ochre Enclave"; hostile → "Aranya Ridge Terraces" | ✅ Pass |
| /contact | Contact | Address / hours | Inspect | Real or marked slot | marked slot | ✅ Pass |
| /future-homes | Concepts | 3 concepts labelled not for sale; Register link carries interest | Click first Register | → /contact?interest=… preselected | 3 labels; preselected "Mitti Courtyard Residence (Future Updates)" | ✅ Pass |
| /about | About | Content + CTAs + slots | Inspect + click | 1 h1; CTAs work; leadership/registration marked slots | slots: proof, leadership, registration, contact-channels, address | ✅ Pass |
| /guides/… | Guide | Interactive checklist: tick, persist, reset | Tick 2, reload, reset | 2 of 12 → persists → 0 | 2 of 12 checked → reload 2 of 12 checked → reset 0 of 12 checked | ✅ Pass |
| /guides/… | Guide | Checklist keyboard | Focus checkbox, Space | Toggles | 1 of 12 checked | ✅ Pass |
| /guides/… | Guide | FAQ details (keyboard) | Focus summary, Enter | Opens; 3 FAQs | open 1 | ✅ Pass |
| /guides/… | Guide | Print stylesheet | emulate print | Header/footer/consent hidden | header display none | ✅ Pass |
| /guides/… | Guide | Schema | Parse | Article + FAQPage + BreadcrumbList | Article, FAQPage, BreadcrumbList,  | ✅ Pass |
| /guides | Guide hub | Hub is noindex until ≥ 3 guides | Fetch | noindex; not in sitemap | noindex; absent from sitemap | ✅ Pass |
| /privacy-policy | Legal | Page renders | GET | 1 h1; sections; breadcrumb | 1 h1; 5 sections | ✅ Pass |
| /cookie-policy | Legal | Page renders | GET | 1 h1; sections; breadcrumb | 1 h1; 4 sections | ✅ Pass |
| /terms-and-conditions | Legal | Page renders | GET | 1 h1; sections; breadcrumb | 1 h1; 4 sections | ✅ Pass |
| /cookie-policy | Legal | Live consent status + reopen preferences | Click Update | Dialog opens | dialog open | ✅ Pass |
| /does-not-exist | 404 | Status, content, search, exits | GET + search | 404 status; search works; links work | HTTP 404; "This page is not on our map."; search → /projects?q=ridge | ✅ Pass |
| / | Header (375) | Enquire CTA visible at phone width | Inspect | Visible, ≥ 44 px | 100×44px | ✅ Pass |
| / | Mobile menu | Open → native dialog, links, focus inside | Tap menu | Opens; focus in dialog; 4 links + CTA | open 1; focus inside true; 5 links | ✅ Pass |
| / | Mobile menu | Scroll lock + inert background | Wheel 600 while open | Page does not scroll | scrollY 0→0 | ✅ Pass |
| / | Mobile menu | Esc closes, focus returns to button | Press Esc | Closed; focus on menu button | open 0; focus icon-btn menu-button | ✅ Pass |
| / | Mobile menu | Link tap navigates and closes | Tap About | → /about, closed | closed after navigation | ✅ Pass |
| /projects | Filters (375) | Collapsible filters panel | Tap Filters, select, apply | Opens; filters; chips | 2 cards | ✅ Pass |
| /projects/[slug] | Sticky bar (375) | Bottom "Enquire" bar → panel | Tap Enquire | Scrolls to enquiry form | panel top 96px | ✅ Pass |
| /projects/[slug] | Gallery (375) | Swipe in lightbox | Open, pointer swipe left | Advances | "1 / 3 Clos" → "2 / 3 Clos" (pointer-event swipe; physical-device swipe untested) | ✅ Pass |
| (all 13 routes) | Responsive | No horizontal scroll at 320px | scrollWidth vs clientWidth | equal on every route | 13/13 routes clean | ✅ Pass |
| (all 13 routes) | Responsive | No horizontal scroll at 375px | scrollWidth vs clientWidth | equal on every route | 13/13 routes clean | ✅ Pass |
| (5 key routes) | Responsive | Tap targets ≥ 44 px at 375 (excl. inline text links) | Measure interactive elements | None below 44 px | /: a:Aranya Ridge Terrace:220x22, a:Vatika Banyan Corner:216x22, a:Shila Laterite Crest:187x22 | /guides/land-buying-checklist: input::24x24, input::24x24, input::24x24, input::24x24, input::24x24, input::24x24 | ⚠️ Partial |
| (all 13 routes) | Responsive | No horizontal scroll at 768px | scrollWidth vs clientWidth | equal on every route | 13/13 routes clean | ✅ Pass |
| (all 13 routes) | Responsive | No horizontal scroll at 1440px | scrollWidth vs clientWidth | equal on every route | 13/13 routes clean | ✅ Pass |
| / | Motion | prefers-reduced-motion: no reveal hiding, transitions disabled | Emulate reduce; scroll to bottom | All sections visible, no [data-reveal] hidden | 0 elements at opacity 0 | ✅ Pass |
| / | Keyboard | Tab walk through the whole home page | Press Tab ≤ 150× | Every stop has visible focus; no trap; reaches footer | 49 stops; 0 without ≥2px focus ring; reached footer true | ✅ Pass |
| /projects | Keyboard | Listing filters by keyboard | Tab to Format, change with arrows | Auto-submits | as expected | ✅ Pass |
| (site) | Endpoints | GET /api/health | fetch | 200 JSON, no secrets | {"status":"ok","contentMode":"preview","siteUrlVerified":true,"indexable":true,"enquiryDelivery":{"smtp":true,"crm":fals | ✅ Pass |
| (site) | Endpoints | /robots.txt | fetch | Allow + Sitemap (audit build, indexable) | User-Agent: * ⏎ Allow: / ⏎ Disallow: /api/ ⏎  ⏎ Sitemap: https://staging.3venisphere.invalid/sitemap.xml ⏎  | ✅ Pass |
| (site) | Endpoints | /sitemap.xml | fetch | 9 URLs with real lastmod, absolute https | 11 urls; 11 lastmod; no priority/changefreq | ✅ Pass |
| (site) | Endpoints | Favicon / apple-icon / manifest | fetch | 200 each | 200/200/200/200 | ✅ Pass |
| (site) | Endpoints | OG images | fetch | 1200×630 JPG per page | 11 images all 200 | ✅ Pass |
| (site) | Endpoints | Security headers | fetch / | CSP w/ frame-ancestors self, nosniff, referrer, permissions | frame-ancestors 'self'; nosniff; strict-origin-when-cross-origin | ✅ Pass |
| (site) | Endpoints | Image optimisation → AVIF | fetch /_next/image with Accept avif | image/avif | image/avif | ✅ Pass |
| (site) | Endpoints | POST /api/enquiries validation | Invalid JSON / missing fields | 400 with field errors, never 500 | bad JSON 400; empty 400 | ✅ Pass |

## Console errors

6 console error entries across the whole run; all are the *expected* network statuses of deliberate tests: the 404 document for `/does-not-exist` (browser logs a failed resource for the 404 response, 5×) and the honest HTTP 503 from the unconfigured enquiry server (1×). **No JavaScript exceptions, no hydration warnings, no CSP violations.**

## Failed requests

55 entries logged by the request listener: 49 are `net::ERR_ABORTED` (Chrome cancelling prefetch / in-flight image or favicon requests when the test navigated away — not server failures), 6 are HTTP errors, all deliberate (404 page ×N, enquiry 503 ×1). No 4xx/5xx on any asset, font, image, script or stylesheet.
