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
  if (/\bnoindex\b/.test(robots)) {
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
const inSitemap = new Set([...locs].map((u) => new URL(u).pathname));
const orphans = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (e.name !== 'index.html') continue;
    const rel = path.relative(ROOT, p).replace(/index\.html$/, '');
    const pathname = '/' + rel.replace(/\\/g, '/');
    if (inSitemap.has(pathname)) continue;
    if (/\bnoindex\b/.test(robotsOf(fs.readFileSync(p, 'utf8')))) continue; // correctly excluded
    orphans.push(pathname);
  }
})(ROOT);

for (const o of orphans) {
  fail.push(`${o} is indexable but is NOT in the sitemap — nothing will point Google at it`);
}

if (fail.length) {
  console.error('check-sitemap: the sitemap and the pages disagree\n');
  for (const f of fail) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-sitemap: ${indexable.length} indexable URLs, all present and none noindex`,
);
