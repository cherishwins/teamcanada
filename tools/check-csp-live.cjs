#!/usr/bin/env node
/**
 * The Content-Security-Policy, proved against the REAL network.
 *
 * tools/check-csp.cjs proves the hash list matches the build. tools/verify.cjs
 * proves the policy does not break the site's own scripts. Neither can see
 * what a third-party script does once it is running, because the sweep
 * answers every other origin with 204 on purpose. So the first policy shipped
 * with `connect-src https://cloud.umami.is`, the sweep passed, CI passed, and
 * on the deployed preview Umami's script posted every beacon to
 * https://gateway.umami.is/api/send and the browser refused all of them.
 * Analytics were silently off and nothing in the repo could have said so.
 *
 * This opens real pages on a real deployment in a real browser and fails on
 * any securitypolicyviolation. It runs weekly against production from
 * .github/workflows/links.yml — the vendors' endpoints are theirs to move —
 * and by hand against a preview:
 *
 *   node tools/check-csp-live.cjs https://teamcanada-git-<branch>-jpandajames.vercel.app
 *
 * Console errors are reported for the record but are not the verdict: under
 * a TLS-intercepting proxy (this repo's web sandbox) the service worker
 * cannot register and Chromium logs ERR_TOO_MANY_RETRIES, neither of which is
 * the site's doing. A CSP violation is unambiguous, so that is the verdict.
 */
const { chromium } = (() => {
  try { return require('playwright'); } catch { /* fall through */ }
  try { return require('/opt/node22/lib/node_modules/playwright'); } catch { /* fall through */ }
  console.error('check-csp-live: playwright not found — run `npm i --no-save playwright`');
  process.exit(1);
})();

const BASE = (process.argv[2] || 'https://northerntemper.ca').replace(/\/$/, '');

// One page per distinct inline script the policy hashes, plus the two heaviest.
const PAGES = ['/', '/calculator/', '/sources/', '/read/the-red-is-the-work/', '/join/', '/bloc/'];

// Third-party requests worth listing so the run shows the vendors actually
// loaded, not just that nothing was blocked.
const VENDOR = /umami\.is|_vercel\/insights/;

(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: !!proxy, viewport: { width: 1280, height: 900 } });
  let violations = 0;
  let noHeader = 0;
  let unreachable = 0;

  for (const p of PAGES) {
    const page = await ctx.newPage();
    const errors = [];
    const vendors = new Map();
    await page.addInitScript(() => {
      window.__csp = [];
      document.addEventListener('securitypolicyviolation', (e) => {
        window.__csp.push(`${e.effectiveDirective} blocked ${e.blockedURI}`);
      });
    });
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 110)); });
    page.on('response', (r) => { if (VENDOR.test(r.url())) vendors.set(r.url().replace(/\?.*/, ''), r.status()); });

    let status = 'ERR';
    let header = '';
    let loaded = false;
    try {
      // 'load' plus a fixed wait, not 'networkidle': analytics beacons and a
      // proxy's retries can keep a page from ever going idle, and a page that
      // never settles would read as a failed load rather than as what it is.
      const res = await page.goto(BASE + p, { waitUntil: 'load', timeout: 60_000 });
      status = res.status();
      header = res.headers()['content-security-policy'] || '';
      loaded = true;
      // Exercise the inline scripts the policy hashes: the nav toggle on every
      // page, the calculator's select on its own. Beacons fire during the wait.
      await page.evaluate(() => document.querySelector('.nav .toggle')?.click()).catch(() => {});
      if (p.startsWith('/calculator')) {
        await page.evaluate(() => {
          const s = document.querySelector('select');
          if (s) { s.selectedIndex = 2; s.dispatchEvent(new Event('change', { bubbles: true })); }
        }).catch(() => {});
      }
      await page.waitForTimeout(2000);
    } catch (e) {
      errors.push(`navigation: ${e.message.slice(0, 100)}`);
    }
    const found = await page.evaluate(() => window.__csp || []).catch(() => []);

    // Three different failures, reported as three different things: a page
    // that could not be loaded proves nothing either way and says so; a page
    // that loaded without the header is a deployment problem; a violation is
    // the policy problem this file exists to find.
    if (!loaded) unreachable++;
    else if (!header) noHeader++;
    const csp = !loaded ? 'unreachable' : header ? 'present' : 'MISSING';
    console.log(`${p.padEnd(28)} http ${status}  csp ${csp}  violations ${found.length}`);
    for (const [u, s] of vendors) console.log(`     ${s}  ${u}`);
    for (const v of found) { violations++; console.log(`     ✗ CSP VIOLATION  ${v}`); }
    for (const e of errors) console.log(`     · console: ${e}`);
    await page.close();
  }
  await browser.close();

  if (violations || noHeader || unreachable) {
    console.error(
      `\ncheck-csp-live: ${violations} violation(s), ${noHeader} page(s) without a CSP header, ` +
        `${unreachable} page(s) unreachable, on ${BASE}`,
    );
    process.exit(1);
  }
  console.log(`\ncheck-csp-live: clean — ${PAGES.length} pages at ${BASE}, CSP present on all, nothing blocked`);
})();
