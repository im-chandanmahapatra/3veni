# 06 — V2 Priorities (ranked by severity)

Format: **problem — where — what V2 should do instead.**

## 🔴 Critical — broken functionality, SEO blockers, trust killers

| # | Problem | Where | V2 action |
|---|---|---|---|
| C1 | **Enquiry form cannot deliver a lead.** Valid submit → `POST /api/enquiries` **503**; UI tells the visitor to copy their own summary. | `services/enquiryService.ts:262-273`; `.env.example` (no `CRM_WEBHOOK_URL`/`SMTP_*`) | Configure CRM/SMTP, run an end-to-end delivery test per release, show a reference ID, alert the client on failures. |
| C2 | **Zero contact channels** on the entire site: 0 `tel:`, 0 `mailto:`, 0 `wa.me`, no address, no map, no social. | `config/siteConfig.ts:215-222`; `Footer.tsx:140-149` (env-conditional); `/contact` | Hard-require phone, email, WhatsApp, address, hours; header phone/WhatsApp; fail build if env missing. |
| C3 | **Sample-only inventory, no prices, no addresses**: every parcel is "Sample Typology … Shared Upon Advisory Consultation". A buyer cannot evaluate anything. | `data/properties.ts:4-8,13,70` | Real inventory with price/price-band, location, RERA/legal ID, status. |
| C4 | **Canonical/sitemap/OG/JSON-LD domain is an unverified placeholder** `https://3venisphere.com`. | `config/siteConfig.ts:178-198` | Set real `NEXT_PUBLIC_SITE_URL`; assert at build. |
| C5 | **`/contact` has no `<h1>` and no form in server HTML** (Suspense bailout); same for home's form. | `EnquirySection.tsx:594-606` | Isolate `useSearchParams` to a client leaf; SSR the H1 and copy. |
| C6 | **Home mobile performance 53, LCP 6.0 s, TBT 900 ms.** | `/` (Lighthouse mobile) | Lazy-load GSAP/ScrollTrigger/Motion, shorten/remove intro, smaller hero, split bundles. |
| C7 | **No favicon** (404 on `/favicon.ico`, no icon links, no manifest) + console error on every load. | `app/` (no icon file) | Add `app/icon`, `apple-icon`, manifest. |
| C8 | **No trust signals**: no team, RERA/company ID, years, reviews, press, office. | Whole site | Add leadership, registrations, proof stats, testimonials, awards. |

## 🟠 High — clearly non-premium

| # | Problem | Where | V2 action |
|---|---|---|---|
| H1 | No property search (location / type / budget); filters limited to category + keyword + size sort; not in URL. | Hero; `FeaturedPlotsSection.tsx:415-418` | Hero search + URL-synced filters. |
| H2 | Imagery appears synthetic (stray `public/assets/aistudio/*.png`), hero source 1376px upscaled to ~1574px. | `public/images/**`; `HeroSection.tsx:179-190` | Commission real photography/drone/video, ≥ 2400px + AVIF. |
| H3 | Brand intro curtain blocks the first ~3.3 s of the landing page. | `BrandIntroCurtain.tsx` | ≤ 1 s or remove; never gate LCP. |
| H4 | "Map" is a fake SVG schematic; no real geography, distances, or landmarks. | `InteractivePlotMap.tsx`; "Location" section | Real styled map, drive-times, neighbourhood data. |
| H5 | Listing JSON-LD is `Place` only; Organization has no phone/address/sameAs; no `RealEstateListing`/`Offer`/agent. | `lib/structuredData.ts:380-450` | Full real-estate schema set. |
| H6 | Mobile menu: no scroll lock/focus trap; header CTA hidden < 640px. | `Navbar.tsx:126,139-196` | Lock scroll, trap focus, persistent CTA. |
| H7 | Cookie banner overlaps hero controls at 768 and gallery captions at 375, buttons 27–29px. | `components/consent/CookieBanner.tsx` | Docked bar, reserve space, 44px buttons. |
| H8 | Three repetitions of the same "quiet earth" message (brand intro, monograph, philosophy) + generic boilerplate ("Customer-Focused Advisory") — template smell. | Home sections 2, 6, 7 | Rewrite with specifics; cut to one brand statement. |
| H9 | Gold-on-olive 3.7:1 contrast at 11–12px (axe serious ×5 on `/` & `/about`). | `WhyChooseSection.tsx:48,69` | Lighten gold or enlarge text. |
| H10 | Detail page too thin: no price, map, docs, agent, lightbox, share. | `app/projects/[slug]/page.tsx` | Full dossier template + sticky enquiry. |
| H11 | "Future Homes" — three unavailable concepts take a top-nav slot and a home section. | Nav + `/future-homes` | Fold into a status badge or remove until real. |
| H12 | Only one guide; "checklist" is static (0 inputs). | `/guides/land-buying-checklist` | Interactive, printable checklist + content hub. |

## 🟡 Medium — polish and consistency

| # | Problem | Where | V2 action |
|---|---|---|---|
| M1 | Leftover "CHAPTER 06 · ADVISORY DESK" / "CHAPTER 04" folios on standalone pages. | `EnquirySection.tsx:160`; `/about` | Remove or make contextual. |
| M2 | axe: SVG parcel `aria-label` ≠ visible text; nested-interactive; `heading-order` h1→h3 on `/projects`, `/contact`. | `InteractivePlotMap.tsx:150`; `app/projects/page.tsx:38` | Fix semantics. |
| M3 | Focus not restored to SVG parcel after modal close; no focus move to first invalid field; inputs rely on 1px border. | `useFocusTrap`, `EnquirySection.tsx` | Visible 2px rings; focus management. |
| M4 | 61 tap targets < 44px at 375. | Site-wide | Raise targets. |
| M5 | Hero auto-rotates every 7.5s without pause control. | `HeroSection.tsx:81-85` | Pause/stop button, honour user intent. |
| M6 | Back-navigation from a parcel returns to scroll 0, not the card list. | Home | Preserve scroll / use query-synced list. |
| M7 | Duplicate presentation of the same parcel (map panel + lead card). | Featured plots | Single presentation. |
| M8 | Lazy images show flat black frames — no blur placeholder. | Monograph, Future homes, footer logo | `placeholder="blur"`. |
| M9 | 4 font families (≈ 274 KB). | `app/layout.tsx:21-48` | Consolidate to 2. |
| M10 | Sitemap `lastmod` fixed date; thin legal pages in sitemap; 404 canonical `/404`. | `app/sitemap.ts:6`; `lib/metadata.ts` | Real timestamps; drop canonical on 404. |
| M11 | `"Showing 0{n} of 0{m}"` string concatenation breaks past 9 items. | `FeaturedPlotsSection.tsx:575` | Proper padding helper. |
| M12 | `frame-ancestors` in CSP still allows `aistudio.google.com`/`*.google.com`; two stray AI-Studio screenshots in `public/`. | `next.config.ts:18`; `public/assets/aistudio/` | Remove. |
| M13 | `npm ci` prints eslint 10 vs eslint-config-next peer-conflict warnings (ERESOLVE overrides). | `package.json` | Align eslint/eslint-config-next versions. |

## ⚪ Low — nice-to-haves

| # | Problem | Where | V2 action |
|---|---|---|---|
| L1 | No analytics installed, so the consent banner governs nothing. | `context/CookieConsentContext.tsx` | Add privacy-friendly analytics. |
| L2 | `lang="hi"` not set on Devanagari strings. | Hero/brand lines | Add `lang`. |
| L3 | Skip-link target `<main>` not focusable. | `app/layout.tsx:109` | `tabIndex={-1}`. |
| L4 | OG images are raw 1376×768 photos; same image on 10 pages. | `lib/metadata.ts:11` | Branded 1200×630 per page. |
| L5 | 404 offers no search/suggestions. | `app/not-found.tsx` | Add search/links. |
| L6 | "Replay Brand Intro" in footer. | `Footer.tsx` | Remove. |
| L7 | Hindi accents are untranslated decoration. | Brand copy | Add translation captions. |
