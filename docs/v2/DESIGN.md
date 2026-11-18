# 3VENI SPHERE — V2 Design System (single source of truth)

**Status:** Phase 2 deliverable — **awaiting approval at the checkpoint**. No implementation code has been written.
**Brief:** *premium visual design · premium UX · SEO-friendly* (client requirement, non-negotiable).
**Evidence this was designed, not guessed:** `screenshots/design-board-1-colour-type.png`, `…-2-components.png`, `…-3-hero-layout.png` (rendered from `design-board/board.html` with the tokens below); `screenshots/type-specimen-comparison.png` (7 serifs × 5 sans candidates rendered side by side) and the font-file size measurements in §5; contrast ratios calculated in §4 and Appendix B.

Every rule here traces back to a V1 audit finding (IDs like **C7**, **H9**, **M4** refer to `docs/v1-audit/06-v2-priorities.md`) or to the premium/SEO requirement.

---

## 1. Brand positioning

3VENI SPHERE should make a high-net-worth buyer feel that a few specific pieces of earth are being held for them by people who are **unhurried, exact and candid** — the calm of a well-kept private archive, not the noise of a property portal. Each screen reads like a page of a bound monograph: generous silence around the photograph, one confident serif voice, numbers set like a surveyor's field notes, and exactly one clear action. Confidence is earned through *specificity and candour* — what is a sample, what is a concept, what is available on request — never through adjectives, ornament or motion.

### Five design principles
| # | Principle | What it means in practice | Fixes |
|---|---|---|---|
| 1 | **Specifics over adjectives** | Facts, dimensions, orientation, documents — set in tabular numerals. Copy that could appear on any website is cut. | H8, C8 |
| 2 | **One action per view** | One terracotta primary button per viewport; everything else is outline or text. | H1, M7 |
| 3 | **Candour is a design feature** | "Sample parcel", "Concept — not for sale", "Price on request" are visible, typographically dignified labels. Missing client content is shown as a marked slot in preview, never faked. | C3, C8 |
| 4 | **Quiet interface, loud land** | The UI recedes: paper, ink, hairlines. Photography carries the emotion. No decoration competes with it. | H8, M1 |
| 5 | **System over ornament** | Every colour, size, space and radius comes from a token. No arbitrary values (V1 had **940** arbitrary hex classes and **59** arbitrary pixel font sizes — counted with `git grep` on the V1 commit; the tokens existed in `globals.css` but components bypassed them, so there was no design system in practice). | H9, M4, M9 |

---

## 2. Benchmarks — principles to learn, not layouts to copy

Reviewed in this session (17–18 Nov 2026) from the live public pages (text extraction; Sotheby's also viewed visually). The Agency was attempted and **blocked by a bot challenge (HTTP 429) — not reviewed, so nothing here relies on it**. Local competitors need the client to confirm the market (open question Q12); Sobha Limited is used as a proxy for Indian luxury norms.

| Benchmark | What it does well (observed) | Principle for 3VENI V2 | Deliberately *not* copied |
|---|---|---|---|
| **Sotheby's International Realty** | Serif wordmark and display line ("Find a home that suits your lifestyle."); one underline-style search with an explicit scope placeholder ("Country, City, Address, Postal Code or ID") above an intent tab row (Buy · Rent · Developments · Sell · More); hero media has a **visible pause control** and one "View listing" action; a **four-number proof row** sits directly below the hero; taxonomy link rows (popular cities / lifestyles / destinations) provide internal linking; heritage paragraph (founded 1976; auction house 1744). | Scope-labelled search; proof row (slots until the client supplies facts); pause control wherever anything auto-moves (we remove auto-motion entirely); taxonomy links (format / terrain / size) feeding SEO. | Franchise/affiliate boilerplate; their numbers (ours must be the client's own). |
| **Knight Frank** | One persistent **"Book a consultation"** button in the top bar; flagship research (e.g. The Residence Report) as authority; stats (130 years · 650+ offices · 21,000+ experts); three full-width image bands, each with **one short sentence**; consultation form near the foot with privacy notice; "Buying guides" under Properties. | Authority through content (the buyer guide is our research); a persistent header CTA at *every* width; image-plus-one-sentence rhythm instead of paragraphs; form close to every page end with the privacy statement. | Mega-menu depth, market/language selector (52 markets) — irrelevant to one developer. |
| **Compass** | One universal search field with an explicit scope; **listing-card anatomy** (photo counter, status badge, price, key specs, address); neighbourhood tiles; **licence disclosures in the footer** (trust through transparency). | Card anatomy (media + status + name + 3 specs + price line); compliance block in the footer (RERA/CIN slots). | Stacked promo banners (mortgage, concierge), card carousels, blue tech branding. |
| **Sobha Limited** (Indian luxury developer) | Simple three-dropdown "Find your next dream home" panel (city · project · configuration); trust via **founder attribution and a craftsmanship narrative**; legal block (CIN, RERA disclaimer, policies, phone) kept in the footer; a "Real Estate Library". | Three-field search (format · size · terrain); legal/registration identifiers in the footer; leadership/process as trust (slots). | **Two search panels with inconsistent lists** (hero vs locations) — V2 has one source of truth for filter options; rotating hero banner. |
| *The Agency* | — not reviewed (bot challenge). | — | — |

---

## 3. Layout & visual concept: "the register"

* **Canvas, not gradients.** Warm paper (`canvas`) with hairline rules; at most **one** deep `night` band per page plus the footer. No purple/blue gradients, no glass blur (V1's `backdrop-blur` header is removed — the solid header is `canvas` at 96 %).
* **Plates.** Photographs are numbered like exhibition plates with a one-line caption (`Plate 01 — Aranya Ridge Terraces · Sample parcel`). This replaces V1's decorative chapter folios (M1).
* **Parcels as dossiers.** Each parcel has a code (P-01…P-05), a spec list set as a definition list in tabular numerals, an explicit status badge, and "Price on request".
* **Asymmetric 12-column grid.** Text starts on column 1 or 2; media may bleed; **no centred-everything layouts** (404 and the enquiry confirmation are the only centred compositions).
* **Image first on mobile.** On phones the hero image sits above the type on paper — no text over photography below `lg` (fixes the contrast, tap-target and consent-banner collisions in V1 hero, 05 §M6).
* **Sections (home):** hero + docked search → principles → featured parcels → method (night band) → terrain mosaic → future residences teaser → guide teaser → enquiry + direct contact. **7 sections replace V1's 9** (H8).

---

## 4. Colour tokens (WCAG 2.2 AA — every pair calculated)

Usage ratio: **≥ 80 %** canvas/paper/sunken + ink · **≤ 12 %** `night` (one band + footer) · terracotta **only** for the primary action, links and small active details · olive for **one** editorial moment and success states · brass is **ornament only on light** (2.35 : 1 — *never* text on a light surface; this is the V1 gold-on-olive failure, **H9**, designed out).

### 4.1 Light family
| Token | Hex | Role | Pair | Ratio |
|---|---|---|---|---|
| `canvas` | `#F7F3EC` | page background | ink on canvas | **15.5 : 1** |
| `paper` | `#FCFAF6` | cards, fields, dialogs | ink on paper | 16.5 : 1 |
| `sunken` | `#EFE8DB` | alternate bands, wells | ink on sunken | 14.1 : 1 |
| `sunken-2` | `#E6DDCC` | hover wells, pressed | ink-2 on sunken-2 | 8.5 : 1 |
| `hairline` | `#DCD3C2` | decorative dividers, card borders | — | decorative (1.34 : 1 by design) |
| `line-strong` | `#8A7F6E` | **control borders** (inputs, selects, checkboxes) | vs canvas / paper | 3.55 / 3.77 : 1 (≥ 3 : 1 UI) — *not* allowed on `sunken-2` (2.92) |
| `ink` | `#1E1B17` | headings, primary text | on canvas | 15.5 : 1 |
| `ink-2` | `#3F392F` | body secondary | on canvas / sunken | 10.3 / 9.4 : 1 |
| `ink-3` | `#5A5145` | captions, metadata | on canvas / sunken | 7.0 / 6.4 : 1 |
| `ink-4` | `#6B6154` | placeholders, disabled labels | on canvas / paper | 5.5 / 5.8 : 1 |

### 4.2 Night family (dark band, footer, photography scrims)
| Token | Hex | Role | Pair | Ratio |
|---|---|---|---|---|
| `night-deep` | `#14120F` | scrim base, lightbox backdrop | on-night on night-deep | 16.3 : 1 |
| `night` | `#1C1A16` | dark band, footer | on-night on night | 15.2 : 1 |
| `night-raised` | `#26231E` | cards on dark | on-night-2 on night-raised | 8.5 : 1 |
| `night-line` | `#3A362F` | dividers on dark | decorative | — |
| `on-night` | `#F4EFE5` | primary text on dark | — | 15.2 : 1 |
| `on-night-2` | `#C7BEAD` | secondary text on dark | on night | 9.4 : 1 |
| `on-night-3` | `#A39A8A` | tertiary on dark | on night / night-raised | 6.2 / 5.6 : 1 |

### 4.3 Accents & states
| Token | Hex | Role | Pair | Ratio |
|---|---|---|---|---|
| `clay` | `#98400F` | primary action, links, active states (the emblem's terracotta) | paper on clay · clay on canvas | **6.6 : 1 · 6.2 : 1** |
| `clay-strong` | `#7A310A` | hover | canvas on clay-strong | 8.4 : 1 |
| `clay-deep` | `#5F2608` | pressed | paper on clay-deep | 11.4 : 1 |
| `clay-soft` | `#E39A73` | accent text on dark | on night | 7.6 : 1 |
| `olive` | `#41490D` | one editorial band; positive | paper on olive · on-night on olive | 9.2 · 8.4 : 1 |
| `olive-soft` | `#B7C27A` | positive text on dark | on night | 9.1 : 1 |
| `brass` | `#C49A50` | **ornament only on light** (hairline accents, 2 px rules) | on canvas | 2.35 : 1 ✖ text |
| `brass-ink` | `#856220` | the rare small gold text on light | on canvas | 5.0 : 1 |
| `brass-soft` | `#E2C58B` | accent text + focus ring **on dark** | on night | **10.4 : 1** |
| `success` | `#3B5A1F` | success text/icon | on canvas | 7.1 : 1 |
| `error` | `#A3281C` | error text/border | on canvas / paper | 6.6 / 7.0 : 1 |
| `error-soft` | `#F0897C` | error on dark | on night | 7.1 : 1 |
| `focus` | `clay` (light) · `brass-soft` (dark) | 2 px focus ring, 3 px offset | vs surface | 6.2 · 10.4 : 1 (≥ 3 : 1) |

### 4.4 Text over photography
* Photographs carry text **only** inside a scrim with **≥ 0.72** `night-deep` opacity across the *whole* text box (worst-case bright grass `#D9D2B0` → on-night 8.0 : 1; at 0.55 it drops to 4.9 : 1 and `on-night-2` to 3.0 : 1, — the first draft of the hero board was corrected for exactly this). Secondary text on photos uses `on-night` only unless scrim ≥ 0.8.
* Below `lg` there is **no text over photographs** at all.
* Verified in build by a pixel-sampling contrast check (Phase 4 hero test).

---

## 5. Typography — does most of the premium work

### 5.1 Families (decided from a rendered specimen, not taste)
| Role | Family | Why | Delivery (measured) |
|---|---|---|---|
| **Display / headings** | **Newsreader**, static optical size 72, weights 300 + 400 | Contemporary editorial serif with real optical sizing: sturdy hairlines at 66 px, crisp tabular-friendly figures at 36 px. Specimen vs V1's Cormorant (hairline-thin, weak at small sizes), Fraunces (heavy, soft), Bodoni Moda (cold; numerals fall apart), Instrument Serif (condensed, over-used), Libre Caslon (stiff). | ≈ 22 KB per weight (woff2, latin) |
| **UI + body** | **Instrument Sans** 400–600 (variable) | Quiet, slightly open humanist grotesque that pairs with Newsreader on night and paper; clean numerals. Specimen vs Manrope (V1), Hanken (heavier), Figtree (too friendly), **Schibsted (comma/period spacing glitches in numerals — rejected)**. | ≈ 29 KB |
| **Devanagari motto lines** | **Noto Serif Devanagari** 400 | Serif Devanagari to match the display; loaded lazily (unicode-range) and **never above the fold** (V1 hero kicker removed from the LCP area — M9). Chosen over Tiro Devanagari Hindi on measured size: **49.8 KB vs 96.5 KB** (Noto Sans 48.7, Hind 73, Mukta 97). | lazy, ≈ 50 KB |
| ~~Mono~~ | *(dropped)* | V1's JetBrains Mono "survey labels" were a template tell; labels are overlines in Instrument Sans. | — |

**Font budget:** V1 shipped **six** woff2 files ≈ **274 KB** (4 families). V2 critical path ≈ **73 KB** (two Newsreader weights + one variable sans) → **−73 %** (M9).
**Delivery:** self-hosted via `next/font/local` (woff2 committed with the OFL licence), `font-display: swap`, `adjustFontFallback`, preload of the two display/body files only. No build-time dependence on Google.
**Open check (Phase 4):** confirm the **₹** (U+20B9) glyph exists in both families before any price is shown; otherwise add a latin-ext subset.

### 5.2 Scale (fluid; all sizes in `rem`; minimum text size **12 px**, body **16 px**)
| Token | Family / weight | Size (375 → 1440) | Line-height | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | Newsreader 300 | 44 → **80 px** (`clamp(2.75rem, 1.5rem + 5.2vw, 5rem)`) | 1.02 | −0.02 em | hero H1 only |
| `display-lg` | Newsreader 300 | 36 → 64 px (`clamp(2.25rem, 1.4rem + 3.2vw, 4rem)`) | 1.05 | −0.018 em | section H2 |
| `display-md` | Newsreader 300 | 28 → 40 px (`clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)`) | 1.12 | −0.012 em | H3, dossier headings |
| `title` | Newsreader 400 | 22 → 26 px | 1.2 | 0 | card titles |
| `lead` | Instrument Sans 400 | 17 → 20 px | 1.6 | 0 | intro paragraphs (`ink-2`) |
| `body` | Instrument Sans 400 | 16 px | 1.65 | 0 | default; **measure ≤ 64 ch** |
| `body-sm` | Instrument Sans 400 | 15 px | 1.55 | 0 | dense UI copy |
| `caption` | Instrument Sans 400 | 13 px | 1.45 | 0 | plates, meta (`ink-3`) |
| `overline` | Instrument Sans 600 | 12 px | 1.2 | +0.14 em, UPPERCASE | eyebrow labels, badges (≤ 28 chars) |
| `label` | Instrument Sans 600 | 13 px | 1.2 | +0.01 em | form labels |
| `button` | Instrument Sans 600 | 13 px | 1 | +0.10 em, UPPERCASE | buttons, action links |
| `numeric` | Instrument Sans 500 | 15–16 px | 1.3 | 0 | specs — `tabular-nums lining-nums` |

### 5.3 Rules
1. Display type: `text-wrap: balance`; body: `text-wrap: pretty`; no hyphenation; max 3 lines for H1 on mobile.
2. Light weight (300) **only ≥ 28 px**; below that use 400.
3. **No italic accent-word device** (V1's gold italic "Architecture." is an AI-template trope); italic only for citations and long-form emphasis.
4. UPPERCASE only for overlines, badges, buttons (tracked +0.10–0.14 em). Never uppercase body or headings.
5. All numerals in specifications use tabular lining figures; units are set in the same weight, separated by a non-breaking space (`4,800 sq. ft.`).
6. Area/number formatting via `Intl.NumberFormat('en-IN')`; money (when supplied) `₹`, lakh/crore words in text.
7. Devanagari lines carry `lang="hi"` and an English translation caption (L2, L7).

---

## 6. Spacing, grid, layout

| Item | Spec |
|---|---|
| **Base unit** | 4 px; scale `4 8 12 16 24 32 40 48 64 80 96 128 160` (Tailwind's default steps) |
| **Section rhythm** | `--section-y: clamp(4.5rem, 3rem + 6vw, 9rem)` (72 → 144 px) top and bottom; inner-page top offset 128 / 96 / 72 px under the header |
| **Containers** | content **80 rem (1280)**; wide media **90 rem (1440)**; reading **42 rem (672)**; narrow forms **36 rem** |
| **Gutters** | `clamp(1.25rem, 0.5rem + 3vw, 4rem)` → 20 px @375, 32 @768, 48 @1024, 64 @1440+ |
| **Columns** | 4 (≤ 767) · 8 (768–1023) · 12 (≥ 1024); column gap 16 / 24 / 32 px |
| **Breakpoints** | `sm 30rem (480)` · `md 48rem (768)` · `lg 64rem (1024)` · `xl 90rem (1440)` — design checks at **375 / 768 / 1024 / 1440** (+ 1920 sanity) |
| **Header** | 64 px mobile, 72 px ≥ md; solid `canvas/96 %` + 1 px hairline; transparent over the home hero until 24 px scroll |
| **Band rhythm** | canvas → sunken → canvas → night → canvas → footer; never two identical backgrounds adjacent without a hairline; max one `night` band + footer per page |
| **Radius** | `0` everywhere (architectural square). Only exceptions: the circular emblem disc and 6 px status dots |
| **Borders / shadow** | 1 px `hairline` structure; **no card shadows**; one `--shadow-float: 0 28px 64px -28px rgb(20 18 15 / .45)` for menus and dialogs only |
| **Z-index** | content 0 · header 40 · consent bar 45 · dialog/lightbox 60 · skip-link 100 |
| **Tap targets** | ≥ 44 × 44 px for every interactive element ≤ 768 px (inline body links excepted, WCAG 2.5.8 AA = 24 px) — closes M4 |

---

## 7. Iconography
Custom inline-SVG set (replaces `lucide-react` → fewer generic icons, −1 dependency): 20-px grid, **1.5 px stroke, square caps, mitre joins, `currentColor`** — drawn to match the hairline architecture. Set: arrow-right/up-right/left/down, chevron-down/left/right, close, menu (two lines), plus/minus, check, alert, pin, ruler, compass, phone, mail, chat (neutral), download, expand, print. Decorative icons `aria-hidden`; icon-only buttons have text labels.

---

## 8. Components — anatomy and states

Board reference: `screenshots/design-board-2-components.png`. All components exist in **default · hover · focus-visible · active · disabled · loading · error · empty** where applicable.

### 8.1 Button
| Variant | Default | Hover | Focus-visible | Active | Disabled | Loading |
|---|---|---|---|---|---|---|
| **Primary** | `clay` bg, `paper` text (6.6 : 1) | `clay-strong`; arrow nudges 3 px | 2 px `focus` ring, 3 px offset | `clay-deep` | `sunken-2` bg, `ink-4` text, `aria-disabled` | label hidden, 18-px ring spinner, width locked, `aria-busy` |
| **Secondary** | transparent, 1 px `ink` border, `ink` text | `ink` bg, `canvas` text | same ring | `ink-2` bg | border `hairline`, text `ink-4` | — |
| **On-dark** | `paper` bg / `ink` text (16.5 : 1) · outline `on-night/55 %` | `white` · `on-night` bg | ring `brass-soft` | — | — | — |
| **Text link** | 13/600 UPPERCASE `clay` + arrow | underline draws in 280 ms | ring | `clay-deep` | — | — |

Sizes: 48 px (default), 56 px (large), icon 48 × 48. One primary per viewport. Minimum width 160 px. Labels are verbs + object (*Request dossier*, *Find plots*), never "Submit"/"Click here".

### 8.2 Fields (text, email, tel, select, textarea, checkbox)
Label **above** (13/600 `ink-2`), required shown as "(required)" text — not just an asterisk; control 52 px, 1 px `line-strong` border, `paper` fill, 16 px text (no iOS zoom); placeholder `ink-4` is *an example*, never the label. **Focus:** `clay` border + 2 px ring offset 2 px. **Error:** `error` border + message with alert icon, linked with `aria-describedby`, `aria-invalid`; **focus moves to the first invalid field** on submit (M3). **Disabled:** `sunken` fill. **Success:** no decoration (quiet). Select: native menu with custom chevron. Checkbox: 24 px square, check icon, whole label is the hit area. Helper text 13 px `ink-3`.

### 8.3 Badges (status)
12 px/600 uppercase, 28 px high, 1 px border: `Sample parcel` (outline), `Open for enquiry` (clay outline), `Concept — not for sale` (night fill), `Available` (olive fill — future), `Reserved` (dashed outline — future). Status is always text, never colour alone.

### 8.4 Property card (listing)
Entire card is **one link** (title anchor with stretched hit area) — removes V1's duplicate "View Details" + "Quick Preview" paths. Media **3 : 2** with `sunken` placeholder + auto blur; badge top-left; overline `P-01 · Residential plots`; title `title` token; locational line (`ink-3`); **spec list** (`<dl>`: Plot size · Dimensions · Facing) in tabular numerals; price line **"Price on request"** (or the supplied price) with a text-link affordance. Hover: image scale 1.025 over 700 ms + border `line-strong`; **no lift, no shadow**. Focus: `:focus-within` ring around the whole card. Skeleton and empty variants below.

### 8.5 Header / navigation
Desktop ≥ lg: wordmark (emblem disc + tracked caps) · `Plots · Buyer's guide · About · Contact` · **Enquire** (always visible; on-dark over hero, primary when solid) · phone/WhatsApp icon buttons **when configured**. "Future Homes" moves to the footer + home teaser (H11). Active link: `clay` + 1 px underline + `aria-current`. **Mobile:** 48-px menu button opens a full-height sheet built on native **`<dialog>`** (focus trap, Esc, inert background, return focus — all native); links in `display-md`; **Enquire** pinned at the bottom with direct channels; body scroll locked via `html:has(dialog[open]){overflow:hidden}` (H6). The header **Enquire CTA is visible at every width** (icon + label ≥ 375).

### 8.6 Search (hero) and filters (listing)
**Hero search** is a native `<form method="get" action="/projects">` — works without JS and is crawlable as links: *Format · Plot size · Terrain* + `Find plots` (desktop docked panel overlapping the fold edge; mobile stacked card). **Listing filters:** same three selects + `Search` text + `Sort` (Featured · Largest · Smallest) + view toggle (List · Plan); results count in an `aria-live="polite"` region; active filters shown as removable chips + `Clear all`; state lives in the URL (H1). Below `lg` the controls sit inside a `<details>` "Filters" panel with an active-count badge.

### 8.7 Pagination
Numbered links `‹ 1 2 3 ›` (48-px cells, `ink` fill on current, `aria-current="page"`), rendered only when results exceed the page size (6); crawlable `?page=N` anchors.

### 8.8 Dialog & lightbox
Native `<dialog>` with `showModal()`: built-in focus trap, Esc, inert background; backdrop `night-deep/88 %`. **Lightbox:** image on `night-deep`, counter (`2 / 5`), caption bar, 48-px prev/next + close; ←/→/Home/End keys, swipe via pointer events, adjacent images preloaded; focus returns to the opening thumbnail (M3). Preferences dialog (consent) uses the same primitive.

### 8.9 Gallery (detail page)
Main plate 3 : 2 + thumbnail strip (5 × 3 : 2, caption beneath); click or Enter opens the lightbox; thumbnails are real buttons with `aria-label="Show photo 2: <caption>"`; scroll-snap on mobile.

### 8.10 Disclosure / accordion
Native `<details>/<summary>` (FAQ, filters panel, footer lists on mobile): 56-px summary, plus/minus icon, no JS, content in HTML for SEO.

### 8.11 Consent bar
Docked **bottom bar** (not a floating card): 3 actions at 44–48 px — *Accept all · Reject optional · Preferences*. While visible it sets `--consent-h` so the page reserves bottom padding and **never overlaps content** (H7). Reject has equal visual weight to Accept.

### 8.12 Skeleton, empty, error, success
* **Skeleton:** `sunken` blocks with a 1.6 s shimmer (disabled under `prefers-reduced-motion`); used in `loading.tsx` for `/projects` and detail pages.
* **Empty (no matching plots):** serif line "No plots match these filters." + removable filter chips + `Clear all` + secondary "Tell us what you are looking for" → enquiry.
* **Error (route):** `error.tsx` with retry + home link; form errors inline; network/server failure keeps the user's input and offers direct channels if configured.
* **Success (enquiry):** reference ID, a plain statement of what happens next, `Make another enquiry`; **no invented response-time promise**; focus moves to the confirmation heading.

### 8.13 Client-content slot (placeholder)
Dashed 1 px `line-strong` box on `sunken`, overline "CLIENT TO PROVIDE", one sentence naming exactly what is needed (see board 2). Rendered **only in `CONTENT_MODE=preview`**; in `live` an unresolved slot renders nothing and the launch gate lists it (Plan §7).

### 8.14 Breadcrumb, footer
Breadcrumb: 13 px `ink-3`, `/` separators, current item `ink`, `<nav aria-label="Breadcrumb">` + JSON-LD. Footer on `night`: brand + registered identity block (name, address, phone, email, **RERA/CIN slots**) · Plots (each parcel) · Company (About, Buyer's guide, Future homes, Contact) · Legal (Privacy, Cookies, Terms, *Cookie settings*); accordions on mobile; **no "Replay brand intro"** (L6).

---

## 9. Imagery rules
| Rule | Spec |
|---|---|
| **Aspect ratios** | hero 16 : 9 → desktop, **4 : 5 mobile (image above type)** · card/gallery 3 : 2 · mosaic 4 : 5 + 3 : 2 mix · OG 1.91 : 1 (1200 × 630) |
| **Focal point** | each image stores `focal: [x,y]`; `object-position` never left at centre |
| **Scrims** | only behind text, ≥ 0.72 across the text box, gradient on the text side only; no overall tint, no duotone, no filters |
| **No upscaling** | render ≤ **1.15×** intrinsic width; hero media is capped at 1440 CSS px (1680 on ultra-wide with canvas margins) until the client supplies ≥ 2400 px originals |
| **Formats / delivery** | `next/image` → AVIF with WebP fallback; explicit `sizes` on every image; static imports (intrinsic size + auto **blur placeholder**, M8); hero uses `preload` + `fetchPriority="high"`, all below-fold images lazy. *Measured on V1 (sharp enabled): hero AVIF 26 KB @750 w, 81 KB @1440 w vs 214 KB source.* |
| **Alt text** | specific and unique ("Terraced plots along a tree-lined stone avenue at golden hour"), never "image of"; decorative = `alt=""`; existing V1 alt copy is kept |
| **Provenance** | imagery currently appears synthetic (stray `public/assets/aistudio/*`); **flagged to client (Q5)** — V2 is built so real photography drops in with no layout change |
| **Text in images** | never; captions are HTML |

---

## 10. Motion rules
| | Rule |
|---|---|
| **Durations** | 100 (state) · 180 (button/link) · 280 (header, menu, dialog, underline) · 480 (accordions) · 700 (image hover, scroll reveal) ms |
| **Easing** | `--ease-out: cubic-bezier(.22,.8,.2,1)` (default) · `--ease-in-out: cubic-bezier(.65,0,.35,1)` (menus) |
| **Animates** | scroll reveal (opacity 0→1 + 14 px rise, **below-the-fold only**, once) · image hover scale 1.025 · link underline draw · header background · dialog/sheet open/close · skeleton shimmer |
| **Never animates** | anything in the first viewport on load (no opacity-0 starts → LCP/CLS safe) · parallax · auto-rotating carousels (**M5**) · route-change transitions (V1 `template.tsx`, suspected cause of M6) · scroll-jacking · cursor effects · springs/bounce · looping motion |
| **Reduced motion** | `prefers-reduced-motion: reduce` → transforms removed, opacity-only 160 ms, no smooth scroll, shimmer off; verified by emulation in the audit |
| **Implementation** | CSS transitions + one shared `IntersectionObserver` hook (~40 lines); **no GSAP, no Motion** (≈ 157 KB gz removed — upper bound from chunk attribution of the V1 build: 64 KB gz in chunks containing GSAP/ScrollTrigger + 93 KB gz in chunks containing Motion) |

---

## 11. Voice & microcopy
* Plain, specific, calm. Cut "curated / exquisite / bespoke" unless it is a fact. Sentence case for headings; UPPERCASE only per §5.3.
* Honest labels: **Sample parcel**, **Concept — not for sale**, **Price on request**, **Shared on consultation**. Never "Available" for a sample.
* Keep all existing client copy; regroup rather than rewrite (the principles, philosophy, parcel descriptions, guide text, legal text stay **verbatim**). New copy is limited to UI microcopy and a keyword-bearing eyebrow/H1 line (Plan §B).
* Units: `4,800 sq. ft.`, `60 × 80 ft`, with non-breaking spaces and the multiplication sign.

---

## 12. Do / Don't (specific to this project)
| ✅ Do | ❌ Don't |
|---|---|
| One serif voice (Newsreader 300) at large sizes; Instrument Sans everywhere else | Cormorant + Manrope "luxury default", italic gold accent words, mono "survey" labels |
| Warm paper + ink; terracotta for the one action | Purple/blue gradients, glass blur, neon, random olive/gold fills |
| Number parcels and plates; set specs as tabular notes | Chapter folios ("CHAPTER 06 · ADVISORY DESK"), rings/crest dividers, decorative SVG filler |
| Image-first on mobile; scrim ≥ 0.72 behind any text on photo | Text over photos on phones; tinted overlays; filters |
| Label samples, concepts and missing client content honestly | Invent prices, testimonials, awards, stats, team names, addresses |
| Native elements: `<dialog>`, `<details>`, GET `<form>` | Hand-rolled focus traps, SVG `role=button` wrappers, modals that duplicate pages |
| Tokens only; CI fails on `text-[#…]` / arbitrary px | 940 arbitrary hex classes, 11-px text, ad-hoc radii/shadows |
| 44-px targets; visible 2-px focus ring everywhere | 29-px tabs, 16-px footer links, `outline:none` |
| Nothing auto-moves; reveal only below the fold | Auto-rotating hero, parallax, intro curtain, route transitions |
| Square corners, hairlines, one float shadow | Mixed radii, card shadows, hover lift |

---

## Appendix A — tokens as code (implemented verbatim in `styles/tokens.css`)

```css
@theme {
  /* colour — see §4 */
  --color-canvas:#F7F3EC; --color-paper:#FCFAF6; --color-sunken:#EFE8DB; --color-sunken-2:#E6DDCC;
  --color-hairline:#DCD3C2; --color-line-strong:#8A7F6E;
  --color-ink:#1E1B17; --color-ink-2:#3F392F; --color-ink-3:#5A5145; --color-ink-4:#6B6154;
  --color-night-deep:#14120F; --color-night:#1C1A16; --color-night-raised:#26231E; --color-night-line:#3A362F;
  --color-on-night:#F4EFE5; --color-on-night-2:#C7BEAD; --color-on-night-3:#A39A8A;
  --color-clay:#98400F; --color-clay-strong:#7A310A; --color-clay-deep:#5F2608; --color-clay-soft:#E39A73;
  --color-olive:#41490D; --color-olive-soft:#B7C27A;
  --color-brass:#C49A50; --color-brass-ink:#856220; --color-brass-soft:#E2C58B;
  --color-success:#3B5A1F; --color-error:#A3281C; --color-error-soft:#F0897C;

  /* type */
  --font-display: var(--font-newsreader), "Iowan Old Style", Georgia, serif;
  --font-sans: var(--font-instrument), system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-deva: var(--font-noto-deva), "Nirmala UI", "Noto Serif Devanagari", serif;
  --text-display-xl: clamp(2.75rem, 1.5rem + 5.2vw, 5rem);
  --text-display-lg: clamp(2.25rem, 1.4rem + 3.2vw, 4rem);
  --text-display-md: clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem);
  --text-title: clamp(1.375rem, 1.2rem + 0.6vw, 1.625rem);
  --text-lead: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);

  /* layout */
  --breakpoint-sm: 30rem; --breakpoint-md: 48rem; --breakpoint-lg: 64rem; --breakpoint-xl: 90rem;
  --container-content: 80rem; --container-wide: 90rem; --container-reading: 42rem; --container-narrow: 36rem;
  --spacing-section: clamp(4.5rem, 3rem + 6vw, 9rem);
  --radius: 0;

  /* elevation & motion */
  --shadow-float: 0 28px 64px -28px rgb(20 18 15 / 0.45);
  --ease-out: cubic-bezier(0.22, 0.8, 0.2, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

## Appendix B — contrast verification (script output, WCAG 2.x relative luminance)
Every row passed except the ones deliberately forbidden above: `brass` on `canvas` (2.35 : 1 → ornament only), the first brass-text candidate `#8E6A22` at 4.48 : 1 on `canvas` (→ darkened to `#856220`, 5.0 : 1), `line-strong` on `sunken-2` (2.92 : 1 → fields never sit on `sunken-2`), and V1's `#C49A50` on `#41490D` (3.70 : 1 — the H9 failure). Scrim worst-case table: 0.55 → 4.9 / 3.0 : 1 · 0.65 → 6.5 / 4.1 · **0.72 → 8.0 / 5.0** · 0.80 → 10.2 / 6.4 (on-night / on-night-2 over `#D9D2B0`).
