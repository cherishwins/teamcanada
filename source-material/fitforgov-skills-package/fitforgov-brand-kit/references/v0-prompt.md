# v0.dev — Fit For Gov Prompt Package

This is the paste-ready prompt block for v0.dev. Upload `assets/logo-seal-256.png` to v0 as a reference image alongside any prompt that uses the seal.

---

## The Design System Block (paste verbatim at top of every v0 prompt)

```
==== DESIGN SYSTEM: "The Dossier" — Fit For Gov ====

The aesthetic is a classified briefing binder delivered to a mayor.
Editorial, typographic, sparse, heavy on whitespace. Think Harvard
Business Review × The Economist × a federal White Paper appendix.
DO NOT make this look like a SaaS landing page. If it looks like a
SaaS landing page, it has failed.

Typography (via next/font/google, self-hosted):
- Display / headings: Instrument Serif, weight 400, letter-spacing
  -0.02em, line-height 1.05 — 72–120px on hero, 44–56px on h2
- Body: Inter Tight at 17px, line-height 1.55, weight 400
- Numbers / monospace data: JetBrains Mono at 14–17px
- ALL-CAPS eyebrows and labels: Inter Tight 11px weight 600,
  tracking 0.16em

Colour tokens (declare in @theme block — no tailwind.config.ts):
  --paper:  #F5F3EE   (page background, warm off-white;
                       NEVER pure white #FFFFFF)
  --ink:    #141414   (primary text;
                       NEVER pure black #000000)
  --mid:    #4A4A4A   (secondary text)
  --rule:   #CFC9BC   (hairlines and dividers, 1px only)
  --accent: #5A1418   (oxblood — the single brand colour;
                       CTAs, live-phone indicator, page-numbers,
                       footer rule, scroll-progress bar)
  --signal: #B0622D   (copper — pull quotes and data peaks only;
                       never for body text or UI chrome)

Absolutely forbidden — zero tolerance:
- border-radius on any element (border-radius: 0 globally)
- drop shadows, glassmorphism, neumorphism, glow effects
- gradients of any kind
- stock SaaS illustrations, AI-generated hero imagery
- emoji in brand voice
- rainbow palettes
- floating device mockups, hero videos
- bouncy / spring animations (animations are linear, slow, purposeful)
- parallax scrolling
- cookie banners, live chat widgets, newsletter sign-ups
- social-sharing icons anywhere

Structural ornamentation (required on every major section):
- Max content width 1200px; 680px text column for prose
- Left-side hairline rail (1px, --rule, gradient-faded top and
  bottom) — like the margin of a legal document. Collapses <768px.
- Section numbering in roman numerals in the left margin (§ I,
  § II, § III...), Inter Tight 11px weight 600 tracking 0.16em,
  colour --mid
- Page-number marker top-right of each section, format "01 / 09",
  JetBrains Mono 11px, colour --accent
- Footnotes at end of each section: superscript¹ in body, numbered
  list below hairline divider, JetBrains Mono 13px

The Official Mark:
- The Fit For Gov seal is a bronzed circular medallion featuring
  the Peace Tower / Centre Block silhouette with "FIT FOR GOV" on
  the arched upper band and "A CIVIC-TECHNOLOGY PRACTICE" on the
  arched lower band. Two side rivets at 9 and 3 o'clock.
- Use the seal at 60–120px on standard surfaces; ≥200px on formal
  documents (RFP covers, briefing PDFs)
- Masthead top-left uses the TYPOGRAPHIC wordmark "Fit For Gov" in
  Instrument Serif 21px, tracking -0.01em — NOT the seal
- Footer uses the seal at 48–64px alongside the wordmark
- Never recolor, stretch, skew, drop-shadow, or place on gradients

Voice:
Declarative. Calm. Factual. Numbered. Footnoted. Never exclamatory.
Never "revolutionary," "cutting-edge," "best-in-class," "solutions,"
"partners," "stakeholders," "leverage," "empower," "unlock,"
"transform," "journey," "robust," "seamless," "synergy,"
"ecosystem." Every sentence should read as if it could appear in
The Economist. If it could appear on any SaaS landing page,
delete it and write it again.

Required closer:
Every page ends with the phone number and email in JetBrains Mono
17px, centered, colour --accent:
  "+1 250 415 5678   ·   jesse@fitforgov.com"
No form. No button. No chat widget. The phone number is the interface.

Technical:
- Next.js 16 App Router, TypeScript strict
- Tailwind CSS v4 with @theme block (not tailwind.config.ts)
- next/font/google for Instrument Serif, Inter Tight, JetBrains Mono
- Full WCAG 2.1 AAA contrast on body text (ink on paper = 15.8:1)
- Responsive: left-rail and page-markers collapse <768px, typography
  scale remains editorial
- The only client-side JS is a 1px oxblood scroll-progress bar at
  the top of the viewport
- Each major block is its own <section id="i">, <section id="ii">
  etc., IDs matching roman numerals

==== END DESIGN SYSTEM ====
```

---

## Homepage Brief — Paste After The Design System Block

```
==== HOMEPAGE CONTENT (in order) ====

The site is fitforgov.com, the homepage of a new Canadian
civic-technology practice launched 2026. Principal: Jesse James,
previously the builder of Waterworth, Muniworth, and The National
Strategy Council at a prior governance-technology employer.
Audience: Canadian municipal CAOs, CFOs, Clerks, IT Leads (ages
45–65), evaluating vendors for a website rebuild, burned before,
reading carefully.

1. MASTHEAD (full viewport height, paper background, NO image)
   - Top-left: wordmark "Fit For Gov" in Instrument Serif 21px,
     tracking -0.01em, colour --ink
   - Top-right: one uppercase link, Inter Tight 11px 600 0.16em,
     colour --accent: "BOOK A 15-MINUTE CONSULTATION →"
   - Centre-left eyebrow: "DOSSIER №01 — WORDPRESS EXPOSURE IN
     CANADIAN MUNICIPALITIES · APRIL 2026"
   - H1 in Instrument Serif 120px, --ink, max-width 1000px:
     "The ground your website stands on just moved."
   - Subhead in Inter Tight 22px, --mid, line-height 1.4, max-width
     560px: "On April 6, 2026, thirty-one WordPress plugins were
     quietly backdoored and pushed to roughly twenty thousand sites.
     The fix did not remove the infection. If your municipality runs
     WordPress, your clock started last week."
   - No CTA button. Single line in --accent, JetBrains Mono 14px:
     "§ Read the briefing ↓"

2. § I — THE CURRENT EXPOSURE
   Executive summary of a white paper. Four paragraphs of 17px body
   prose describing the April 2026 Essential Plugin supply-chain
   attack: 31 plugins quietly backdoored, ~20,000 WordPress sites
   affected, 8-month dormant backdoor before activation, the
   WordPress.org takedown did NOT remove injected code from already
   infected wp-config.php files.
   
   Three-column numeric panel, JetBrains Mono:
     11,334        $5.08M         43%
     new WP        avg ransomware of the web
     vulnerabilities incident cost runs on
     in 2025       in 2025        WordPress
   
   Each number at 72px in --ink, label below at 11px caps --mid.
   Three footnotes at end citing TechCrunch (Apr 14, 2026),
   Patchstack State-of-WP-Security 2026, Cybersecurity Ventures
   Ransomware Report 2026.

3. § II — WHAT WE BUILD INSTEAD
   Two-column layout.
   
   Left column (prose, 17px body, four paragraphs): the replacement
   architecture — statically-generated Next.js App Router, headless
   Payload CMS on Postgres, global edge CDN, zero plugin ecosystem,
   WCAG 2.1 AAA contrast, bilingual by default (EN/FR), live
   federal/provincial data integrations, AI document summarisation,
   Canadian hosting (AWS ca-central-1 or equivalent).
   
   Right column (ledger table, JetBrains Mono 14px, hairline rules
   between rows):
     Attack surface:    WordPress: 60+ plugins   / Fit For Gov: 0
     Page load:         WP typical: 3.2s         / Fit For Gov: <0.8s
     Licensing / year:  WP: $1,200–$4,000        / Fit For Gov: $0
     CMS updates:       WP: manual, risky        / Fit For Gov: automated
     Supply-chain risk: WP: active               / Fit For Gov: none
     WCAG compliance:   WP templates: AA partial / Fit For Gov: AAA contrast
     Data residency:    Varies                   / Canadian cloud

4. § III — THE PRINCIPAL'S TRACK RECORD
   H2 in Instrument Serif 56px: "Municipal technology I have
   previously built."
   
   Lede paragraph clarifying clearly: "Before launching Fit For Gov,
   I spent several years as the right hand to the founder of a
   Canadian governance-technology firm, where I built the production
   front-ends for all three of the platforms below. Hundreds of
   municipalities across North America sign in to them daily. The
   practice you are considering today is newer, but its foundations
   are not."
   
   Three "dossier cards" in a horizontal row — each with a hairline
   border, a small uppercase eyebrow in --mid, a 33px Instrument
   Serif headline, 3 lines of --mid body text, a JetBrains Mono URL
   footer in --accent.
   
   Card 1:
     EYEBROW: PRIOR WORK — MUNICIPAL FINANCIAL ANALYTICS
     HEADLINE: Waterworth
     BODY: The water-utility analytics and rate-design platform used
     daily by hundreds of municipal water authorities across North
     America — the City of Vancouver among them. I built and shipped
     the production front-end.
     URL: waterworth.net
   
   Card 2:
     EYEBROW: PRIOR WORK — MUNICIPAL COMPARATIVE DATA
     HEADLINE: Muniworth
     BODY: The peer-comparison data platform for Canadian
     municipalities, operated by Muniworth Innovations. I designed
     and shipped the public front-end during my tenure with the firm.
     URL: muniworth.com
   
   Card 3:
     EYEBROW: PRIOR WORK — FEDERAL CIVIC STRATEGY
     HEADLINE: The National Strategy Council
     BODY: Federal-scope civic-strategy and open-government platform
     for strategic research and policy briefings. I built the site's
     production front-end.
     URL: thenationalstrategycouncil.org

5. § IV — THE PROCUREMENT ADVANTAGE
   Single-column editorial block, 680px wide, treated like the body
   of a legal brief.
   
   H2: "Built for delivery under the provincial direct-award threshold."
   
   Four paragraphs of body prose explaining the Canadian public-
   procurement reality: most provinces permit direct-award contracts
   for services below $10,000 (Nova Scotia explicitly so) without
   limited competition or formal RFP evaluation cycle. The paperwork
   that usually takes six weeks takes one signature.
   
   Highlighted aside: thin --accent rule above and below, centred,
   JetBrains Mono 14px, max-width 680px:
   "Fit For Gov prices every municipal build beneath your direct-
   award threshold by design. The paperwork that usually takes six
   weeks takes one signature."

6. § V — PRINCIPAL
   Two-column layout.
   
   Left column: the Fit For Gov seal at 175×175px (use the uploaded
   logo-seal-256.png reference), on paper background, no frame or
   border.
   
   Right column:
   - Eyebrow: "PRINCIPAL · FIT FOR GOV", Inter Tight 11px 600 0.16em, --mid
   - Name: "Jesse James" in Instrument Serif 44px, --ink
   - Body paragraph, 17px: "Full-stack developer and civic-
     technology builder. Previously de-facto chief of staff at the
     Canadian governance-technology firm behind Waterworth,
     Muniworth, and The National Strategy Council — where I built
     all three platforms' production front-ends, recruited roughly
     three-quarters of the engineering team, and ran internal
     finance reconciliation. I also build enterprise software for
     the senior-living industry; Fit For Gov is my dedicated
     municipal practice."
   - Link row in JetBrains Mono 13px: "jesse@fitforgov.com ·
     +1 250 415 5678 · linkedin.com/in/jessecares"
   - Below in Inter Tight 13px italic, --mid: "24/7/365 direct line.
     The principal answers the phone."

7. § VI — CLOSING
   Paper background, centre-aligned, generous vertical padding.
   
   H2 in Instrument Serif 72px italic, --ink: "If your municipality
   runs WordPress, call me this week."
   
   Single hairline rule in --rule beneath.
   
   Contact line in JetBrains Mono 17px, --accent, centred:
   "+1 250 415 5678   ·   jesse@fitforgov.com"
   
   Nothing else. No button. No form. No social icons.

8. FOOTER
   Thin 1px --accent rule at the top. Three columns, JetBrains Mono
   13px, --mid.
   
   Left column: the seal at 48×48px above the wordmark "Fit For Gov"
   in Instrument Serif 18px, --ink. Below: "A civic-technology
   practice" + "Founded 2026" on separate lines.
   
   Middle column: four links, each on its own line — "The Briefing"
   (/briefing), "Case Studies" (/work), "Methodology" (/how),
   "Contact" (/contact).
   
   Right column, two lines:
   "Registered in British Columbia, Canada"
   "Data resident in Canadian cloud regions"
   
   No social icons. No newsletter sign-up. No cookie banner.

==== END HOMEPAGE CONTENT ====
```

---

## Follow-Up Page Prompts (queue these after the homepage lands)

### /briefing — The long-form white paper
```
Build the long-form dossier referenced from the homepage masthead,
titled "DOSSIER №01 — WordPress Exposure in Canadian Municipalities,
April 2026." 3,000–4,000 word editorial article. Dossier design
system (reuse the tokens and ornamentation from the homepage).

Structure:
- Sticky table of contents in the left margin (collapses to top
  accordion below 1024px)
- Drop-caps on first paragraph of each section (Instrument Serif,
  4-line capital in --accent)
- Pull quotes in Instrument Serif 44px italic, oxblood quotation
  marks, left-aligned in the 680px text column with a 48px hanging
  indent
- Proper footnotes section at the bottom: JetBrains Mono 13px,
  numbered, each footnote terminating with a source URL

Three inline data charts as SVG (no JavaScript chart libraries) with
JetBrains Mono axis labels:
1. WordPress vulnerabilities by year 2018–2026 (bar chart, ink bars
   on paper, peak year in --signal)
2. Canadian municipal ransomware incident costs 2022–2026 (line
   chart, single oxblood line on paper)
3. WordPress plugin count distribution across a sample of Canadian
   municipal sites (histogram, ink bars, mean line in --accent)

Sign off with an author note in a framed block at the foot of the
article: 80×80px seal at top-left, byline in Instrument Serif 22px,
contact block in JetBrains Mono 13px, date of publication in
JetBrains Mono 11px caps.
```

### /work — Selected prior matters
```
Build a "Selected Prior Work" index page in the style of a law firm's
"Selected Matters" index.

Page header:
- Eyebrow: "FIT FOR GOV · PRIOR MATTERS · PRINCIPAL'S TRACK RECORD"
- H1 in Instrument Serif 72px: "Selected prior work."
- Lede in Inter Tight 22px, --mid: "The entries below are the
  Principal's work at a prior employer. Fit For Gov is a new
  practice launched 2026; its first engagement is flagged below in
  oxblood."

Entries as single horizontal rows — year in JetBrains Mono on the
left (180px column), platform name in Instrument Serif 33px in the
middle, two-line description in Inter Tight 14px on the right,
separated by hairlines (--rule). Each entry links to a case-study
detail page at /work/[slug].

Entries in reverse-chronological order:
- 2026 — Town of Annapolis Royal (RFP-03-26-2026 · Fit For Gov
  inaugural engagement) — flag in --accent
- 2022 — The National Strategy Council (federal civic-strategy
  platform)
- 2020 — Muniworth (municipal comparative-data platform)
- 2018 — Waterworth (municipal water-utility analytics platform,
  used by hundreds of municipalities incl. City of Vancouver)

Above each pre-Fit-For-Gov entry, the small-caps eyebrow
"PRIOR WORK" in --mid. Above the Annapolis entry, the small-caps
eyebrow "FIT FOR GOV · APRIL 2026" in --accent.
```

### /how — Methodology
```
Single-page process explainer.

H1 in Instrument Serif 72px: "How Fit For Gov delivers a municipal
website beneath the direct-award threshold."

Lede in Inter Tight 22px, --mid: "Six phases. Thirty calendar days.
One signature."

Six numbered sections in roman numerals:
  I — Discovery        (3 days)
  II — Architecture     (4 days)
  III — Content migration (8 days)
  IV — Build            (10 days)
  V — Audit             (3 days)
  VI — Handover         (2 days)

Each phase has:
- Roman numeral and name (Instrument Serif 44px)
- Duration in JetBrains Mono 14px caps
- A short list of deliverables in JetBrains Mono 13px (4–6 bullets,
  each preceded by an em-dash not a bullet character)
- One editorial paragraph in Inter Tight 17px body describing what
  happens and who is involved

Hold the full Dossier design system throughout. End the page with
the standard closing contact block.
```

### /contact — The anti-form contact page
```
Centred single-page contact card, hairline rails left and right on
desktop (collapsing to full-width on mobile).

H1 in Instrument Serif 72px, centred: "Call first. Email second.
Forms third."

Three stacked blocks below, each centered:

Block 1: "+1 250 415 5678" in JetBrains Mono 27px, colour --accent.
Beneath in Inter Tight 13px italic, --mid: "24/7/365 direct line —
answered by the principal."

Block 2: "jesse@fitforgov.com" in JetBrains Mono 27px, colour
--accent. Beneath in Inter Tight 13px italic, --mid: "Read in under
an hour during Pacific business hours."

Block 3: "linkedin.com/in/jessecares" in JetBrains Mono 22px, colour
--accent. Beneath in Inter Tight 13px italic, --mid: "18,000+ civic
and municipal connections. Message accepted from first-degree."

Final hairline rule in --rule. Below in Inter Tight 13px, --mid,
centred: "Registered in British Columbia, Canada. No sales queue.
No AI chatbot. No automated reply."

At the bottom, a plain-text contact form — three fields only
(name, municipality, rough project scope) — POSTing to a placeholder
/api/contact endpoint. No dropdowns, no validation theatre, no
"please enter a valid email" messaging. Submit button is a plain
oxblood text link: "Send →".

Footer follows the standard homepage footer pattern.
```

---

## Uploading to v0 — Process

1. Create a new v0 project at v0.dev
2. In the project settings, add the design-system block above as a **Custom Instructions** or **System Prompt** entry (v0 calls this "Project Context" in some versions)
3. Upload `assets/logo-seal-256.png` and `assets/logo-seal-512.png` as reference images
4. Paste the homepage brief as the first prompt
5. For each subsequent page (/briefing, /work, /how, /contact), paste the follow-up brief verbatim
6. Iterate on individual sections with targeted prompts — the design system will carry through if it was set as project context

When reviewing v0 output, reject any iteration that adds: border-radius, drop shadows, gradients, floating mockups, stock illustrations, emoji in body copy, or the banned words list. These are non-negotiable.

---

## Troubleshooting — Common v0 Mistakes

| Mistake | Correction |
|---------|-----------|
| Rounded corners on cards | "Remove border-radius globally. The system uses `border-radius: 0` on every element." |
| Drop shadows on dossier cards | "Remove shadows. Cards are defined by 1px hairline borders in --rule only." |
| Using `bg-white` or `bg-slate-50` | "Use --paper (#F5F3EE). Never pure white." |
| Using `text-black` | "Use --ink (#141414). Never pure black." |
| Sans-serif on headlines | "Headlines are Instrument Serif, weight 400, tracking -0.02em. Never Inter or Geist." |
| "Join our newsletter" CTA | "No newsletter. The phone number is the CTA." |
| Emoji in body copy | "Remove all emoji. Dossier is typographic only." |
| Gradient backgrounds | "No gradients anywhere. Solid --paper or --ink only." |
| Hero image or 3D illustration | "No imagery in the masthead. The typography is the hero." |
| "Read more →" buttons | "Use text links in --accent. No filled buttons except the single top-right CTA." |
