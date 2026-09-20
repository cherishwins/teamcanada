#!/usr/bin/env node
/**
 * /privacy must name exactly the analytics vendors the site actually ships.
 *
 * This exists because of a real failure, the fourth of its kind in this repo.
 * A one-click Vercel dashboard integration opened a PR that set
 * `webAnalytics: { enabled: true }`, it was merged, and the site shipped a
 * second analytics vendor while /privacy went on saying "one provider, not
 * several". Every other drift this repo has caught was in a note or a
 * generated-adjacent file. This one was a false statement on the privacy
 * policy of a site whose entire claim is that what it says is checkable.
 *
 * Two things made it invisible, and both are the point of this file:
 *
 *   1. Vercel injects /_vercel/insights/script.js at DEPLOY time. It is not in
 *      the local build output, so `tools/verify.cjs` — which sweeps every page
 *      for everything else — cannot see it, and never could. The built HTML is
 *      not evidence here. The CONFIG is the only evidence a build has.
 *
 *   2. The disclosure is hand-written prose. Nothing regenerated it, so
 *      nothing corrected it.
 *
 * So this check reads both sides and refuses a disagreement. It deliberately
 * takes NO position on which vendors should be enabled — that is the owner's
 * call and it can change. It only insists that the page and the deployment
 * tell the same story. Either answer passes, as long as /privacy is honest.
 *
 * Adding a vendor? Add it to VENDORS with a detector, and /privacy must name
 * it or the build fails.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.vercel/output/static';
const CONFIG = 'astro.config.mjs';
const PAGE = path.join(ROOT, 'privacy', 'index.html');

const fail = [];

for (const f of [CONFIG, PAGE]) {
  if (!fs.existsSync(f)) {
    console.error(`check-privacy: ${f} not found — run \`astro build\` first`);
    process.exit(1);
  }
}

const config = fs.readFileSync(CONFIG, 'utf8');

/**
 * Read a built page as PROSE, not as markup.
 *
 * Matching a vendor name against raw HTML looks fine and is quietly wrong:
 * Astro stamps `data-astro-cid-…` onto every styled tag, and a name split by
 * markup — `<strong>Vercel</strong> Web Analytics` — reads correctly to a
 * human and fails `includes()` silently. A check that cannot fail is worse
 * than no check, so the page is flattened to text first. The first draft of
 * this file skipped that step, and its own negative test passed while
 * asserting nothing.
 */
function text(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x27|#39|apos);/g, "'")
    .replace(/&(nbsp|#160);/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

const page = text(fs.readFileSync(PAGE, 'utf8'));
// Any page carries the site-wide scripts; index is the cheapest witness.
const home = fs.existsSync(path.join(ROOT, 'index.html'))
  ? fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
  : '';

/**
 * Every analytics vendor this site knows how to ship.
 *
 * `detect` answers "is this actually on the deployed page", and where it reads
 * the answer from matters: a vendor injected by the platform is invisible in
 * `html` and must be detected from `config`, and only from `config`.
 */
const VENDORS = [
  {
    name: 'Umami',
    // A plain <script src> written by src/layouts/Base.astro, so the built
    // HTML is the truth and the config knows nothing about it.
    detect: ({ html }) => /cloud\.umami\.is\/script\.js/.test(html),
    where: 'src/layouts/Base.astro',
  },
  {
    name: 'Vercel Web Analytics',
    // Read from BOTH sides, because they are different claims and they can
    // disagree. The adapter writes <script src="/_vercel/insights/script.js">
    // into every page at build time — so the tag IS in the local output, even
    // though the file behind it only exists on Vercel's edge. The HTML is
    // therefore real evidence of what ships; the config is what a human edits.
    // Either one alone is enough to require disclosure, and a disagreement
    // between them is itself reported below.
    detect: ({ config: c, html }) => flagOn(c) || /\/_vercel\/insights\/script\.js/.test(html),
    where: 'astro.config.mjs (adapter: vercel({ webAnalytics }))',
  },
];

// The config documents the trade-off in prose above the flag, and that prose
// contains the words `enabled: true`. Strip comments before matching or the
// explanation of the decision reads as the decision.
const flagOn = (c) => /webAnalytics\s*:\s*\{[^}]*\benabled\s*:\s*true/.test(stripComments(c));

/**
 * ORDER MATTERS, and getting it wrong cost a red build.
 *
 * This stripped block comments first. A `//` line elsewhere in the config
 * happened to contain the two characters that CLOSE a block comment, the
 * non-greedy block regex paired an earlier `/*` with that stray sequence, and
 * everything after it survived misaligned — so `webAnalytics: { enabled: true }`
 * stopped matching and this checker reported analytics as OFF while it was on.
 * A false alarm, but a loud one, and a checker nobody trusts is a checker
 * nobody keeps.
 *
 * Line comments go first now: whatever a `//` line contains is gone before
 * block pairing ever looks at it.
 */
function stripComments(src) {
  return src.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

// A tag in the HTML with the flag off, or the flag on with no tag, means the
// build output and the config have come apart — which is the state where every
// other check here is reasoning from the wrong evidence.
const tagPresent = /\/_vercel\/insights\/script\.js/.test(home);
if (home && flagOn(config) !== tagPresent) {
  fail.push(
    `astro.config.mjs says webAnalytics is ${flagOn(config) ? 'ON' : 'OFF'} but the built HTML ` +
      `${tagPresent ? 'does' : 'does not'} carry /_vercel/insights/script.js — rebuild, or reconcile the two.`,
  );
}

const enabled = [];
const disabled = [];
for (const v of VENDORS) {
  (v.detect({ config, html: home }) ? enabled : disabled).push(v);
}

// ---- 1. Every shipped vendor is named on /privacy.
for (const v of enabled) {
  if (!page.includes(v.name)) {
    fail.push(
      `${v.name} ships on every page (per ${v.where}) but /privacy never names it. ` +
        `Readers are entitled to the list, and this page is the list.`,
    );
  }
}

// ---- 2. Nothing is disclosed that is not actually shipped.
// Over-disclosure is a smaller sin than under-disclosure, but it is still a
// false statement, and it is how a page ends up naming a vendor removed years
// ago. Matched on the full vendor name so "Vercel" in the hosting section —
// which is about the host, not the analytics — does not trip it.
for (const v of disabled) {
  if (page.includes(v.name)) {
    fail.push(
      `/privacy names ${v.name}, but it is not enabled (${v.where}). ` +
        `Remove the disclosure or re-enable the vendor.`,
    );
  }
}

// ---- 3. The count claim must match the count.
// "one provider, not several" was literally true for a year and became false
// in a single merged commit without a word of the page changing.
const singular = /\bone provider\b|\bone analytics provider\b|\ba single provider\b/i;
if (enabled.length > 1 && singular.test(page)) {
  fail.push(
    `/privacy still claims a single analytics provider, but ${enabled.length} are enabled ` +
      `(${enabled.map((v) => v.name).join(', ')}).`,
  );
}

// ---- 4. No undisclosed third-party script may reach a page.
// The vendor list above only catches what this file already knows about. This
// catches the next integration nobody wrote a detector for. That is the actual
// recurring risk here — a widget arrives through a dashboard, not through a
// code review.
//
// TWO PLACES, because the first draft only looked at one and would have missed
// the very vendor that prompted this file. Vercel Web Analytics does NOT ship a
// <script src> tag: the adapter writes an INLINE bootstrap that does
// `script.src = '/_vercel/insights/script.js'` and appends it to <head> at
// runtime. It happens to be same-origin so it would not have tripped this check
// either way, but almost every third-party snippet on the web has that exact
// shape — an inline loader that fetches the real payload. A scan that only
// reads src attributes is blind to all of them.
//
// Checked against the live site when this was written: no executable inline
// script on any page contains an absolute URL, so flagging every off-allowlist
// one is precise rather than noisy. JSON-LD is skipped — it is data the browser
// never executes, and it legitimately cites schema.org.
const ALLOWED_ORIGINS = ['https://cloud.umami.is'];
const thirdParty = new Set();
for (const file of walk(ROOT).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const where = path.relative(ROOT, file);

  for (const m of html.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)["']/gi)) {
    const origin = new URL(m[1]).origin;
    if (!ALLOWED_ORIGINS.includes(origin)) thirdParty.add(`${origin} — <script src> in ${where}`);
  }

  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/ld\+json/i.test(m[1])) continue;
    for (const u of m[2].matchAll(/https?:\/\/[^"'\s)]+/g)) {
      let origin;
      try {
        origin = new URL(u[0]).origin;
      } catch {
        continue; // not a URL we can parse; not our business
      }
      if (!ALLOWED_ORIGINS.includes(origin)) thirdParty.add(`${origin} — inline script in ${where}`);
    }
  }
}
for (const t of thirdParty) {
  fail.push(`undisclosed third-party origin: ${t} — add it to ALLOWED_ORIGINS and to /privacy, or remove it`);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

if (fail.length) {
  console.error('check-privacy: /privacy does not match what the site ships\n');
  for (const f of fail) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-privacy: ok — ${enabled.length} analytics vendor${enabled.length === 1 ? '' : 's'} ` +
    `(${enabled.map((v) => v.name).join(', ') || 'none'}), all disclosed on /privacy`,
);
