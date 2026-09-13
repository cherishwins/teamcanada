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
- `src/pages/index.astro` — **Act I · Temper**.
- `src/pages/api/figures.json.ts` — on-demand live figures, edge-cached 1h.
- `legacy/` — the previous primestrength.ca static site. **Not deployed.**
  Content still to migrate: `legacy/read/*.html` (5 long-form pieces),
  `legacy/fr/index.html`, `legacy/join.html`.
- `source-material/` — raw uploads, 107 MB, **not deployed**. Prune or move to
  external storage; it is cloned on every checkout.

## Live data — the rule that matters
Both APIs are public and need no key:
- **Bank of Canada Valet** — `FXUSDCAD`, `V39079` (policy rate).
- **StatCan WDS** — vector `65201210` (monthly real GDP), `1` (population),
  `41690973` (CPI). Confirm any new vector with `getSeriesInfoFromVector`
  before wiring it; vector IDs are not guessable.

**A figure never renders blank.** Every series carries a hand-checked fallback
with the date it was true. On failure the page shows the fallback *and says a
source is not responding*. The site's whole authority is "every figure here is
public and checkable" — it can afford neither a dash nor a silently stale number.

## Conventions
- **Verify before pushing.** Serve `.vercel/output/static` through Playwright
  request interception; check horizontal overflow and console errors at 1440 and
  390, and run the contrast audit. **Current state: 0 WCAG AA failures.** Keep it.
- Content must never depend on an animation to be readable — `prefers-reduced-motion`
  and `@media print` both force `.rv` fully visible.
- Develop on a branch → draft PR → merge to `main`.

## Roadmap — the five acts
```
I   · TEMPER    Character. Water, Gander, Kandahar.        ✅ shipped
II  · THE HAND  What Canada holds.                         ← legacy/index.html
III · THE MATH  Dossier №01, separation costed.            ← teamcanadawins repo
IV  · THE BLOC  ★ Middle powers. Korea/Japan/EU/AU/MX.     ← legacy/read/the-closed-loop.html
V   · THE BUILD Refine · Compute · Corridor + Bill C-5.    ← teamcanadawins repo
```
**Act IV is the new argument and the real flex** — not "we don't need you" but
"we have other partners, and here is the signed paperwork." *The Closed Loop*
(3,359 words, already written) is the Canada–Korea anchor case.

## Open / pending
1. **Acts II–V** — migrate the content above into `src/content/`.
2. **Separation-cost calculator** — province → GDP hit, debt share, build-a-state
   cost, defence bill. Runs on the Tombe/APP figures in the dossier.
3. **Middle-power bloc map** — static TopoJSON + inline SVG. No Mapbox: keys,
   cost and a tracking surface on an otherwise privacy-clean site.
4. **Coalition backend** — `legacy/join.html` is a `mailto:`. Needs a real store
   (Supabase is already in use on the x402 project) plus a moderation step.
5. **`/support`** — a **colophon, not a plea.** What it cost, what it's for, in
   the site's own ledger register. No modal, no banner, no thermometer. The
   primary ask is the coalition; money is the footnote. If it ever runs during a
   writ period, check Elections Canada third-party advertising thresholds.
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
