# CLAUDE.md — handoff & memory for this repo

> Read this first. It's the durable memory across sessions (chat history does NOT carry over).
> Keep it accurate; update it in the same commit when conventions change.

## What this is
**Team Canada / Prime Strength** — a fast, static, non-partisan Canadian-unity site at **primestrength.ca**.
Pure HTML/CSS/JS, no build step, no framework. Author/owner: **Jesse James** (jesse@primestrength.ca).

## Stack / infra (no Cloudflare)
- **Registrar + DNS:** GoDaddy. Apex `A @ → 216.150.1.1` (Vercel), `www CNAME → …vercel-dns.com`.
- **Host + CDN:** Vercel (project `teamcanada`, GitHub-connected). Auto-deploys `main`. **No edge cache to purge** — stale views are always the browser/service worker.
- **Email:** Purelymail (MX/SPF/DKIM/DMARC already set in GoDaddy).
- **Analytics:** Umami (cookieless) + Vercel Web Analytics. No cookie banner.

## Brand & design rules (the house style — applies to everything)
- **Light only.** The dark theme/toggle was removed deliberately. Don't reintroduce a theme toggle.
- **Voice:** guardian-not-conqueror, warm, **grade-6 reading level**, invites the skeptic. NEVER use "Dominion / Phalanx / Unbreakable / Unyielding" or roaring-bear-with-threat imagery (see `source-material/primestrength-bilingual.skill`). **No AI bear image on the site** — it read cheesy; the Sentinel is a typographic line now.
- **Logo + favicon everywhere:** `assets/leaf-logo.png` (the cleaned shard maple leaf) + `assets/leaf-16/32/180/192/512.png` + `assets/leaf.svg`. Transparent for tabs; cream tile for iOS/PWA.
- **Palette:** crimson `#7B0505`, ink `#16140f`, paper `#F6F3EC`, soft `#4A4640`, hairline `#D8D2C4`, gold `#B0822D`.
- **Type:** Newsreader (serif body/headlines), Archivo (caps labels/buttons), JetBrains Mono (data).
- **Feel:** national-broadsheet — hairline rules, **no cards, no border-radius, no content shadows.** Hero/footer/pledge are deliberate dark bands over the light page.
- Must be **wicked fast, accessible (WCAG AA), mobile-first, work on any device anywhere.**

## File map
- `index.html` (landing), `fr/index.html` (French — **BROUILLON, `noindex`** until a native Québécois reviewer signs off, then remove banner + add reciprocal hreflang), `join.html` (coalition), `privacy.html`, `terms.html`, `404.html`, `offline.html`.
- `read/*.html` — the long-form pieces. The 3 Team-Canada-voice reads use `assets/editorial.css` (rebranded to light). `the-closed-loop` (NPSI) and `the-vertical-squeeze` (Fit For Gov) keep their own imprint styling — that's intentional (different brands; NPSI brand forbids red/flags).
- `assets/` (css, leaf icons, og cards, carney portraits), `brand/` (kit: logos, icons, social, colors, guidelines; `brand/partners/npsi.png`), `source-material/` (raw uploads — NOT deployed).
- Config: `vercel.json` (clean URLs; **`sw.js` = no-store**, CSS/JS revalidate, images immutable; redirects incl. `/go/<slug>` branded short links), `site.webmanifest`, `sitemap.xml`, `feed.xml`, `robots.txt` (AI-crawler friendly), `llms.txt`, IndexNow key, `.well-known/security.txt`, `humans.txt`.

## Conventions
- **Branded short links:** add `{ "source": "/go/SLUG", "destination": "<url>", "permanent": false }` to `vercel.json` redirects. No DNS needed — it's a path on the existing domain.
- **Service worker:** network-first for HTML/CSS/JS, cache-first only for images/fonts; bump `VERSION` in `sw.js` on asset changes.
- **OG image:** `/brand/social/og-1200x630.jpg` (the light broadsheet card) on all shareable pages.
- **Coalition members** live in `index.html`, `join.html`, `fr/index.html` (Prime Strength, NPSI→npsi.ca, Fit For Gov→fitforgov.com, iPurpose). Real logos go in `brand/partners/`.
- **Verify** changes with the Playwright request-interception pattern (serve files from disk, check overflow + JS errors at 1440/390/320). Develop on a branch → PR → merge to `main`.

## Open / pending
1. **Upload transparent logos** → `brand/partners/`: iPurpose (+ its URL) and Fit For Gov (the bronze seal but transparent). Then swap the wordmarks for `<img class="m-logo">`.
2. **French go-live:** native Québécois review of `/fr/` → remove BROUILLON + `noindex`, add hreflang pairs on `/` and `/fr/`.
3. **Decision:** keep this repo build canonical vs. fold in the separate "dossier" build the user has elsewhere.
4. **LinkedIn at scale:** when the user provides the LinkedIn full-export `Shares.csv`, generate `/go/<slug>` redirects for the whole catalog.
5. Optional: lighten the hero; wire iPurpose/FFG logos.

## Sister project
MuniTech / Fit For Gov civic-tech products (separate repo) — vision + full build-prompt library in `notes/MUNITECH-STRATEGY.md` (internal, not deployed).
