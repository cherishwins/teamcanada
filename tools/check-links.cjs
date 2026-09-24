#!/usr/bin/env node
/**
 * Every external link the built site cites must still resolve.
 *
 * This site's one asset is that its figures can be checked. A dead link on
 * /sources or under a read is a claim that can no longer be checked, and
 * nothing else here would notice: the sweep answers every other origin with
 * 204 on purpose, so it proves the pages work WITHOUT the outside world and
 * says nothing about whether the outside world is still there.
 *
 * Not in the build, and not on every PR. External sites go down for an hour,
 * rate-limit, or block a datacentre range, and a deploy or a review must not
 * turn red for that. It runs on a weekly schedule and on demand from
 * .github/workflows/links.yml, where a red run means "go look", not "cannot
 * ship".
 *
 * Two things learned writing it, both encoded below:
 *
 *   · Academic publishers (OUP, Wiley, Springer) refuse non-browser clients
 *     outright — 403 even with a browser User-Agent. A DOI link is checked at
 *     doi.org only: a 3xx from the resolver means the DOI is registered and
 *     points somewhere, which is the claim the link makes. Following it into
 *     the publisher's bot wall proves nothing either way.
 *   · A 403/405/429 from anyone else is "unverifiable from here", reported
 *     but not fatal. Only 404, 410, DNS failure and a 5xx that repeats are
 *     dead.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.vercel/output/static';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const OWN = /^https?:\/\/(www\.)?northerntemper\.ca(\/|$)/;

/**
 * The share band's intent links are buttons, not citations. X, Facebook and
 * Reddit answer a datacentre GET with 400/403 whatever the URL says, so
 * "fetching" them proves nothing about whether a reader's tap works — the
 * sweep covers that as a tap target. Skipped here, and counted so the skip is
 * visible in the output rather than silent.
 */
const SHARE_INTENT = /^https?:\/\/(twitter\.com|x\.com)\/intent\/|^https?:\/\/bsky\.app\/intent\/|^https?:\/\/www\.linkedin\.com\/sharing\/|^https?:\/\/www\.facebook\.com\/sharer\/|^https?:\/\/www\.reddit\.com\/submit\?/;

if (!fs.existsSync(ROOT)) {
  console.error(`check-links: ${ROOT} not found — run \`astro build\` first`);
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

/** url -> set of pages citing it. */
const links = new Map();
let intents = 0;
for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, 'utf8');
  const where = path.relative(ROOT, file).replace(/index\.html$/, '') || '/';
  for (const m of html.matchAll(/\shref=["'](https?:\/\/[^"']+)["']/gi)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (OWN.test(url)) continue;
    if (SHARE_INTENT.test(url)) { intents++; continue; }
    (links.get(url) || links.set(url, new Set()).get(url)).add(where);
  }
}

if (links.size === 0) {
  console.error('check-links: found 0 external links — the parse went blind. Fix the parse, do not delete the check.');
  process.exit(1);
}

async function probe(url, { follow }) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 25_000);
  try {
    const r = await fetch(url, {
      method: 'GET',
      redirect: follow ? 'follow' : 'manual',
      headers: { 'user-agent': UA, accept: 'text/html,*/*;q=0.8' },
      signal: ctl.signal,
    });
    return { status: r.status };
  } catch (e) {
    return { status: 0, error: e.cause?.code || e.name || String(e) };
  } finally {
    clearTimeout(t);
  }
}

async function check(url) {
  const isDoi = /^https?:\/\/(dx\.)?doi\.org\//.test(url);
  let r = await probe(url, { follow: !isDoi });
  // One retry for the failure modes that are usually the network, not the page.
  if (r.status === 0 || r.status >= 500) r = await probe(url, { follow: !isDoi });

  if (isDoi) {
    if (r.status >= 300 && r.status < 400) return { verdict: 'ok', note: 'DOI registered (resolver 3xx)' };
    if (r.status === 404) return { verdict: 'dead', note: 'DOI not registered' };
    return { verdict: 'unverifiable', note: `doi.org answered ${r.status}` };
  }
  if (r.status >= 200 && r.status < 400) return { verdict: 'ok' };
  if ([401, 403, 405, 429, 999].includes(r.status)) return { verdict: 'unverifiable', note: `${r.status} — the host refuses non-browser clients` };
  if (r.status === 404 || r.status === 410) return { verdict: 'dead', note: String(r.status) };
  return { verdict: 'dead', note: r.error ? `no response (${r.error})` : `${r.status} twice` };
}

(async () => {
  const urls = [...links.keys()].sort();
  const results = new Map();
  // Modest concurrency: this is a courtesy crawl of other people's servers.
  const queue = [...urls];
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const u = queue.shift();
      results.set(u, await check(u));
    }
  }));

  const by = { ok: [], unverifiable: [], dead: [] };
  for (const u of urls) by[results.get(u).verdict].push(u);

  for (const u of by.dead) {
    const r = results.get(u);
    console.error(`  ✗ DEAD  ${u}\n          ${r.note} · cited on ${[...links.get(u)].join(', ')}`);
  }
  for (const u of by.unverifiable) {
    console.log(`  ? ${u}\n          ${results.get(u).note}`);
  }
  console.log(
    `\ncheck-links: ${urls.length} external URLs — ${by.ok.length} ok, ` +
      `${by.unverifiable.length} unverifiable from a datacentre, ${by.dead.length} dead` +
      ` (${intents} share-intent links not fetched)`,
  );
  if (by.dead.length) process.exit(1);
})();
