#!/usr/bin/env node
/**
 * One page, one URL, proved on the REAL edge.
 *
 * tools/check-canonical.cjs proves the build names every page in one form and
 * that the adapter emits the redirect for the other. It cannot prove the edge
 * obeys: this repo has already watched production ignore a route the adapter
 * wrote into config.json (the _astro/* immutable header), and a redirect
 * conditioned on a hostname cannot run anywhere but the host it names —
 * Vercel's docs say `has` "does not yet work locally".
 *
 * Why it matters: for months every page answered 200 at /bloc AND /bloc/, the
 * sitemap submitted /bloc/, and the page said its canonical was /bloc. Search
 * Console filed the slash URLs as "Alternate page with proper canonical tag"
 * and left twelve more "Discovered — currently not indexed". A second host,
 * teamcanada.vercel.app, served the whole site with no noindex. A tag is a
 * hint; a permanent redirect is the signal Google ranks first.
 *
 * So, against a deployment (production by default):
 *   1. the root and canonical pages answer 200 with no redirect;
 *   2. the slash form of a page answers 301/308 to the canonical form;
 *   3. on production only, the pages carry no X-Robots-Tag noindex and
 *      /llms-full.txt, every page's prose in one file, does. Production only
 *      because Vercel stamps noindex on EVERY preview response, which is right
 *      for a preview and would make both assertions meaningless there. The
 *      header rule matters enough to prove on the edge: a source pattern
 *      in this repo has already been miswritten once in a way Vercel accepted
 *      and silently ignored;
 *   4. on production only, http:// and www. reach the apex, and the retired
 *      default host, teamcanada.vercel.app, redirects permanently to it.
 *
 *   node tools/check-urls-live.cjs                        # production
 *   node tools/check-urls-live.cjs https://<preview-host> # parts 1 and 2 only
 *
 * Runs weekly from .github/workflows/links.yml, never on a PR: the edge is
 * someone else's machine, and its outage must not turn a review red.
 */
const BASE = (process.argv[2] || 'https://northerntemper.ca').replace(/\/$/, '');
const APEX = 'https://northerntemper.ca';
const IS_PROD = BASE === APEX;

// A page from each depth, including the two ledgers whose fragments other
// pages link to. Canonical form: no trailing slash, except the root.
const PAGES = ['/bloc', '/read/two-leaders', '/record/members'];

const fail = [];
const rows = [];

async function head(url) {
  // GET, not HEAD: some edges answer HEAD differently, and a reader never sends one.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'northerntemper.ca/check-urls-live' } });
      await r.body?.cancel();
      const loc = r.headers.get('location');
      return { status: r.status, location: loc ? new URL(loc, url).href : null, robots: r.headers.get('x-robots-tag') || '' };
    } catch (e) {
      if (attempt === 3) return { status: 'ERR', location: null, robots: '', error: e.cause?.code || e.message };
    }
  }
}

async function expect200(url, { noindex = false } = {}) {
  const r = await head(url);
  rows.push(`${String(r.status).padEnd(4)} ${url}${r.robots ? `  [x-robots-tag: ${r.robots}]` : ''}`);
  if (r.status !== 200) fail.push(`${url} should answer 200 with no redirect, got ${r.status}${r.location ? ` → ${r.location}` : ''}${r.error ? ` (${r.error})` : ''}`);
  const says = /\bnoindex\b/i.test(r.robots);
  if (IS_PROD && r.status === 200 && says !== noindex) {
    fail.push(noindex
      ? `${url} should carry X-Robots-Tag: noindex and does not — the vercel.json header rule is not reaching the edge`
      : `${url} is a page meant to be indexed, and the edge sends X-Robots-Tag: ${r.robots}`);
  }
}

async function expectPermanent(url, want) {
  const r = await head(url);
  rows.push(`${String(r.status).padEnd(4)} ${url}${r.location ? `  → ${r.location}` : ''}`);
  if (![301, 308].includes(r.status)) {
    fail.push(`${url} should permanently redirect to ${want}, got ${r.status}${r.error ? ` (${r.error})` : ''}`);
  } else if (typeof want === 'string' ? r.location !== want : !want.test(r.location || '')) {
    fail.push(`${url} redirects to ${r.location}, expected ${want}`);
  }
}

(async () => {
  await expect200(BASE + '/');
  for (const p of PAGES) {
    await expect200(BASE + p);
    await expectPermanent(BASE + p + '/', BASE + p);
  }
  if (IS_PROD) await expect200(BASE + '/llms-full.txt', { noindex: true });

  if (IS_PROD) {
    const host = new URL(APEX).host;
    await expectPermanent(`http://${host}/bloc`, `${APEX}/bloc`);
    await expectPermanent(`https://www.${host}/bloc`, `${APEX}/bloc`);
    // The retired default host keeps the path; a slash URL then takes the
    // apex's own second hop. Google follows ten.
    await expectPermanent('https://teamcanada.vercel.app/', `${APEX}/`);
    await expectPermanent('https://teamcanada.vercel.app/bloc', `${APEX}/bloc`);
  }

  for (const r of rows) console.log(`  ${r}`);
  if (fail.length) {
    console.error(`\ncheck-urls-live: ${fail.length} problem(s) on ${BASE}\n`);
    for (const f of fail) console.error(`  ✗ ${f}`);
    console.error('');
    process.exit(1);
  }
  console.log(`\ncheck-urls-live: one URL per page on ${BASE}${IS_PROD ? ', the right X-Robots-Tag on each, and every other host lands on it' : ' (headers and host redirects are production-only and were not checked)'}`);
})();
