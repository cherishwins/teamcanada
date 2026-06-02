# MuniTech / Fit For Gov — strategy + build-prompt library (INTERNAL)

> Internal business notes. **Not deployed** (excluded in `.vercelignore`). Belongs to the separate
> MuniTech / fitforgov.com product line, parked here as durable memory until that repo exists.

## The model — the flywheel
**Free citizen app → attention + data on what residents want → leverage → sell the matching admin tool to the municipality.** We own the resident relationship; the city rents the back office. Every citizen app must have a **paid admin twin**. Be the trusted **liaison between citizens and their governments**, at every level, expanding in concentric circles (start where open data is richest; east→west).

## Why we win
"**Official government data, in plain language, fast, on any phone**" — the Team Canada DNA (grade-6, accessible, non-partisan, nice to citizens) applied to gov software. Incumbents are not nice to citizens. That niceness + speed + trust is the wedge.

## Data landscape
- **Federal — open.canada.ca (CKAN): keyless, ~47k datasets.** Richest for grant opportunities (Grants & Contributions + funding programs). Hardcode nothing.
- **Provincial — gateways (e.g. BC APS):** request a key per API; **key lives in a Vercel server env var, never client.** Useful "Common Services": CDOGS (doc-gen), CHES/Notify (email/SMS), COMS (S3 storage), Address Geocoder, Route Planner, BC Parks, Short-Term Rental Data API, Payment.
- **Municipal — 4 platform standards cover most of Canada:** CKAN (Toronto, Montréal), Socrata (Calgary, Edmonton, Winnipeg), ArcGIS Hub / OpenDataSoft (Ottawa, Vancouver, smaller towns). Long tail is unstructured (PDF/web) → scrape + Claude extraction.
- **Key reframe:** fed/prov = the grant **opportunities**; municipal open data = the applicant's **evidence/profile** to auto-fill strong applications. The product marries the two.
- **Free extras:** Represent API (Open North) for "who represents me" at all 3 levels.
- **Honest watch-outs:** gov API onboarding can gate some services (design free fallbacks: Claude+PDF, Resend, Supabase Storage, Stripe); grant data is patchy (LLM the tail); slow gov procurement (lead with citizen side); PIPEDA + Law 25 once we hold resident accounts; we submit strong applications + track to a decision — we don't grant approvals.

## Reusable spine (build once, reuse everywhere)
Place context (geocode → your jurisdiction/ward/nearby) · Notifications (subscribe-to-anything) · Auth & multi-tenancy (Supabase + RLS) · Doc-gen (Claude+PDF / CDOGS adapter) · Payments (Stripe / gov adapter) · Plain-language LLM (`toGrade6`) · GovData store (normalized open data).

## Citizen app ↔ paid admin twin
1. **Civic Concierge (AI)** — ask your city anything, plain-language, cited → "Ask [City]" + resident-question analytics. **Flagship hook.**
2. **My Street** — everything about your address → white-label resident portal (cuts 311).
3. **Report-It (311)** — snap/track issues → case-management console. **Easiest first sale.**
4. **Permit Navigator + Autopilot** — which permits + prefilled + pay/track → faster staff intake.
5. **Grant Radar (free) + Grant Autopilot (paid)** — match + draft + submit/track. **Has buyers.**
6. **Where Your Tax Dollar Goes** — plain-language budget + money-landed-here → transparency portal (FOI deflection).
7. **Council Digest** — plain-language "what council is deciding," subscribe by topic → engagement console.
8. **Quick wins:** Who Represents Me (Represent API), STR Watch (BC STR API), Parks & Rec booking (BC Parks + Payment).
9. **City Console** — the unified multi-tenant admin platform all citizen apps feed. The thing we sell.

## Recommended stack (free/low-cost)
Next.js (App Router) + TypeScript + Tailwind on **Vercel**; **Supabase** (Postgres + Auth + Storage + RLS) or Neon; Drizzle ORM; **Claude** (with prompt caching) for AI; Resend (email); Upstash Redis (rate-limit/cache); Stripe (billing). Public apps = static + cached + free; LLM/metered features behind the paywall so cost tracks revenue. Secrets in Vercel env vars, server-only.

## Ship order (fastest to revenue)
P0 → P1 → P2 → **P3 (Concierge) + P5 (Report-It)** → P7 (Grants) → P8 (Console) → fan out P4/P6/P9–P11 → P12–P14 continuous.

---

# Build-prompt library (paste into the MuniTech repo's coding agent, in order)

> P0 sets house rules every later prompt inherits. Run one per branch/PR. Rename "CivicStack" as desired.

## P0 — Foundation & house rules
Bootstrap a Vercel-deployable Next.js (App Router) + TypeScript + Tailwind app "CivicStack" (MuniTech / Fit For Gov). Add Supabase (Postgres + Auth + Storage + RLS) with Drizzle, Anthropic Claude (prompt caching), Resend, Upstash Redis. Create `AGENTS.md` + `CLAUDE.md` encoding NON-NEGOTIABLE rules: (1) house style = wicked fast, mobile-first, plain language at GRADE-6, WCAG AA, no cookie banners, minimal client JS (RSC + edge caching); (2) secrets ONLY in Vercel env vars, server-only, never in client — federal open data needs no key, provincial gateways use server env vars; (3) all gov data flows through a normalized internal schema, cached hard, rate-limit-respecting; (4) PIPEDA + Law 25 by default, EN/FR ready, data-deletion supported; (5) build a reusable spine once, every product is a thin front end. Set up Tailwind tokens, ESLint/Prettier, /docs, env.example, README explaining the two-sided model. Commit.

## P1 — GovData ingestion + normalization
Build connectors (shared typed interface): CKAN (open.canada.ca keyless + municipal CKANs), Socrata/SODA, ArcGIS Hub/OpenDataSoft, plus a jurisdictions registry (slug, level, platform, base URL, optional key env-var). Normalize into jurisdictions/datasets/resources + a `grants` table + a generic `records` JSONB. Vercel Cron nightly upsert; server-only typed query API; Upstash cache; a Claude "extractor" turning unstructured grant/program pages/PDFs into the `grants` shape with source URL + confidence. Tests against live federal endpoints. Doc: add a new city in <10 min. Commit.

## P2 — Reusable spine
Build: (1) Place context (address → coords + jurisdiction/ward/nearby; geocoder keys server-only, graceful fallback); (2) Notifications (subscribe-to-anything, email/SMS, Resend default + BC Notify/CHES adapter, confirm/unsubscribe, deadline reminders); (3) Auth & tenancy (Supabase + RLS; municipality=tenant, residents=users, staff=roles); (4) Doc-gen (Claude narrative + server PDF; CDOGS adapter); (5) Payments (Stripe default; gov Payment adapter); (6) `toGrade6(text, lang)` Claude helper (prompt caching, EN/FR, show-original). Server-side, typed, cached, tested. Commit.

## P3 — Civic Concierge (flagship)
Fast, grade-6, mobile chat answering residents' questions about THEIR municipality using only official open data + the city's bylaws/FAQs (RAG over GovData + uploaded docs). Address once (Place spine) → ask "can I park here overnight?" etc. Cite sources, say "I'm not sure — here's who to ask" when unsure (no hallucination), EN/FR, streaming, weak-connection friendly. Privately + consented, log the QUESTIONS (not personal data) → admin analytics product. Public page + embeddable widget + rate limiting. Commit.

## P4 — My Street
Address → one fast page: ward + all 3 levels of reps (Represent API), garbage/recycling day, zoning, nearby parks (BC Parks), road/closure status (DriveBC), recent permits, "money that landed here." Plain-language, WCAG AA, cache last view, "subscribe to my street" (Notify). Degrade gracefully per city. Commit.

## P5 — Report-It (311)
Citizen: photo + auto-geocode + category + submit (no account; optional email status); photos in Supabase Storage (COMS adapter ready). Admin (authed tenant): inbox/kanban, assign/triage, status auto-notifies resident, map, SLA timers, CSV export, analytics. Demo municipality + pricing/landing page for the paid tier. Commit.

## P6 — Permit Navigator + Autopilot
Resident/business answers a few plain questions → exact permits/licences for their municipality, steps, fees, timelines (GovData + LLM-extracted unstructured). Autopilot: reusable applicant profile → Claude drafts each application → Doc-gen package → Payment fees → Notify status to decision (we prepare/submit + track, not approve). Admin: intake dashboard with completeness scoring. EN/FR, grade-6. Commit.

## P7 — Grant Radar + Autopilot (money product)
Radar (free, public): province + population + priorities → matched grant OPPORTUNITIES + deadlines, plain-language, shareable, no login. Autopilot (paid, authed): org profile auto-filled from MUNICIPAL open data as evidence → Claude drafts narrative vs criteria → Doc-gen → deadline tracking → status to decision. Matching = rules + explainable LLM ranking. Admin analytics: pipeline, win-rate, $ applied/won. Pricing page. Commit.

## P8 — City Console (the platform we sell)
Multi-tenant admin platform all citizen apps feed: tenant onboarding (boundaries, data sources, branding), unified dashboard (Report-It / Concierge questions / Permits / Grants), resident-engagement analytics, staff roles & RLS, white-label theming of the citizen apps, data-export + FOI-deflection reports, Stripe billing tiers. Value: "see and serve your residents, in one place." EN/FR. Commit.

## P9 — Transparency: Where Your Tax Dollar Goes
Free citizen tool: municipality → grade-6 budget breakdown + money-landed-here + simple charts + compare-to-similar-city; drop a budget CSV/PDF → Claude plain-language summary. Admin twin: a Transparency Portal a city buys to publish + deflect FOI. Shareable OG cards. Commit.

## P10 — Council Digest
Ingest agendas/minutes (scrape + Claude → structured items) → plain-language summaries of "what council is deciding," subscribe by topic/ward (Notify), "this affects your street." Admin twin: publishing + engagement console + weekly email digest. EN/FR. Commit.

## P11 — Quick-win citizen apps
(1) Who Represents Me (Represent API + BC public-bodies) — 3 levels + contact + votes. (2) STR Watch (BC Short-Term Rental Data API) — is this Airbnb legal here? + report → admin enforcement. (3) Parks & Rec (BC Parks + Payment) — find/book. Fast, grade-6, degrade per city. Commit.

## P12 — PWA, SEO/share, cookieless analytics
All public apps: installable PWA (manifest + network-first SW, sw.js no-store, CSS/JS revalidate), full OG/Twitter cards with generated images, JSON-LD, sitemap + AI-friendly robots, llms.txt, canonical + hreflang en-ca/fr-ca, cookieless analytics (Umami/Vercel). Lighthouse 95+ mobile on every public page. Commit.

## P13 — Privacy, legal & trust
PIPEDA + Law 25: plain-language privacy + terms (EN/FR), explicit consent for accounts/notifications, data-minimization, self-serve export + delete, security.txt, "how we use government data" page, per-tenant DPA template. Visible trust promise: "official data, plain language, your data stays yours." Commit.

## P14 — Go-to-market
Fit For Gov / MuniTech marketing site: fast landing on the two-sided model, per-product pages, book-a-demo (Resend), pricing tiers, a live demo city on seeded open data, case-study templates, branded /go/<slug> short links (Vercel redirects). Keep the primestrength.ca house style. Commit.
