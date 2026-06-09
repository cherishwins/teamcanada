# FFG skills — staging copy (NOT for this repo's deploy)

This folder is a **staging copy** of the Fit For Gov skills package, parked here
under `source-material/` (which is `.vercelignore`'d — it never deploys to
primestrength.ca). It does **not** belong to the Team Canada / Prime Strength site.

## Move it to the fitforgov repo

This package is meant to live in the **fitforgov** repository, not here. In a
session scoped to fitforgov:

1. Copy the three skill folders into the repo (e.g. `.fitforgov/skills/`).
2. Copy `AGENTS.md` → repo root. For Claude Code, also save it as `CLAUDE.md`
   at the root (identical content) so it loads automatically every session.
   - ⚠️ Do **not** create a root `CLAUDE.md` in *this* (teamcanada) repo — it
     would override the existing project memory. That's why the file is left as
     `AGENTS.md` in this staging copy.
3. Delete this staging copy from `source-material/` once it's safely in fitforgov.

(Full install options are in this package's own `README.md`.)

## New: draft flat BIMI mark — needs your approval

`fitforgov-brand-kit/assets/logo-bimi-flat-DRAFT.svg`

BIMI (the logo next to your emails) requires a **flat SVG Tiny PS** image — no
gradients, no metallic. The official bronzed seal can't be used: the brand kit
forbids flattening or recoloring it. So this is a **separate, purpose-built mark**
for email/BIMI only: a simplified Peace-Tower silhouette in Oxblood `#5A1418` on
Paper `#F5F3EE`. It validates clean against the BIMI spec.

It is a **draft for your sign-off**, not a brand decision made for you. If you
approve it (or replace it with your own flat mark), the activation path is:

1. Get FFG email to DMARC enforcement (`p=quarantine`/`p=reject`) — same ramp as
   primestrength.
2. Host the approved SVG on fitforgov.com (e.g. `/.well-known/bimi-logo.svg`).
3. Add DNS: `default._bimi.fitforgov.com TXT "v=BIMI1; l=https://fitforgov.com/.well-known/bimi-logo.svg; a="`
4. Gmail additionally needs a paid VMC/CMC (trademark-backed); Apple Mail /
   Fastmail / Yahoo show it with just the record + SVG.
