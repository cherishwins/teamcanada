#!/usr/bin/env node
/**
 * The sitemap and the robots meta must not contradict each other.
 *
 * A URL in the sitemap is a request to index it. A `noindex` on that page is an
 * instruction not to. Sending both tells Google two opposite things about the
 * same URL, and Google resolves it by trusting the page — so the sitemap entry
 * is at best wasted crawl budget on a site that is already waiting in the
 * "Discovered — currently not indexed" queue.
 *
 * This exists because the rule was ALREADY WRITTEN DOWN and still got applied
 * incompletely. CLAUDE.md said it, astro.config.mjs said it, and the filter
 * excluded /fr and /support — but not /offline, which carries
 * `noindex, nofollow` and was being submitted to Google the whole time. Nobody
 * would have found that by reading the filter, because the filter looks
 * complete. It is only visible by comparing the sitemap against the pages.
 *
 * So: read the built sitemap, read the robots meta on every page it lists, and
 * fail on any disagreement. Also fail the other way — a sitemap that has gone
 * empty, or lost pages that are perfectly indexable, is its own bug.
 *
 * A page can also be noindexed by a HEADER. vercel.json sends
 * `X-Robots-Tag: noindex` on the five machine text files (llms-full.txt is
 * 18 pages' prose in one file, and the only indexable copy of the /fr
 * draft). That rule is one careless edit from noindexing the site: widen its
 * source to "/(.*)" and every page disappears from Google while every page
 * still reads "index, follow". So the header rules are compiled with Vercel's
 * own router, tested against every path the deploy can answer, and must reach
 * exactly those five files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.vercel/output/static';
const fail = [];

if (!fs.existsSync(ROOT)) {
  console.error(`check-sitemap: ${ROOT} not found — run \`astro build\` first`);
  process.exit(1);
}

// ---- Collect every <loc> across the sitemap index and its children.
const sitemaps = fs.readdirSync(ROOT).filter((f) => /^sitemap.*\.xml$/.test(f));
if (sitemaps.length === 0) {
  console.error('check-sitemap: no sitemap*.xml in the build');
  process.exit(1);
}

const locs = new Set();
for (const f of sitemaps) {
  const xml = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    // The index points at the child sitemaps; only page URLs interest us.
    if (/sitemap.*\.xml$/.test(m[1])) continue;
    locs.add(m[1]);
  }
}

if (locs.size === 0) {
  console.error('check-sitemap: the sitemap lists no page URLs at all');
  process.exit(1);
}

/** Map a public URL back to the file the build produced for it. */
function fileFor(url) {
  const p = new URL(url).pathname.replace(/^\//, '').replace(/\/$/, '');
  for (const candidate of [
    path.join(ROOT, p, 'index.html'),
    path.join(ROOT, p ? `${p}.html` : 'index.html'),
    path.join(ROOT, 'index.html'),
  ]) {
    if (p === '' && candidate.endsWith(path.join(ROOT, 'index.html'))) return candidate;
    if (p !== '' && fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Does a robots value keep the URL out of the index? Google's own list:
 * `noindex`; `none`, "Equivalent to noindex, nofollow"; and `unavailable_after`,
 * which is `noindex` on a timer. Matching the word `noindex` alone let a rule
 * sending `none` to every page pass. Parsed by directive, not by word, because
 * `max-image-preview:none` is an image setting and must not trip it.
 */
function blocksIndex(value) {
  return String(value).toLowerCase().split(',').some((t) => {
    const d = t.trim().replace(/^(?!max-|unavailable_after)[a-z0-9_-]+\s*:\s*/, ''); // drop a "googlebot:" prefix
    return d === 'noindex' || d === 'none' || d.startsWith('unavailable_after');
  });
}

function robotsOf(html) {
  const m = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  if (!m) return '';
  const c = m[0].match(/content=["']([^"']*)["']/i);
  return c ? c[1].toLowerCase() : '';
}

// ---- 1. Nothing in the sitemap may be noindex.
const indexable = [];
for (const url of [...locs].sort()) {
  const file = fileFor(url);
  if (!file) {
    fail.push(`${url} is in the sitemap but the build produced no page for it`);
    continue;
  }
  const robots = robotsOf(fs.readFileSync(file, 'utf8'));
  if (blocksIndex(robots)) {
    fail.push(
      `${url} is in the sitemap but the page says "${robots}". ` +
        `Submitting a URL while telling crawlers not to index it is a contradictory signal — ` +
        `add it to the filter in astro.config.mjs.`,
    );
  } else {
    indexable.push(url);
  }
}

// ---- 2. Nothing indexable may be MISSING from the sitemap.
// The opposite failure, and just as quiet: a page ships, nothing links to it
// from the sitemap, and it waits forever to be discovered.
// Compare paths, not spellings: /bloc and /bloc/ name the same built page.
// Whether the sitemap uses the canonical spelling is check-canonical's claim.
const norm = (p) => p.replace(/(.)\/$/, '$1');
const inSitemap = new Set([...locs].map((u) => norm(new URL(u).pathname)));
const orphans = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    // Every HTML file, not only index.html: 404.html answers 200 at its own
    // filename, and this walk skipped it on the premise that it is only ever
    // served with an error status. It was indexable there for months.
    if (!e.name.endsWith('.html')) continue;
    const rel = path.relative(ROOT, p).replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '$1');
    const pathname = norm('/' + rel);
    if (inSitemap.has(pathname)) continue;
    if (blocksIndex(robotsOf(fs.readFileSync(p, 'utf8')))) continue; // correctly excluded
    orphans.push(pathname);
  }
})(ROOT);

for (const o of orphans) {
  fail.push(`${o} is indexable but is NOT in the sitemap — nothing will point Google at it`);
}

// ---- 3. X-Robots-Tag reaches EXACTLY the five machine text files.
// Exact in both directions, the way check-csp is. Testing only the pages let a
// rule on /og/ (Article images must be indexable), /feed.xml, robots.txt or
// /api/ pass, and a missing vercel.json skipped the whole check. So every
// path the deploy can answer is tested: each file the build wrote, each page
// in both spellings, and each on-demand endpoint.
const NOINDEX_BY_HEADER = ['/LICENSE.txt', '/ai.txt', '/humans.txt', '/llms-full.txt', '/llms.txt'];
const VERCEL_JSON = process.argv[3] || 'vercel.json';
if (!fs.existsSync(VERCEL_JSON)) {
  console.error(`check-sitemap: ${VERCEL_JSON} not found — the X-Robots-Tag rules cannot be checked`);
  process.exit(1);
}
let getTransformedRoutes;
try {
  ({ getTransformedRoutes } = require('@vercel/routing-utils')); // ships with @astrojs/vercel
} catch {
  console.error('check-sitemap: @vercel/routing-utils not found — it ships with @astrojs/vercel; run npm ci');
  process.exit(1);
}
const vercel = JSON.parse(fs.readFileSync(VERCEL_JSON, 'utf8'));
if (vercel.routes) fail.push(`${VERCEL_JSON} uses "routes", which this check does not read — write headers under "headers"`);
const { routes, error } = getTransformedRoutes({ headers: vercel.headers || [] });
let headerRules = 0;
if (error) {
  fail.push(`${VERCEL_JSON} headers do not compile: ${error.message || error}`);
} else {
  const noindexRoutes = routes.filter((r) => r.headers && Object.entries(r.headers)
    .some(([k, v]) => k.toLowerCase() === 'x-robots-tag' && blocksIndex(v)));
  headerRules = noindexRoutes.length;
  const served = new Set();
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      const rel = '/' + path.relative(ROOT, p).replace(/\\/g, '/');
      served.add(rel);
      if (e.name === 'index.html') {
        const page = norm(rel.replace(/index\.html$/, ''));
        served.add(page);
        served.add(page === '/' ? page : page + '/');
      }
    }
  })(ROOT);
  // Tested by name too: generate-llms-full writes llms-full.txt AFTER this check.
  for (const p of NOINDEX_BY_HEADER) served.add(p);
  const API = 'src/pages/api';
  if (fs.existsSync(API)) for (const f of fs.readdirSync(API)) served.add('/api/' + f.replace(/\.[cm]?[jt]s$/, ''));
  const hit = [...served].filter((p) => noindexRoutes.some((r) => new RegExp(r.src).test(p)));
  for (const p of hit.sort()) {
    if (!NOINDEX_BY_HEADER.includes(p)) {
      const r = noindexRoutes.find((x) => new RegExp(x.src).test(p));
      fail.push(`${p} gets X-Robots-Tag from the ${VERCEL_JSON} rule ${r.src}; only ${NOINDEX_BY_HEADER.join(', ')} may`);
    }
  }
  for (const p of NOINDEX_BY_HEADER) {
    if (!hit.includes(p)) fail.push(`${p} should carry X-Robots-Tag: noindex from ${VERCEL_JSON} and no rule sends it`);
  }
}

if (fail.length) {
  console.error('check-sitemap: the sitemap and the pages disagree\n');
  for (const f of fail) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-sitemap: ${indexable.length} indexable URLs, all present and none noindex` +
    `; ${headerRules} X-Robots-Tag rule${headerRules === 1 ? ' reaches' : 's reach'} exactly the ${NOINDEX_BY_HEADER.length} machine text files`,
);
