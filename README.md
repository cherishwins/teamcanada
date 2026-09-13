# Northern Temper

A statement of Canadian character. **northerntemper.ca**

> What we are. What we hold. And what we have never once used against a
> neighbour, though we have always been able to.

Everything here — text, figures, marks, code — is dedicated to the public
domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
Copy it, translate it, print it, quote it in full, train a model on it. No
permission needed, no attribution required.

## Run it

```bash
npm install
npm run dev      # localhost:4321
npm run build    # -> .vercel/output
```

## How it is built

Astro 5 on Vercel, static by default. Every chapter is pre-rendered HTML; only
`src/pages/api/` runs on demand. The entire client-side payload is **~1 kB
gzipped** — a scroll-reveal fallback and a number count-up, nothing else.

| | |
|---|---|
| Design system | [Northern Temper Design System](https://claude.ai/design) — tokens in `src/styles/tokens/`, copied verbatim |
| Fonts | Oswald 600/700, Inter 400/500/600 — self-hosted, Latin-subset WOFF2, **72 kB** for all five |
| Marks | Inline SVG components, traced from source PNGs — **33 kB**, down from 1,485 kB |
| Live figures | Statistics Canada WDS + Bank of Canada Valet, both key-free |
| Accessibility | **0 WCAG AA contrast failures**, verified against the built DOM |

## Live figures

`src/lib/sources.ts` reads real numbers from two public Canadian APIs, and
`/api/figures.json` serves them edge-cached for an hour.

The rule: **a figure never renders blank.** Every series carries a hand-checked
fallback with the date it was true. If a source fails, the page shows the
fallback *and says a source is not responding*. The site's whole claim is that
every figure is public and checkable — it can afford neither a dash nor a
silently stale number.

## Repository layout

```
src/
  config.mjs          the only place the public origin is written
  styles/tokens/      design-system tokens (verbatim) + a11y layer
  components/         Stat, Meter, marks/
  layouts/Base.astro  head, meta, OG, JSON-LD, skip link
  lib/sources.ts      StatCan + Bank of Canada
  pages/
    index.astro       Act I · Temper
    api/figures.json.ts
legacy/               the previous primestrength.ca build — not deployed
```

See [`CLAUDE.md`](./CLAUDE.md) for the full handoff, the brand rules, and the
roadmap through Acts II–V.
