# CLAUDE.md — handoff & memory for this repo

> Read this first. It's the durable memory across sessions (chat history does NOT carry over).
> Keep it accurate; update it in the same commit when conventions change.

## THE BAR — must read, every session
**This site is to be better than 99.999999999% of web properties on the
Internet.** That is the owner's standing objective, stated 24 September 2026,
and it underpins every decision here. Not "good", not "better than most": the
best work that can be done with the resources at hand in the time available,
every time, and the question to ask before anything ships is *"is this the
best I can do?"* — not "is this the easiest thing that works". When a choice
is between the easy option and the excellent one and both are free, take the
excellent one; when the excellent one costs money, see ZERO BUDGET below — it
has to earn it first. Everything that follows in this file (seven build-time
checkers, a ten-viewport sweep, figures written once, sources quoted from
their abstracts) exists because of this bar. Do not lower it to finish faster.
(That parenthesis said "seven" checkers when it was written; it is ten now,
plus a generator that fails. Counts in prose drift; the tools do not.)

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
  the second vendor went live. Both are free and both are cookieless. **Neither
  writes browser storage, but both READ it** (this file and `/privacy` once
  said neither touched it, and that was wrong): Umami reads `umami.disabled`,
  its opt-out switch, and Vercel's script reads an identity entry it would
  write only if the site called its identify API, which it never does. Read
  the scripts again if either vendor changes them. The no-consent-banner
  posture is intact. **Whether to keep the second one is an
  open question for the owner — see Open item 9.** What is NOT open is that
  `/privacy` must name whatever ships; `tools/check-privacy.cjs` now fails the
  build if it does not.
- **Client JS budget: ~2 kB gzipped for the whole site.** If a feature needs a
  framework, question the feature first. **This budget is currently exceeded,
  and this line used to misdescribe what ships.** The only first-party external
  script is Astro's prefetcher (`/_astro/page.*.js`, ~1.2 kB gzipped, from
  `prefetch` in `astro.config.mjs`; the reveal fallback and the count-up are
  small inline scripts, as are the nav, share band, calculator, join form and
  `LiveRefresh`). Measured on production in September 2026, gzipped: prefetcher
  1,181 B, `/_vercel/insights/script.js` 2,025 B, Umami 2,342 B from a
  third-party origin. Vendor byte counts drift with every vendor release; re-
  measure rather than trust these.

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
- `src/pages/.well-known/security.txt.ts` — RFC 9116 `security.txt`, written
  at build from `SITE.email` with an `Expires` 180 days after the deploy. It
  shipped for months as a static file WITHOUT `Expires`, which the RFC makes
  required; a typed date is one somebody must remember to move, so it moves
  itself on every deploy.
- `src/styles/tokens/*.css` — **verbatim from the design system** + `a11y.css`.
- `src/styles/base.css` — imports the tokens, then reset, type scale, grain,
  reveal system. `a11y.css` must import last; it overrides four text roles.
- `src/layouts/Base.astro` — head, meta, OG, JSON-LD, skip link, reveal fallback.
- `src/components/` — `Stat`, `Meter`, `marks/{BearDual,BearHead,LeafSeal}`,
  and `BarTable` — a figure that is a real table first (every value printed,
  row and column headers) with a single-hue bar under each value; no script, no
  image. `/read/the-vertical-squeeze` draws its three figures with it and
  `/read/the-closed-loop` its one. Write a space after a heading's kicker and
  between cells: layout hides a missing one, and anything that reads the text
  rather than the layout (`llms-full.txt`, the word count) runs the words
  together.
- `src/lib/sources.ts` — live figures from StatCan WDS + Bank of Canada Valet.
- `src/lib/figures.ts` — **the one place a hand-entered number is written.**
  `sources.ts` covers figures that come from an endpoint; this covers the ones
  that come from a document and therefore have to be typed by a person. It
  carries each figure's machine value, its exact `display` string, its source
  and period, and — where the publisher runs on a cycle — a `reviewBy` date
  that fails the build once it passes. `/calculator`, `/math`, `/build`,
  `/sources` and `/read/the-red-is-the-work` all render from it.
- `src/lib/reads.ts` — **each read's title, imprint, date and length, once.**
  The read page, `/read`, `feed.xml`, the Article markup, the OG article tags
  and the `/read` share card all read it. They used to be typed in up to four
  places, and three reads carried May dates their own text contradicts ("current
  to June 1, 2026" under a 4 May date); every read now prints its date. The
  length is COUNTED: `check-figures` counts each built article and fails the
  build unless `words` is exactly that, printing the number to write. The typed
  lengths had drifted up to 6%.
- `src/lib/calculator.ts` — the separation bill's arithmetic, once;
  `/calculator` and the calculator share card both run it.
- `tools/load-ts.cjs` — bundles a `src/lib` module with esbuild so a CommonJS
  tool calls the page's own code rather than a copy of it.
- `src/components/Nav.astro`, `SiteFooter.astro`, `BlocChart.astro`.
- `src/layouts/Read.astro` — the long-form layout (single 68ch column), plus a
  named `after` slot for anything that belongs OUTSIDE the column on the black
  ground — the share band, in practice; all six reads use it, each with its
  own quote. A read passes only its `slug` (the rest is in `src/lib/reads.ts`),
  its description and its standfirst; the layout prints the date.
- `src/lib/support.ts` — the processor-free support rail (see below).
- `src/lib/schema.ts` — Article markup for the reads, **Dataset markup for the
  six public endpoints**. The site redistributes government figures under CC0;
  Dataset markup is how that becomes findable as data rather than as six
  anonymous JSON URLs, which is the discovery channel that actually fits a site
  whose only asset is checkability. Each dataset carries a `short` blurb and
  **`/sources` renders its endpoint list from this array** — the list there
  was typed by hand and said "four endpoints" for as long as `water.json`
  existed. **`isBasedOn` names each upstream table as a Dataset with its
  publisher**, linked by the same `src/lib/upstream.ts` that links the IDs on
  `/sources`, so the markup and the page cannot cite different things. It
  used to be one bare URL per dataset, the agency's home page, which told a
  crawler nothing a reader could check. The record's dataset lives on
  `/record` (its `url`) and carries `sameAs` from `/sources`.
- `src/pages/api/{figures,rivers,trade,provinces,water}.json.ts` — on-demand
  live data. `src/pages/api/record.json.ts` is **prerendered** from the
  committed snapshot, so it is a static file: its CORS header comes from
  `vercel.json`, not from code like the others.
- **The record** — `src/lib/record.ts` (the one copy of the math; the pages,
  the endpoint, the report and the share card all call its `compute()`),
  `src/data/record/45-1.json` (the committed snapshot, ~174 kB, one character
  per ballot), `src/layouts/Record.astro` (the shared frame and the ledger
  styles, global under `.rec` on purpose), `src/pages/record/index.astro`
  (the front page), `src/pages/record/divisions.astro` and
  `src/pages/record/members.astro` (the ledgers), `tools/record/fetch.cjs`
  (incremental snapshot writer), `tools/record/validate.cjs` (the snapshot
  must add up; run before every write and in every build),
  `tools/record/load.cjs` (`record.ts`'s `compute()` for CommonJS tools),
  `tools/record/analyse.cjs` (the report), `.github/workflows/record.yml`
  (the daily refresh). See "The record" below.
- `.github/dependabot.yml` — monthly PRs for GitHub Actions and npm, grouped.
  Every action sat on a major whose Node runtime GitHub had retired, and the
  adapter trailed a release that fixed a bug `vercel.json` works around, with
  nothing proposing either upgrade.
- `.nvmrc` and `engines` in `package.json` — **the Node version, written
  once.** CI reads `.nvmrc`; Vercel reads `engines` for the build and the
  functions. It was declared nowhere, and three machines each chose.
- `legacy/` — the previous primestrength.ca static site. **Not deployed.**
  Content still to migrate: `legacy/read/*.html` (5 long-form pieces),
  `legacy/fr/index.html`, `legacy/join.html`.
- `.github/workflows/verify.yml` — build + `check-french` + `npm audit` + the
  full sweep, on every PR and every push to `main`, **plus a second build with
  every upstream down** (`NT_OFFLINE=1`, see the CSP convention for why). Free:
  the repo is public.
- `tools/check-french.cjs` — Québec typography + banned-framing audit;
  `tools/check-llms.cjs` — llms.txt shape + no-restated-figures, and
  `ai.txt`'s `Data:` lines equal `src/pages/api` both ways (it said "four
  endpoints" while six shipped, the third typed count to drift here); and
  `tools/check-docs.cjs` — **every path THIS file names must exist**; and
  `tools/check-privacy.cjs` — **`/privacy` must name exactly the analytics
  vendors the site actually ships**, and no third-party script origin may reach
  a page undisclosed; and `tools/check-figures.cjs` — **no hand-entered figure
  may go stale or be typed twice, and every read's length is its count**; and `tools/check-sitemap.cjs` — **nothing
  in the sitemap may be `noindex`, and nothing indexable may be missing from
  it**; and `tools/check-csp.cjs` — **the Content-Security-Policy in
  `vercel.json` must list exactly the inline-script hashes and script origins
  the build ships**, in both directions, with no `'unsafe-inline'`; and
  `tools/check-internal-links.cjs` — **every same-origin `href` in the build
  must land on a page the build produced, and every `#fragment` must name an
  id on that page**; and `tools/check-canonical.cjs` — **one page, one URL:
  every canonical names its own page, every sitemap `<loc>` equals that
  canonical byte for byte, every same-origin reference the build writes uses
  it, and the other form permanently redirects**; and `tools/check-live.cjs` —
  **every figure marked `data-live="false"` has a note in its block saying a
  source is not responding, no block whose figures are all live says so, and
  under `NT_OFFLINE=1` every live figure on the site is on fallback** (see
  "A figure never renders blank" below). Every one of them runs in
  `npm run build` and fails it, and so does
  `tools/generate-llms-full.cjs` if a sitemap page is in neither its reading
  order nor its exclusion list. Outside the build: `tools/check-links.cjs`
  (every external link the site cites, weekly, from
  `.github/workflows/links.yml`) and `html-validate` against
  `.htmlvalidate.json` (in `verify.yml`).
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
  `public/favicon.svg`, and the maskable manifest icons, drawn from
  `LeafSeal.astro`; `tools/check-icons.cjs` — proves they still match, and
  measures each maskable icon's safe zone.
- `tools/check-sitemap.cjs` — the sitemap and the pages' robots meta must
  agree (every `.html` the build writes, not only `index.html`: `404.html`
  answers 200 at its own filename and was indexable there), and the `X-Robots-Tag` rules in `vercel.json` must reach exactly the
  five machine text files, no more and no fewer.
- `tools/check-csp.cjs` — the CSP in `vercel.json` matches the built scripts.
- `tools/check-canonical.cjs` — one page, one URL, in the build. See the
  convention "One page, one URL" below for why it exists.
- `tools/check-urls-live.cjs` — the same claim on the real edge, weekly from
  `links.yml`: canonical pages answer 200 with no noindex, the slash form
  308s to them, `/llms-full.txt` carries `X-Robots-Tag: noindex`, http,
  www and `teamcanada.vercel.app` all land on the apex, and the published
  `security.txt` has at least 30 days left on its `Expires` (it renews on
  every deploy, so a failure means the site has stopped deploying).
- `tools/check-internal-links.cjs` — no link inside the site points at a page
  that does not exist, and no fragment points at an id that is not there
  (the members ledger links every break to `/record/divisions#vN`, and a
  fragment that names nothing lands the reader at the top of a 174-row table
  with no idea why). **This was a gap for as long as the site existed:** the
  sweep counts broken *resources* and `check-links` checks *external*
  citations, so two "Read next" links carried over from the legacy site
  (`/read/two-leaders.html`, `/read/honest-answer.html`) passed eight
  checkers and a ten-count sweep and 404'd on production until a phone-width
  crawl of the live site tripped over them. Reachability is a claim too: the
  crawl proved every sitemap page reachable by tapping from `/`, acts and
  receipts in one tap via the hamburger, every read in two.
- `tools/check-links.cjs` + `.github/workflows/links.yml` — external links
  still resolve; weekly and on demand, never on a PR (other people's outages
  must not turn a review red). The same workflow runs
  `tools/check-csp-live.cjs` — the CSP against the real vendors on production.
- `.htmlvalidate.json` — config for the HTML validity step in CI.
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

**That rule was written here and not kept, and nothing could tell.** Until
September 2026 `/hand`, `/bloc` and `/calculator` printed fallbacks with no
notice, `/` said so only from a client script, a gauge silent for 51 hours was
served as live under "right now", and `/sources` said "responding right now"
on a page built days earlier. What holds it now:
- `src/lib/sources.ts` marks a gauge older than three hours stale, and trade
  and provincial figures fall back **all or nothing** (one month, one quarter,
  every row live), the discipline `getWater()` always had. A fallback API
  answer is edge-cached for a minute, not an hour.
- Pages print their notice from the SERVER (`data-live` on each figure,
  `data-live-note` on its block), and `tools/check-live.cjs` fails the build
  when a fallback has no notice or a live block claims one. `verify.yml`'s
  offline build renders every fallback on every PR, so the notices are proven,
  not assumed.
- `src/components/LiveRefresh.astro` refreshes `/`, `/hand` and `/fr` from the
  site's own endpoints once loaded, so "a reading, taken this morning" is true
  of what a reader sees. **Only a live answer replaces a printed value**; a
  fallback never does, or an outage would swap the build's newer number for
  an older one. No figure lives in the script, so its CSP hash never moves.
- Where a page cannot refresh, its words carry the date: `/bloc` names the
  month the series describes, `/sources` the time it was built.

## Conventions
- **Verify before pushing: `node tools/verify.cjs`.** It serves
  `.vercel/output/static` through Playwright request interception and sweeps
  **every page across 10 viewports** (320 → 2560) for horizontal overflow,
  console errors, undersized tap targets, broken references and missing
  `og:image:alt`, plus WCAG AA contrast and a full **axe-core** pass on all
  pages, and **serves the production CSP on every HTML response** so a policy
  that blocks the nav or the share button fails here, not in a reader's
  browser. Since September 2026 it also counts **glued words** (an inline
  element meeting text with no space, read from the laid-out page, so a
  block-styled link is not a false alarm) and **navigation problems** (the
  phone menu opened at six short phone sizes the width sweep never uses: every
  link reachable by a finger, none focusable while closed, closed when focus
  leaves it; `/record/divisions#v73` landing below the sticky nav; and the menu
  working while a third-party script is stalled for eight seconds, which it
  did not while Umami loaded with `defer`). It exits non-zero. **Current state:
  clean on all twelve counts.** Keep it there.
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
- **One page, one URL: no trailing slash, and the other form redirects.**
  For the site's first months every page answered 200 at BOTH `/bloc` and
  `/bloc/`. Every canonical, og:url, JSON-LD url and internal link said
  `/bloc`; the sitemap said `/bloc/` (what `@astrojs/sitemap` writes when
  `trailingSlash` is unset and `build.format` is `'directory'`), and so did
  the share band on thirteen pages, because it falls back to
  `Astro.url.pathname`. Google's own rule is "don't specify one URL in a
  sitemap, but a different URL for that same page using rel=canonical", and
  Search Console showed the cost in September 2026: twelve slash URLs from the
  sitemap "Discovered, currently not indexed", and `/bloc/` and `/privacy/`
  filed as "Alternate page with proper canonical tag". Nine checkers and a
  ten-count sweep passed the whole time, because `check-internal-links`
  resolves both forms to the same file and a share URL sits percent-encoded
  inside a query string. Now `trailingSlash: 'never'` is set in
  `astro.config.mjs` **and nowhere else**: the adapter turns it into a 308 from
  `/x/` to `/x` ahead of the filesystem, the sitemap drops the slash, and
  `Astro.url.pathname` loses it. Do not also set `trailingSlash` in
  `vercel.json`; the adapter warns against having both. Two consequences:
  `astro dev` answers `/bloc/` with a 404 (production redirects), and every
  link written by hand must be the no-slash form, which `check-canonical`
  enforces. **The retired default host follows the same rule:**
  `teamcanada.vercel.app` served the whole site with no noindex, so the first
  entry in `vercel.json` `redirects` sends it to the apex with a
  host-conditioned 308. Its source is `/(.*)`, NOT the `/:path*` in Vercel's
  own KB example: in the compiler Vercel uses, `/:path*` matches neither `/`
  nor any path ending in a slash, so it would have redirected most of the site
  and silently kept the homepage. A `has` condition cannot run on a preview
  or under `vercel dev`, which is why `check-urls-live` exists.
- **The five machine text files carry `X-Robots-Tag: noindex`; nothing else
  does.** `/llms-full.txt` is 18 pages' prose in one file, 70 to 99% of
  each one's words, and it was indexable: an extra search result that could
  win a long-tail query as bare text/plain, with no share band, no live
  figures and no fallback notice. It was also the only indexable copy of the
  `/fr` BROUILLON, which the owner deliberately keeps `noindex`. `llms.txt`,
  `ai.txt`, `humans.txt` and `LICENSE.txt` ride the same rule because none is a
  page a searcher should land on. **This does NOT tighten access for AI
  crawlers:** `noindex` never blocks a fetch, the named crawlers are governed
  by `robots.txt`, and `robots.txt` still says `Allow: /` to every one of them.
  Deliberately left alone: `/feed.xml` (its "Crawled, not indexed" status is
  the correct resting state for a feed, and a noindexed feed has no documented
  guarantee of still feeding discovery); `/robots.txt` and the IndexNow key;
  `/api/*.json` (JSON is not an indexable type for Google, and Dataset Search
  reads the markup on `/sources` and `/record`); and `/og/`, because Article
  images must be crawlable and indexable. **The rule is one careless edit away
  from deleting the site from Google** (a source widened to `/(.*)`), so
  `check-sitemap` compiles every header rule with Vercel's own router, tests
  it against every file the build wrote, every page in both spellings and
  every `/api/` route, and fails unless the rules reach exactly these five
  files. It counts `none` and `unavailable_after` as well as `noindex`: its
  first version matched only the word, and a rule sending `none` to `/(.*)`,
  which Google defines as "Equivalent to noindex, nofollow", passed with every
  page deindexed. It fails on a missing `vercel.json` rather than skipping.
  Proven by swapping the rule's source: `/(.*)` sending `none` fails with
  138 violations (the first version passed it with 0), `/og/(.*)` with 41,
  `/api/(.*)` 11, `/(.*)\.xml` 8, `/(.*)\.txt` 3, a single read 6.
- Develop on a branch → draft PR → merge to `main`. The one exception is
  `record[bot]`, which commits a new snapshot straight to `main` after the
  build passes — see "The record".
- **A push made with `GITHUB_TOKEN` triggers no workflow.** GitHub forbids
  workflows chaining off their own token, so when `record.yml` pushes to
  `main`, `verify.yml`'s `push` trigger never fires and the sweep would never
  see a bot commit. `workflow_dispatch` is the one event that IS allowed to
  chain, so `verify.yml` carries it and `record.yml` dispatches it by hand
  after the push (`actions: write`). Vercel deploys from the push regardless
  and runs every build checker again on its side.
- **A scoped `<style>` stamps `data-astro-cid-…` onto every element it could
  match, and on a ledger that is the page.** The first record page carried
  5,935 of them, 154 kB of a 391 kB file, on cells whose only styling was a
  border. `Record.astro` uses `<style is:global>` under a `.rec` class that
  nothing else on the site uses; the same ledgers now carry 136. Reach for
  this only for a page that is mostly a table; scoping is the right default
  everywhere else.
- **Links change ground, and the colour has to change with them.** The record
  front page alternates white and black sections, and when the method section
  moved from one to the other in a refactor its `--nt-red` links went to
  3.57:1 on black. The sweep caught it before it shipped. In `Record.astro`
  links are `--nt-red-lift` by default and `--nt-red` inside `.nt-light`, so
  a section can move between grounds without a fresh audit; do the same
  anywhere links sit on both.
- **The sweep blocks service workers instead of filtering their errors.**
  It filters exactly one console message, "Failed to load resource", because
  every failed request is already counted by path as a broken reference and
  the console copy carries no URL; nothing else is filtered. (This note once
  said it filtered nothing, and before that described a different filter:
  the note outlived the design twice.) A
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
  broken input before it is trusted — every one has been. `check-canonical`
  failed the unmodified main build with 33 problems before it passed the
  fix, and `check-urls-live` failed production with 6 before the fix shipped.
  **A checker can also fail for the WRONG reason, which costs just as much
  trust.** `check-privacy` stripped block comments before line comments, so a
  `//` line elsewhere in `astro.config.mjs` that happened to contain the two
  characters closing a block comment mispaired the regex, hid
  `webAnalytics: { enabled: true }`, and turned the build red claiming analytics
  was off while it was on. Line comments are stripped first now. When a checker
  parses source text, assume the source contains the characters your parser
  cares about.
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
  because they are big enough to hold it. **The maskable icons are separate
  files** (`icon-maskable-192.png`, `icon-maskable-512.png`): the seal at 72% on
  black, so its ring sits inside the W3C safe zone (radius 0.4 of the width).
  The manifest used to reuse `icon-512.png`, whose ring runs to the edge, so a
  launcher's circle mask cut the seal to a bare leaf and a squircle left red
  wedges in the corners. `check-icons` measures it.
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
- **A `noindex` page must stay out of the sitemap, and the filter is NOT the
  place that rule is enforced.** A sitemap entry asks Google to index a URL; a
  `noindex` on the page tells it not to. Sending both is contradictory, and
  Google resolves it by trusting the page — so the entry is wasted crawl budget
  on a site already sitting in the *Discovered — currently not indexed* queue.
  **This rule was written down here, restated in `astro.config.mjs`, and still
  applied incompletely:** the filter excluded `/fr` and `/support` and missed
  **`/offline`**, which carries `noindex, nofollow` and was submitted to Google
  for as long as the sitemap has existed. Reading the filter would never have
  revealed it — the filter looks complete. It is only visible by comparing the
  sitemap against the pages, which is what `tools/check-sitemap.cjs` now does
  on every build, in both directions: no noindex URL in the sitemap, and no
  indexable page missing from it. Remove `/fr` from the filter the day the
  BROUILLON banner comes off.
- **Google's Dataset parser is NARROWER than schema.org, and `spatialCoverage`
  is where that bites.** It accepts Text, a `Place` carrying `geo`, or a
  `GeoShape` — and nothing else. `Country` is perfectly valid schema.org (it
  descends from Place) and Search Console still rejected all five datasets with
  *"Invalid object type for field spatialCoverage"*. It is plain Text now, and
  **per-dataset**, because it was never the same for all of them: the water
  dataset covers Canada *and* the United States, so `Country: Canada` was wrong
  on the facts as well as the type. Do not swap Text for a bounding box unless
  the four coordinates can be cited.
- **The service worker is network-first for pages and data, cache-first only for
  fonts, marks and images.** It must never be the reason somebody sees an old
  figure. Bump `VERSION` in `public/sw.js` when a cached asset changes; activate
  deletes every other cache, so a bump is a clean slate.
- **The CSP allows inline scripts by HASH, never by `'unsafe-inline'`.** Seven
  inline scripts ship (the Vercel analytics bootstrap, nav toggle, service
  worker registration, share band, calculator, reveal fallback, join form) and
  their sha256 tokens are listed in `vercel.json`. Editing any of them, or
  upgrading the Vercel adapter, changes a hash; `check-csp` fails the build and
  prints the token to paste.
  **No inline script may carry a figure.** A hash pins bytes, so a script whose
  bytes include data fails the build the day the data moves. `/calculator` did
  exactly that: `define:vars` put the live StatCan population into its script,
  so the hash in `vercel.json` matched only one quarter's population, and a
  build with StatCan down (the fallback value) failed `check-csp`. It was found
  in September 2026 only because this sandbox cannot reach StatCan; the
  December release would have blocked every deploy, the record bot's
  included. The calculator now computes every province in its frontmatter and
  hangs the finished text on each `<option>`; the script only swaps text.
  Data goes in the markup, never in a script. **`verify.yml`'s
  `offline-build` job enforces it:** `NT_OFFLINE=1` makes every upstream in
  `src/lib/sources.ts` fail at once, and the full build must still pass, so a
  shipped byte that depends on the data fails on the PR, not on a deploy
  months later. `define:vars` is fine for a constant from `src/config.mjs`
  (`/join` uses it for the address) and nothing else.
  `style-src` keeps `'unsafe-inline'` because the
  stylesheet is inlined by design (`inlineStylesheets: 'always'`, measured) —
  the security value of a CSP is almost entirely in `script-src`.
  `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`,
  `X-Frame-Options: DENY` and `Cross-Origin-Opener-Policy: same-origin` ride
  alongside. HSTS is Vercel's default and deliberately NOT `includeSubDomains`
  — nobody has audited every subdomain for HTTPS, and that flag is one-way.
  **`connect-src` names `gateway.umami.is`, not just `cloud.umami.is`, and
  that was found on the deploy, not in the repo.** Umami's script is served
  from `cloud.umami.is` and posts its beacons to `gateway.umami.is/api/send`.
  The first policy allowed only the former; the build passed, the sweep passed,
  CI passed, and on the preview the browser refused every analytics hit.
  Nothing local can see where a third-party script connects, because the sweep
  stubs other origins on purpose. So `tools/check-csp-live.cjs` opens real
  pages on a real deployment and fails on any violation — weekly against
  production from `links.yml`, and by hand against a preview URL after any
  CSP change. **Verify a CSP on the deploy, never only in the sweep.**
- **Vercel's `source` patterns are path-to-regexp 6, not regex.** `{8}` is
  not a quantifier there; `"/og/(.*)\\.[0-9a-f]{8}\\.png"` was accepted by
  the deploy and matched nothing, so the hashed OG cards kept revalidating
  after the "fix". A pattern is only fixed when the header shows on the
  deployed asset. Test candidates against `path-to-regexp@6.1.0` before
  pushing; the working form is `"/og/([a-z0-9-]+\\.[0-9a-f]+)\\.png"`.
- **Production ignored the adapter's `_astro/*` immutable route.** The
  adapter writes it into `.vercel/output/config.json`, and the live site
  served the hashed JS bundle with `max-age=0, must-revalidate` anyway — every
  repeat visit revalidated a file whose name is its content hash. It is now an
  explicit rule in `vercel.json`, as are the content-hashed OG cards. Check a
  header on the deploy, not in the config: the config said one thing and the
  edge did another. (The cause was the adapter writing that route after
  `handle: filesystem`; `@astrojs/vercel` 11.0.11 fixed the order. The
  `vercel.json` rule stays as the belt to that brace.)
- **Valid HTML, by the spec.** `html-validate` runs in CI on every built page
  (`.htmlvalidate.json`; `no-inline-style` off because the stylesheet is
  inlined by design). Its first run found twelve `<th>` without `scope` in one
  migrated table, a phone number that could wrap, and a `<title>` past 70
  characters — none of which axe reports. `Base.astro` takes an optional
  `pageTitle` for the tab title only; the headline, OG and schema keep the full
  title.
- **The migrated reads were carrying flattening debris and it is gone.** The
  legacy walker captured every text node, which is why 0 words were lost — and
  also why a div-built card grid became forty bare `<p>`s: flag emoji alone on
  a line, "CarneyHarvard" where a label met its text, `· · ·` as a paragraph,
  "Share on X Facebook LinkedIn Copy link" as prose, and a closing line printed
  twice. They are a `<table>`, `<dl>`s, `.compare` cards and an `<hr>` now,
  styled in `Read.astro`, with the legacy HTML as the reference for what the
  author actually grouped. All six reads carry a page-specific share band.
  **That sentence was untrue of `/read/the-vertical-squeeze` until September
  2026**, and nothing could see it: its household cards printed "Total
  paid$10,401", its section markers were loose paragraphs ("§ I — The Squeeze,
  Specified01 / 06"), its footnote numbers ran into their sources, "Letter the
  First" sat after the letter it introduces, and the walker's dedupe had
  dropped the high earner's "Benefits received $0" and three of the five
  Fit/Forward verdicts because each repeated an earlier line. Its three
  figures had been PNG charts; the captions survived and the charts did not,
  so the read described figures it never showed. They are `BarTable`s now,
  drawn from Table 1 on the same page and the legacy chart's own labels, in
  the design system's data colour rather than the dossier's copper. The glued
  words check in the sweep is what keeps this class of fault visible.
  **"0 words lost" was true of the walker's input and false of its output**:
  diff the legacy text against the page, not against the walker.
  **`/math` and `/build` carried the same debris until September 2026**, from
  the dossier in the `teamcanadawins` repo: a grid of six figures and a
  two-province comparison as thirty-nine loose `<p>`s, so no value could be
  matched to its province; a timeline printing "Jan 2025Trump assumes office"; eight
  of the nine section kickers at the foot of the section before them; six pull quotes whose
  attributions read as paragraphs; the playbook's headline figure missing
  entirely, its label printing under nothing; and on `/build` the dossier's
  section rail as a sentence, with Royal Assent stated twice in a row. `/math`
  now follows the source section for section, including which sections sat on
  the dark ground, and a word diff of the source's visible text against the
  page loses no prose. What it drops is furniture: "Team Canada" (retired,
  Open item 8), the scroll cue, a fleuron, the fixed section rail, and a nav
  line that repeats the colophon. A restructure changes no claim; the content questions it
  surfaced went to the owner instead of into the page.

## Discoverability — the point is that it travels
Everything is CC0 and the site is built to be repeated, not protected.
- `robots.txt` **explicitly allows every named AI crawler** — GPTBot, ClaudeBot,
  PerplexityBot, CCBot, Google-Extended, Applebot-Extended and the rest. Most
  sites block these; this one does the opposite on purpose. Do not "tighten" it.
- **`/llms-full.txt`** is the entire site as one plain-text file — 18 pages,
  ~21,900 words — generated by `tools/generate-llms-full.cjs` as a **post-build
  step from the BUILT HTML**, so it can never drift from what is published. It
  is wired into `npm run build`, so Vercel produces it too. **It had glued
  words of its own**: table cells, `<dt>`/`<dd>` and any `<br>` carrying a
  scoped `data-astro-cid-…` attribute ran into each other ("The math
  ofstaying together.", "Total paid$10,401"), which the sweep cannot see
  because it reads pages, not this file. Cells now join with ` | `, terms and
  descriptions take a line each, and every `<br>` is a line break. It is served with
  `X-Robots-Tag: noindex` so it is read by machines and never ranked in place
  of the pages it copies (see the convention on the machine text files).
  **Every sitemap URL
  must be in its `ORDER` or in its `EXCLUDE` with a reason, or the build
  fails.** The first run of that check found `/privacy` and `/terms` had never
  been in the file. The two record ledgers are excluded on purpose: they are
  data, and `/api/record.json` serves them whole. The endpoint list in its
  header is read from `src/pages/api/`, because the typed one said "four"
  while five shipped.
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
  absolute on the canonical host and in the canonical form, byte for byte
  (`check-canonical`). **`/fr` is excluded while it is `noindex`.**
- Structured data: WebSite on every page, Article on each read, **Dataset on the
  six public endpoints** so the figures are findable as data.

## Performance — measured, not assumed
A phone-width cold load, per page: **7–11 requests, 81–120 kB gzipped, ~2 kB of
JavaScript**. **That figure did not count what the page fetched AFTER load**,
and until September 2026 that was most of it: viewport prefetch pulled
200–310 kB of pages (and `/api/*.json`, a serverless invocation each) that a
one-page reader never opened, and the service worker precached the whole home
page (~23 kB br) on every first visit wherever it landed. Prefetch is `'tap'`
now and data links opt out; the precache no longer includes `/`. Measure a page
with its prefetch and service-worker traffic, not without. Roughly **67 kB of that is fonts** — five Latin-subset WOFF2 faces
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

## The site — 20 indexable pages, all shipped
```
I   · TEMPER    /         Character. Water, Gander, Kandahar.   live gauges
II  · THE HAND  /hand     What Canada holds.                    live figures
III · THE MATH  /math     Dossier No. 01, separation costed.     from teamcanadawins
IV  · THE BLOC  /bloc     Middle powers.                        live trade data
V   · THE BUILD /build    Refine · Compute · Corridor + C-5.     from teamcanadawins

/calculator  The bill, per province      live StatCan GDP + population
/record      How they actually voted     the count, the party matrix, the method
  /record/divisions  every recorded division, every party's position
  /record/members    every member, party-line rate, every break
/sources     The receipts                every figure, source, period, endpoint
/fr          La trempe du Nord           BROUILLON, noindex, Act I only
/offline     Service-worker fallback     noindex, OUT of the sitemap
/read + 6 long-form pieces   5 migrated from the old site (9,162 words)
                             + The Red Is the Work, written here (1,154)
/join  /privacy  /terms  /404          /support is HIDDEN (noindex, unlinked)
/feed.xml    RSS for the six reads
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

**`/read/the-red-is-the-work` is the first read written FOR this site rather
than migrated to it**, and it is the thesis as a field note: the red on a
maple leaf is synthesised, not unmasked, and it is a light screen that
protects the leaf while the tree takes nitrogen back before winter — the
pressure from the south as October, the country pulling in and widening
without a word. It runs on two primary sources quoted from their abstracts
(Hoch, Singsaas & McCown 2003, *Plant Physiology* 133:1296; Vergütz et al.
2012, *Ecological Monographs* 82:205), and its one number renders from
`figures.ts` as `N_RESORPTION` — a **global** mean across plant types, so the
prose says "a plant", never "a maple". **The paper-birch paragraph is
load-bearing:** birch makes no red and recovers nitrogen just as well, and
without that paragraph the piece claims red is the only way to have character,
which is the taunt this site exists not to make. Cold-public register from
`compulsion-engineering`: zero em-dashes, four-sentence paragraph ceiling,
grade ~4–7. **Adding a read touches five places** — the page (which passes
only its `slug`, description and standfirst to `Read.astro`), its entry in
`src/lib/reads.ts` (the build prints its word count), `llms.txt`,
`generate-llms-full.cjs` ORDER, and the CARDS list in `generate-og.cjs`. `/read`,
the feed and the `read` card's total follow from `reads.ts`.

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
   backend. Only replace it if volume actually demands it. The form needs
   scripting to open a mail app; without it the form is hidden and the address
   is shown instead (`method="dialog"`, so a stray submit goes nowhere). It
   used to submit to `/join` as a GET, putting the reader's email and message
   in the address bar while the page and `/privacy` said nothing leaves the
   browser.
   **`/sources` is the site's central claim made inspectable** — every figure,
   its source table, its reference period, and for live ones the endpoint
   serving it — **and every table ID is a link to the upstream table or
   series** (StatCan web table, Bank of Canada Valet JSON, World Bank
   indicator JSON) via `upstream()` in `src/lib/upstream.ts`. Until September 2026
   the page named every table and linked none; the whole site hyperlinked
   seven external URLs. "Checkable" has to be one click. Where a figure has a known weakness the row says so, including
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
     itself.** The generator computes it with the page's own `getWater()` and
     prints its year, so a card that lags the page is still true. If
     AQUASTAT's reference year moves, rerun `tools/generate-og.cjs`. (It used
     to type `8.7×`, so a rerun redrew the old number.) The words on `/` are
     computed from the ratio too: "nearly nine times" was typed in the
     description and the prose while the figure beside them was live.
   - **Every card figure that has a source is computed from it** (the
     record, water, trade, the calculator's `bill()`, `figures.ts`,
     `reads.ts`) and dated where the source moves. When a source is down, the
     generator keeps that card's last version rather than draw one from a
     fallback. The calculator card said $253B beside a page printing $254B
     while both were typed.
   - Live at `/api/water.json`, on `/sources` as four live rows, and carrying
     Dataset markup.
8. **Legal:** "Team Canada" is a Canadian Olympic Committee mark. The rebrand
   sidesteps it — do not reintroduce the name as a public brand.
9. **Two analytics vendors — the owner's call, and it is genuinely open.**
   Vercel Web Analytics was removed once (PR #28) as redundant with Umami, then
   re-enabled through the Vercel dashboard's one-click integration (PR #34).
   Neither state is wrong; they trade different things:
   - **Keep both.** Vercel's numbers are first-party, survive ad-blockers that
     take Umami out, and need no third-party origin. Cost: ~2 kB gzipped on
     every page (2,025 B measured in September 2026), and a second party
     receiving reader data.
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
10. **Search Console after the one-URL fix (PR #45, September 2026).** The
    owner's reports on 20 Sept showed 12 slash URLs "Discovered, not indexed"
    and `/bloc/` and `/privacy/` as alternates; the cause and fix are under
    the convention "One page, one URL". After the merge deploys: run the
    `weekly` workflow by hand and require its `urls-live` job green (the only
    proof of the host redirect and the text-file header on the real edge);
    resubmit `https://northerntemper.ca/sitemap-index.xml` (expect 20 pages,
    only the root ending in a slash); URL-inspect and Request indexing the
    no-slash URLs, never-crawled ones first, once each, stopping at the daily
    quota. **Expected, not errors:** "Page with redirect" grows to about 19
    slash URLs; "Alternate page" drops to 0; the noindex row gains the five
    machine text files; `/feed.xml` stays "Crawled, not indexed". **Never** use
    Removals for this. Still the owner's: the old dossier on
    `teamcanadawins.netlify.app` and `teamcanadawins.vercel.app` is live,
    indexable, self-canonical and about 95% the same text as `/math`; a
    permanent redirect to `/math` is written but uncommitted in that repo
    (a push there was refused by permissions), and it should land before
    `/math` is requested. The GitHub "Website" fields on both repos still
    point at the old vercel.app hosts.

## The record — approved 24 September 2026, v1 shipped the same day
**Owner decisions (24 Sept 2026):** reference first, the "closest to you" tool
is a lens on it, never the product; **federal first**, Alberta referendum
tracker second, **BC only after the Elections BC third-party call and a
Hansard spike**; the home is Northern Temper, not a sister site; the JS budget
exception is granted ("adding value and not costing us"); and the daily
refresh commits to `main` by bot, because a daily PR a person must merge is a
record that goes stale the first week nobody does.

**What ships.** `/record` is the front page: five counts, the party agreement
matrix, the two ledgers offered as numbers, the method, a share band. It is
the size of any other page here (49 kB, 14 kB gzipped) because share links
land on it. `/record/divisions` (174 rows, 18 kB gzipped) and
`/record/members` (349 rows, 26 kB gzipped) are the ledgers, split out so the
front page stays light and so a reader searching a member's name searches a
page that has only members on it. Every division number links to the official
House page; every member links to OpenParliament; every break links to
`/record/divisions#vN` and `check-internal-links` proves the id exists.
`/api/record.json` is the whole computed record, **prerendered** (the only
static file under `/api/`; CORS from `vercel.json`), with Dataset markup and
three rows on `/sources` under "Counted". No client script: it is all
rendered at build from `src/data/record/45-1.json`.

**Data, probed not assumed.** OpenParliament.ca API: keyless JSON for votes,
per-member ballots, memberships and politicians; no advertised rate limit, so
be polite (User-Agent with contact, ~150 ms between requests, sequential).
LEGISinfo: every federal bill and stage as JSON. Represent (Open North):
postal code → riding → MP, 60 requests/minute free; **it returns BOTH the 2013
and 2023 boundary sets, filter to the current one.** The official House
division page is `https://www.ourcommons.ca/members/en/votes/45/1/N` with
**lowercase `members`** — the capitalised path is refused with a 403 by
their WAF, and so is anything fetched with curl's User-Agent, so `check-links`
will report those rows unverifiable rather than dead. **BC and Alberta
legislatures have no API**; Hansard is HTML and PDF.

**Method.** Agreement math, never a spectrum: a party's position on a division
is the majority of its cast ballots; a member's party-line rate is the share
of their cast votes matching it (parties with fewer than three casters have
no line, so Greens and independents are reported but not rated; members with
fewer than twenty comparable votes are listed without a rate); pairwise
agreement is over the divisions both parties took a position on; the party a
member is scored against is the one they sat for on the day, from the
membership record. **All divisions, never a curated "key votes" list** —
curation is where bias enters. Yea/Nay count; Paired and Didn't vote are
shown as what they are and are never a position. **The math exists in one
copy, `src/lib/record.ts`:** the three pages and the endpoint import it, and
`tools/record/load.cjs` hands it (through `tools/load-ts.cjs`) to
`analyse.cjs` and `generate-og.cjs`, so they call the same `compute()`.

**The snapshot format** is one character per ballot: `members[]`,
`memberships[]` (with the OpenParliament URL, so an incremental run never
refetches one), and `votes[]` each carrying a `ballots` string of `Y/N/P/A/-`
indexed by member position. 59,579 ballots in 174 kB, committed, diffable.
**A member who has left the House has no current party or riding on
OpenParliament**, and the snapshot's first import took both from the
politician record, so twelve members showed a dash in every column of the
ledger, including the most dissenting one the front page names. `fetch.cjs`
now fills them from the member's last membership, once. The ledger also
lists every party a member sat for this session in order (six crossed the
floor or left their caucus: five to the Liberals, one to sit as an
independent), and the day a seat ended; `party` alone is only the last one.
`node tools/record/fetch.cjs 45-1` fetches only the divisions the snapshot
lacks (a run with nothing new is about three requests) and only bumps
`fetched` when something was; `node tools/record/analyse.cjs` prints the
report. **`fetched` moving only on real change is what makes the workflow's
diff gate mean something.**

**Freshness.** `.github/workflows/record.yml`, 06:23 UTC Monday to Saturday
and on demand, in **two jobs**. `fetch` holds a read-only token and no git
credential: `npm ci`, fetch, `git diff --quiet` gate, **`npm run build` with
the new snapshot, then html-validate and the full sweep, all before anything
reaches `main`** (the sweep used to run only after the bot had pushed and
Vercel had deployed). `publish` can push and runs no npm code at all:
`fetch.cjs` needs only Node's built-ins, so it fetches again, must reach the
same snapshot by digest (`--digest`, the `fetched` stamp aside), commits as
`record[bot]`, rebases onto `main` if a human merged meanwhile, pushes, and
dispatches `verify.yml` by hand (a `GITHUB_TOKEN` push triggers nothing on its
own; see Conventions). `main` is unprotected, which is what lets the push land;
if that ever changes, the bot needs a bypass or the workflow needs to open PRs
instead.

**The session is named once**, in the snapshot `src/lib/record.ts` imports;
`fetch.cjs`, `validate.cjs`, the workflow and `/sources` all read it from
there (it used to be typed six times). **Every run first asks OpenParliament
for its newest division, and if it belongs to another session the run FAILS.**
Before this, a prorogation or an election would have left the bot reporting
"0 new" and success every morning while the House voted in a session nobody
fetched. Starting the next session is the owner's decision (what `/record`
shows when a session has three divisions), so the bot stops and asks.
**Nothing is written unless the snapshot validates**: Yea/Nay/Paired count to
each division's totals, one ballot slot per member, every cast ballot inside a
membership, divisions 1..N with no gap. A known division is never refetched,
so a half-fetched one used to be permanent. OpenParliament lists Bill Blair as
"didn't vote" in seven divisions after his membership ended on 2 February
2026; a non-vote is never scored against a party, so that is left as recorded.

**Scheduled workflows switch themselves off after 60 quiet days**, and the
House rises for about 90 each summer. When nothing has touched `main` for 45
days, `publish` commits one dated line to `.github/heartbeat`. **Daily rebuild
is one secret away**: with a Vercel Deploy Hook stored as
`VERCEL_DEPLOY_HOOK`, `publish` requests a rebuild on every morning with no new
division, so build-time figures are never more than a day old. Until the owner
creates it, the step says so in the run log.

**The share card's figure is counted and dated, never typed.** `generate-og`
reads `compute()` at generation time and prints "99.9% · party-line, 174
divisions to 23 Sept 2026". The snapshot moves daily and a PNG cannot, so the
date is what keeps the card true; rerun the generator when it should catch up.

**What the count says (45-1, 174 divisions, 29 May 2025 → 23 Sept 2026):**
party-line 99.9%; 307 of 344 rated members never broke; most dissent
Erskine-Smith, 6 of 164. Conservatives agree with Liberals on 26.4% of
divisions and with the Bloc on 51.7%; Bloc–NDP 71.1%. **159 of 174 divisions
had zero dissent in every party; none saw any party split 10% or more.**
128 of 174 were genuinely contested (≥ 20% on the losing side); one 164–164
tie (26 Mar 2026). Bill C-5 third reading 306–31. The consequence for design:
within a party there is nothing to plot, so v1 compares parties and shows the
member ledger as the receipt. **A "graph of members" would be five dots.**

**Next, in order:** the reader-as-member lens (vote on the same motions, see
which bench you sat with; the JS exception covers it, ~5–10 kB); the Alberta
referendum tracker; then BC, and nothing BC-provincial ships during the
campaign without Elections BC's answer on third-party status.

## Sister projects (separate repos, do not merge in)
- **x402-facilitator** — USDC/Base payments. Real work, zero relation to this
  argument. It is a Fit For Gov capability proof, not a donation rail for a
  civic site.
- **MuniTech / Fit For Gov** — `notes/MUNITECH-STRATEGY.md` (internal).
