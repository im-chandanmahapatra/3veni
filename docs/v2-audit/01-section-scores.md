# 01 — Section-by-Section Review (V2)

Same benchmark (Sotheby's, Compass, Knight Frank, The Agency), same integer scale and same caps as V1. Evidence comes from the clean-room production build at 1440 / 768 / 375 px (`screenshots/`) and the executed matrix in `02`. "Cap" names where missing client content limits a score — those are *engineering-complete, content-blocked*.

Dimension key: **V** visual · **U** UX · **R** responsive · **F** functionality · **A** accessibility · **S** SEO.

| Section | Overall (V1→V2) | V | U | R | F | A | S | Evidence | What remains |
|---|---|---|---|---|---|---|---|---|---|
| Navbar / header | 6 → **9** | 9 | 9 | 9 | 9 | 9 | n/a | Transparent over hero → solid after 24 px; Enquire visible at every width (100×44 px at 375); native `<dialog>` menu: focus inside, wheel-scroll locked (scrollY 0→0), Esc closes and returns focus, link tap closes. Skip link visible, focuses `#main`. `x-mobile-menu-open-375.jpg`, `x-header-solid-1440.jpg` | Phone / WhatsApp icon buttons render only when the client supplies numbers |
| Brand intro curtain | 4 → **removed** | – | – | – | – | – | – | No intro, no replay link (`02`: "Replay-intro gimmick: absent") | – |
| Hero | 6 → **8** | 8 | 9 | 9 | 9 | 8 | 8 | One static plate; nothing auto-moves (DOM identical after 8 s); search form (format/size/terrain) → `/projects?format=…`; image shown at ≤ 1.15× intrinsic with focal point; mobile = image first, type on paper. `home-1440-fold.jpg` | **Cap 8**: imagery still reads as generated; replace with site photography (≥ 2400 px) |
| Brand statement | 6 → **8** | 9 | 8 | 9 | 9 | 9 | 8 | One `display-lg` statement + 3 principles; Devanagari motto has `lang="hi"` and an English caption | Needs proof (see next row) to reach 9 |
| Proof row / trust | 1 → **1 (slot)** | – | – | – | – | – | – | Marked `[CLIENT TO PROVIDE]` slot; nothing fabricated | Real stats, registrations, team, testimonials, press |
| Featured plots | 5 → **8** | 8 | 8 | 9 | 9 | 9 | 8 | 3 one-link cards (status as text, "Price on request"), "View all plots" | Prices once the client confirms public pricing |
| Plot map → masterplan | 5 → **8** | 8 | 8 | 8 | 9 | 9 | n/a | SVG `role="group"` with 5 real links (no modal, no nested interactive), caption "Schematic — not to scale"; keyboard Enter → dossier. `x-masterplan-keyboard-focus-1440.jpg` | Replace schematic with the real site plan |
| About / stewardship (home) | 6 → **7** | 8 | 8 | 9 | 9 | 9 | 8 | Copy V1-verbatim, once | Cap 7: still anonymous (no team / registration) |
| Location & lifestyle (terrain mosaic) | 5 → **7** | 8 | 8 | 9 | 9 | 9 | 7 | 4-plate mosaic → native-dialog lightbox (→, Esc, focus returns to opener); location facts = marked slot | Cap 7: no site location, connectivity, drive times |
| Visual storytelling | 5 → **8** | 8 | 8 | 9 | n/a | 9 | 8 | Typographic section on `/about` (no black frames, no pin-scroll) | – |
| Why choose us → Method | 5 → **8** | 8 | 8 | 9 | n/a | 9 | 8 | Night band, brass-soft numerals 10.4:1 (V1 3.7:1) | – |
| Future homes (home + page) | 5 → **8** | 8 | 8 | 9 | 9 | 9 | 8 | "Concept — not for sale" badge ×3; Register → `/contact?interest=<title> (Future Updates)` preselects only valid values | – |
| **Enquiry form / contact** | **3 → 7** | 8 | 8 | 9 | 8 | 9 | 8 | H1 + form in raw HTML; empty submit → focus first invalid; invalid email/phone; valid submit → success with reference `3VN-…`, focus on confirmation, mail with name/phone/reference in SMTP sink; honeypot rejected; rate limit 429 after 5; unconfigured server → honest 503, input kept, no success panel; `?interest=` hostile value ignored. `x-form-validation-1440.jpg`, `x-form-success-1440.jpg` | **Cap 7**: no phone/WhatsApp/email, no inbox or CRM configured by the client; `check:launch` blocks a live build until supplied |
| Footer | 4 → **6** | 8 | 7 | 9 | 9 | 9 | 6 | Identity block, plots / company / legal lists, cookie settings; no replay link; 3 marked slots (contact, address, registration) | **Cap 6**: nothing real to show — phone, email, address, CIN/RERA, socials |
| Cookie consent | 5 → **9** | 9 | 9 | 9 | 9 | 9 | n/a | Docked bar sets `--consent-h` so content is never covered (body padding 77 = bar 77); 44/44/44-px equal-weight buttons; reject persists; reopen from footer; **0 external requests before consent**. `x-home-consent-bar-375.jpg`, `x-cookie-preferences-375.jpg` | Consent-gated analytics loader not wired (no analytics provider chosen) |
| Project detail page | 6 → **7** | 9 | 8 | 9 | 9 | 9 | 8 | Gallery thumbs + lightbox (End/Home/Esc, focus returns), spec rows, Portfolio Notice verbatim, sticky enquiry panel (parcel is the subject — verified in mail), similar + previous/next, mini-plan, `RealEstateListing` + `BreadcrumbList`, no `Offer` without a price. `project-aranya-1440.jpg` | **Cap 7**: price, address/coordinates (click-to-load map ready), documents, RERA ID are slots |
| Projects listing | 5 → **9** | 9 | 9 | 9 | 9 | 9 | 9 | Server-rendered; every filter in the URL; survives reload/back; chips; sort; empty state; plan view; pagination (self-canonical page 2, filtered URLs noindex + canonical `/projects`). `projects-1440.jpg`, `x-listing-empty-1440.jpg` | – |
| About page | 6 → **7** | 8 | 8 | 9 | 9 | 9 | 8 | Emblem + material study, philosophy, storytelling, method | Cap 7: leadership + registration slots |
| Buyer guide | 6 → **9** | 9 | 9 | 9 | 9 | 9 | 9 | 12 real checkboxes: progress "n of 12", persisted across reload, reset, keyboard Space, print stylesheet hides chrome; FAQ as `details`; `Article` + `FAQPage` + `BreadcrumbList`. `x-checklist-progress-1440.jpg` | More guides (hub stays `noindex` until 3) |
| 404 | 7 → **9** | 9 | 9 | 9 | 9 | 9 | 9 | HTTP 404, `noindex`, search → `/projects?q=…`, popular links | – |
| Legal pages | 6 → **7** | 8 | 8 | 9 | 9 | 9 | 7 | Text unchanged by instruction, restyled `.prose`; cookie page shows live consent state | Cap 7: needs counsel review, entity name, grievance contact |
| Agents / testimonials / stats / services / blog / newsletter / real map / contact details | 1 each | – | – | – | – | – | – | Marked slots or intentionally absent | Client content |

**Weighted check:** the category scores in `README.md` follow from these rows; the eight sub-8 rows are all capped by the same five missing inputs (channels, inbox, domain, inventory/price/location, team/registration/photography).
