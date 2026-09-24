#!/usr/bin/env node
/**
 * Every same-origin link in the build must land on a page the build produced.
 *
 * This existed as a gap for as long as the site has: tools/verify.cjs counts
 * broken RESOURCES (a script, a font, an image that 404s) and
 * tools/check-links.cjs checks EXTERNAL citations, and neither ever looked at
 * an <a href="/…"> pointing inside the site. So two "Read next" links carried
 * over from the legacy site — /read/two-leaders.html and
 * /read/honest-answer.html, paths that do not exist here — shipped, passed
 * eight checkers and a ten-count sweep, and 404'd on production until a
 * phone-width crawl of the live site tripped over them.
 *
 * A dead link inside the site is worse than a dead citation: it is the site
 * failing to find itself. So this walks every built page, resolves every
 * same-origin href (absolute or relative, ignoring ?queries) to a file in the
 * output, and fails on any that is not there. /api/* is the one path that is
 * dynamic rather than built, and mailto:/tel: are not pages.
 *
 * A #fragment is a claim too. The members ledger links every break to
 * /record/divisions#v34, and a fragment that names no id on the target page
 * lands the reader at the top of a 174-row table with no idea why. So where a
 * link carries a fragment, the target page must carry that id.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.vercel/output/static';

if (!fs.existsSync(ROOT)) {
  console.error(`check-internal-links: ${ROOT} not found — run \`astro build\` first`);
  process.exit(1);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

/** The file a site-relative path resolves to, or null. */
function fileFor(p) {
  const clean = decodeURIComponent(p);
  return [
    path.join(ROOT, clean),
    path.join(ROOT, clean, 'index.html'),
    path.join(ROOT, clean.replace(/\/$/, '') + '.html'),
  ].find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? null;
}

/** Every id on a built page, read once. */
const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    idCache.set(file, new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

const pages = walk(ROOT);
const broken = new Map();
const noAnchor = new Map();
let checked = 0;
let fragments = 0;

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const here = '/' + path.relative(ROOT, path.dirname(file)).replace(/\\/g, '/');
  for (const m of html.matchAll(/\shref=["']([^"'#?]*)(?:\?[^"'#]*)?(?:#([^"']*))?["']/gi)) {
    const href = m[1];
    const frag = m[2];
    if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let target = file; // a bare "#anchor" is the same page
    if (href) {
      const p = href.startsWith('/') ? href : path.posix.join(here, href);
      if (p.startsWith('/api/')) continue; // served on demand, never in the static output
      checked++;
      target = fileFor(p);
      if (!target) { (broken.get(href) || broken.set(href, new Set()).get(href)).add(path.relative(ROOT, file)); continue; }
    }
    if (frag) {
      fragments++;
      const id = decodeURIComponent(frag);
      if (!idsOf(target).has(id)) {
        const key = `${href}#${frag}`;
        (noAnchor.get(key) || noAnchor.set(key, new Set()).get(key)).add(path.relative(ROOT, file));
      }
    }
  }
}

if (checked === 0) {
  console.error('check-internal-links: found 0 internal links across the build — the parse went blind. Fix the parse, do not delete the check.');
  process.exit(1);
}

if (broken.size || noAnchor.size) {
  if (broken.size) {
    console.error('check-internal-links: the site links to pages it did not build\n');
    for (const [href, where] of broken) console.error(`  ✗ ${href}\n      on ${[...where].join(', ')}`);
  }
  if (noAnchor.size) {
    console.error('check-internal-links: the site links to fragments that name no id on the target page\n');
    for (const [href, where] of noAnchor) console.error(`  ✗ ${href}\n      on ${[...where].join(', ')}`);
  }
  console.error('');
  process.exit(1);
}

console.log(`check-internal-links: ${checked} internal links and ${fragments} fragments across ${pages.length} pages, every one resolves`);
