# 03 — SEO Audit (V1, production build)

Method: `next build` → `next start`; raw HTML fetched with `fetch()` (equivalent to View Source, no JS executed) for every route; Lighthouse SEO run on `/`, `/projects`, `/projects/aranya-ridge-terraces` (mobile + desktop); JSON-LD parsed with `JSON.parse`; `robots.txt` / `sitemap.xml` fetched.

## SEO score: **6 / 10**

**Why not higher:** The technical foundation is genuinely good (SSG pages, unique titles/descriptions, canonical, OG/Twitter, sitemap, robots, BreadcrumbList, FAQPage) and Lighthouse SEO is **100** everywhere. But Lighthouse does not test what matters to a real-estate business, and on those V1 is weak: the canonical/sitemap/OG domain is a **hard-coded unverified fallback** (`https://3venisphere.com`), `/contact` ships **no `<h1>` and no form in the server HTML**, there is **no favicon**, listing structured data is `Place` (not `RealEstateListing`/`Offer`), there is **no NAP** (name-address-phone) at all, only 5 thin listing pages, no location pages and a single guide.

| Sub-area | Score |
|---|---|
| Rendering / crawlability | 7 |
| On-page (titles, meta, headings) | 7 |
| Structured data | 4 |
| Indexation controls (canonical, sitemap, robots) | 6 |
| Content depth / internal linking | 4 |
| Local / real-estate SEO signals | 2 |

## Per-page table

| Page | Title (chars) | Meta desc (chars) | H1 count (raw HTML) | Heading skips | JSON-LD types | Imgs / missing alt / empty alt | Notes |
|---|---|---|---|---|---|---|---|
| `/` | 3VENI SPHERE — Invest With Confidence \| Plotted Land & Living Spaces (72) | 155 ✔ | 1 | none | Organization, WebSite | 18 / 0 / 4 (decorative thumbs) | Enquiry form **absent from source** (Suspense fallback "Loading enquiry form…"). H1 "Quiet Earth. Enduring Architecture." has no keyword. |
| `/about` | About 3VENI SPHERE — Stewardship & Ethos \| 3VENI SPHERE (59) | 126 ✔ | 1 | none | Org, WebSite, BreadcrumbList | 4 / 0 / 0 | OK |
| `/projects` | Projects & Land Plots — Interactive Masterplan \| … (65) | 131 ✔ | 1 | **h1→h3** | Org, WebSite, BreadcrumbList | 8 / 0 / 0 | Heading skip (`app/projects/page.tsx:38`) |
| `/projects/aranya-ridge-terraces` | Aranya Ridge Terraces — 4,800 sq. ft. \| 3VENI SPHERE (52) | 156 ✔ | 1 | none | + **Place** | 8 / 0 / 0 | No price, no address, no `Offer` |
| `/projects/vatika-banyan-corner` | … 3,600 sq. ft. (51) | 145 ✔ | 1 | none | + Place | 7 / 0 / 0 | |
| `/projects/shila-laterite-crest` | … 6,200 sq. ft. (51) | 138 ✔ | 1 | none | + Place | 7 / 0 / 0 | |
| `/projects/prana-valley-sanctuary` | … 10,890 sq. ft. (0.25 Acre) (66) | 141 ✔ | 1 | none | + Place | 7 / 0 / 0 | |
| `/projects/taru-ochre-enclave` | … 2,800 sq. ft. (49) | 147 ✔ | 1 | none | + Place | 7 / 0 / 0 | |
| `/future-homes` | Future Homes Collection — Coming Soon \| … (52) | 153 ✔ | 1 | none | Org, WebSite, Breadcrumb | 5 / 0 / 0 | Indexed page for non-purchasable concepts |
| `/guides/land-buying-checklist` | Land Buying Checklist & Plot Due Diligence Guide \| … (67) | 164 (slightly long) | 1 | none | + **FAQPage** | 2 / 0 / 0 | Best SEO page; static content, 4.4k chars |
| `/contact` | Contact & Advisory Enquiry \| 3VENI SPHERE (45) | 120 ✔ | **0** ❌ | n/a | Org, WebSite, Breadcrumb | 2 / 0 / 0 | **Only ~764 chars of text in HTML**; H1 + form are client-rendered (`<template data-dgst>` bailout) |
| `/privacy-policy` | Privacy Policy \| … (29) | 117 | 1 | none | Org, WebSite, Breadcrumb | 2 / 0 / 0 | Indexable thin page |
| `/cookie-policy` | Cookie Policy \| … (28) | 124 | 1 | none | same | 2 / 0 / 0 | |
| `/terms-and-conditions` | Terms and Conditions \| … (35) | 120 | 1 | none | same | 2 / 0 / 0 | |
| `/<missing>` | Page Not Found \| … (29) | 71 | 1 | h1→h3 | Org, WebSite | 2 / 0 / 0 | **HTTP 404 ✔**, `robots: noindex` ✔; canonical points to `/404` |

All 15 pages: `<html lang="en">` ✔, semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`) ✔, `og:*` ×10 and `twitter:card=summary_large_image` ✔, `robots: index, follow` ✔, image `width`/`height` or `fill` ✔ (0 images without dimensions), 16/18 images below the fold use `loading="lazy"` ✔.

## Site-wide findings

### 1. 🔴 Canonical / sitemap / OG all point at an unverified placeholder domain
`config/siteConfig.ts:178` `DEFAULT_CANONICAL_FALLBACK = 'https://3venisphere.com'` is used whenever `NEXT_PUBLIC_SITE_URL` is empty (it is, in `.env.example` and in this build). Every `canonical`, `og:url`, `og:image`, `sitemap.xml` `<loc>`, JSON-LD `url` and `robots.txt` Sitemap line emits that domain (verified in raw HTML and `/sitemap.xml`). If the production domain differs, search engines are told to index someone else's/non-existent URLs.

### 2. 🔴 `/contact` has no `<h1>` and no form in the server HTML
`EnquirySection` wraps a `useSearchParams()` consumer in `<Suspense>` (`components/sections/EnquirySection.tsx:594-606`). Static prerender therefore emits `Loading enquiry form...` and a `BAILOUT_TO_CLIENT_SIDE_RENDERING` template; H1 and all form copy only exist after hydration. The same happens to the home page's enquiry section. Google can render JS, but this is the page that should rank for "contact / enquire".

### 3. 🔴 No favicon
`/favicon.ico` → 404, no `<link rel="icon">`, no `apple-touch-icon`, no web manifest (all 404). Browser tab shows a blank globe; SERP favicon will be missing; console shows a 404 error on every first load.

### 4. 🟠 Structured data is too generic for real estate
- Present & valid JSON (all blocks parse): `Organization` (name, url, logo only — **no telephone, address, sameAs, areaServed**), `WebSite` (no `SearchAction`), `BreadcrumbList` (inner pages), `FAQPage` (guide), `Place` (plots, `lib/structuredData.ts:419-450`).
- Missing: `RealEstateAgent`/`RealEstateListing`/`Residence`/`Offer`/`LocalBusiness`, price, geo, address.
- `Organization` + `WebSite` are duplicated on every page via `app/layout.tsx:92-93` (harmless but bloats).

### 5. 🟠 Content depth and architecture
- Only 5 indexable listings, **all labelled "Sample Typology" with no address, no price** — nothing for a buyer to search for ("plots in <town>").
- No location/neighbourhood pages, no blog, one guide; URL structure itself is clean (`/projects/<slug>`, `/guides/<slug>`) ✔.
- Homepage H1 and title mention no place name or searchable keyword ("plots for sale in <city>").
- All 15 pages share the same OG image except plots (`/images/plots/aranya-ridge.webp`, 1376×768 raw photo, not a 1200×630 branded card).
- Legal pages are in the sitemap at priority 0.3 — fine; `/future-homes` (non-purchasable) at 0.7 is generous.

### 6. 🟡 Rendering method
✔ Excellent: every page is statically prerendered (`○`/`●` in the build output), real content is in the HTML, `generateStaticParams` for 5 plots. The only SSR gap is the Suspense-wrapped enquiry section (finding 2).

### 7. robots.txt / sitemap.xml
- `robots.txt` ✔: `User-Agent: *`, `Allow: /`, `Disallow: /api/`, Sitemap line (placeholder domain).
- `sitemap.xml` ✔: 14 URLs (9 static + 5 plots), `lastmod` hard-coded `2026-11-17T00:00:00.000Z` (`app/sitemap.ts:6`) — every page claims it changed on one fixed date.

### 8. Internal linking
Strong between plots (footer lists all 4 formats; detail pages link two neighbours; hero links to plots; guide links to /projects and /contact). No contextual links from guide body text to listings; no location hubs.

## Lighthouse SEO
`/`, `/projects`, `/projects/aranya-ridge-terraces`: **100 / 100 / 100** (mobile and desktop). Lighthouse cannot detect findings 1–5 — treat the 100 as a hygiene pass, not a ranking forecast.

## What V2 must do (SEO)
1. Set `NEXT_PUBLIC_SITE_URL` to the real https domain and fail the build if it is missing.
2. Move `useSearchParams` into a tiny client child; keep H1/copy in SSR on `/contact` and `/`.
3. Add `app/icon.png` + `apple-icon.png` + manifest.
4. `RealEstateListing` + `Offer` (price) + `Residence`/`Place` with `geo`/`address`; `RealEstateAgent`/`LocalBusiness` with NAP, `sameAs`.
5. Add keyword/location to H1 & titles; create location and guide hubs; real per-page OG cards (1200×630).
6. Real `lastmod` from content timestamps; drop thin pages from sitemap or `noindex` them.
