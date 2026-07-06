# Client-Ready Upgrade — Design

**Date:** 2026-07-06
**Status:** Draft (benchmark findings pending)
**Goal:** Take Surga Indonesia Travel from "polished demo" to "site a real high-end agency could launch", doubling as portfolio proof of production-grade frontend work.

## Context

React 18 + Vite MPA/SPA hybrid (8 HTML entries, react-router routes are the `.html` paths), Tailwind, GitHub Pages under `/Travel-Agency/`. Editorial luxury design system: Playfair Display display, Noto Serif, DM Sans labels; sand `#f8f5ee`, ink `#131b2e`, caramel `#8d4b00`; flat panels, sharp corners, ghost buttons (owner non-negotiables).

Already strong (July 5 audit + fixes): 9 fully-written trips with day-by-day itineraries across every major region of the archipelago, SEO structured data, focus-trapped mobile nav, reduced-motion handling, LCP-optimized hero, WhatsApp + prefilled contact flows.

## Current gaps (audit)

1. **No story/trust page.** Nav is Home / Destinations / Contact. Every credible high-end agency leads with who they are, how they work, and why to trust them.
2. **No client area.** PRODUCT.md: "route pages must feel like a working product." A traveler dashboard (booking status, payment schedule, documents) is the strongest possible proof of that — and the user explicitly floated login.
3. **Placeholder form backend.** Consultation form posts to `httpbin.org/post` (fakes success). Endpoint is env-configurable (`VITE_CONTACT_ENDPOINT`); needs honest handling + docs rather than a silent fake.
4. **Footer inconsistency.** HomePage carries a rich inline footer; `Layout` has an off-brand plain footer (rounded corners, slate/amber palette) used elsewhere; `EditorialFooter` exists separately. Three footers, one brand.
5. **Honesty bugs.** `AVAILABILITY_LAST_UPDATED` is `new Date().toISOString()` — "availability updated" always shows *today*, a fake freshness signal. Fake IBAN `1234 5678 9012` on the contact page. TripPage pads day copy with regex-matched templated filler paragraphs.
6. **Dead trust data.** `TRUST_STATS` (4.9/5, 380+ trips, response times) defined but never rendered anywhere; third testimonial never displayed; zero social proof on Services/Trip/Contact pages.
7. **Legal entry HTMLs missing editorial fonts** — terms/cancellation/privacy/payments.html load only Inter + icons, so `font-editorial-*` classes fall back to Georgia/Inter on those pages.
8. **Privacy leak:** `src/components/CLAUDE.md` (personal context incl. income goals) is git-tracked in the public portfolio repo. Unused `monkey.mp4/.webm` also tracked.
9. **Wrong-region photos** in TripPage `mediaPool` (e.g. Borneo trip shows Sulawesi photo, Maluku shows Raja Ampat).
10. **No responsive `srcset`** on content images (OptimizedImage supports it; nothing passes it).
11. **No FAQ** anywhere; contact page has a "How confirmation works" box only.

## Benchmark findings (Jacada, Black Tomato, Scott Dunn, Audley)

All three converge on the same skeleton and never gate content behind login — the enquiry form is the only gate. The 10 signals of an established agency, `[DIFF]` = usually absent on amateur sites:

1. **One conversion verb everywhere** ("Start Planning") on header, hero, every card, every trip page — wired to prefilled form/WhatsApp. `[DIFF]`
2. **Specialist faces** — "Meet your team" with names, titles, region focus. Cited as the single strongest differentiator. `[DIFF]`
3. Day-by-day itineraries grouped by place with named stays + inclusions. `[DIFF]` (we already have day-by-day)
4. "From $X pp / N days" + "tailor-made starting point" framing. `[DIFF]` (we have price/duration)
5. Platform-attributed social proof with counts and dates; quotes that name the specialist. `[DIFF]`
6. Footer credentials block — association badges, "Est. YEAR", press/award row. `[DIFF]`
7. "When to go" seasonal content per destination. `[DIFF]`
8. Editorial journal + FAQ accordion (FAQ lives on destination/contact pages, not a global page). `[DIFF]`
9. "How it works" + "Why us" service-model framing.
10. Quiet-luxury system + a localStorage **wishlist** (Scott Dunn "My Wishlist") — the one interactive feature worth cloning.

Key insight: none of these sites use login, live availability, or checkout. The architecture is **inspire → trust → enquire**, which a static React site replicates 1:1.

## Approaches considered

**A. Breadth: add many destinations + a journal/blog.**
More trips (9 → 12+) and content marketing sections. Rejected: 9 routes already cover the whole archipelago; new trips need new licensed photography (weakest link, high effort, brand-quality risk); a thin fabricated journal reads as filler — the opposite of "operationally honest."

**B. Depth: trust + product-feel (recommended).**
Add the two things real agencies have that demos never do: an **About/approach page** (story, numbers, operating principles, planner desk) and a **client area** (demo sign-in → seeded booking dashboard with status timeline, payment schedule, documents, saved routes). Plus targeted UI consolidation (one shared editorial footer, nav growth) and honest form handling. Fits static hosting: auth is a transparent demo (one-click "view demo booking"), state in localStorage.

**C. Minimal polish only.**
Fix footers, copy, and small UI debt; no new pages. Rejected: doesn't move the site toward "real-world client ready" and ignores the user's explicit login/feature appetite.

**Decision: B** — scope detailed below after benchmark confirmation.

## Design

### On "login" (deliberate deviation from the literal ask)

The user floated adding login. Every benchmarked high-end agency gates **nothing** behind an account — a fake auth flow on a static GitHub Pages site is also a portfolio liability (a savvy client sees there's no backend). The honest equivalent that carries most of the perceived "my account" value is a **wishlist / saved routes** feature (Scott Dunn ships exactly this): real localStorage state, works offline, demonstrates state-management skill, and is brand-aligned ("operationally honest"). We build the wishlist instead of login. More destinations are also declined: the 9 routes already span the whole archipelago, and net-new trips need brand-quality photography we don't have — depth beats thin breadth.

### Scope (ordered by impact)

**Phase 0 — Honesty + hygiene fixes (bugs):**
- Remove `src/components/CLAUDE.md` from git and gitignore it (leaks personal income goals in a public repo). Remove unused `monkey.mp4/.webm`.
- `AVAILABILITY_LAST_UPDATED` → a real fixed ISO date (not `new Date()`), so "updated" stops lying.
- Fake IBAN `1234 5678 9012` → honest "shared on your deposit invoice" language.
- Legal entry HTMLs (`terms/cancellation/privacy/payments.html`) → load the full editorial font stack like every other entry.
- Fix wrong-region `mediaPool` photos in TripPage.

**Phase 1 — Shared trust primitives:**
- Rework `data/trust.js`: honest stats, dated + specialist-attributed testimonials, plus new `SPECIALISTS`, `FAQ_ITEMS`, `CREDENTIALS`, `PLANNING_STEPS`, `SEASONS` data.
- New reusable components: `Testimonials`, `TrustStats`, `FaqAccordion`, `SpecialistGrid`.
- **Footer consolidation:** upgrade `EditorialFooter` into one editorial footer with a credentials/trust row and full nav (incl. About, FAQ); render it via `Layout` everywhere and replace both the HomePage inline footer and the off-brand plain `Layout` footer. One footer, one brand.

**Phase 2 — About / Our Approach page** (new entry `about.html`):
Hero → founder/agency story → "How we plan" 4-step process → the numbers (honest `TrustStats`) → operating principles → **meet the planning desk** specialists (flat monogram avatars, no fake stock faces — on-brand) → testimonials → CTA band. Nav grows to Home / Destinations / About / Contact.

**Phase 3 — Wishlist / saved routes:**
- `useSavedRoutes` localStorage hook + save toggle (heart) on destination cards and the trip page; header shows a saved count; a saved-routes view (drawer or section) lets users review and enquire on saved trips.

**Phase 4 — Content depth:**
- `FaqAccordion` on Contact (and About). `Testimonials` added to Services + Trip + Contact. "When to go" seasonal block on TripPage.

**Phase 5 — UI polish + perf:**
- Responsive `srcset`/`sizes` via `OptimizedImage` on catalog + hero images. Hierarchy/spacing fixes surfaced during 1440/390 screenshot passes.

### Architecture notes
- Each new page follows the established entry recipe (root html + vite input + tailwind content + App route + urls + nav). New icons appended to `icon_names=` in all entries.
- Wishlist is pure client state (localStorage), no backend — consistent with the static deployment and the honest-demo principle.
- Reusable trust components keep pages thin and consistent, and shrink the large page files (HomePage 876 lines, TripPage 882) by extracting shared UI.

## Constraints / traps (from project memory)

- New entry pages require: root `{name}.html` mirroring index.html head, `vite.config.js` input, `tailwind.config.js` content, route in `App.jsx` + `urls.js`, nav updates.
- Any new Material Symbols icon must be appended to the `icon_names=` subset list in **all** entry HTML files.
- Tailwind opacity modifiers must be multiples of 5.
- `SiteHeader` is `position: fixed` — must stay a direct child of the page wrapper, never inside a hero's `relative z-10` container.
- Never add `overflow-x: hidden` to html/body (kills sticky positioning).
