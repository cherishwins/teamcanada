# CLAUDE.md — handoff & memory for this repo

> Read this first. It's the durable memory across sessions (chat history does NOT carry over).
> Keep it accurate; update it in the same commit when conventions change.

## What this is
**Northern Temper** — a statement of Canadian character at **northerntemper.ca**.
Astro on Vercel. Author/owner: **Jesse James**. Everything here is **CC0 1.0 public domain**.

The site consolidates four previously separate builds of the same argument
(primestrength.ca, teamcanadawins, the-uniting, united-canada-site). Fragmentation
across repos and hosts was the actual problem; one app is the fix.

### The thesis, and the guardrail
**Restraint is the flex.** "We make as much fresh water as they do, share it
with a fraction of the people, and have never once mentioned the tap" is a
harder claim than any taunt — it cannot be screenshotted
against us, it survives a change of government, and it reads as strength to the
skeptic we need. The pressure from the south is the *weather*, never the villain.

The brand sheet's own test governs every surface: *a Canadian feels pride in under
three seconds, and an American neighbour feels respect without being insulted.*
An earlier identity ("Unyielding Dominion", roaring grizzly) was retired for
failing exactly this test. Do not walk back toward it.

> **"Eleven times" is retired — see Open item 7.** It came from two figures of
> different vintages and was not reproducible from any single source. The site
> now runs on FAO AQUASTAT: same year, same definition, both countries, and the
> ratio is **computed from the two live figures rather than typed**. Never
> reintroduce 11×.

## Stack / infra
- **Framework:** Astro 7, `output: 'static'` + `@astrojs/vercel` 11. Acts are
  pre-rendered HTML; only `src/pages/api/*` runs on demand.
- **Host:** Vercel. **Domain:** northerntemper.ca — registered and routed.
- `primestrength.ca` is **retired. Not being renewed. Do not raise it again.**

## ZERO BUDGET — this is a hard constraint
This is a passion project, not a funded one. **Nothing may cost money unless it
has already earned it.** Every dependency here is free and must stay free:
Vercel hobby tier, keyless government APIs (StatCan, Bank of Canada, ECCC),
open-licence typefaces, self-hosted assets, no Mapbox, no paid tier of
anything. Before adding any service, the question is not "is it
better" but "is it free, and does it stay free at scale." If the site ever
earns, that changes — until then it does not.
- **TWO analytics vendors now ship: Umami and Vercel Web Analytics.** This line
  said "Umami is the one hosted service" for months and it is no longer true —
  a one-click Vercel dashboard integration opened PR #34, it was merged, and
  the second vendor went live. Both are free and both are cookieless (checked:
  neither script touches `document.cookie` or browser storage), so the
  no-consent-banner posture is intact. **Whether to keep the second one is an
  open question for the owner — see Open item 9.** What is NOT open is that
  `/privacy` must name whatever ships; `tools/check-privacy.cjs` now fails the
  build if it does not.
- **Client JS budget: ~2 kB gzipped for the whole site.** Reveal fallback and
  count-up only. If a feature needs a framework, question the feature first.
  **This budget is currently exceeded.** Measured gzipped on the deployed page:
  the site's own script is 1,172 B and `/_vercel/insights/script.js` is
  1,497 B — 2,669 B, more than double what the site shipped before. Umami's own
  script is a further 2,317 B from a third-party origin.

## Brand — Northern Temper Design System
**The published design system is the source of truth**, not this file and not
any reconstruction from the brand sheet PNG:

    claude.ai/design → "Northern Temper Design System"
    projectId 847cddce-7742-445f-aae1-20006b9b9e63   (org default)

Read it with the `DesignSync` tool (`list_files`, `get_file`). It carries
`tokens/*.css`, `components/{core,data,layout,library,marks,typography}`,
`guidelines/*.html`, a report template, and two UI kits
(`northern-temper-site`, `northern-temper-library`).

`src/styles/tokens/*.css` are copied from it **verbatim**. When the design
system changes, re-pull rather than hand-editing them. Two deliberate
divergences, both documented in-file and both worth pushing back upstream:

1. **`tokens/fonts.css`** — the system ships TTF (1.2 MB for five faces). We
   ship the same faces Latin-subset as WOFF2: **72 kB**, identical rendering.
2. **`tokens/a11y.css`** — four of the ten dark-field text roles fail WCAG AA.
   Measured on black: `--nt-red` labels 3.57:1, `--nt-n-560` cue 3.14:1,
   `--nt-n-500` caption 3.88:1, `--nt-n-600` colophon 3.04:1. Three are fixed
   by using a step the system **already defines** — `--nt-n-460` (#767676,
   4.62:1). Only the red label needs a new value: `--nt-red-lift #D95A6F`,
   which clears 4.5:1 on all four dark surfaces in use. `--nt-red` itself is untouched and
   remains the strike colour for rules, fields and large numerals.
   **If these are folded upstream, delete `a11y.css`** — that is the better fix.

Non-negotiables the system states and we keep: four brand colours only (red,
black, white, frost); frost is **charts only, never behind type**; one
full-bleed red field per document, maximum; every corner square (`--radius:0`);
the only two effects are the fixed grain and the cover aurora — no shadows, no
glows, no gradients as decoration; Oswald 700 uppercase display, Inter body.

**Marks are inline SVG components** (`src/components/marks/`), traced from the
source PNGs — 1,485 kB of PNG became 33 kB of SVG. They use `currentColor`, so
one file serves both colourways. **Never reference them via `<img src>`:**
`currentColor` resolves to black in an external SVG and the mark disappears.

## File map
- `src/config.mjs` — **the only place the public origin is written.** Canonicals,
  OG, sitemap and schema all read it. Moving domains is a one-line change.
- `src/styles/tokens/*.css` — **verbatim from the design system** + `a11y.css`.
- `src/styles/base.css` — imports the tokens, then reset, type scale, grain,
  reveal system. `a11y.css` must import last; it overrides four text roles.
- `src/layouts/Base.astro` — head, meta, OG, JSON-LD, skip link, reveal fallback.
- `src/components/` — `Stat`, `Meter`, `marks/{BearDual,BearHead,LeafSeal}`.
- `src/lib/sources.ts` — live figures from StatCan WDS + Bank of Canada Valet.
- `src/lib/figures.ts` — **the one place a hand-entered number is written.**
  `sources.ts` covers figures that come from an endpoint; this covers the ones
  that come from a document and therefore have to be typed by a person. It
  carries each figure's machine value, its exact `display` string, its source
  and period, and — where the publisher runs on a cycle — a `reviewBy` date
  that fails the build once it passes. `/calculator`, `/math` and `/sources`
  all render from it.
- `src/components/Nav.astro`, `SiteFooter.astro`, `BlocChart.astro`.
- `src/layouts/Read.astro` — the long-form layout (single 68ch column).
- `src/lib/support.ts` — the processor-free support rail (see below).
- `src/lib/schema.ts` — Article markup for the reads, **Dataset markup for the
  four public endpoints**. The site redistributes government figures under CC0;
  Dataset markup is how that becomes findable as data rather than as four
  anonymous JSON URLs, which is the discovery channel that actually fits a site
  whose only asset is checkability.
- `src/pages/api/{figures,rivers,trade}.json.ts` — on-demand live data.
- `legacy/` — the previous primestrength.ca static site. **Not deployed.**
  Content still to migrate: `legacy/read/*.html` (5 long-form pieces),
  `legacy/fr/index.html`, `legacy/join.html`.
- `.github/workflows/verify.yml` — build + `check-french` + `npm audit` + the
  full sweep, on every PR and every push to `main`. Free: the repo is public.
- `tools/check-french.cjs` — Québec typography + banned-framing audit;
  `tools/check-llms.cjs` — llms.txt shape + no-restated-figures; and
  `tools/check-docs.cjs` — **every path THIS file names must exist**; and
  `tools/check-privacy.cjs` — **`/privacy` must name exactly the analytics
  vendors the site actually ships**, and no third-party script origin may reach
  a page undisclosed; and `tools/check-figures.cjs` — **no hand-entered figure
  may go stale or be typed twice.** All five run in `npm run build` and fail it.
  **`check-docs` is here because this file has now described something untrue
  three times** (a French pass that was not in the repo, a console-error filter
  the sweep does not have, a renamed JSON), and each was found by accident. A
  path is the cheapest claim to check; the prose still cannot be, so keep the
  prose honest by hand. **`check-privacy` is here because the fourth time it
  happened, the untrue sentence was on the public privacy policy** — /privacy
  said "one provider, not several" while two shipped. Same failure, worse page.
  **`check-figures` is here because the same number was typed in three places
  and two of them disagreed** — see `src/lib/figures.ts`. **`check-icons` is
  here because the same thing happened in binary:** `favicon.ico` carried the
  ringed LeafSeal and `favicon.svg` carried a ringless leaf, so which mark a
  reader saw depended on whether their browser preferred `.ico` or `.svg`, and
  a binary does not show up in a diff anyone reads.
  `tools/generate-favicons.cjs` now draws `favicon.ico` (16/32/48),
  `favicon-16.png`, `favicon-32.png` and `mask-icon.svg` **from
  `public/favicon.svg`**, and `check-icons` re-renders and compares so the
  generator cannot be skipped. It is not in the build — icons change about once
  a year and rasterising them every deploy produces identical bytes — so run
  `npm run icons` after changing the art. `tools/generate-og.cjs` draws the share cards
  *and* emits `src/lib/og-manifest.json`, which carries each card's
  **content-hashed path and its alt text together**, so neither can drift from
  the card it describes. (This line said `og-alt.json` for one commit after the
  file was renamed — the same drift this repo keeps catching, in the file whose
  job is to prevent it.)
- `tools/generate-favicons.cjs` — every small icon, drawn from
  `public/favicon.svg`; `tools/check-icons.cjs` — proves they still match.
- `source-material/` — raw uploads, 107 MB, **not deployed**. Prune or move to
  external storage; it is cloned on every checkout.

## Live data — the rule that matters
Both APIs are public and need no key:
- **Bank of Canada Valet** — `FXUSDCAD`, `V39079` (policy rate).
- **StatCan WDS** — `65201210` (monthly real GDP), `1` (population),
  `41690973` (CPI); trade by partner from table **12-10-0011**, vectors
  resolved via `getSeriesInfoFromCubePidCoord`. Confirm any new vector with
  `getSeriesInfoFromVector`; vector IDs are not guessable.
- **Environment and Climate Change Canada** — `api.weather.gc.ca`,
  `hydrometric-realtime`, five-minute river discharge.

**THE WDS RETURNS ROWS OUT OF REQUEST ORDER.** Index the response by each
row's own `vectorId`. Zipping it against the request array silently mislabels
every series — wrong country on every number, on a site whose entire claim is
that the figures are checkable.

**A figure never renders blank.** Every series carries a hand-checked fallback
with the date it was true. On failure the page shows the fallback *and says a
source is not responding*. The site's whole authority is "every figure here is
public and checkable" — it can afford neither a dash nor a silently stale number.

## Conventions
- **Verify before pushing: `node tools/verify.cjs`.** It serves
  `.vercel/output/static` through Playwright request interception and sweeps
  **every page across 10 viewports** (320 → 2560) for horizontal overflow,
  console errors, undersized tap targets, broken references and missing
  `og:image:alt`, plus WCAG AA contrast and a full **axe-core** pass on all
  pages. It exits non-zero. **Current state: clean on all nine counts.**
  Keep it there.
  **`.github/workflows/verify.yml` runs all of it on every PR and every push to
  `main`**, so none of this depends on somebody remembering. The repo is public,
  so Actions minutes are free and unmetered — that is the only reason it is
  allowed to exist under the budget rule.
  **Playwright is deliberately NOT in `package.json`.** Vercel installs
  devDependencies to build, and a browser-automation library has no business in
  the install path of a static site that never uses it at runtime; CI installs
  it with `--no-save`. `axe-core` *is* a devDependency — 568 kB, dev-only, and
  it never reaches a page.
  This lived in a scratch directory for a long time and died with each session,
  which is how a convention quietly stops being true. Two things it stubs *on
  purpose*, and the comments say why: other origins answer 204 (the page must
  not need them) and `/api/*` answers **503**, so the sweep actually exercises
  the "a figure never renders blank" fallback rather than faking success.
  Service workers are blocked in the sweep — Playwright does not route their
  script fetches, so registration failures there are an artifact, not a finding;
  `sw.js` is syntax-checked directly instead (see below).
- **Accessibility is audited by machine, not by eye, and the eye was missing a
  whole class of it.** Geometry and colour checks cannot see a scroll container
  the keyboard never reaches, a heading level skipped so the document outline
  has a hole in it, or content stranded outside every landmark. All three were
  real here and all three are fixed: the four wide-table wrappers are
  `tabindex="0" role="region"` with **distinct** names (two on one page sharing
  a name is itself a failure); `/build`, `/privacy`, `/terms` and
  `changed-my-mind` went `h1 → h3` and now go `h1 → h2`, with the scoped
  selector moved to the new tag so **nothing changed visually** — the level was
  wrong, the type was not; and `<Brouillon>` dropped `role="note"`, which had
  been stripping `<aside>` of the `complementary` landmark it already had.
- **Calibrate contrast against the LIGHTEST dark surface a token can land on,
  never against `#000`.** This has bitten three times: the footer is
  `--nt-n-950` (#070707), raised panels `--nt-n-900` (#111111), meter and
  chart tracks `--nt-n-880` (#1C1C1C). A value tuned for pure black fails on
  all three. `--nt-red-lift` and `--nt-n-440` are now set so they clear 4.5:1
  on **all four** grounds, which means a token can move between surfaces
  without a fresh audit. Keep that property when changing them.
- Firefox and WebKit cannot be installed in the web sandbox (missing system
  libs), so cross-engine checking is done by auditing features statically.
  Guard `animation-timeline` with `@supports`, prefix `backdrop-filter` with
  `-webkit-`, and always give `color-mix()` a plain `rgba()` fallback line
  first — without it a Safari < 16.2 sticky nav renders fully transparent.
- Content must never depend on an animation to be readable — `prefers-reduced-motion`
  and `@media print` both force `.rv` fully visible.
- **Astro 7's compiler rejects unbalanced tags outright** (Astro 5 tolerated
  them). Any generated markup must balance its own anchors — an `<a href="#…">`
  that is skipped on open must not still emit its close.
- Develop on a branch → draft PR → merge to `main`.
- **The sweep does not filter console errors — it blocks service workers instead.**
  An earlier version of this note described a filter on one exact message, and
  that is not what `tools/verify.cjs` does; the note outlived the design. A
  message filter suppresses an artifact *and* stands as a permanent chance of
  masking a real error that happens to match. Registration cannot succeed under
  Playwright route interception either way, so nothing is lost by blocking it,
  and the console channel then carries only errors the site is responsible for.
  **The consequence is that `sw.js` is never parsed by the sweep — and Astro
  copies `public/` verbatim without parsing it either — so `verify.cjs`
  syntax-checks it directly and asserts it still has a `VERSION` constant.**
  Nothing else in this repo reads that file. A broken service worker is worse
  than none: it is precisely what leaves somebody looking at a stale figure.
- **`/_vercel/*` is same-origin but platform-served: the LOADER is in the
  build, the FILE never is.** `webAnalytics: { enabled: true }` makes the
  adapter write an **inline bootstrap** into every page at build time — not a
  `<script src>` tag. It sets `script.src = '/_vercel/insights/script.js'` and
  appends it to `<head>` at runtime, and the asset behind that path exists only
  on Vercel's edge. (An earlier version of this note said it writes a
  `<script src>`. It does not, and the difference matters: a scan that only
  reads `src` attributes cannot see a vendor that loads itself this way, which
  is how most third-party snippets ship. `check-privacy` reads inline script
  bodies too, for exactly that reason.) `tools/verify.cjs` serves
  the local output, so it counted that as a broken reference on all 20 pages at
  all 10 viewports — **200 failures, and that is what turned `main` red on
  PR #34.** The sweep now answers `/_vercel/*` with 204, exactly as it answers
  a third-party origin, so it still proves the page works without it. Keep that
  case narrow: `/_vercel/` only, never a general "ignore missing files" rule,
  or the broken-reference count stops meaning anything.
- **A checker that cannot fail is worse than no checker.** The first draft of
  `check-privacy` matched vendor names against raw HTML; Astro stamps
  `data-astro-cid-…` onto styled tags, and a name split by markup
  (`<strong>Vercel</strong> Web Analytics`) would have read fine to a human and
  failed `includes()` silently. Its own negative test passed while asserting
  nothing. Every checker in `tools/` should be run once against a deliberately
  broken input before it is trusted — all five have been.
- **`astro check` runs in CI, not in the build, and its dependencies stay out of
  `package.json`.** `@astrojs/check` + `typescript` pull 75 packages — a Volar
  language server, Emmet, Prettier, the VS Code language services — and Vercel
  installs devDependencies on every production build for a command it never
  runs. Same rule as Playwright: `npm i --no-save`, in CI only. The `check`
  script sat in `package.json` for months with its dependency missing, so it
  could not run at all; the first thing it found once wired up was a StatCan
  round-trip on `/fr` whose result was discarded.
  **`npm i --no-save X` PRUNES every other un-saved package** — it reconciles
  `node_modules` to `package.json` plus `X`. A second `--no-save` install in a
  later CI step deleted Playwright and the sweep died with "playwright not
  found". So `verify.yml` installs Playwright, `@astrojs/check` and
  `typescript` in **one** step and calls `npx astro check` directly; the
  `npm run check` script still self-installs, because on a developer's machine
  there is nothing to prune.
- **A number typed in two places is a number that will disagree with itself,
  and this site already did it.** The federal accumulated deficit was a raw
  constant in `/calculator`, the string `$1,266B` in `/math`, and `$1,266B`
  again in `/sources`. The calculator interpolated its constant and printed
  **`$1266B`** — same figure, two spellings, on the site whose whole argument
  is that its figures are checkable. Nobody chose that; three copies did.
  Every hand-entered figure now lives in `src/lib/figures.ts` and every page
  renders its `display` string. `tools/check-figures.cjs` refuses a build where
  any page prints the ungrouped spelling of a grouped figure, which is exactly
  how the bug reappears.
- **A figure that comes from a DOCUMENT needs a `reviewBy` date; one that comes
  from an ENDPOINT does not.** Public Accounts of Canada is tabled each autumn
  and has no key-free API, so `$1,266B` cannot be live and "somebody will
  remember" is not a mechanism. It carries `reviewBy: '2026-12-15'` and a note
  saying what to replace it with. Do not put review dates on figures with no
  next edition — 563 lakes is not waiting on a release, and noise there teaches
  people to ignore the real ones.
  **The figure itself was verified against the primary source, not carried
  forward:** the Annual Financial Report for 2024-25 (Finance Canada, published
  7 November 2025) states the accumulated deficit "stood at $1,266.5 billion at
  March 31, 2025". **Never substitute StatCan `10-10-0002`** — that series is
  *central government debt*, a different definition, and swapping it in would
  repeat the two-vintages error that retired "eleven times". The Fiscal
  Monitor's running year-end number is not a substitute either; Finance labels
  it pre-adjustment and superseded by Public Accounts.
- **The tab icon is drawn FOR 16px, not shrunk to it.** What shipped was the
  full LeafSeal — red leaf, red ring, black field — and all three of its
  failures are visible the moment it is rendered at true size: the ring is a
  hairline that antialiases into a halo and steals a third of the frame; and
  `#C8102E` on `#000` is two dark colours, so on a dark browser tab strip the
  tile edge vanishes and the icon reads as a smudge. It is now **a white leaf
  on black with no ring below 48px**. White carries on a dark strip and the
  black tile carries on a light one, which neither red-on-black nor
  red-on-white manages — all four were rendered at 16px and compared before
  choosing. `--nt-red-lift` was tried and rejected: it is a colour for small
  text, and as a mark it is a washed pink. The black field is deliberate — it
  is the site's ground, it matches `theme_color`, and it keeps the family with
  `apple-touch-icon` and the 192/512 icons, which still carry the full seal
  because they are big enough to hold it.
- **`mask-icon` needs a MONOCHROME, TRANSPARENT file.** Safari fills a mask
  icon with the colour on the `<link>`, so it was handed `favicon.svg` — which
  has an opaque `<rect>` across the whole canvas — and filled the rectangle:
  the pinned tab was a solid block. It points at generated `mask-icon.svg`
  now, and `check-icons` refuses a build where a mask icon has a rect or a
  fill, or where the link points back at `favicon.svg`.
- **XML comments cannot contain `--`.** Writing `--nt-red-lift` inside the
  comment in `favicon.svg` made the file invalid XML; browsers tolerated it,
  the SVG rasteriser did not, and the generator failed outright. Name a CSS
  custom property without its leading dashes inside any SVG comment.
- **`/fr` must stay out of the sitemap while it is `noindex`** — submitting a URL
  while telling crawlers not to index it is a contradictory signal. The filter
  lives in `astro.config.mjs`; remove it the day the draft banner comes off.
- **The service worker is network-first for pages and data, cache-first only for
  fonts, marks and images.** It must never be the reason somebody sees an old
  figure. Bump `VERSION` in `public/sw.js` when a cached asset changes; activate
  deletes every other cache, so a bump is a clean slate.

## Discoverability — the point is that it travels
Everything is CC0 and the site is built to be repeated, not protected.
- `robots.txt` **explicitly allows every named AI crawler** — GPTBot, ClaudeBot,
  PerplexityBot, CCBot, Google-Extended, Applebot-Extended and the rest. Most
  sites block these; this one does the opposite on purpose. Do not "tighten" it.
- **`/llms-full.txt`** is the entire site as one plain-text file — 15 pages,
  ~18,000 words — generated by `tools/generate-llms-full.cjs` as a **post-build
  step from the BUILT HTML**, so it can never drift from what is published. It
  is wired into `npm run build`, so Vercel produces it too.
- `ai.txt` states the reuse policy in machine-readable form: training, quoting
  in full, and retrieval all allowed; no attribution, no permission.
- **`llms.txt` states only what does NOT change, and `tools/check-llms.cjs`
  enforces that in the build.** This exists because of a real failure: when the
  water claim was replaced, every *generated* surface corrected itself — `/`,
  `/fr`, `/sources` and `llms-full.txt` are built from live data or from the
  published HTML — while hand-written `llms.txt` went on asserting the retired
  **11:1** ratio as fact, on the one file whose whole job is to be quoted by
  machines. Google PageSpeed's agentic-browsing audit is what surfaced it.
  The checker refuses a restated per-capita figure or any `N:1` ratio, and
  enforces the llmstxt.org shape: H1 first, then H2 sections whose file lists
  are real markdown links, `- [name](url): notes` — a bare path in backticks
  does not parse and the file is silently less useful than it looks.
  **Link to the endpoint; never restate a live number in a static file.**
- **OG card filenames are CONTENT-HASHED** (`/og/home.41655b70.png`), resolved
  through generated `src/lib/og-manifest.json`. Pages still write
  `ogImage="/og/home.png"` and never see the hash. This is not tidiness:
  LinkedIn and every platform that *mirrors* OG images rehosts the bytes on its
  own CDN and caches by URL. Post Inspector proved it — a re-scrape refreshed
  our title and description while still serving an `11×` card from
  `media.licdn.com`. **Re-scraping cannot fix a stale card; only a different URL
  can.** The hash changes exactly when the image does, so nobody has to remember
  to bump anything. The unhashed copy is still written so links already in the
  wild resolve to something rather than 404.
- **IndexNow**: `tools/ping-indexnow.cjs` submits every sitemap URL to Bing and
  Yandex. The key file is the 32-hex `.txt` at the site root — if it is ever
  regenerated, the filename and its contents must match. Google ignores
  IndexNow; submit the sitemap once in Search Console instead.
- Sitemaps are validated XML against the sitemaps.org 0.9 schema, all URLs
  absolute on the canonical host. **`/fr` is excluded while it is `noindex`.**
- Structured data: WebSite on every page, Article on each read, **Dataset on the
  four public endpoints** so the figures are findable as data.

## Performance — measured, not assumed
A phone-width cold load, per page: **7–11 requests, 81–120 kB gzipped, ~2 kB of
JavaScript**. Roughly **67 kB of that is fonts** — five Latin-subset WOFF2 faces
at about 13 kB each, all genuinely used. That is where the weight is, and it is
already near the floor without dropping a weight from the design system.

`build.inlineStylesheets` is **`'always'`**, and this REVERSES an earlier note
here that argued for `'auto'`. That note's premise was wrong: it reasoned about
"anyone reading more than a single page", but this site travels by share link,
so almost every session is one page — Lighthouse labels its own run *"Single
page session"*. Measured, gzipped, on the real build:

| | first load | requests | render-blocking | each extra page |
|---|---|---|---|---|
| `'auto'` | 15,359 B HTML + 9,830 B CSS = **25,189 B** | 4 | 2 | 14,670 B |
| `'always'` | **21,198 B** HTML | 1 | **0** | 18,923 B |

Inlining is **3,991 B smaller on first load** — the CSS compresses better in
context than as three separately-gzipped files — *and* removes a chain PageSpeed
costs at **730 ms** on Slow 4G. It costs **+4,253 B per additional page**, so
break-even is under one extra page on bytes alone, before counting the 730 ms
that only the first load ever pays. **Re-measure before changing this back**, and
re-check the premise as well as the numbers — that is what was wrong last time.

## The site — 16 pages, all shipped
```
I   · TEMPER    /         Character. Water, Gander, Kandahar.   live gauges
II  · THE HAND  /hand     What Canada holds.                    live figures
III · THE MATH  /math     Dossier No. 01, separation costed.     from teamcanadawins
IV  · THE BLOC  /bloc     Middle powers.                        live trade data
V   · THE BUILD /build    Refine · Compute · Corridor + C-5.     from teamcanadawins

/calculator  The bill, per province      live StatCan GDP + population
/sources     The receipts                every figure, source, period, endpoint
/fr          La trempe du Nord           BROUILLON, noindex, Act I only
/offline     Service-worker fallback     noindex
/read + 5 long-form pieces   9,162 words migrated from the old site
/join  /privacy  /terms  /404          /support is HIDDEN (noindex, unlinked)
/feed.xml    RSS for the five reads
robots.txt · llms.txt · humans.txt · site.webmanifest · sw.js · security.txt

Every act and the calculator carry a share band: native share sheet where the
browser has one, plain intent links otherwise, and a ready-to-post block whose
quote is specific to THAT page. No third-party widget, no tracking pixel.
```
**Act IV is the argument that did not exist before.** Not "we don't need the
Americans" but "we are already widening, and here is the monthly StatCan series
that proves it." The US is still ~72% of these exports and still growing —
saying so plainly is what makes the rest credible. *The Closed Loop* is the
Canada–Korea anchor case.

## Migrating legacy content
`/tmp` scripts are gone between sessions; the approach is what matters.
Both old sites were parsed with a walker that captures **every element which
directly contains text**, not a whitelist of tags — these pages put figures and
claims in `<div>`/`<span>`, and a tag whitelist silently drops them. Verified by
diffing the source vocabulary against the output: **0 words lost** across the
dossier and 4 of 5 reads. Two traps worth remembering:
- Astro parses `{` `}` in text as a JSX expression. Escape to `&#123;`/`&#125;`
  or the build dies on any content containing a brace.
- Pass component props as `label={"…"}`, never as a bare HTML attribute. A
  quotation mark inside the text ends the attribute early.

## Open / pending
1. **THIS SITE DOES NOT ASK FOR MONEY.** Owner's decision, and it is settled —
   not "not yet", not "once there's traffic". Northern Temper makes its
   argument and asks the reader for nothing.
   `/support` carries `noindex`, is out of the sitemap, out of `llms.txt` and
   out of `llms-full.txt`, and nothing links to it. The page and
   `src/lib/support.ts` are **untouched on disk and deliberately preserved** —
   the owner intends to reuse that code on a different site, so do not delete
   it. **Never re-link it here, never re-add it to the sitemap, never propose
   a donation, tip jar, membership or "support us" surface on this site, and
   never ask for `SUPPORT_WALLET` again.** If a future session thinks the site
   should monetise: it should not. That is the point of it.
2. ~~Separation-cost calculator~~ — **built at `/calculator`.** Live StatCan
   provincial GDP (36-10-0222) and population (17-10-0009); every line states
   its own method and cites its source on the page. Pure client-side
   arithmetic, no service, no cost.
   It cross-validates against the dossier's independent research: Alberta's
   debt share computes to $155B (dossier: $155B), Quebec's to $277B (dossier:
   ~$278B), from live population alone.
   **Day-one cost per resident is near-constant across provinces** — both its
   components scale with population. That is not a bug; the page says so
   explicitly, because a headline that reads identically everywhere otherwise
   looks broken. What varies is the recurring bill, driven by GDP per head.
3. **Middle-power bloc map** — static TopoJSON + inline SVG. Never Mapbox: keys,
   cost, and a tracking surface on an otherwise privacy-clean site.
4. **Coalition** — `/join` is a `mailto:`, which costs nothing and needs no
   backend. Only replace it if volume actually demands it.
   **`/sources` is the site's central claim made inspectable** — every figure,
   its source table, its reference period, and for live ones the endpoint
   serving it. Where a figure has a known weakness the row says so, including
   the water vintage. Add a row whenever a new figure appears anywhere on the
   site; a number that is not on that page is a number nobody can check.
5. **`/support` — retired from this site, and the code kept on purpose.**
   The rail itself is **sound work, not sloppy work** — the EIP-681 argument
   ordering, the server-rendered QR, the self-hiding-when-unset behaviour are
   all correct and worth reusing. What was wrong was never the craft; it was
   the **fit**. The addressable audience for a USDC-on-Base payment on a
   Canadian civic-pride site rounds to zero, because using it needs a wallet,
   USDC *specifically on Base*, and enough familiarity to trust a URI scheme.
   A well-built bridge to an island nobody lives on is still good bridge-
   building — and still the wrong project. That is a targeting error, not a
   quality one, and the distinction matters because the code deserves to be
   reused somewhere it fits.
   **The owner intends exactly that: reuse it on a different site.** Keep
   `src/lib/support.ts` intact. What follows is the original design, kept so
   the preserved code is explicable — NOT a spec to rebuild here:

   A **colophon, not a plea**:
   what it costs, in the site's own ledger register. No modal, no thermometer.
   The rail is **deliberately processor-free** — USDC on Base, wallet to wallet,
   so no platform can decide the page is a political risk and switch it off.
   That independence was the reason it was built this way. **The owner has
   since reversed that call** — see the top of this item. The section still
   hides itself when `SUPPORT_WALLET` is unset, which is why nothing leaked
   while the page was live and unset. The EIP-681 URI
   targets the **token contract** with the recipient as the `transfer` argument
   — the arrangement that reads more naturally asks for native ETH and delivers
   no USDC at all. QR is rendered to SVG server-side so the page ships no QR
   library. If this ever runs during a writ period, check Elections Canada
   third-party advertising thresholds.
6. **French** — `/fr` is **live as a BROUILLON draft behind `noindex`**, Act I
   only, re-authored rather than translated. It needs a native Québécois reader
   to sign off; then remove `<Brouillon />`, drop `noindex`, and add the
   reciprocal hreflang pair (the spot is marked in `Base.astro`). Until then
   hreflang is deliberately NOT emitted — pairing an indexed page with an
   unindexed one is a bad signal.
   Rules live in `source-material/primestrength-bilingual.skill`; read
   `references/quebec-french.md` before touching any French.
   - **« La trempe »** carries the same double meaning as "temper" —
     the metallurgical sense and a person's calibre. That is why the French
     title is *La trempe du Nord* and not a translation of the English one.
   - The English page opens on Gander. The French opens on **le fleuve**,
     because the water argument is not abstract to a reader here — it runs
     past LaSalle and the gauge reports it every five minutes.
   - **Typography is the fastest tell**, and an earlier version of this note
     got it wrong. Canadian usage drops the space before **`? ! ;`** where
     France thin-spaces all three — but the **colon is not part of that
     divergence**: Canadian French takes a non-breaking space before `:`
     exactly as France does (OQLF, *Banque de dépannage linguistique*). Use
     U+202F (narrow no-break) for it, and inside guillemets, so the mark can
     never wrap away from its words. Straight ASCII quotes are the surest sign
     of machine translation — `'` is never right in French prose, only `’`.
     **`tools/check-french.cjs` enforces all of this and runs inside
     `npm run build`.** It was previously claimed here to run and did not,
     which is exactly how `/fr` came to ship with 71 straight apostrophes and
     zero typographic ones. It audits built HTML, so component output and
     generated alt text are covered too. Keep it at zero.
   - Banned framings (1995 federal-propaganda echoes) are audited too:
     *unité nationale, notre grand pays, d'un océan à l'autre, un Canada uni,
     la nation canadienne.* Never reintroduce them.
7. ~~Fact-check the water figures~~ — **done, replaced, and live.**
   The site used to print **109,837 m³ against 9,980** and call it eleven to
   one. Those came from separate publications on different dates, and the
   Canadian one divided its volume by the population of its own publication
   year — about 31.7 million, Canada in 1998. **A ratio assembled from two
   vintages is not a checkable number**, which is disqualifying on a site whose
   entire claim is that its figures are checkable.

   Now: **FAO AQUASTAT, served key-free through the World Bank**, one source,
   one reference year, the same definition on both sides of the border.

   | renewable **internal** fresh water | Canada | United States | ratio |
   |---|---|---|---|
   | per capita | 73,170 m³ | 8,437 m³ | **8.67×** |
   | total volume | 2,850 km³ | 2,818 km³ | **1.01×** |

   **The second row is the argument.** The two countries make almost exactly
   the same amount of fresh water; the whole per-capita gap is population. That
   is harder than "eleven times" because it is reproducible in one request and
   it carries its own explanation. `/` leads on it, `/fr` leads on it, and the
   home page keeps an open `<details>` titled *"This page used to say eleven
   times"* — **flagging our own correction in public is the posture. Do not
   delete that note.**

   Rules that must hold:
   - **`ER.H2O.INTR.PC` / `ER.H2O.INTR.K3`, and index rows by
     `countryiso3code`** ('CAN'/'USA'). `country.id` is the TWO-letter code and
     will never match — the same row-order discipline the StatCan reader needs,
     for the same reason.
   - **`getWater()` rejects a year mismatch between the two countries** and
     falls back rather than print a cross-vintage ratio. That guard is the
     whole point of this change; do not remove it.
   - **The ratio is computed, never typed** — in both languages. French uses a
     decimal comma (`8,7`), via a separate `Intl` formatter.
   - **`internal`, not `total`.** Total renewable counts cross-border inflow,
     and much of what reaches the US arrives from Canada — the wrong measure
     for a claim about what Canada makes.
   - **The `home` and `fr` OG cards print the ratio and a PNG cannot update
     itself.** If AQUASTAT's reference year moves and the ratio shifts, rerun
     `tools/generate-og.cjs`. A card disagreeing with the page it links to is
     worse than no card.
   - Live at `/api/water.json`, on `/sources` as four live rows, and carrying
     Dataset markup.
8. **Legal:** "Team Canada" is a Canadian Olympic Committee mark. The rebrand
   sidesteps it — do not reintroduce the name as a public brand.
9. **Two analytics vendors — the owner's call, and it is genuinely open.**
   Vercel Web Analytics was removed once (PR #28) as redundant with Umami, then
   re-enabled through the Vercel dashboard's one-click integration (PR #34).
   Neither state is wrong; they trade different things:
   - **Keep both.** Vercel's numbers are first-party, survive ad-blockers that
     take Umami out, and need no third-party origin. Cost: +1,497 B gzipped on
     every page, and a second party receiving reader data.
   - **Drop Vercel, keep Umami.** Restores the ~2 kB JS budget and the "one
     provider" posture that `/privacy` used to state. Cost: the numbers
     under-count wherever `cloud.umami.is` is blocked, which on a politically
     adjacent site is not a small share.
   - **Drop Umami, keep Vercel.** The only option that removes a third-party
     origin from the page entirely — the cleanest privacy posture of the three,
     and the smallest payload. Cost: Hobby-tier event caps, and the owner
     already set Umami up.
   Until the owner decides, both ship and `/privacy` names both. Whichever way
   it goes, `tools/check-privacy.cjs` makes the page follow the config.

## Sister projects (separate repos, do not merge in)
- **x402-facilitator** — USDC/Base payments. Real work, zero relation to this
  argument. It is a Fit For Gov capability proof, not a donation rail for a
  civic site.
- **MuniTech / Fit For Gov** — `notes/MUNITECH-STRATEGY.md` (internal).
