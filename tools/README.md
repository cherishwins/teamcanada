# tools/

Authoring-time generators. **None of this runs at build or request time** — each
produces a committed artefact, so the live site carries no dependency on them.

## `generate-map.cjs`

Regenerates `src/components/map/world.svg` for Act IV from Natural Earth data
(public domain, via the `world-atlas` devDependency).

```bash
node tools/generate-map.cjs
```

Run it only when the tracked partner list on `/bloc` changes. Notes:

- **Equirectangular**, clipped to 84°N–56°S. Antarctica and the empty far south
  are dropped rather than drawn and ignored.
- **Simplification matters.** Unsimplified output is 123 kB; at 0.8 px
  tolerance with a 3 px² minimum area it is 45 kB (16 kB gzipped) and looks
  identical at the size it is shown.
- **Rings break naive Douglas–Peucker.** A ring's first and last point are the
  same, so the baseline between them has zero length, every perpendicular
  distance computes as 0, and the whole country collapses to two points. The
  recursion is seeded at the vertex farthest from the start for that reason —
  do not "simplify" that away.
- **Singapore and Malta do not exist at 110m.** Singapore is a tracked partner,
  so it is drawn as a marker circle rather than silently omitted; the map has to
  agree with the table beside it.

## `generate-og.cjs`

Regenerates the per-page social cards in `public/og/`. Requires Playwright with
Chromium available. Run it when a page's headline or its featured figure
changes — the cards are committed PNGs, not rendered per request, so nothing
about them costs anything at runtime.
