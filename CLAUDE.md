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
**Restraint is the flex.** "We hold eleven times the water and have never once
mentioned the tap" is a harder claim than any taunt — it cannot be screenshotted
against us, it survives a change of government, and it reads as strength to the
skeptic we need. The pressure from the south is the *weather*, never the villain.

The brand sheet's own test governs every surface: *a Canadian feels pride in under
three seconds, and an American neighbour feels respect without being insulted.*
An earlier identity ("Unyielding Dominion", roaring grizzly) was retired for
failing exactly this test. Do not walk back toward it.

## Stack / infra
- **Framework:** Astro 5, `output: 'static'` + `@astrojs/vercel`. Acts are
  pre-rendered HTML; only `src/pages/api/*` runs on demand.
- **Host:** Vercel. **Domain:** northerntemper.ca (registered Sept 2026).
- `primestrength.ca` lapsed 2026-07-31 and went to redemption — recover it if
  still possible and 301 it here; never build on it again.
- **Client JS budget: ~2 kB gzipped for the whole site.** Reveal fallback and
  count-up only. If a feature needs a framework, question the feature first.

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
   4.62:1). Only the red label needs a new value: `--nt-red-lift #D23D56`
   (4.54:1), the same hue lifted 19%. `--nt-red` itself is untouched and
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
- `src/components/Nav.astro`, `SiteFooter.astro`, `BlocChart.astro`.
- `src/layouts/Read.astro` — the long-form layout (single 68ch column).
- `src/lib/support.ts` — the processor-free support rail (see below).
- `src/pages/api/{figures,rivers,trade}.json.ts` — on-demand live data.
- `legacy/` — the previous primestrength.ca static site. **Not deployed.**
  Content still to migrate: `legacy/read/*.html` (5 long-form pieces),
  `legacy/fr/index.html`, `legacy/join.html`.
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
- **Verify before pushing.** Serve `.vercel/output/static` through Playwright
  request interception and sweep **every page across 10 viewports** (320 → 2560)
  for horizontal overflow, console errors and undersized tap targets, then run
  the contrast audit on all pages.
  **Current state: 0 overflow, 0 JS errors, 0 WCAG AA failures, 0 undersized
  standalone tap targets.** Keep it there.
- Contrast must be calibrated against the surface a token is **actually painted
  on**. The footer is `--nt-n-950` (#070707), not `#000`, which drags every
  ratio down ~0.18 — enough to fail a value tuned for pure black.
- Firefox and WebKit cannot be installed in the web sandbox (missing system
  libs), so cross-engine checking is done by auditing features statically.
  Guard `animation-timeline` with `@supports`, prefix `backdrop-filter` with
  `-webkit-`, and always give `color-mix()` a plain `rgba()` fallback line
  first — without it a Safari < 16.2 sticky nav renders fully transparent.
- Content must never depend on an animation to be readable — `prefers-reduced-motion`
  and `@media print` both force `.rv` fully visible.
- Develop on a branch → draft PR → merge to `main`.

## The site — 16 pages, all shipped
```
I   · TEMPER    /         Character. Water, Gander, Kandahar.   live gauges
II  · THE HAND  /hand     What Canada holds.                    live figures
III · THE MATH  /math     Dossier No. 01, separation costed.     from teamcanadawins
IV  · THE BLOC  /bloc     Middle powers.                        live trade data
V   · THE BUILD /build    Refine · Compute · Corridor + C-5.     from teamcanadawins

/read + 5 long-form pieces   9,162 words migrated from the old site
/join  /support  /privacy  /terms  /404
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
1. **Acts II–V** — migrate the content above into `src/content/`.
2. **Separation-cost calculator** — province → GDP hit, debt share, build-a-state
   cost, defence bill. Runs on the Tombe/APP figures in the dossier.
3. **Middle-power bloc map** — static TopoJSON + inline SVG. No Mapbox: keys,
   cost and a tracking surface on an otherwise privacy-clean site.
4. **Coalition backend** — `legacy/join.html` is a `mailto:`. Needs a real store
   (Supabase is already in use on the x402 project) plus a moderation step.
5. **`/support` — built, needs `SUPPORT_WALLET`.** A **colophon, not a plea**:
   what it costs, in the site's own ledger register. No modal, no thermometer.
   The rail is **deliberately processor-free** — USDC on Base, wallet to wallet,
   so no platform can decide the page is a political risk and switch it off.
   That independence is the reason it is built this way, and it is the owner's
   explicit call. Set `SUPPORT_WALLET` in Vercel; the section hides itself when
   unset rather than showing an address nobody can spend from. The EIP-681 URI
   targets the **token contract** with the recipient as the `transfer` argument
   — the arrangement that reads more naturally asks for native ETH and delivers
   no USDC at all. QR is rendered to SVG server-side so the page ships no QR
   library. If this ever runs during a writ period, check Elections Canada
   third-party advertising thresholds.
6. **French** — re-authored, never translated; ships as BROUILLON behind
   `noindex` until a native Québécois reviewer signs off (see
   `source-material/primestrength-bilingual.skill`).
7. **Fact-check:** the 109,837 / 9,980 m³ water figures work back to mid-2000s
   population denominators. The 11:1 ratio holds; the absolutes are ~20 years
   old. Footnote the vintage or refresh both sides from the same year.
8. **Legal:** "Team Canada" is a Canadian Olympic Committee mark. The rebrand
   sidesteps it — do not reintroduce the name as a public brand.

## Sister projects (separate repos, do not merge in)
- **x402-facilitator** — USDC/Base payments. Real work, zero relation to this
  argument. It is a Fit For Gov capability proof, not a donation rail for a
  civic site.
- **MuniTech / Fit For Gov** — `notes/MUNITECH-STRATEGY.md` (internal).
