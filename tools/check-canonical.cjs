#!/usr/bin/env node
/**
 * One page, one URL — and every URL the build writes for a page is that one.
 *
 * Every page here answered 200 at BOTH /bloc and /bloc/. The canonical tag,
 * og:url, JSON-LD, llms.txt and every internal link said /bloc; the sitemap
 * said /bloc/ (Astro's default with trailingSlash unset and build.format
 * 'directory'), and so did the share band on thirteen pages, because it falls
 * back to Astro.url.pathname and that carries the slash. Google's own words:
 * "don't specify one URL in a sitemap, but a different URL for that same page
 * using rel=\"canonical\"". Search Console showed the result: twelve slash URLs
 * discovered from the sitemap and never crawled, and /bloc/ and /privacy/
 * reported as "Alternate page with proper canonical tag" — Google fetching
 * the URL we submitted and being told by the page that it is not the page.
 *
 * Nothing caught it. check-sitemap compares the sitemap with the robots meta,
 * never with the canonical; check-internal-links resolves /bloc/ and /bloc to
 * the same file, so both forms "resolve"; and a share URL sits inside a
 * percent-encoded query string or a data- attribute, where no href check looks.
 *
 * So, against the built output:
 *   1. every page's canonical points back at that same page;
 *   2. every sitemap <loc> equals, byte for byte, the canonical of its page;
 *   3. every same-origin URL anywhere in the output — href, src, data-*,
 *      og:url, JSON-LD, share intents (decoded), feed.xml, llms*.txt — that
 *      names a page names it in its canonical form; and no page carries a
 *      RELATIVE link, which resolves differently at /x and /x/;
 *   4. the platform enforces the choice: the non-canonical form must
 *      permanently redirect (a route in .vercel/output/config.json, or
 *      `trailingSlash` in vercel.json), or both forms keep answering 200 and
 *      the only thing separating them is a tag Google treats as a hint.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.vercel/output/static';
if (!fs.existsSync(ROOT)) {
  console.error(`check-canonical: ${ROOT} not found — run \`astro build\` first`);
  process.exit(1);
}

// The origin is written once, in src/config.mjs. Read it rather than type it.
const cfg = fs.readFileSync('src/config.mjs', 'utf8');
const ORIGIN = (cfg.match(/origin:\s*['"]([^'"]+)['"]/) || [])[1];
if (!ORIGIN) { console.error('check-canonical: no origin found in src/config.mjs'); process.exit(1); }
const HOST = new URL(ORIGIN).host;

const fail = [];
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const files = walk(ROOT);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

/** The key a URL path is looked up by: no trailing slash, except the root. */
const key = (p) => (p.replace(/\/+$/, '') || '/');

/** Every built page, by the path that reaches it. */
const pageByPath = new Map();
for (const f of htmlFiles) {
  const r = rel(f);
  const p = r === 'index.html' ? '/'
    : r.endsWith('/index.html') ? '/' + r.slice(0, -'/index.html'.length)
    : '/' + r.replace(/\.html$/, '');
  pageByPath.set(key(p), f);
}
const fileFor = (p) => pageByPath.get(key(p)) ?? null;

const canonOf = new Map();
function canonicalOf(file) {
  if (!canonOf.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i);
    const href = tag && (tag[0].match(/\bhref=["']([^"']+)["']/i) || [])[1];
    canonOf.set(file, href ?? null);
  }
  return canonOf.get(file);
}

// ---- 1. Every page's canonical names that same page, on this origin.
let pages = 0;
for (const f of htmlFiles) {
  // The error page is served with a 404 at every missing path, where robots
  // meta and canonicals are ignored. At its own filename it answers 200, so it
  // carries noindex, and check-sitemap holds it to that.
  if (/^(404|500)\.html$/.test(rel(f))) continue;
  pages++;
  const c = canonicalOf(f);
  if (!c) { fail.push(`${rel(f)} has no <link rel="canonical">`); continue; }
  const u = new URL(c);
  if (u.host !== HOST) { fail.push(`${rel(f)} declares a canonical on another host: ${c}`); continue; }
  if (fileFor(u.pathname) !== f) fail.push(`${rel(f)} declares canonical ${c}, which is not this page`);
}

// ---- 2. Every sitemap <loc> is its page's canonical, byte for byte.
let locs = 0;
for (const sm of files.filter((f) => /\/sitemap[^/]*\.xml$/.test(f))) {
  for (const m of fs.readFileSync(sm, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = m[1].trim();
    if (/sitemap[^/]*\.xml$/.test(loc)) continue; // the index pointing at a child
    locs++;
    const f = fileFor(new URL(loc).pathname);
    if (!f) { fail.push(`sitemap lists ${loc} but the build produced no page for it`); continue; }
    const c = canonicalOf(f);
    if (loc !== c) fail.push(`sitemap lists ${loc} but that page declares canonical ${c}`);
  }
}

// ---- 3. Every same-origin reference to a page uses the canonical form.
const originRe = new RegExp(ORIGIN.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '(/[^\\s"\'<>()\\\\`]*)?', 'g');
const attrRe = /\s(?:href|src|action|content|data-[\w-]+)=["']([^"']*)["']/gi;
// Decode run by run: prose here contains a bare "112%", which makes a single
// decodeURIComponent over the whole file throw and decode nothing at all.
const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&#x2F;|&#47;/gi, '/').replace(/&quot;/g, '"')
  .replace(/(?:%[0-9A-Fa-f]{2})+/g, (run) => { try { return decodeURIComponent(run); } catch { return run; } });
const offenders = new Map();
let refs = 0;
function note(where, found, want) {
  const k = `${found} → should be ${want}`;
  (offenders.get(k) || offenders.set(k, new Set()).get(k)).add(where);
}
function checkPath(where, raw) {
  const p = (raw || '/').split(/[?#&]/)[0].replace(/[.,;:!]+$/, '') || '/';
  const f = fileFor(p);
  if (!f || /^(404|500)\.html$/.test(rel(f))) return; // the error page: see above
  refs++;
  const c = canonicalOf(f);
  if (!c) return; // reported in step 1
  const want = new URL(c).pathname;
  if (p !== want) note(where, p, want);
}
for (const f of files.filter((x) => /\.(html|xml|txt|json|webmanifest)$/.test(x) && !/\/sitemap[^/]*\.xml$/.test(x))) { // sitemaps: step 2
  const text = fs.readFileSync(f, 'utf8');
  const where = rel(f);
  const scan = decode(text);
  for (const m of scan.matchAll(originRe)) checkPath(where, m[1]);
  if (!f.endsWith('.html')) continue;
  for (const m of text.matchAll(attrRe)) {
    const v = decode(m[1]);
    if (/^\/(?!\/)/.test(v)) { checkPath(where, v); continue; }
    // A relative link resolves against /x/ and against /x differently.
    if (/^\s(?:href|src|action)=/i.test(m[0]) && v && !/^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(v)) {
      fail.push(`${where} carries a relative link "${v}" — it resolves differently at /x and /x/; write it root-relative`);
    }
  }
}
for (const [k, where] of offenders) {
  const list = [...where];
  fail.push(`${k}  (${list.length} file${list.length === 1 ? '' : 's'}: ${list.slice(0, 4).join(', ')}${list.length > 4 ? ', …' : ''})`);
}

// ---- 4. The platform enforces the choice.
const canonPaths = htmlFiles
  .filter((f) => !/^(404|500)\.html$/.test(rel(f)) && canonicalOf(f))
  .map((f) => new URL(canonicalOf(f)).pathname)
  .filter((p) => p !== '/');
const slashed = canonPaths.filter((p) => p.endsWith('/'));
if (slashed.length && slashed.length !== canonPaths.length) {
  fail.push(`canonicals disagree on the trailing slash: ${slashed.length} with, ${canonPaths.length - slashed.length} without`);
} else if (canonPaths.length) {
  const form = slashed.length ? 'always' : 'never';
  const sample = canonPaths.find((p) => !/\.\w+$/.test(p));
  const other = form === 'never' ? sample + '/' : sample.replace(/\/$/, '');
  let enforced = false;
  const vjson = fs.existsSync('vercel.json') ? JSON.parse(fs.readFileSync('vercel.json', 'utf8')) : {};
  if (vjson.trailingSlash === (form === 'always')) enforced = true;
  const cfgPath = path.join(ROOT, '..', 'config.json');
  if (!enforced && fs.existsSync(cfgPath)) {
    for (const r of JSON.parse(fs.readFileSync(cfgPath, 'utf8')).routes || []) {
      if (r.handle === 'filesystem') break; // only routes ahead of the filesystem see a file that exists
      if (!r.src || ![301, 308].includes(r.status)) continue;
      const loc = r.headers && (r.headers.Location || r.headers.location);
      const re = new RegExp(r.src);
      const m = other.match(re);
      if (!m || !loc) continue;
      if (re.test('/') || re.test(sample)) {
        fail.push(`the redirect route ${r.src} also matches "/" or the canonical ${sample} — that is a loop`);
        continue;
      }
      if (loc.replace(/\$(\d)/g, (_, i) => m[+i] ?? '') === sample) enforced = true;
    }
  }
  if (!enforced) {
    fail.push(
      `canonicals are ${form === 'never' ? 'WITHOUT' : 'WITH'} the trailing slash, but nothing redirects ${other} to ${sample}: ` +
      `both answer 200 and only a hint separates them. Set trailingSlash: '${form}' in astro.config.mjs ` +
      `(the Vercel adapter then emits a 308) — not in vercel.json as well, the adapter warns against both.`,
    );
  }
}

if (fail.length) {
  console.error('check-canonical: the build names its pages in more than one form\n');
  for (const f of fail) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}
console.log(`check-canonical: ${pages} pages self-canonical, ${locs} sitemap URLs and ${refs} same-origin page references all in canonical form, non-canonical form redirected`);
