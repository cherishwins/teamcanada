---
name: fitforgov-brand-kit
description: "Brand identity for Fit For Gov (fitforgov.com) — Jesse James's Canadian civic-technology practice building custom municipal websites as the alternative to vulnerable WordPress. Trigger on 'Fit For Gov', 'FitForGov', 'fitforgov', 'fitforgov.com', 'municipal brand', 'civic tech brand', or any Fit For Gov output: homepage, RFP responses, letterhead, /briefing dossiers, CAO pitches, Annapolis Royal materials, v0.dev prompts for fitforgov, case studies, OG images. Enforces the Dossier editorial aesthetic: Paper #F5F3EE, Ink #141414, Oxblood #5A1418, Copper #B0622D; Instrument Serif display, Inter Tight body, JetBrains Mono data. Official mark is the bronzed Peace Tower seal — used small and formal, never hero, never recolored. Voice is declarative, numbered, footnoted, never promotional. NOT for Cherish/VI Care, 주체강, Ibrahim Energy, or iPurpose. Use this skill any time Fit For Gov is the target, even without 'brand' — municipal work, CAO pitches, and v0 prompts for fitforgov.com all trigger this."
---

# Fit For Gov — Brand Kit

Every piece of content carrying the Fit For Gov name must read as though it was set by a book designer at an academic press, not a SaaS brand studio. The practice positions itself as the boutique, Canadian, principal-led alternative to every agency that has ever shipped a municipal WordPress site with a .png flag dropped on a Bootstrap template. This skill locks that identity.

**Read this file completely before producing any Fit For Gov-branded content. For the full visual specification with live typography and colour specimens, read `references/brand-guide.html`. For a v0.dev-optimized prompt package, read `references/v0-prompt.md`.**

---

## Brand Identity

**Name**: Fit For Gov
**Domain**: fitforgov.com
**Founded**: 2026
**Principal**: Jesse James
**Registered**: British Columbia, Canada
**Official Mark**: Bronzed circular seal — Peace Tower / Centre Block silhouette, wordmark "FIT FOR GOV" on arched upper band, "A CIVIC-TECHNOLOGY PRACTICE" on lower band

**Mission**: Build custom municipal websites and platforms for Canadian towns, cities, regional districts, and counties — as the modern alternative to vulnerable WordPress installations.

**Positioning**: Founder-led boutique practice launched 2026. The principal previously built the production front-ends for Waterworth, Muniworth, and The National Strategy Council at a prior governance-technology employer — these credentials are referenced as prior work, never as current Fit For Gov products.

**Core Values**: Procurement-ready by design · Accessibility is non-negotiable · Phone first, forms last · Principal signs every deliverable · Canadian-hosted, Canadian-run

**Personality**: The voice of a classified briefing binder delivered to a mayor. Editorial, typographic, numbered, footnoted. Never exclamatory. Never "revolutionary" or "cutting-edge." If a sentence could appear in The Economist, keep it. If it could appear on a SaaS landing page, delete it and write it again.

### The Name — Three Readings

The brand lives in the tri-valence of the word "fit." Copy and imagery should draw on all three:

| Reading | Dictionary Sense | Positioning Payload |
|---------|------------------|---------------------|
| **Ready** | fit / adj. — in suitable condition | Compliant. Accessible. Audited. Procurement-ready under the provincial direct-award threshold. |
| **Tailored** | fit / n. — the way a thing sits | Bespoke. Right-sized to the municipality. Not a template. |
| **Healthy** | fit / adj. — in good physical condition | Fast, secure, maintainable. The opposite of a bloated plugin-ridden WordPress install. |

### Audience

| Tier | Who | Register |
|------|-----|----------|
| Primary | CAOs, CFOs, Clerks, IT Leads of Canadian municipalities (45–65) | Austere editorial — the briefing binder voice |
| Secondary | Municipal council members evaluating vendors | Procurement-framed — threshold, direct-award, RFP language |
| Tertiary | Civic-technology peers, journalists, partners | Technical — Next.js, headless CMS, supply-chain security |

### Relationship to Other Brands

- **Cherish / VI Care**: Completely separate. Cherish is senior-living dining management; the principal also builds for that industry, but Fit For Gov is the dedicated municipal practice. No crossover in content.
- **주체강 (JucheKang)**: The principal's Korean reunification advocacy. Separate identity. Fit For Gov never references 주체강 deals, geopolitics, or content.
- **Ibrahim Energy Partners**: The principal's North African oil & gas facilitation. Separate identity. Never referenced in Fit For Gov materials.
- **iPurpose**: Thought leadership brand page (not an incorporated entity). Fit For Gov does not operate under iPurpose and is not a "practice of" iPurpose.
- **Prior employer (Waterworth / Muniworth / The National Strategy Council)**: Cited as the principal's professional track record. Always flagged as "prior work" — never as Fit For Gov product. Use the exact framing: "Before launching Fit For Gov, I built..." Do not imply Fit For Gov inherits that client roster.

---

## Quick Reference — Colours (The Dossier Palette)

The palette is intentionally austere. Six tokens. One accent. No exceptions. Any colour outside this system is a violation.

### Core Tokens

| Token | Hex | CSS Variable | Role |
|-------|-----|--------------|------|
| Paper | `#F5F3EE` | `--paper` | Page background. Warm off-white with newsprint undertone. **Never pure white (#FFFFFF is forbidden).** |
| Ink | `#141414` | `--ink` | Primary text — headlines, body copy, wordmark. **Never pure black (#000000 is forbidden).** |
| Mid Ink | `#4A4A4A` | `--mid` | Secondary text — subheads, captions, deck copy |
| Rule | `#CFC9BC` | `--rule` | Hairlines and dividers only. 1px weight. Never used as fill. |
| Accent / Oxblood | `#5A1418` | `--accent` | The single brand colour. CTAs, live-phone indicators, page-number markers, footer rule, scroll-progress bar, footnote markers. |
| Signal / Copper | `#B0622D` | `--signal` | Emphasis only. Pull-quote marks, data hot-points, chart peaks, the "savings" figure. **Never for body type or UI chrome.** |

### Seal Tone (Reference Only — Not a Type Colour)

The bronzed Peace Tower seal carries its own warm metallic tone (`#9C7A3E` / `#B59157` approximate). This is a **photographic tone**, not a palette colour. Never sample from the seal for UI elements.

### Contrast Audit (WCAG 2.1 AAA)

| Foreground | Background | Ratio | Rating |
|------------|------------|-------|--------|
| Ink `#141414` | Paper `#F5F3EE` | 15.8 : 1 | AAA |
| Mid `#4A4A4A` | Paper `#F5F3EE` | 8.3 : 1 | AAA |
| Accent `#5A1418` | Paper `#F5F3EE` | 9.2 : 1 | AAA |
| Paper `#F5F3EE` | Accent `#5A1418` | 9.2 : 1 | AAA |
| Signal `#B0622D` | Paper `#F5F3EE` | 4.1 : 1 | **AA Large only** |

Signal passes AA at 18pt+ only. Never use copper for body copy — it is an emphasis colour, not a reading colour.

---

## Typography

Three faces. All free via Google Fonts. Load self-hosted via `next/font/google` in production.

### Display — Instrument Serif

- **Weight**: 400
- **Tracking**: −0.02em
- **Line-height**: 1.05
- **Usage**: h1 at 72–120px · h2 at 44–56px · h3 at 28–33px · dossier-card titles at 32px
- **Character**: Sharp, editorial, Tiempos-adjacent. This is the voice of the brand.

### Body — Inter Tight

- **Weights**: 400 (body), 600 (labels)
- **Tracking**: 0 (body) · 0.16em (labels)
- **Line-height**: 1.55
- **Usage**: body at 17px · subhead at 22px · ALL-CAPS eyebrows at 11px weight 600 tracking 0.16em
- **Character**: Dense, modern, readable at length. The working sans for prose.

### Data — JetBrains Mono

- **Weights**: 400 (body), 500 (emphasis)
- **Tracking**: 0.02em
- **Line-height**: 1.5
- **Usage**: numbers at 14–72px · footnotes at 13px · page markers at 11px · ledger tables · phone numbers · URLs
- **Character**: The monospace for comparisons, citations, and any figure that wants to read as evidence.

### Typographic Scale

| Role | Face | Size | Weight | Tracking |
|------|------|------|--------|----------|
| h1 (masthead) | Instrument Serif | 120px | 400 | −0.02em |
| h1 (page) | Instrument Serif | 72px | 400 | −0.02em |
| h2 | Instrument Serif | 56px | 400 | −0.02em |
| h3 | Instrument Serif | 33px | 400 | −0.02em |
| Subhead | Inter Tight | 22px | 400 | 0 |
| Body | Inter Tight | 17px | 400 | 0 |
| Caption | Inter Tight | 13px | 400 | 0 |
| Label (CAPS) | Inter Tight | 11px | 600 | 0.16em |
| Data large | JetBrains Mono | 72px | 500 | 0.02em |
| Data body | JetBrains Mono | 14px | 400 | 0.02em |
| Footnote | JetBrains Mono | 13px | 400 | 0.02em |
| Page marker | JetBrains Mono | 11px | 400 | 0.02em |

---

## The Official Mark — Bronzed Seal

The official Fit For Gov mark is a circular bronzed seal:

- **Inner field**: Silhouette of the Peace Tower / Centre Block (Parliament Hill, Ottawa)
- **Upper band**: "FIT FOR GOV" in sans serif caps, arched
- **Lower band**: "A CIVIC-TECHNOLOGY PRACTICE" in sans serif caps, arched
- **Side rivets**: Two flanking rivets in the outer ring (9 o'clock and 3 o'clock)
- **Finish**: Brushed bronze with subtle sheen; reads metallic/heraldic, not flat

Asset files (in `assets/`):

| File | Size | Use Case |
|------|------|----------|
| `logo-seal.png` | 1984×2172 transparent | Master file. Any production use above 512px. |
| `logo-seal-512.png` | 512×512 transparent | OG image crest, favicon source, PWA icons |
| `logo-seal-256.png` | 256×256 transparent | Letterhead, invoice, social avatar |
| `logo-seal-128.png` | 128×128 transparent | Sidebar badges, footer watermark |
| `logo-seal-64.png` | 64×64 transparent | In-line crests, favicon medium |
| `logo-seal-32.png` | 32×32 transparent | Favicon small |
| `logo-seal-on-black.png` | 1984×2172 RGB | When composited on black surfaces (social banners, dark-mode splash) |
| `favicon-source.png` | 512×512 transparent | Source for favicon.ico generation pipeline |

### Mark Usage Rules

**Do**:
- Use the seal at **60–120px** on standard surfaces (letterhead header, website footer, invoice badge)
- Use the seal at **≥200px** on formal documents (RFP response covers, proposal front pages, briefing PDFs)
- Use the seal on paper (`#F5F3EE`) for light surfaces, on ink (`#141414`) for dark surfaces
- Treat the seal as a **sovereign imprimatur** — small, formal, officious
- Preserve the native metallic finish — it carries the heraldic weight

**Do not**:
- Use the seal as a hero element on the homepage — the Dossier masthead is typographic, not graphic
- Scale below 32px (it loses the Parliament tower detail)
- Recolor the seal (no oxblood versions, no single-colour flat versions, no outlines)
- Place on gradients, photographic backgrounds, or coloured surfaces other than paper/ink
- Stretch, skew, rotate (except by exact 90° increments for edge-of-page placements)
- Drop-shadow or add glow effects
- Pair with additional typographic wordmarks at the same scale — the seal replaces the wordmark when both would compete

### Homepage Hierarchy — Where the Seal Appears

| Location | Treatment |
|----------|-----------|
| Masthead top-left | The typographic wordmark "Fit For Gov" (Instrument Serif 21px, −0.01em), **not** the seal |
| Footer left | Seal at 48–64px, alongside the typographic wordmark |
| OG image | Seal at 120px bottom-right, wordmark bottom-left |
| Favicon | Seal, cropped tight to the circle |
| /briefing cover | Seal at 200px, centered, above the document title |
| Letterhead | Seal at 80px top-left, contact block top-right |
| RFP response cover | Seal at 240px, centered, above the RFP reference number |

---

## Structural Ornamentation — The Dossier System

These ornaments are what separate the Dossier aesthetic from a generic serif-on-cream landing page. Every major section of every Fit For Gov surface carries the full set.

### Required on Every Major Section

1. **Roman numeral section marker** — top-left, Inter Tight 11px weight 600 tracking 0.16em, colour `--mid`, format: `§ I — Section Title`
2. **Page-number marker** — top-right, JetBrains Mono 11px, colour `--accent`, format: `01 / 09`
3. **Left hairline rail** — 1px, `--rule`, gradient-faded top and bottom (like the margin of a legal document). Collapses below 768px.
4. **Footnotes block** — at the end of each major section, hairline-ruled, JetBrains Mono 13px, superscript markers in body reference footnote numbers in list below
5. **Top-of-section border** — 1px `--rule` separating from prior section

### Structural Rules

- Max content width: **1200px**
- Text column: **680px** for prose
- Zero border-radius globally (`border-radius: 0 !important`)
- No drop shadows, no gradients, no glassmorphism, no neumorphism, no glow effects
- Hairline dividers only (1px `--rule`)
- Scroll-progress bar: 1px, `--accent`, top of viewport (the only permitted client-side JS ornament)

### Forbidden Treatments

The following are system violations. Zero tolerance.

| Forbidden | Why |
|-----------|-----|
| `border-radius` | Dossier is orthogonal. Rounded corners signal SaaS. |
| Drop shadows | Editorial documents are flat. Shadows are app chrome. |
| Gradients | The palette is named, finite, and flat. |
| Glassmorphism | Apple 2023. Unprofessional for municipal work. |
| Neumorphism | As above. |
| Glow effects / neon | Unprofessional. |
| Stock SaaS illustrations | Never. Imagery is typographic. |
| AI-generated hero imagery | Never. |
| Emoji | Never in brand voice. Exception: user-facing utility UI only. |
| Rainbow palettes | The palette has six tokens. |
| Floating device mockups | Unprofessional. |
| Hero videos | Unprofessional. |
| Bouncy / spring animations | All animation is linear, slow, purposeful. |
| Parallax scrolling | Never. |
| Cookie banners | Site is GDPR/PIPEDA-compliant without tracking. |
| Live chat widgets | The phone number is the interface. |
| Newsletter sign-up | Never. The brand does not farm emails. |
| Social-sharing icons in footer | Never. |

---

## Voice & Editorial Standards

The voice is **declarative, calm, factual, numbered, footnoted**. Never exclamatory. Never promotional. The reader is a 55-year-old municipal administrator who has been pitched by thirty vendors this year — the tone signals that we know that.

### Register That Works

- Declarative sentences (not interrogative, not exhortative)
- Specific numbers (11,334 vulns, not "thousands of vulnerabilities")
- First-person singular ("I built..." "I answer the phone")
- Footnoted claims (every data point has a source)
- Direct procurement language ("under the direct-award threshold")
- Concrete comparisons (WP 3.2s vs Fit For Gov <0.8s)
- Short paragraphs (2–4 sentences)
- Names of actual cities (Vancouver, Annapolis Royal, Victoria)
- Phone numbers (+1 250 415 5678 is referenced often)
- Dollar figures ($1,200–$4,000, $10,000 threshold)
- Day-count deliverables ("30 calendar days")

### Banned Words

Every one of the following is a voice violation. Use the replacement test: if you can remove the word and the sentence is stronger, the word was doing no work.

| Banned | Reason |
|--------|--------|
| revolutionary · cutting-edge · best-in-class · world-class | Promotional adjectives with no information content |
| solutions · partners · stakeholders | Consultancy filler |
| leverage · empower · unlock · transform · journey | SaaS verbs |
| robust · seamless · scalable · synergy · ecosystem | SaaS adjectives |
| dive in · unpack · deep-dive | SaaS idiom |
| game-changing · disruptive · innovative | Promotional filler |
| "click here" | Use descriptive link text |

### Ledger Voice (Exception)

Comparison tables, specification lists, and numeric panels use JetBrains Mono and speak in **fragments**. Example:

```
Attack surface:    WordPress: 60+ plugins  /  Fit For Gov: 0
Page load:         WP typical: 3.2s         /  Fit For Gov: <0.8s
```

This register does not take articles or verbs. It is read, not parsed. The ledger is **permitted only in comparison contexts** — do not write body copy this way.

### Required Closers

Every Fit For Gov page ends with the phone number. No exception.

> **+1 250 415 5678  ·  jesse@fitforgov.com**

The principal answers the phone. 24/7/365 direct line. This is the brand's primary CTA on every surface. Do not replace with a form, a chat widget, a calendar-booking embed, or a newsletter sign-up.

---

## Application Patterns

### Homepage Masthead (Fitforgov.com /)

- Full-viewport-height section
- Paper background, no imagery (no hero image, no background pattern, no gradient)
- Top-left: typographic wordmark "Fit For Gov" in Instrument Serif 21px, tracking −0.01em, colour `--ink`
- Top-right: one uppercase link in oxblood: "BOOK A 15-MINUTE CONSULTATION →"
- Eyebrow above headline: dossier reference in all-caps Inter Tight 11px
- H1 in Instrument Serif 120px, max-width 1000px, line-height 1.02
- Subhead in Inter Tight 22px, colour `--mid`, max-width 560px
- No CTA button. Single line in oxblood: "Read the briefing ↓"
- No hero image, no phone mockup, no illustration

### RFP Response Cover

- 8.5 × 11" portrait
- Paper background
- Seal centered at 240px, top third of page
- Beneath seal: RFP reference number in JetBrains Mono 14px caps
- Below: document title in Instrument Serif 56px, max-width 520px, left-aligned
- Bottom: "Prepared by Jesse James, Principal" + contact block in JetBrains Mono 13px
- Footer rule in oxblood, page marker top-right "01 / N"

### Letterhead

- 8.5 × 11" portrait
- Seal at 80px top-left
- Contact block top-right in JetBrains Mono 10px: phone, email, domain, each on its own line
- Single oxblood hairline beneath the header
- Body in Inter Tight 13px (longer documents) or 17px (short letters)
- Footer: registered address + page marker, JetBrains Mono 9px

### OG Image (1200 × 630)

- Paper background, 3px oxblood top rule
- Document title in Instrument Serif 72px, left-aligned, max-width 900px
- Eyebrow above title in Inter Tight 11px caps
- Bottom-left: wordmark "Fit For Gov" in Instrument Serif 24px, oxblood
- Bottom-right: domain "fitforgov.com" in JetBrains Mono 13px, mid ink
- Bottom-right corner (optional for briefings): seal at 120px
- No product screenshot, no stock photo, no gradient overlay

### Favicon

- Source: `favicon-source.png` (the full seal, square-cropped to the outer ring)
- Generate `.ico` at 16/32/48 and `.png` at 16/32/64/128/192/512
- Below 32px the seal loses detail — at those sizes the browser/OS should render the bronzed circle as a warm-metal dot, which is acceptable fallback
- No separate stylized "F" favicon — the seal is the favicon

### Social Profile Avatar (400 × 400 — LinkedIn, X, Bluesky)

- Seal at 400px, centered on paper background
- No wordmark overlay
- When the platform applies a circular crop, the seal sits naturally within it

### Social Banner (1584 × 396 LinkedIn / 1500 × 500 X)

- Paper background with 3px oxblood bottom rule
- Left 40%: Instrument Serif 64px headline (e.g., "Municipal websites, fit for Canada.")
- Right 20%: seal at 280px, vertically centered
- No gradient, no pattern, no photo

---

## v0.dev Integration Instructions

When a user asks for a Fit For Gov page built in v0.dev, produce a prompt that:

1. Opens with the Dossier design-system block (colours, typography, forbidden list — see `references/v0-prompt.md` for the exact block)
2. Specifies Next.js 16 App Router + TypeScript strict + Tailwind CSS v4 with `@theme` declaring all tokens (never `tailwind.config.ts`)
3. Specifies `next/font/google` self-hosted loading for Instrument Serif, Inter Tight, JetBrains Mono
4. Requires full WCAG 2.1 AAA contrast on body text
5. Uses the official seal from `assets/logo-seal-256.png` (the skill's bundled asset) — user will need to upload this to v0 as a reference image
6. Structures each major block as `<section id="i">`, `<section id="ii">`, etc. (Roman numeral IDs)
7. Includes the 1px oxblood scroll-progress bar as the only client-side JS

For the full v0-ready prompt body, read `references/v0-prompt.md`.

---

## Content Screening — Deal Risk

Before publishing any Fit For Gov content, screen for the following:

- **No references to active Fit For Gov client negotiations** unless already public (Annapolis Royal RFP-03-26-2026 is public; treat individual conversations with CAOs as confidential until a signed engagement exists)
- **No references to the principal's other active deals** (Libya E&P, Korean advocacy, senior-living clients) — Fit For Gov content stays in its lane
- **No references to the prior employer by corporate name** — cite the products (Waterworth, Muniworth, The National Strategy Council) which are public, not the operating entity which is Jesse's former employer and deserves its own reputation hygiene
- **Pricing screens**: public surfaces can reference the direct-award threshold ($10,000) as the pricing ceiling. Actual scope-specific quotes stay in RFP responses and private correspondence
- **Accessibility claims require AAA audit evidence** before publishing. Do not claim "AAA compliant" of a live site until it has been tested

---

## Governance

Brand governance is simple because the practice is founder-led. Every surface is approved by the principal before it ships. The rules below exist so most decisions never need escalating.

- **Approval authority**: Every public-facing Fit For Gov surface — website page, RFP response, LinkedIn post, email signature, pitch deck — is approved by Jesse James before publication. No committee, no brand council, no style board.
- **Templates over exceptions**: If a design decision isn't in this system, the default is to remove the element rather than invent a new token. The system gets more authoritative the more restrictive it stays.
- **Review cadence**: Quarterly. First review: July 1, 2026. If no surface in the preceding quarter has required a new token, the review is a no-op.
- **The phone number rule**: No surface ships without +1 250 415 5678. This is a hard rule.

---

## Reference Files

- `references/brand-guide.html` — Full visual specification as a browser-ready document. Open to see live typography, colour swatches, ornament demos, and application mockups.
- `references/v0-prompt.md` — Paste-ready prompt block for v0.dev. Includes the full design-system declaration and the homepage brief.
- `assets/logo-seal-*.png` — The bronzed seal at multiple sizes, transparent PNGs plus one on-black version.
- `assets/favicon-source.png` — Square 512×512 source for favicon generation.

---

## Quick Reference — What To Do When

| User asks for | Start from | Key rules |
|---------------|------------|-----------|
| Homepage or landing page | `references/v0-prompt.md` | No hero image, phone closer, roman-numeral sections |
| RFP response | Application Patterns → RFP Response Cover | Seal at 240px centered, Annapolis Royal precedent |
| Letterhead or invoice | Application Patterns → Letterhead | Seal 80px top-left, oxblood hairline |
| LinkedIn post | Voice section + banned-words list | First-person, specific numbers, phone closer |
| OG image | Application Patterns → OG Image | 1200×630, oxblood top rule, wordmark bottom-left |
| Favicon / PWA icons | Application Patterns → Favicon | Use `assets/favicon-source.png` |
| /briefing white paper | Application Patterns + Voice section | Drop-caps, pull quotes, chart labels in JetBrains Mono |
| v0.dev prompt for any page | `references/v0-prompt.md` | Copy the system block verbatim; tune the content brief |

---

*Fit For Gov · Dossier Brand Kit v1.0 · April 2026*
