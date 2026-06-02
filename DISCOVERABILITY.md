# Discoverability playbook — primestrength.ca

Everything below is either already shipped in the repo or a copy-paste step for you.
Do the four ⭐ steps the day you go live; the rest compounds over the first month.

---

## Your URLs (bookmark these)

| What | URL |
|------|-----|
| Sitemap | `https://primestrength.ca/sitemap.xml` |
| RSS feed | `https://primestrength.ca/feed.xml` |
| robots.txt | `https://primestrength.ca/robots.txt` |
| llms.txt (for AI) | `https://primestrength.ca/llms.txt` |
| IndexNow key file | `https://primestrength.ca/1b5f670d64c363edea901656ac4b47b3.txt` |
| security.txt | `https://primestrength.ca/.well-known/security.txt` |

---

## ⭐ 1. Google Search Console

1. Go to <https://search.google.com/search-console> → **Add property** → **Domain** → `primestrength.ca`.
2. It gives you a **TXT record**. In **Cloudflare → DNS**, add it (Type `TXT`, Name `@`, the value Google gives). Verify.
   - Domain property covers `www`, root, http/https — do this one, not the URL-prefix one.
3. **Sitemaps → Add new sitemap →** enter `sitemap.xml` → Submit.
4. **URL Inspection →** paste `https://primestrength.ca/` → **Request indexing**. Repeat for `/join` and each `/read/...`.
5. Check back in 3–7 days: **Pages** (indexed count), **Enhancements** (FAQ, Breadcrumbs, Article rich results should appear).

## ⭐ 2. Bing Webmaster Tools (gets you Bing + ChatGPT search)

1. <https://www.bing.com/webmasters> → **Import from Google Search Console** (one click once GSC is set up), or add `primestrength.ca` and verify via Cloudflare TXT.
2. Submit `https://primestrength.ca/sitemap.xml`.
3. Bing powers ChatGPT/Copilot web results — this matters more than it used to.

## ⭐ 3. IndexNow (instant indexing on Bing/Yandex — already wired)

The key file is live at the URL above. To tell search engines a page changed, ping:

```bash
curl "https://api.indexnow.org/indexnow?url=https://primestrength.ca/&key=1b5f670d64c363edea901656ac4b47b3"
```

Submit several at once (after each content update):

```bash
curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" -d '{
  "host":"primestrength.ca",
  "key":"1b5f670d64c363edea901656ac4b47b3",
  "urlList":[
    "https://primestrength.ca/",
    "https://primestrength.ca/join",
    "https://primestrength.ca/read/changed-my-mind",
    "https://primestrength.ca/read/honest-answer",
    "https://primestrength.ca/read/two-leaders"
  ]
}'
```

## ⭐ 4. Warm the social share caches (so the cards look right)

Paste the live URLs into each validator once — they cache aggressively:
- **Facebook/Threads:** <https://developers.facebook.com/tools/debug/> → enter URL → **Scrape Again**
- **LinkedIn:** <https://www.linkedin.com/post-inspector/>
- **X/Twitter:** post the link in a draft; X reads OG tags (no validator anymore)
- **Preview anywhere:** <https://www.opengraph.xyz>

---

## Already built into the site (nothing to do)

- **Structured data:** Organization, WebSite, CollectionPage + ItemList, **FAQPage**, per-read **Article** and **BreadcrumbList**. Test any page at <https://search.google.com/test/rich-results>.
- **Open Graph + Twitter cards** on every page with real images (square 1200×1200 + branded share cards).
- **`llms.txt`** + an **AI-crawler-friendly `robots.txt`** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot…) so assistants can find and cite you.
- **Sitemap with image entries** (helps Google Images), **RSS feed**, **canonical + `hreflang=en-ca`** throughout.
- **PWA + service worker** (fast repeat loads, installable, offline) and **cookieless analytics** (no banner).
- **Core Web Vitals:** optimized images, reserved image dimensions, system-font fallback — fast on every device.

---

## Cloudflare free wins (you're already on it)

- **Caching:** Cloudflare in front of Vercel = global edge cache + Brotli for free. Default settings are fine; optionally set a **Cache Rule** to cache `/assets/*` aggressively.
- **Cloudflare Web Analytics:** <https://dash.cloudflare.com> → **Analytics → Web Analytics** → add `primestrength.ca`. It's cookieless (no banner). Paste the beacon snippet (in `README.md`) before `</body>` if you want it in addition to Vercel's.
- **Email routing:** Cloudflare **Email Routing** gives you `jesse@primestrength.ca` forwarding for free — and set **SPF/DKIM/DMARC** so your confirmations don't hit spam.
- **Always Use HTTPS** + **HSTS:** toggle on under SSL/TLS → Edge Certificates.

---

## Off-site distribution (this is where unity actually spreads)

The site is the home base; reach comes from pushing *out* and linking *back*.

- **LinkedIn (Fit For Gov page):** post each read as a short carousel, link back to `primestrength.ca/read/...`, pin the pledge. Backlinks + referral traffic + B2B credibility.
- **Share card:** the downloadable Sentinel card on `/#spread` ("Each province alone is a vassal. Together, we are a peer.") is made for native posting on X / Facebook / Instagram / Reddit. Native image + link in first comment.
- **Reddit:** r/canada, r/onguardforthee, r/canadapolitics — lead with the *data*, not the pitch; link the specific read that answers the thread.
- **Wikipedia-grade sourcing:** because every claim cites StatCan/IMF/OECD, the reads are quotable in comment debates — that's the viral mechanic.
- **Consistent NAP/handles:** use the same name "Team Canada / Prime Strength" and link `primestrength.ca` from every profile (`rel="me"` builds entity trust).
- **One post cadence beats ten one-offs:** 2–3 posts/week, always linking home, for a month.

---

## When you publish a new read (the 60-second checklist)

1. Add the page under `/read/`, add it to `sitemap.xml`, `feed.xml`, the home **ItemList**, and `llms.txt`.
2. Ping **IndexNow** (command above) and **Request indexing** in GSC.
3. Re-scrape the URL in the **Facebook/LinkedIn** validators.
4. Post it to LinkedIn + one relevant community, linking back.
