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
const path = require('path');
const fs = require('fs');

/**
 * Playwright is deliberately NOT in package.json.
 *
 * Vercel installs devDependencies to build, so listing a browser-automation
 * library there would add its weight to every single deploy of a site that
 * never uses it at runtime. CI installs it explicitly instead (--no-save), and
 * the sandbox has it globally. Resolve whichever is present.
 */
function loadChromium() {
  for (const m of ['playwright', '@playwright/test', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(m).chromium; } catch { /* try the next one */ }
  }
  console.error('verify: playwright not found — run `npm i --no-save playwright`');
  process.exit(1);
}
const chromium = loadChromium();

/** axe-core IS a devDependency: 568 kB, dev-only, and it never reaches a page. */
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

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
 * Three kinds of request are deliberately not served from the static output,
 * and a sweep that counted them as 404s would drown the real signal:
 *
 *   - Another origin. Umami and Vercel Speed Insights live on their own hosts.
 *     The page is required to work without them, so they answer 204 and the
 *     sweep proves the page does not depend on either.
 *   - /api/*. Those are serverless routes; a static build has no such file.
 *     They answer 503 ON PURPOSE, which turns the sweep into a test of the
 *     rule CLAUDE.md actually cares about — "a figure never renders blank; on
 *     failure the page shows the fallback and says a source is not responding."
 *     Stubbing them with plausible success would test nothing.
 *   - /_vercel/*. SAME-ORIGIN, but served by the platform's edge and never
 *     written into the build. `webAnalytics: { enabled: true }` puts
 *     `/_vercel/insights/script.js` on every page at BUILD time — the tag is
 *     in the HTML, only the file is absent — so before this case existed the
 *     sweep reported 20 pages × 10 viewports = 200 broken references and
 *     `main` went red. It answers 204, on the same logic as another origin:
 *     the page must work without it. That it is 204 and not 200 is the point,
 *     because /offline and every fallback path must survive its absence.
 *     Narrow on purpose — `/_vercel/` only, not a wildcard for anything
 *     missing.
 *
 * Anything else that 404s is a genuinely broken reference, and is counted.
 */
/**
 * The production Content-Security-Policy, served on every HTML response here
 * exactly as Vercel serves it, so the sweep proves the policy against every
 * page at every width. tools/check-csp.cjs proves the hash LIST matches the
 * build; this proves the policy does not BREAK anything — a directive that
 * blocks the nav toggle or the share button shows up as a violation below,
 * not as a bug report from a reader.
 */
const CSP = (() => {
  const cfg = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  const rule = (cfg.headers || []).find((h) => h.source === '/(.*)');
  return rule?.headers?.find((h) => h.key.toLowerCase() === 'content-security-policy')?.value || '';
})();

/** Runs in every document before any page script: records CSP violations. */
const CSP_PROBE = `
  window.__csp = [];
  document.addEventListener('securitypolicyviolation', (e) => {
    window.__csp.push({ directive: e.effectiveDirective, blocked: e.blockedURI, sample: (e.sample || '').slice(0, 60) });
  });
`;

function serve(page, onBroken) {
  return page.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.host !== 'local.test') return route.fulfill({ status: 204, body: '' });
    if (u.pathname.startsWith('/api/')) {
      return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"stubbed by tools/verify.cjs"}' });
    }
    if (u.pathname.startsWith('/_vercel/')) return route.fulfill({ status: 204, body: '' });
    let f = path.join(ROOT, decodeURIComponent(u.pathname));
    if (f.endsWith('/')) f += 'index.html';
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(f + '/index.html')) f += '/index.html';
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      const html = f.endsWith('.html');
      return route.fulfill({
        status: 200,
        contentType: MIME[path.extname(f).slice(1)] || 'application/octet-stream',
        headers: html && CSP ? { 'content-security-policy': CSP } : {},
        body: fs.readFileSync(f),
      });
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

/**
 * The service worker needs its own check, and this is not belt-and-braces.
 *
 * Astro copies public/ verbatim without parsing it, and the sweep below blocks
 * service workers outright (see the comment on newContext), so nothing else in
 * this repo ever reads sw.js. A syntax error in it would ship silently — and a
 * broken service worker is worse than no service worker, because it is exactly
 * the thing that can leave somebody looking at a stale figure on a site whose
 * whole claim is that the figures are current.
 */
function checkServiceWorker() {
  const sw = path.join(ROOT, 'sw.js');
  if (!fs.existsSync(sw)) return ['sw.js missing from the build'];
  const bad = [];
  try {
    new (require('vm').Script)(fs.readFileSync(sw, 'utf8'), { filename: sw });
  } catch (e) {
    bad.push(`sw.js does not parse: ${e.message}`);
  }
  // activate deletes every cache whose name is not VERSION, so a missing or
  // unbumped VERSION is how a stale asset survives a deploy.
  if (!/const\s+VERSION\s*=\s*['"`][^'"`]+['"`]/.test(fs.readFileSync(sw, 'utf8')))
    bad.push('sw.js has no VERSION constant to key its cache on');
  return bad;
}

(async () => {
  if (!fs.existsSync(ROOT)) { console.error(`verify: no build at ${ROOT}`); process.exit(1); }
  const swProblems = checkServiceWorker();
  for (const m of swProblems) console.log(`  SW        ${m}`);
  const browser = await chromium.launch();
  let overflow = 0, jsErrors = 0, taps = 0, contrast = 0, missing = 0, altMissing = 0, broken = 0, axeFails = 0, cspFails = 0;
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
    await page.addInitScript(CSP_PROBE);
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

      // Read violations now, before the sweep's own axe injection below — that
      // is tooling, not the site, and it goes in through CDP for that reason.
      for (const v of await page.evaluate(() => window.__csp || [])) {
        cspFails++; report.push(`  CSP       ${width}px  ${p}  ${v.directive} blocked ${v.blocked}${v.sample ? `  "${v.sample}"` : ''}`);
      }

      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) { overflow++; report.push(`  OVERFLOW  ${width}px  ${p}  +${over}px`); }

      for (const t of await page.evaluate(TAP_PROBE)) { taps++; report.push(`  TAP       ${width}px  ${p}  ${t.w}x${t.h}  "${t.text}"`); }

      // Contrast and metadata do not change with width; check once, at 1280.
      if (width === 1280) {
        for (const c of await page.evaluate(CONTRAST_PROBE)) { contrast++; report.push(`  CONTRAST  ${p}  ${c.ratio}:1 (needs ${c.need}) ${c.px}px  "${c.text}"`); }
        // axe-core catches the whole class of failures a geometry-and-colour
        // sweep cannot see: a scroll container the keyboard cannot reach, a
        // heading level skipped so the outline has a hole in it, content
        // stranded outside every landmark. All three were real here.
        // Evaluated through CDP rather than injected as a <script> tag: a tag
        // would be an unhashed inline script and the page's own CSP would
        // rightly refuse it. The probe above has already been read, so this
        // cannot be mistaken for a site violation either way.
        await page.evaluate(AXE);
        const violations = await page.evaluate(async () =>
          (await axe.run(document, { resultTypes: ['violations'] })).violations
            .map((v) => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length,
                           sample: v.nodes[0]?.html.slice(0, 110) })));
        for (const v of violations) {
          axeFails++;
          report.push(`  AXE       ${p}  [${v.impact}] ${v.id} × ${v.n} — ${v.help}\n              ${v.sample}`);
        }

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
  console.log(`  service-worker problems  ${swProblems.length}`);
  console.log(`  axe-core violations      ${axeFails}`);
  console.log(`  CSP violations           ${cspFails}`);
  const bad = overflow + jsErrors + taps + contrast + missing + altMissing + broken + swProblems.length + axeFails + cspFails;
  console.log(bad ? `\nverify: ${bad} issue(s)` : '\nverify: clean');
  process.exit(bad ? 1 : 0);
})();
