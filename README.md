# Team Canada — `primestrength.ca`

> We've got everything in this country. Let's stop fighting each other long enough to use it.
> **Strong. Proud. Free.**

A fast, beautiful, fully static web app making the honest, non-partisan case for Canadian
unity — backed by hard numbers and sourced in full. No build step, no framework, no database.
Pure HTML/CSS/JS. Deploys to Vercel in one click.

---

## What's here

```
index.html              The unity landing page (the centerpiece)
join.html               Coalition sign-up — businesses add their logo (frictionless, no account)
404.html                Branded not-found page
offline.html            Shown by the service worker when offline
sw.js                   Silent service worker — instant repeat visits + offline. No install nags.
assets/
  teamcanada.css        The unified design system (midnight + maple + gold)
  editorial.css         Shared styles for the long-form reads
  seal-*.png            The Team Canada / Prime Strength seal (brand mark + icons)
  sentinel.jpg          The Sentinel hero image
  maple.svg             Crisp scalable favicon
  ...                   OG share cards, portraits, comic, icons
read/
  changed-my-mind.html  "I Campaigned Against This Man." (the Carney essay)
  honest-answer.html    "One Question. Seven Leaders. An Honest Answer." (the G7 recession retort)
  two-leaders.html      "The Wave Hit Every G7 Democracy. Two Leaders Beat It."
  the-closed-loop.html  NPSI Working Paper No. 6 — the strategic case
  the-vertical-squeeze.html  Fit For Gov dossier — the tax-stack accounting
site.webmanifest        PWA manifest
vercel.json             Clean URLs, caching, security headers, redirects
sitemap.xml             All public URLs
robots.txt              Welcomes search + AI crawlers explicitly
llms.txt                LLM-friendly summary so this work can be found and cited
feed.xml                RSS feed of the reads
source-material/        Original uploads (zips, PDFs, art). NOT deployed (see .vercelignore).
```

## Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this on a PR).
2. In Vercel: **Add New → Project → Import** this repo.
3. Framework preset: **Other**. Build command: *none*. Output directory: *leave blank* (root).
4. Add your domain **`primestrength.ca`** under **Settings → Domains**.
5. Deploy. That's it — it's all static.

`vercel.json` already sets clean URLs (`/read/honest-answer` instead of `.html`),
long-cache immutable assets, and sensible security headers.

## Discoverability (built in)

- **Structured data (JSON-LD):** Organization + WebSite + CollectionPage on the home page,
  and an `Article` block on every read — so Google and LLMs understand and can cite the content.
- **Open Graph + Twitter cards** on every page, with real share images.
- **`llms.txt`** following the [llms.txt convention](https://llmstxt.org/) — a plain-language
  summary plus links, so AI assistants can find and reference the site accurately.
- **`robots.txt`** explicitly *allows* the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, CCBot, Applebot, …) — we *want* to be quoted.
- **`sitemap.xml`** (with image entries) + **`feed.xml`** (RSS) for indexing and syndication.
- **Canonical + hreflang (`en-ca`)** tags throughout.
- **FAQPage** on the home page + per-read **Article** and **BreadcrumbList** for rich results.
- **IndexNow** key file at the repo root for instant Bing/Yandex indexing.
- `.well-known/security.txt` and `humans.txt` for trust/identity signals.

> **Full step-by-step playbook (Search Console, Bing, IndexNow, social cache, Cloudflare, off-site distribution): see [`DISCOVERABILITY.md`](DISCOVERABILITY.md).**

## Analytics (cookieless — no banner needed)

The pages already include Vercel Web Analytics (`/_vercel/insights/script.js`). It activates
automatically when you toggle **Analytics** on in the Vercel dashboard, and is cookieless, so
**no cookie-consent banner is required**. It does nothing until enabled.

Prefer **Cloudflare Web Analytics** (also free + cookieless)? Add your beacon before `</body>`:

```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "YOUR_CLOUDFLARE_TOKEN"}'></script>
```

If you put Cloudflare in front of Vercel (free plan), you also get global CDN caching, Brotli,
and bot protection at no cost — DNS-only setup, no code changes.

## The coalition (how "join" works)

`/join` lets any Canadian business add their logo to the wall. It's deliberately backend-free:
the form previews their logo client-side and opens a **pre-filled email** to
`jesse@primestrength.ca` (set this address to one you own, or change it in `join.html`).
You review submissions and add approved members to the `.coalition` grid in `index.html`
and `join.html`. No accounts, no uploads server, no tracking.

> Want true self-serve uploads later? Drop in a free form backend (Formspree, Tally, Google
> Forms) or a Vercel serverless function — the markup is ready for it.

## Swapping in higher-res brand art

The hero uses `assets/sentinel.jpg` and the brand seal uses `assets/seal-*.png`. To upgrade to
the higher-resolution branded versions, just replace those files (keep the same names) and the
whole site updates. Images are auto-served with long cache headers.

## Credits

Written and built by **Jesse James** · View Royal, British Columbia.
Content free to quote and cite with attribution to Team Canada / `primestrength.ca`.
