# 3VENI SPHERE — V2 Plan (traceability, briefs, SEO architecture, build order)

**Status:** Phase 3 deliverable — **⛔ checkpoint: awaiting your approval. No implementation code has been written, no branch has been created or changed.**
**Inputs:** `docs/v1-audit/*` (re-run on 17 Nov 2026), V1 source (commit `11e6fc8`), the Next.js 16 docs bundled in `node_modules/next/dist/docs` (per `AGENTS.md`), and `docs/v2/DESIGN.md`.

---

## 0. Decisions I need from you (everything else I will just do)

| # | Decision | My recommendation | Why it matters |
|---|---|---|---|
| **D1** | **Branch protocol.** A local `v2` branch already exists (`c2ebaab`, never pushed) holding an *earlier incremental V2 attempt* (21 code files, +594/−141, self-scored 9/10 in its own docs). Your working tree has uncommitted changes (formatting-only edit to `Navbar.tsx`, deleted earlier V2/V1 docs, the rewritten `docs/v1-audit/*` from this session). | **(A)** snapshot-commit everything on `v2` → rename it `v2-attempt-1` (archived, nothing deleted) → `git switch -c v2 main` → carry the new audit + design docs onto it. Alternatives: (B) continue on the existing `v2`; (C) use a different name such as `v2-rebuild`. | Rule 1 says "create a new branch called v2" — that name is taken. Whichever you pick, V1 on `main` is never touched, no force-push, nothing deleted. Full command list in §6.1. |
| **D2** | **Missing client content.** The repo contains **no** phone, email, WhatsApp, address, registration IDs, prices, team, testimonials, real parcel locations/coordinates or production domain. | Build every slot (typed, tested, SEO-wired) and show unresolved ones as marked `[CLIENT TO PROVIDE]` blocks in a `CONTENT_MODE=preview` build; `live` mode hides empty slots and **fails the build** if a critical item is missing (§5.4). Send me the content (list in §7.3) and I'll wire it in. | Rule 4 forbids inventing it, so some 🔴 items can only be *engineered* to completion, not *closed* — see §8 for what that does to the quality bar. |
| **D3** | **Structural removals** the audit asks for: intro curtain + footer "Replay", auto-rotating hero, parcel quick-preview modal, scroll-progress bar, chapter folios, "Future Homes" out of the top nav (footer + home teaser instead), nav label *Projects → Plots*. | Approve all. Every one maps to an audit ID in §2. | They change visible behaviour, so they should be yours to veto. URLs do **not** change (`/projects`, `/projects/<slug>` stay). |
| **D4** | **Typography change**: Cormorant + Manrope + JetBrains Mono + Noto Devanagari → **Newsreader + Instrument Sans** (+ Noto Serif Devanagari, lazy), self-hosted (−73 % font bytes). | Approve (evidence: `screenshots/type-specimen-comparison.png`). | Largest single visual lever; also removes the V1 "Cormorant + Manrope" template tell. |
| **D5** | **Imagery & CSP housekeeping**: the repo ships two stray `public/assets/aistudio/*.png` (0 references in code) and CSP `frame-ancestors` allows `aistudio.google.com`/`*.google.com`. Images look synthetic. | Remove the unused files; make embedding origins an env setting (default `'self'`); keep current images until you supply originals (≥ 2400 px). | Removing the CSP allowance would break an AI-Studio preview iframe if you still use one — so it's your call (rule 5: flag, don't change silently). |

If you simply reply **"approved"**, I proceed with the recommendations above.

---

## 1. Phase 1 — absorbing the audit

### 1.1 What I did
Read all of `docs/v1-audit/` (I produced it earlier this session, so the evidence is fresh), re-read the codebase (`app/`, 23 client components, `data/`, `lib/`, `services/`, `config/`, `styles/`), re-ran V1 locally (production build, port 3200) and re-measured its performance with a corrected environment (§1.3).

### 1.2 Root causes (not symptoms)
| RC | Root cause | Evidence | Symptoms it explains (audit IDs) |
|---|---|---|---|
| **RC1** | **No ops/content contract.** Business facts (domain, phone, email, WhatsApp, SMTP/CRM) default to *empty* and the app builds and ships green without them. | `config/siteConfig.ts:178-222`, `.env.example`, `services/enquiryService.ts:262-273` | C1, C2, C4, footer/contact failures |
| **RC2** | **The data model is a brochure, not a listing.** `LandPlot` has no price, address, geo, status, documents, dates or RERA fields; `isIllustrative: true` is a literal type. Filters, schema and detail pages can only express what the model holds. | `types/property.ts`, `data/properties.ts:70` | C3, H1, H5, H10, M10 |
| **RC3** | **Client-first architecture.** 23 files carry `'use client'`; every section is an island hydrated with GSAP/Motion for *decoration*; `useSearchParams` inside `<Suspense>` bails the whole enquiry section to client rendering. Chunk attribution of the V1 build: **GSAP/ScrollTrigger ≈ 182 KB raw / 64 KB gz and Motion ≈ 308 KB raw / 93 KB gz — ~45 % of all shipped JS (1.08 MB raw / 341 KB gz)**; mobile LCP is gated behind hydration (observed render delay 0.5–0.7 s, simulated 4.6–5.0 s). | `.next/static/chunks` analysis; Lighthouse JSON (`lcp-breakdown`, `bootup-time`); `EnquirySection.tsx:594-606`; raw HTML of `/contact` has no `<h1>` | C5, C6, H3, M5, M6 |
| **RC4** | **No design system in practice.** Tokens exist in `globals.css` but components bypass them: **940 arbitrary hex classes, 59 arbitrary pixel text sizes** (36 × `text-[11px]`). Contrast, tap-target and consistency bugs are inevitable. | `git grep` counts on V1 | H8, H9, M1, M4, M9, "template smell" |
| **RC5** | **Content strategy is atmosphere-first.** The same "quiet earth" message appears in three sections; no proof, no people, no registrations, no location facts. | `01-section-scores.md` | C8, H4, H8 |
| **RC6** | **Asset pipeline gaps.** No favicon/icons/manifest; generic 1.91 : 1 OG crop reused on 10 pages; 1376-px hero source stretched to 1574 px; lazy images have no blur placeholder; no static imports. | `app/` has no icon files; `imgcheck` (nw 1376 → rw 1574); 404 on `/favicon.ico` | C7, H2, L4, M8 |
| **RC7** | **Hand-rolled accessibility patterns** instead of native elements (custom focus-trap hook, SVG `role=button` inside `role=img`, custom dialogs, no scroll-lock). | axe: `nested-interactive`, `label-content-name-mismatch`; focus not restored from SVG trigger | H6, M2, M3 |
| **RC8** | **Fixed-position UI without layout reservation** (consent card over hero controls; header CTA hidden `< sm`). | `home-768-fold.png`, `Navbar.tsx:126` | H7, 05 §T1/M2/M4 |

### 1.3 Audit verification log (rule 3: verify before fixing)
Every finding was verified at least once with a test or measurement during the audit. In this phase I re-checked the ones whose cause or numbers I was least sure about:

| Item | Result |
|---|---|
| Enquiry returns 503 / no channels / `/contact` has no H1 / no favicon / placeholder canonical | ✅ **Confirmed** again from code + raw HTML (no change needed). |
| **⚠️ Audit correction — image delivery & some performance numbers.** `sharp` **cannot load on this Windows machine** (`@img/sharp-win32-x64` is missing because the lockfile only carries Linux binaries). Next 16 then serves the *original* file for every `/_next/image` request. The V1 audit therefore measured **unoptimised images** (hero 210 KB at every width) and over-stated weight on desktop. | **Re-measured V1** in an isolated worktree with `sharp` installed (`npm i --no-save sharp`, package files untouched): hero AVIF **26 KB @750 w / 81 KB @1440 w** (source 214 KB). The audit's "heaviest assets", "same photo fetched 3× at 210 KB" and "hero is both large for mobile and too small for desktop" lines are **overstated**; the *resolution* finding (1376-px source) still stands. |
| Home mobile performance | **Still failing, but different numbers** (median of 3 Lighthouse runs, sharp enabled): **62** (runs 53 / 68 / 62; audit said 53), LCP **5.0 s** (audit 6.0 s), TBT **604 ms** (range 411–1319; audit 900), CLS 0. Root cause is JS/hydration, not image bytes (`lcp-breakdown`: TTFB 17 ms, load 47 ms, **render delay 713 ms**). |
| Detail page mobile | **83** (81–83), LCP **4.6 s** — new finding: the LCP image has **no `fetchPriority="high"`** (Lighthouse `priorityHinted: false`) and is gated by hydration. |
| Projects page | 98 mobile / 99 desktop (confirmed). Home desktop **91** (audit 81); detail desktop **99** (audit 93). |
| Page weight | home mobile **663 KiB** (audit 861), home desktop **895 KiB** (audit 1,732). |
| M6 "back returns to scroll 0" | Reproduced; **root cause unverified** — suspects: `app/template.tsx` remount animation, `data-scroll-behavior="smooth"` interplay (Next 16 scroll-behavior change). Will be diagnosed in Phase 4 before any fix. |
| M12 AI-Studio assets | `git grep aistudio` → only `.gitignore` and the CSP line; the two PNGs in `public/assets/aistudio/` are unreferenced. |
| JSON-LD escaping *(new)* | V1's `JsonLd` does `JSON.stringify` without escaping `<` — the Next 16 JSON-LD guide recommends `.replace(/</g,'\\u003c')`. Low risk (static data) but adopted in V2. |

**Consequence for the final comparison:** `docs/v1-vs-v2-comparison.md` will use the **corrected V1 baseline above**, and the V2 self-audit runs in a `sharp`-enabled environment (§8) so V1 and V2 are compared like for like. I will not edit the V1 audit files; this plan is the record of the correction.

---

## 2. A — Traceability matrix

### 2.1 Issue-level (all 40 items of `06-v2-priorities.md`)
V1 score = the score of the section where the issue lives (`01-section-scores.md`). "Target" = the section score I will defend in the V2 audit; *(c)* = capped until client content arrives (§8).

#### 🔴 Critical
| ID | Issue (from audit) | Sev | V1 score | Root cause | V2 solution | Files affected | Target |
|---|---|---|---|---|---|---|---|
| **C1** | Enquiry form cannot deliver a lead (503); visitor told to copy their own summary | 🔴 | Enquiry 3 | RC1 | Typed config + launch gate; SSR form; service tries SMTP **and** webhook, returns a reference ID; honest preview/error states; `/api/health` (booleans only); **end-to-end test against a local SMTP sink** in CI/self-audit; production credentials are client-supplied | `lib/config.ts`, `lib/enquiry/*`, `app/api/enquiries/route.ts`, `app/api/health/route.ts`, `components/forms/EnquiryForm.tsx`, `scripts/dev-smtp-sink.mjs`, `scripts/check-launch.mjs`, `.env.example` | 8 *(c)* |
| **C2** | Zero contact channels (0 tel / mailto / WhatsApp / address / map / social) | 🔴 | Footer 4, Contact 3 | RC1 | `content/site.ts` contact block (phone, email, WhatsApp, address, hours, socials) feeding header icons, mobile sheet, footer, contact page and JSON-LD; slots in preview; gate in live | `content/site.ts`, `components/layout/*`, `app/contact/page.tsx`, `lib/structured-data.ts` | 8 *(c)* |
| **C3** | Sample-only inventory, no prices/addresses | 🔴 | Cards 5, Detail 6 | RC2 | Typed `Parcel` model (price, address, geo, status, RERA, documents, `updatedAt` all optional); explicit "Price on request"; sample/concept labelling; `Offer` emitted only when a price exists | `content/parcels.ts`, `types/parcel.ts`, `lib/parcels.ts` | 8 *(c)* |
| **C4** | Canonical/sitemap/OG/JSON-LD use unverified `https://3venisphere.com` | 🔴 | SEO 6 | RC1 | `NEXT_PUBLIC_SITE_URL` required in live (build fails); preview/unverified builds emit `noindex` + `Disallow: /`; one `siteUrl` source for canonical, OG, sitemap, schema | `lib/config.ts`, `lib/metadata.ts`, `app/robots.ts`, `app/sitemap.ts` | 9 |
| **C5** | `/contact` has no `<h1>` and no form in server HTML (Suspense bailout) | 🔴 | Enquiry 3 / SEO 3 | RC3 | Read `searchParams` on the server and pass `defaultInterest` as a prop — no `useSearchParams`, no bailout; H1 + copy in SSR; regression test greps built HTML | `app/contact/page.tsx`, `components/forms/EnquiryForm.tsx`, `scripts/audit/seo-source.mjs` | 9 |
| **C6** | Home mobile perf 53 → **re-measured 62**, LCP 5.0 s, TBT 604 ms | 🔴 | Perf 5 | RC3 | Server Components by default; remove GSAP + Motion + lucide (~45 % of JS); no intro; hero `preload` + `fetchPriority`; 73 KB self-hosted fonts; islands only for header menu, filters, lightbox, enquiry, checklist; `content-visibility:auto` below the fold | `package.json`, `app/layout.tsx`, `components/**`, `styles/*` | Lighthouse mobile ≥ 90 on **all** pages |
| **C7** | No favicon / icons / manifest; 404 on every load | 🔴 | Footer/SEO | RC6 | `app/favicon.ico`, `icon.png`, `apple-icon.png`, `manifest.ts` generated from the supplied emblem (Pillow script committed) | `app/*`, `scripts/gen-icons.py` | 10 |
| **C8** | No trust signals (team, registrations, reviews, years, press) | 🔴 | About 6 | RC5 | `Proof` slots: registrations block, leadership, testimonial, stats row, press; compliance block in footer (RERA/CIN); candour badges; process transparency from existing copy; preview slots + launch gate | `components/sections/ProofRow.tsx`, `components/ui/ClientSlot.tsx`, `content/placeholders.ts`, footer | 8 *(c)* |

#### 🟠 High
| ID | Issue | Sev | V1 score | Root cause | V2 solution | Files affected | Target |
|---|---|---|---|---|---|---|---|
| **H1** | No property search; filters = category + keyword + size sort, not in URL | 🟠 | Plots 5 | RC2/RC3 | Hero GET search (format · size · terrain) → `/projects?…`; server-side filtering via `searchParams` (format, size, terrain, q, sort, page, view); removable chips; `aria-live` count; pagination links | `components/home/HeroSearch.tsx`, `app/projects/page.tsx`, `lib/search-params.ts`, `components/property/ListingFilters.tsx` | 8 |
| **H2** | Synthetic-looking imagery; hero 1376 px stretched to 1574 | 🟠 | Hero 6 | RC6 | Static-import images (intrinsic size + blur); media capped to ≤ 1.15× intrinsic; art-directed mobile crop; focal points; asset spec sent to client (Q5) | `content/images.ts`, `components/ui/Media.tsx` | 8 *(c)* |
| **H3** | Intro curtain gates first ~3.3 s | 🟠 | Intro 4 | RC3 | Delete `BrandIntroCurtain`, `introSession`, footer "Replay"; no first-viewport animation | `components/motion/*`, `lib/introSession.ts`, tests | removed |
| **H4** | "Map" is a schematic; no geography | 🟠 | Map 5 | RC5 | Plan view labelled "Schematic — not to scale" (SVG anchors); `LocationBlock`: click-to-load map only when coordinates exist (consent-aware); location slots | `components/property/Masterplan.tsx`, `components/property/LocationBlock.tsx` | 8 *(c)* |
| **H5** | Schema too generic (`Place` only; thin Organization) | 🟠 | SEO 6 | RC2 | Builders for `Organization`, `RealEstateAgent`, `WebSite`, `RealEstateListing`(+`Place`, +`Offer` if price), `CollectionPage`+`ItemList`, `Article`, `FAQPage`, `BreadcrumbList`, `ContactPage`; unit tests validate shape; `<` escaping | `lib/structured-data.ts`, `components/seo/JsonLd.tsx`, `lib/__tests__/structured-data.test.ts` | 9 |
| **H6** | Mobile menu: no scroll-lock/trap; header CTA hidden `< 640` | 🟠 | Navbar 6 | RC7/RC8 | Native `<dialog>` sheet (trap, Esc, inert, focus return) + CSS scroll lock; persistent **Enquire** at every width | `components/layout/Header.tsx`, `MobileMenu.tsx` | 8 |
| **H7** | Cookie banner overlaps hero controls / gallery captions; 27–29-px buttons | 🟠 | Cookie 5 | RC8 | Docked bottom bar sets `--consent-h`, page reserves space; 44–48-px actions; preferences in native dialog | `components/layout/ConsentBar.tsx` | 8 |
| **H8** | Repeated brand copy, generic boilerplate, template smell | 🟠 | Statement 6 / Why 5 / Storytelling 5 | RC4/RC5 | 9 sections → 7; each existing message used once; chapter folios and decorative motifs removed; specifics-over-adjectives rule | `app/page.tsx`, `components/home/*`, `content/copy.ts` | 8 |
| **H9** | Gold-on-olive 3.7 : 1 (axe serious ×5) | 🟠 | Why 5 | RC4 | Tokens only; brass banned as light-surface text; night band uses `on-night`/`brass-soft` (≥ 5.8 : 1); CI token lint | `styles/tokens.css`, `scripts/check-tokens.mjs` | 9 |
| **H10** | Detail page thin: no price, map, docs, agent, lightbox, share | 🟠 | Detail 6 | RC2 | Dossier template: gallery + lightbox, spec list, documents slot, location block, plan position, sticky enquiry panel, similar-by-attribute, prev/next, `RealEstateListing` | `app/projects/[slug]/page.tsx`, `components/property/*` | 9 |
| **H11** | Future Homes: 3 unavailable concepts take a nav slot + home section | 🟠 | Future 5 | RC5 | Footer + compact home teaser; page as editorial rows with "Concept — not for sale" badge; "Register interest" prefilled | `app/future-homes/page.tsx`, `components/home/ResidencesTeaser.tsx` | 8 |
| **H12** | Buyer guide "checklist" is static (0 inputs); single guide | 🟠 | Guide 6 | RC3 | Interactive checklist island (tick, progress, localStorage, print), FAQ as `<details>`, `Article` + `FAQPage`; generic `/guides/[slug]` template + `/guides` hub | `components/guides/InteractiveChecklist.tsx`, `app/guides/**`, `content/guides.ts` | 9 |

#### 🟡 Medium
| ID | Issue | Sev | V1 score | Root cause | V2 solution | Files affected | Target |
|---|---|---|---|---|---|---|---|
| **M1** | Leftover "CHAPTER 06 / 04" folios on standalone pages | 🟡 | Enquiry 3 / About 6 | RC4 | Folio component deleted; plates/captions only | `components/ui/BrandMotifs.tsx` (removed) | 8 |
| **M2** | axe: SVG label ≠ visible text, nested-interactive, `heading-order` h1→h3 | 🟡 | Map 5 / Listing 5 | RC7 | Plan view built from `<a>` in an `<svg role="group">`, label starts with the visible name; heading-order unit/audit check | `Masterplan.tsx`, pages | 9 |
| **M3** | Focus not restored (SVG trigger); no focus to first invalid field; inputs rely on 1-px border | 🟡 | Map 5 / Enquiry 3 | RC7 | Native `<dialog>` returns focus; submit handler focuses first invalid; global 2-px ring token | `EnquiryForm.tsx`, `ui/*` | 9 |
| **M4** | 61 tap targets < 44 px at 375 | 🟡 | Hero 6 / Footer 4 | RC4 | 44-px minimum token; audit script re-measures all interactives | `styles/*`, all components | 9 |
| **M5** | Hero auto-rotates every 7.5 s without pause | 🟡 | Hero 6 | RC3 | Static hero; nothing auto-moves anywhere | `components/home/Hero.tsx` | 9 |
| **M6** | Back from a parcel lands at scroll 0 | 🟡 | Plots 5 | RC3 (suspected) | Diagnose first (template remount / scroll-behavior); remove `template.tsx`; real links so the browser restores scroll; Playwright test | `app/template.tsx` (removed), `app/layout.tsx` | 9 |
| **M7** | Same parcel shown twice (map panel + lead card) | 🟡 | Plots 5 | RC5 | One card list; plan panel only in plan view | `ListingGrid`, `Masterplan` | 8 |
| **M8** | Lazy images render as flat black frames | 🟡 | Storytelling 5 | RC6 | Static imports ⇒ automatic blur placeholders; `aspect-ratio` boxes on `sunken` | `Media.tsx` | 9 |
| **M9** | 4 font families, ≈ 274 KB | 🟡 | — | RC4 | 2 families (+ lazy Devanagari), self-hosted ≈ 73 KB | `app/layout.tsx`, `public/fonts/*` | 9 |
| **M10** | Sitemap `lastmod` fixed; thin legal pages listed; 404 canonical `/404` | 🟡 | SEO 6 | RC2 | `updatedAt` per record; legal/utility pages excluded (indexable, not in sitemap); no canonical on error pages | `app/sitemap.ts`, `lib/metadata.ts` | 9 |
| **M11** | `"Showing 0{n} of 0{m}"` breaks past 9 | 🟡 | Plots 5 | RC4 | Proper formatter; "6 plots" | `ListingFilters.tsx` | 9 |
| **M12** | CSP allows AI-Studio origins; stray assets | 🟡 | — | RC1 | `EMBED_ALLOWED_ORIGINS` env (default `'self'`); delete unreferenced PNGs (after D5) | `next.config.ts`, `public/assets/aistudio/` | 9 |
| **M13** | `npm ci` peer-dependency override warnings (eslint 10 vs config-next) | 🟡 | — | RC1 | Align `eslint` with `eslint-config-next`'s peer range; `npm ci` must be warning-free; also solve Windows `sharp` (explicit dependency + platform binaries) | `package.json`, `package-lock.json` | 9 |

#### ⚪ Low
| ID | Issue | Sev | V1 score | Root cause | V2 solution | Files affected | Target |
|---|---|---|---|---|---|---|---|
| **L1** | No analytics installed, consent guards nothing | ⚪ | Cookie 5 | RC1 (decision never made) | Consent-gated loader reading env (none installed until the client chooses) | `components/analytics/*` | 8 |
| **L2** | `lang="hi"` missing on Devanagari | ⚪ | — | RC7 | `lang` attributes + translations (L7) | `components/ui/Motto.tsx` | 9 |
| **L3** | Skip-link target not focusable | ⚪ | Navbar 6 | RC7 | `<main tabIndex={-1}>` | `app/layout.tsx` | 9 |
| **L4** | OG images raw 1376 × 768, same on 10 pages | ⚪ | SEO 6 | RC6 | 1200 × 630 per-page crops + default brand card (Pillow script) | `public/og/*`, `scripts/gen-og.py` | 9 |
| **L5** | 404 offers no search/suggestions | ⚪ | 404 7 | RC5 | Search form + suggested plots/guide | `app/not-found.tsx` | 9 |
| **L6** | "Replay Brand Intro" in footer | ⚪ | Footer 4 | RC3 (decorative gimmick) | Removed with H3 | footer | removed |
| **L7** | Hindi accents untranslated | ⚪ | Statement 6 | RC5 | Translation captions | `content/copy.ts` | 9 |

### 2.2 Section-level (every section scored < 8 in V1, plus the sections that did not exist)
| Section | V1 | Target | Issues it must close | Brief (§3) |
|---|---|---|---|---|
| Navbar / header | 6 | 8 | H6, L3, C2 | B1 |
| Brand intro curtain | 4 | *removed* | H3, L6 | — |
| Hero | 6 | 9 | H1, H2, M5, M4, C6 | B2 |
| Brand statement + principles | 6 | 8 | H8, L2, L7 | B3 |
| Featured plots (cards, search, filters) | 5 | 8 | H1, M7, M11, M8 | B4 |
| Plot map | 5 | 8 | H4, M2, M3 | B12 (plan view) |
| About / stewardship (home) | 6 | 8 | C8, H8 | B3 / B14 |
| Location & lifestyle carousel | 5 | 8 | H4, H8 | B6 |
| Visual storytelling (monograph) | 5 | *merged into B6* | H8, M8 | B6 |
| Why choose us (olive) | 5 | 8 | H9, H8 | B5 |
| Future homes (home + page) | 5 | 8 | H11 | B7 / B16 |
| Enquiry form / contact | 3 | 8 *(c)* | C1, C2, C5, M1, M3 | B9 / B17 |
| Footer | 4 | 8 *(c)* | C2, C7, C8, L6 | B10 |
| Cookie consent | 5 | 8 | H7, L1 | B11 |
| Project detail page | 6 | 9 | C3, H5, H10 | B13 |
| Projects listing | 5 | 8 | H1, M2, M7 | B12 |
| About page | 6 | 8 | C8, M1 | B14 |
| Buyer guide | 6 | 9 | H12 | B15 |
| 404 | 7 | 8 | L5, M10 | B19 |
| Legal pages | 6 | 8 | M10 (typography only; **text unchanged**) | B18 |
| *Did not exist:* property search | 1 | 8 | H1 | B2/B12 |
| *Did not exist:* agents/team, testimonials, stats, press | 1 | slots (c) | C8 | B14 `ProofRow` |
| *Did not exist:* services | 1 | **out of scope** unless client supplies (Q10) | — | — |
| *Did not exist:* blog/insights | 1 | Guides hub + template (content-gated) | H12 | B15 |
| *Did not exist:* newsletter | 1 | **not built** (no ESP); "Register interest" via enquiry covers it | — | — |
| *Did not exist:* real map | 1 | click-to-load when coordinates exist (c) | H4 | B13 |
| *Did not exist:* contact details | 1 | slots + gate (c) | C2 | B10 / B17 |

---

## 3. B — Section redesign briefs
Common to all briefs: tokens and components from `DESIGN.md`; server-rendered content; one primary action per viewport; 44-px targets; visible focus; no first-viewport animation; copy kept verbatim unless noted.

**B1 · Header / navigation** — *Purpose:* orient, offer the one persistent action. *V1:* hidden CTA < 640, no scroll lock, blur header, 6 links incl. "Home". *V2:* wordmark (emblem disc + tracked caps) · **Plots · Buyer's guide · About · Contact** · **Enquire** at every width · phone/WhatsApp icon buttons when configured. Transparent over the home hero (on-dark), solid `canvas/96 %` after 24 px and on every inner page. *Interactions:* native `<dialog>` mobile sheet (focus trap, Esc, inert, scroll lock via CSS), closes on navigation. *Mobile:* 64-px bar; sheet links in `display-md`; Enquire + channels pinned at the bottom. *SEO:* `<nav aria-label>`, crawlable `<a>`, `aria-current`.

**B2 · Hero + docked search** — *Purpose:* state what this is and start the journey. *V1:* auto-rotating three-slide hero, 1376-px image stretched, no search, 29-px tabs, intro curtain above it, kicker with Devanagari in the LCP area. *V2:* one **static** plate (Aranya Ridge aerial) — desktop full-bleed with scrimmed left text column (≥ 0.72 scrim), **mobile image-first (4 : 5) with type on paper**. Eyebrow = keyword line "Contoured residential land plots"; the **H1 keeps the client's line** "Quiet earth. Enduring architecture." (eyebrow + line live inside the single `<h1>`, so the heading carries intent without rewriting the brand voice). Existing sub-copy kept. CTAs: **Explore plots** (primary) + **Our approach** (text link). **Docked search** (native GET form): Format · Plot size · Terrain → `/projects?…`. Caption plate links to the parcel. *LCP:* image via `preload` + `fetchPriority="high"`, AVIF @ 26–80 KB, `sizes` exact; no opacity-0 starts. *SEO:* one H1, descriptive alt, search results are real URLs.

**B3 · Positioning statement + principles** — *Purpose:* the brand idea, once. *V1:* 3 repetitions of the same message. *V2:* one large `display-lg` statement ("We treat residential land not as a commodity to be crowded, but as quiet ground worthy of patient architecture.") + the three principles (Contour-Led Selection · Unclouded Clarity · Land Today, Form Tomorrow) as hairline columns; Devanagari motto (`lang="hi"`) with an English caption. *Content hierarchy:* statement → principles → two text links (About, Buyer's guide). *Mobile:* single column. *SEO:* real H2.

**B4 · Featured parcels** — *Purpose:* get to a parcel in one click. *V1:* map panel + lead card + grid duplicating the same parcel; two competing CTAs per card; "0{n}" counter. *V2:* three featured cards (Aranya wide, Vatika, Shila) using the single card component; "View all 5 plots" text link; *no* modal. *Cards:* media 3 : 2 + badge + code + title + terrain line + 3 specs + "Price on request". *Mobile:* 1-up, swipe not required. *SEO:* `<article>` list, real links, `ItemList` not needed here.

**B5 · Method (night band)** — *Purpose:* proof of process using existing client copy. *V1:* olive band, gold-on-olive 3.7 : 1, boilerplate. *V2:* `night` band (never olive text), 4 numbered columns reusing V1's *Why choose* copy (Thoughtful Property Selection · Clear Property Information · Customer-Focused Advisory · A Considered Ownership Horizon) under the line "Quiet diligence before every decision." Numerals in `brass-soft`. *This is the page's single night band.* *SEO:* H2 + H3s.

**B6 · Terrain & light mosaic (merges Location carousel + Visual storytelling)** — *Purpose:* atmosphere + the location story. *V1:* carousel with no location, black-frame monograph. *V2:* asymmetric 4-image mosaic (existing four plates) with captions; **click → lightbox**; existing "Natural Surroundings / Thoughtful Accessibility / Future Possibility" copy beside it; a **location facts slot** (`[CLIENT TO PROVIDE: site location, connectivity, drive times]`). *Mobile:* 2-up grid → single column. No carousel.

**B7 · Future residences teaser** — *V1:* full carousel of non-purchasable concepts. *V2:* compact three-up row with "Concept — not for sale" badges and a link to `/future-homes`; the existing disclaimer ("not currently open for purchase") kept verbatim.

**B8 · Guide teaser** — a single feature card linking to the Buyer's guide (internal linking + authority; Knight Frank pattern): title, one-line summary (existing meta description), "Read the guide".

**B9 · Enquiry band (home) / form** — *Purpose:* the conversion. *V1:* Suspense-wrapped client form, 503. *V2:* two columns — left: heading, existing intro copy, **direct channels** (phone / WhatsApp / email / address as configured, otherwise slots) and the privacy statement; right: the form — Full name · Phone · Email · Interested in (prefilled via server-read `?interest=`) · Terrain/format · Message · consent line; honeypot kept; 52-px fields; first-invalid focus; loading state; **success** panel with reference ID and "Make another enquiry"; **failure** keeps input + shows channels. SSR'd (H1/copy in HTML). *Mobile:* single column, sticky submit not needed.

**B10 · Footer** — `night`: brand + **registered identity block** (name, address, phone, email, RERA/CIN slots) · Plots (5 parcels) · Company · Legal + *Cookie settings*; accordions on mobile; **no replay link**; socials only if provided. Compliance text from the existing legal pages is *linked*, not rewritten.

**B11 · Consent bar** — docked bottom bar, 3 equal-weight actions, reserves page padding; preferences dialog (native). Behaviour and storage key unchanged (`3veni_cookie_consent_v1`) so existing consent records stay valid.

**B12 · Listing (`/projects`)** — *Purpose:* find and compare. *V1:* a copy of the home block; h1→h3; no URL state. *V2:* H1 "Plots", count, filter row (Format · Size · Terrain · Search · Sort · View toggle), chips, **List | Plan** views, card grid 1/2/3-up, **numbered pagination** (page size 6), `loading.tsx` skeleton, empty state. **Plan view** (≥ 768 px): SVG schematic labelled "Schematic — not to scale"; each parcel is an `<a>` to its dossier (no modal); hover/focus shows an info panel; below 768 px the plan collapses to the list. *State:* URL (`?format=&size=&terrain=&q=&sort=&view=&page=`), server-rendered. *SEO:* canonical `/projects`; any filter/sort/view param ⇒ `noindex,follow` + canonical to base; `?page=n` self-canonical; `CollectionPage` + `ItemList`.

**B13 · Parcel dossier (`/projects/[slug]`)** — *Purpose:* decision page. *V1:* five spec fields, no price/map/docs/lightbox. *V2:* breadcrumb · badge · H1 · terrain/corridor · **gallery** (main plate + thumbs → lightbox) · **left column:** overview (existing copy), site highlights, **specification list** (`<dl>`: size, dimensions, facing, road width, topography, price-on-request/price, status, RERA slot), documents slot (brochure/survey sketch), **location block** (click-to-load map when coordinates exist; otherwise slot), "Position on masterplan" mini-plan · **right column (sticky ≥ lg):** enquiry panel (name, phone, email, submit) with direct channels · **similar parcels** (same format / nearest size, computed) · prev/next parcel. *SEO:* `RealEstateListing` + `Place` (+ `Offer` only with a price), `BreadcrumbList`, unique title/description, per-parcel OG 1200 × 630. *Mobile:* panel becomes a bottom "Request dossier" bar (reserves space).

**B14 · About (`/about`)** — existing story, emblem meaning and approach/vision copy; "How we evaluate land" (links to the guide); **ProofRow + leadership + registrations slots** (preview only). No chapter folios.

**B15 · Guides (`/guides`, `/guides/[slug]`)** — hub shows the single guide as a feature (hub is `noindex` until ≥ 3 guides). Guide template: breadcrumb, H1, sticky in-page contents, **interactive checklist** (tick, progress bar `role="progressbar"`, `localStorage`, reset, **print stylesheet**), FAQ as `<details>`, closing CTA. Existing guide text and FAQs verbatim. *SEO:* `Article` + `FAQPage` + breadcrumb (FAQ rich results are not guaranteed by Google; markup kept for semantics).

**B16 · Future homes (`/future-homes`)** — three editorial rows (image + typology + footprint + material palette + the existing architectural note) each with a "Concept — not for sale" badge and "Register interest" (prefills the enquiry). Static, no carousel.

**B17 · Contact (`/contact`)** — H1 in SSR; two columns: **channels** (phone, WhatsApp, email, address, hours — slots in preview) + click-to-load map when coordinates exist; the same `EnquiryForm`; privacy statement. `ContactPage` schema.

**B18 · Legal (`/privacy-policy`, `/cookie-policy`, `/terms-and-conditions`)** — **text unchanged** (rule 5); restyled in the reading container with sticky contents; excluded from the sitemap, still `index,follow`.

**B19 · 404 / error / loading** — `not-found` (HTTP 404, no canonical) keeps the client's voice ("This terrain coordinate does not exist.") with search + suggested plots and the guide; `error.tsx` + `global-error.tsx` with retry; `loading.tsx` skeletons for `/projects` and detail.

---

## 4. C — SEO architecture plan

| Area | Plan |
|---|---|
| **Rendering** | Everything a crawler needs is in the server HTML. Pages are Server Components; static where possible (`generateStaticParams` for parcels/guides). `/projects` is rendered per request because it reads `searchParams` (Next 16: async `searchParams`) — fast with 5–50 records; optional CDN `Cache-Control` for `/projects`. **No `useSearchParams` in a statically rendered tree** (the V1 bailout). A build-time test greps the built HTML of `/`, `/contact`, a parcel and the guide for the H1, key copy and form fields. |
| **URLs** | Keep existing, already clean URLs → no redirects: `/`, `/about`, `/projects`, `/projects/<slug>`, `/future-homes`, `/guides/land-buying-checklist`, `/contact`, legal pages. Add `/guides` (hub). Filters are query strings. Slugs are stable; a redirect map is reserved if a slug ever changes. |
| **Metadata** | One `buildMetadata()` helper → unique `title` (≤ 60 chars: keyword · brand), `description` (120–155 chars), absolute `canonical`, `openGraph` (type, locale `en_IN`, per-page 1200 × 630 image + alt), `twitter` card, `robots`. Patterns: Home *"3VENI SPHERE — Contoured residential land plots & architectural planning"*; Listing *"Land plots — residential, corner & estate parcels"*; Parcel *"{Name} — {area} {format} plot"*. `<html lang="en-IN">`. **Location keywords are impossible until the client supplies real site locations (Q3)** — noted as the biggest SEO ceiling. |
| **Indexation rules** | Preview / unverified-domain builds: `noindex` + `Disallow: /` (prevents indexing a staging site under a placeholder domain). Live: indexable pages as above; filtered/sorted/plan URLs `noindex,follow` + canonical to `/projects`; `?page=n` self-canonical; `/guides` hub `noindex` until ≥ 3 guides; 404 pages carry **no canonical**; legal pages indexable but out of the sitemap. |
| **JSON-LD** (escaped with `<`→`<`) | **Site-wide:** `Organization`, `WebSite`; **`RealEstateAgent`** (LocalBusiness subtype) emitted with only the fields the client has supplied (name, url, logo, telephone, email, address, `areaServed`, `sameAs`) — nothing invented. **Home:** the above. **Listing:** `CollectionPage` + `ItemList` of `ListItem`→parcel URLs. **Parcel:** `RealEstateListing` (`about`: `Place` with `additionalProperty` area/dimensions/orientation/road width, `geo`/`address` when present, `image`, `datePosted`/`dateModified` from `updatedAt`) + `Offer` **only when a price exists** + `BreadcrumbList`. **Guide:** `Article` + `FAQPage` + `BreadcrumbList`. **Contact:** `ContactPage`. Tests parse every emitted block and assert required fields; the Rich Results / Schema Markup Validators are run on the built pages for the audit. |
| **Sitemap** | `app/sitemap.ts` → home, plots, each parcel, about, guides (+ each guide), future-homes, contact; `lastModified` from each record's `updatedAt` (no fixed date); `changeFrequency`/`priority` dropped (ignored by Google). |
| **robots.txt** | `Allow: /`, `Disallow: /api/`; Sitemap line from `siteUrl`; preview mode → `Disallow: /`. |
| **Images** | Static imports (intrinsic dimensions, blur), AVIF → WebP via `next/image`, exact `sizes`, hero `preload`, below-fold lazy, descriptive unique alts (V1 alt copy kept), descriptive file names. `images.qualities` configured if anything other than 75 is used (Next 16 default is `[75]`). |
| **Internal linking** | Header/footer to every parcel; hero search and taxonomy chips (format, terrain, size) → filtered URLs; parcel pages → guide sections (road width, boundary, documents) and back; "similar parcels"; breadcrumbs everywhere; guide → listing and contact. |
| **Core Web Vitals as SEO** | Targets: LCP < 2.5 s, CLS < 0.1 (aspect-ratio boxes, blur placeholders, `size-adjust` font fallbacks), INP < 200 ms (≤ 5 small islands, no long tasks) — enforced by the audit (§8). |
| **Status codes** | Real 404 for unknown slugs (`notFound()`), 308 only if a slug changes; error pages never indexable. |
| **Local SEO** | NAP block (footer, contact, schema) and `areaServed` activate automatically when the client supplies the data (Q1–Q3). |

---

## 5. Technical architecture & dependency decisions

### 5.1 Stack (unchanged where it works)
Next.js 16.4.6 (App Router, Turbopack), React 19, Tailwind 4 (CSS-first `@theme`), TypeScript, Node's built-in test runner via `tsx` (existing `npm test`), `nodemailer` for SMTP. **Next 16 specifics honoured:** async `params`/`searchParams`; `next/image` `preload` (replaces deprecated `priority`); `images.qualities`/`localPatterns` configured if needed; no `middleware` (not required); `next lint` is gone → `eslint .` + `tsc --noEmit`.

### 5.2 Dependency delta (rule 7)
| Change | Package | Justification |
|---|---|---|
| **− remove** | `gsap` | ≈ 64 KB gz upper bound; used only for parallax/stagger decoration (RC3) |
| **− remove** | `motion` | ≈ 93 KB gz upper bound; layout/enter animations replaced by CSS |
| **− remove** | `lucide-react` | generic icons (template cap) → 20 custom inline SVGs; −1 dep |
| **= keep** | `nodemailer`, `tailwindcss`, `@tailwindcss/postcss`, `react`, `next`, `typescript`, `tsx` | needed |
| **± align** | `eslint` ↔ `eslint-config-next` peer range | M13 (warning-free `npm ci`) |
| **+ none new at runtime** | `sharp` | already Next's optional peer; declared explicitly so images optimise on Windows *and* Vercel (otherwise Next serves unoptimised originals — the V1 audit pitfall) |
| **audit tooling** | `playwright-core`, `lighthouse`, `axe-core` | live in `scripts/audit/package.json` (own `node_modules`), **never shipped or added to the app's dependencies** |

### 5.3 Structure
```
app/            layout, pages, loading/error/not-found, icon/apple-icon/favicon/manifest, robots, sitemap, api/{enquiries,health}
components/     ui/ (Button, Field, Select, Badge, Dialog, Icon, Media, ClientSlot, Reveal, Skeleton)
                layout/ (Header, MobileMenu, Footer, ConsentBar)   property/ (ParcelCard, SpecList, Gallery, Lightbox, Masterplan, ListingFilters, Pagination, EnquiryPanel)
                home/ (Hero, HeroSearch, Principles, Featured, Method, Mosaic, ResidencesTeaser, GuideTeaser, EnquiryBand)
                forms/ (EnquiryForm)   guides/ (InteractiveChecklist, Faq)   seo/ (JsonLd)
content/        site.ts (contact, identity, socials — typed, all optional), parcels.ts, residences.ts, guides.ts, copy.ts, images.ts, placeholders.ts
lib/            config.ts, content-mode.ts, parcels.ts (selectors), search-params.ts, format.ts, metadata.ts, structured-data.ts, enquiry/(validation, service), rate-limit.ts, consent.ts
styles/         tokens.css (@theme), base.css, components.css
scripts/        check-launch.mjs, check-tokens.mjs, dev-smtp-sink.mjs, gen-icons.py, gen-og.py, audit/*
```

### 5.4 Content mode & launch gate (answers rule 4 + C1/C2/C4/C8)
* `CONTENT_MODE=preview` (default): unresolved client content renders as a marked **`[CLIENT TO PROVIDE: …]` slot** (DESIGN §8.13); the build is `noindex`.
* `CONTENT_MODE=live`: unresolved slots render **nothing**; `scripts/check-launch.mjs` runs before `next build` and **fails** if a *critical* item is missing: production domain, ≥ 1 public contact channel, enquiry delivery (SMTP or webhook), legal entity name. Non-critical items (testimonials, press, stats) are listed as warnings.
* `content/placeholders.ts` is the registry (id, where used, what is needed, owner); `npm run content:report` prints it and feeds `HANDOVER.md`.

### 5.5 Data model (RC2)
`Parcel` = existing V1 fields **verbatim** (names, descriptions, specs, highlights, galleries, alt text) **+** typed optionals: `status`, `price`, `address`, `geo`, `reraId`, `documents[]`, `updatedAt`, `focal` per image, `featured`. `Residence` (concepts) likewise. Selectors (`filterParcels`, `similarParcels`, `facets`) are pure, unit-tested functions shared by SSR and the hero search so there is **one source of truth for filter options** (the Sobha anti-pattern).

### 5.6 Enquiry pipeline (C1)
`EnquiryForm` (client island, SSR markup) → `POST /api/enquiries` (kept; honeypot, sanitising, rate-limit retained) → `service` tries **SMTP and CRM webhook**, succeeds if either does, returns `{status:'delivered', referenceId}`; if none configured → `preview` response (clearly labelled, never presented as sent); failures keep user input and surface channels. **Verification:** `scripts/dev-smtp-sink.mjs` (≈ 60 lines, Node `net`) receives the mail in the audit; an integration test asserts reference ID, recipient, reply-to and body. `/api/health` returns configuration booleans only. Known limitation (documented): the in-memory rate limiter is per instance on serverless.

### 5.7 Security / headers
Keep CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy; `frame-ancestors` from `EMBED_ALLOWED_ORIGINS` (default `'self'`, D5); JSON-LD `<` escaping; no secrets under `NEXT_PUBLIC_`.

### 5.8 Testing
Unit: selectors/search-params parsing, formatters, validation, rate limit, schema builders (JSON-LD shape), content gate, consent. Integration: enquiry → SMTP sink. Source-HTML regression (H1/form present). Audit suite (`scripts/audit`): crawl + screenshots at 375/768/1024/1440, interaction matrix, keyboard walk, axe, Lighthouse ×3, overflow and tap-target probes, console/network capture.

---

## 6. D — Build order and commit plan

### 6.1 Git protocol (on approval of D1-A) — nothing below has been run yet
```bash
git add -A && git commit -m "wip: snapshot before V2 rebuild (uncommitted work, V1 audit re-run)"   # rule 1: commit uncommitted work first
git branch -m v2 v2-attempt-1                    # archive the earlier attempt — nothing deleted
git switch -c v2 main                            # fresh V2 from V1 code; main is never touched
git checkout v2-attempt-1 -- docs/v1-audit docs/v2/DESIGN.md docs/v2/00-v2-plan.md docs/v2/design-board docs/v2/screenshots
git commit -m "docs: V1 audit (strict re-run) + V2 design direction and plan"
```
Never force-push; `origin` has only `main` and nothing is pushed unless you ask.

### 6.2 Build order (each bullet = one commit; verified at 375 / 768 / 1440 with before/after screenshots in `docs/v2/screenshots/`)
1. **`v2: design tokens, fonts & base styles`** — `tokens.css`, self-hosted fonts (+ ₹ glyph check), base/reset, token-lint script, favicon set.
2. **`v2: UI primitives`** — Button, Field/Select/Checkbox, Badge, Icon set, Dialog, Media, Skeleton, ClientSlot, Reveal (all states, shown on a `/styleguide` route that returns 404 in `CONTENT_MODE=live`).
3. **`v2: content model, config & launch gate`** — typed `Parcel`/`Residence`/`Guide`, `content/site.ts`, `CONTENT_MODE`, `check-launch`, placeholders registry, selectors + tests.
4. **`v2(seo): metadata, schema, sitemap, robots, OG, icons`** — builders + tests, escaping, noindex rules, source-HTML regression test.
5. **`v2(enquiry): form, API, SMTP sink test, health`** — 🔴 C1/C5.
6. **`v2(layout): header + mobile sheet, footer, consent bar`**.
7. **`v2(home): hero + docked search`**, then **principles → featured → method → mosaic → residences/guide teasers → enquiry band** (separate commits per section).
8. **`v2(plots): listing — URL state, cards, pagination, plan view, empty/loading`**.
9. **`v2(plots): dossier — gallery + lightbox, specs, location block, sticky enquiry, similar parcels`**.
10. **`v2(pages): about, contact, future homes, guides (+ interactive checklist), legal, 404/error`**.
11. **`v2(perf): remove gsap/motion/lucide; bundle + image + font budgets`** (M6 diagnosed here).
12. **`v2(a11y): keyboard, focus, reduced-motion, contrast, tap-target pass`**.
13. **`v2(audit): self-audit iteration 1…3`** → `docs/v2-audit/*`; fixes between iterations.
14. **`v2(docs): comparison, changelog, handover`**.

---

## 7. E — Risks & open questions

### 7.1 Risks
| # | Risk | Mitigation |
|---|---|---|
| R1 | **Quality bar vs. rule 4** — Contact/Footer/Trust/Price sections cannot reach 8 without client content (§8). | State it up front; score honestly with caps; deliver slots + gate; re-audit when content arrives. |
| R2 | **Imagery** appears synthetic and tops out at 1376 px. | Build for drop-in replacement; cap upscaling; request originals (Q5). |
| R3 | **Local competitor benchmark** impossible without the market. | Q12; Sobha used as a proxy. |
| R4 | **Windows `sharp`** makes local image numbers misleading (V1 lockfile carries only Linux binaries). | Declare `sharp` and regenerate the lock so it covers win32-x64 *and* linux-x64; the audit asserts `/_next/image` returns AVIF before measuring. I can verify Windows here but **cannot test a Linux/Vercel install locally** — flagged for your first deploy. |
| R5 | In-memory **rate limiter** is per instance on serverless. | Documented; recommend platform WAF/KV later. |
| R6 | **Scope**: a full redesign of 19 sections/pages + audit loops is large. | Commit-per-step order (§6.2) so partial delivery is still coherent; honest handover of anything unfinished. |
| R7 | M6 (scroll restoration) root cause unknown. | Diagnose before fixing; keep a Playwright regression test. |
| R8 | ₹ glyph coverage in the chosen fonts unverified. | Checked in step 1; latin-ext subset if missing. |

### 7.2 Open questions for the client
Q1 phone(s) · Q2 email, WhatsApp number, office address + hours · Q3 **real site location(s)** (and coordinates) for each parcel · Q4 production domain · Q5 **photography**: are the current images acceptable, and can you supply ≥ 2400-px originals/drone/video · Q6 legal identity: entity name, CIN, RERA number(s), grievance/privacy contact · Q7 are prices/price bands shareable (publicly or "from") · Q8 leadership/team names, portraits, short bios · Q9 testimonials (with written permission), awards, press · Q10 are there **services** beyond plots/homes to present · Q11 analytics choice (privacy-friendly vs GA) and social profiles · Q12 the **local competitors** to benchmark (market/city) · Q13 SMTP account or CRM webhook for enquiries and the inbox that should receive them · Q14 further guides/articles (and who approves legal accuracy) · Q15 keep or retire the AI-Studio embed allowance (D5).

### 7.3 `[CLIENT TO PROVIDE]` registry (will be generated into `HANDOVER.md`)
domain · phone · email · WhatsApp · address/hours · coordinates · RERA/CIN/entity · prices · documents (brochure, survey sketch) · photography · team · testimonials · awards/press · stats (years, acres, families — only if true) · socials · analytics · SMTP/CRM · additional guides.

---

## 8. Self-audit protocol and what the quality bar can honestly promise

**Protocol (same rubric as V1):** production build (`next build` + `next start`) in a `sharp`-enabled environment (assert `/_next/image` returns `image/avif` first); V1 baseline **re-measured in that same environment** (§1.3) and used in the comparison; Lighthouse mobile + desktop × `/`, `/projects`, a parcel page, `/contact` and the guide, **3 runs, median**; the 121-check V1 interaction matrix extended to every new component; axe on 8+ pages; keyboard walk; reduced-motion emulation; real-HTML source checks; JSON-LD validated; same score caps and the "no more than 2 above the lowest dimension" rule; screenshots at 375 / 768 / 1440 saved to `docs/v2/screenshots` (before = V1 audit shots).
**Iteration rule:** up to 3 fix-and-re-audit loops; if the bar is still unmet, `docs/v2-audit/README.md` states exactly what blocks it.

**What I can promise from engineering alone** (no client input): Lighthouse mobile **Performance ≥ 90 on every audited page** (today: home 62, detail 83), **Accessibility ≥ 95**, **Best Practices ≥ 95**, **SEO 100**; LCP < 2.5 s, CLS < 0.1, INP < 200 ms (TBT proxy); **zero console errors and zero failing interactions**; valid JSON-LD on home, listing and parcel pages; no section < 8 *for sections that do not depend on missing client content*.

**What depends on you** — and therefore cannot be honestly closed in a preview build: C2 (contact channels), C3 (real inventory/prices), C8 (trust signals), the production half of C1/C4 (credentials, domain), and the photography half of H2. With these missing, I expect Footer, Contact/Enquiry and parts of About to be capped at **7**, which puts the weighted overall at roughly **8.0–8.3**. With the content in §7.3 supplied, **8.5–8.9** is realistic. I will report both numbers rather than round the problem away, and I will list any 🔴 item that is "engineering-complete, content-blocked" instead of claiming "zero 🔴".

**Out of scope (explicit):** CMS/admin, user accounts, i18n, newsletter ESP, payments, third-party map SDKs, services pages and testimonials/team copy unless supplied.
