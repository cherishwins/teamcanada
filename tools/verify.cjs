#!/usr/bin/env node
/**
 * The pre-push sweep, committed.
 *
 * CLAUDE.md has required this for a while — "sweep every page across 10
 * viewports for horizontal overflow, console errors and undersized tap
 * targets, then run the contrast audit" — but the script that did it lived in
 * a scratch directory and died with the session, exactly like the French pass
 * did. A convention that cannot be re-run is a convention that silently stops
 * being true. This is that sweep, in the repo.
 *
 * It serves .vercel/output/static through request interception rather than a
 * dev server, so it exercises the bytes Vercel will actually publish and needs
 * no network.
 *
 *   node tools/verify.cjs [.vercel/output/static]
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const ROOT = process.argv[2] || '.vercel/output/static';

const PAGES = ['/', '/hand', '/math', '/bloc', '/build', '/calculator', '/sources',
  '/read', '/read/the-closed-loop', '/read/the-vertical-squeeze', '/read/changed-my-mind',
  '/read/two-leaders', '/read/honest-answer', '/join', '/support', '/privacy',
  '/terms', '/fr', '/offline', '/404.html'];

// 320 is the narrowest phone still in use; 2560 catches a layout that only
// centres by accident. The middle values are the real traffic.
const VIEWPORTS = [320, 360, 390, 414, 600, 768, 1024, 1280, 1920, 2560];

const MIME = { html: 'text/html', css: 'text/css', js: 'text/javascript',
  png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', woff2: 'font/woff2',
  ico: 'image/x-icon', json: 'application/json', webmanifest: 'application/manifest+json',
  xml: 'application/xml', txt: 'text/plain' };

/**
 * Two kinds of request are deliberately not served from the static output, and
 * a sweep that counted them as 404s would drown the real signal:
 *
 *   - Another origin. Umami and Vercel Speed Insights live on their own hosts.
 *     The page is required to work without them, so they answer 204 and the
 *     sweep proves the page does not depend on either.
 *   - /api/*. Those are serverless routes; a static build has no such file.
 *     They answer 503 ON PURPOSE, which turns the sweep into a test of the
 *     rule CLAUDE.md actually cares about — "a figure never renders blank; on
 *     failure the page shows the fallback and says a source is not responding."
 *     Stubbing them with plausible success would test nothing.
 *
 * Anything else that 404s is a genuinely broken reference, and is counted.
 */
function serve(page, onBroken) {
  return page.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.host !== 'local.test') return route.fulfill({ status: 204, body: '' });
    if (u.pathname.startsWith('/api/')) {
      return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"stubbed by tools/verify.cjs"}' });
    }
    let f = path.join(ROOT, decodeURIComponent(u.pathname));
    if (f.endsWith('/')) f += 'index.html';
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(f + '/index.html')) f += '/index.html';
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      return route.fulfill({ status: 200, contentType: MIME[path.extname(f).slice(1)] || 'application/octet-stream', body: fs.readFileSync(f) });
    }
    onBroken(u.pathname);
    return route.fulfill({ status: 404, body: 'not found' });
  });
}

/** Relative luminance contrast, computed against the nearest opaque ancestor. */
const CONTRAST_PROBE = () => {
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const parse = (s) => { const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]] : null; };
  const bgOf = (el) => { let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c[3] > 0.9) return c; n = n.parentElement; } return [0, 0, 0, 1]; };
  const out = [];
  for (const el of document.querySelectorAll('p,span,div,li,h1,h2,h3,h4,a,strong,em,dt,dd,td,th,label,button,figcaption,summary')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.5) continue;
    const fg = parse(cs.color); if (!fg) continue;
    const bg = bgOf(el);
    const a = L(...fg.slice(0, 3)), b = L(...bg.slice(0, 3));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const px = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const large = px >= 24 || (px >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (ratio < need - 0.01) out.push({ ratio: +ratio.toFixed(2), need, px: +px.toFixed(1), text: el.textContent.trim().slice(0, 52) });
  }
  return out;
};

/** Anything interactive that is not inline in a run of text must reach 24px. */
const TAP_PROBE = () => {
  const out = [];
  for (const el of document.querySelectorAll('a,button,input,select,summary,[role="button"]')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (cs.display === 'inline' && el.closest('p,li,dd,figcaption')) continue;  // inline links in prose
    if (r.width < 24 || r.height < 24) out.push({ text: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 34), w: Math.round(r.width), h: Math.round(r.height) });
  }
  return out;
};

(async () => {
  if (!fs.existsSync(ROOT)) { console.error(`verify: no build at ${ROOT}`); process.exit(1); }
  const browser = await chromium.launch();
  let overflow = 0, jsErrors = 0, taps = 0, contrast = 0, missing = 0, altMissing = 0, broken = 0;
  const report = [];

  for (const width of VIEWPORTS) {
    // Playwright does not put service-worker script fetches through page.route,
    // so under interception every registration fails against a host that does
    // not exist and the browser logs it — 57 errors that say nothing about the
    // site. Verified separately on real HTTP: /sw.js serves 200 as
    // application/javascript, and the registration is wrapped in .catch()
    // anyway, so a failure there never reaches the page. Block it and let the
    // console channel carry only errors the site is actually responsible for.
    const ctx = await browser.newContext({
      viewport: { width, height: 900 }, deviceScaleFactor: 1, serviceWorkers: 'block',
    });
    const page = await ctx.newPage();
    let current = '';
    await serve(page, (p) => { broken++; report.push(`  BROKEN    ${width}px  ${current}  -> ${p}`); });
    page.on('pageerror', (e) => { jsErrors++; report.push(`  JS ERROR  ${width}px  ${current}  ${e.message}`); });
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      // Resource-load failures are already counted precisely above, by path;
      // the console copy is a duplicate with no URL in it. The 503 /api stubs
      // are deliberate, and the page is required to survive them.
      if (/Failed to load resource/.test(m.text())) return;
      jsErrors++; report.push(`  CONSOLE   ${width}px  ${current}  ${m.text()}`);
    });

    for (const p of PAGES) {
      current = p;
      const res = await page.goto('https://local.test' + p, { waitUntil: 'load' }).catch(() => null);
      if (!res || res.status() !== 200) { missing++; report.push(`  MISSING   ${width}px  ${p}`); continue; }
      await page.waitForTimeout(40);

      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) { overflow++; report.push(`  OVERFLOW  ${width}px  ${p}  +${over}px`); }

      for (const t of await page.evaluate(TAP_PROBE)) { taps++; report.push(`  TAP       ${width}px  ${p}  ${t.w}x${t.h}  "${t.text}"`); }

      // Contrast and metadata do not change with width; check once, at 1280.
      if (width === 1280) {
        for (const c of await page.evaluate(CONTRAST_PROBE)) { contrast++; report.push(`  CONTRAST  ${p}  ${c.ratio}:1 (needs ${c.need}) ${c.px}px  "${c.text}"`); }
        const alt = await page.evaluate(() => {
          const g = (s) => document.querySelector(s)?.getAttribute('content') || '';
          return { img: g('meta[property="og:image"]'), alt: g('meta[property="og:image:alt"]'), talt: g('meta[name="twitter:image:alt"]') };
        });
        if (!alt.alt || !alt.talt) { altMissing++; report.push(`  OG ALT    ${p}  missing`); }
      }
    }
    await ctx.close();
    process.stdout.write(`  ${width}px ✓\n`);
  }
  await browser.close();

  if (report.length) console.log('\n' + report.join('\n'));
  console.log(`\n${PAGES.length} pages × ${VIEWPORTS.length} viewports (${320}→${2560})`);
  console.log(`  horizontal overflow      ${overflow}`);
  console.log(`  JS / console errors      ${jsErrors}`);
  console.log(`  undersized tap targets   ${taps}`);
  console.log(`  WCAG AA contrast fails   ${contrast}`);
  console.log(`  pages not served         ${missing}`);
  console.log(`  pages missing og alt     ${altMissing}`);
  console.log(`  broken references        ${broken}`);
  const bad = overflow + jsErrors + taps + contrast + missing + altMissing + broken;
  console.log(bad ? `\nverify: ${bad} issue(s)` : '\nverify: clean');
  process.exit(bad ? 1 : 0);
})();
