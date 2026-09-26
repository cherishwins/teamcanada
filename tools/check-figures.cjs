#!/usr/bin/env node
/**
 * Hand-entered figures: no stale ones, and no second copy.
 *
 * `src/lib/figures.ts` is the one place a typed number on this site is written.
 * This checker enforces the two things that file cannot enforce about itself.
 *
 *   1. FRESHNESS. A figure whose publisher runs on a cycle carries `reviewBy`.
 *      Once that date passes the build FAILS, printing the note that says what
 *      to replace it with. This is the whole point: a number that comes out of
 *      a document instead of an endpoint cannot refresh itself, and "somebody
 *      will remember" is not a mechanism. The federal accumulated deficit is
 *      the live case — Public Accounts is tabled each autumn, there is no
 *      key-free endpoint for it, and nothing else in this repo would notice
 *      the day it is superseded.
 *
 *   2. NO SECOND COPY, in the specific form this site actually produced.
 *      The federal debt was typed three times: a raw constant in the
 *      calculator, and the string `$1,266B` in /math and /sources. The
 *      calculator interpolated its constant and rendered **`$1266B`** — the
 *      same figure printed two ways, on the site whose argument is that its
 *      figures are checkable. So for every figure whose `display` groups
 *      thousands with commas, the UNGROUPED spelling must not appear in any
 *      page's prose. Re-typing the raw number anywhere puts it back, and the
 *      build says so.
 *
 *   3. COUNTED, NOT ESTIMATED. Each read's length is written once, in
 *      src/lib/reads.ts, and /read, the Article markup and the /read share card
 *      all print it. Typed by hand, the lengths drifted up to 6% from the
 *      articles they described. This counts each built article (the text of
 *      `article.body`, less anything aria-hidden, every whitespace-separated
 *      token with a letter or digit in it) and fails unless `words` is exactly
 *      that count, printing the number to write.
 *
 * The first two read the built HTML as TEXT, not markup — `data-pop="1266092"`
 * and the calculator's inline JSON both legitimately contain raw digits, and a
 * check that tripped on those would be turned off within a week.
 */
const fs = require('fs');
const path = require('path');

// --ahead N: fail on a review date within the next N days, not only one that
// has passed. The weekly job runs it with 30, so the owner hears about a figure
// a month before the build starts failing on it, not the morning it does.
const args = process.argv.slice(2);
const aheadAt = args.indexOf('--ahead');
const AHEAD = aheadAt >= 0 ? Number(args[aheadAt + 1]) || 0 : 0;
const ROOT = args.find((a, i) => !a.startsWith('--') && i !== aheadAt + 1) || '.vercel/output/static';
const SRC = path.join('src', 'lib', 'figures.ts');

for (const f of [SRC, ROOT]) {
  if (!fs.existsSync(f)) {
    console.error(`check-figures: ${f} not found — run \`astro build\` first`);
    process.exit(1);
  }
}

const src = fs.readFileSync(SRC, 'utf8');
const fail = [];

/**
 * Pull `display` / `reviewBy` / `reviewNote` out of the module.
 *
 * This reads the file as text rather than importing it, because the checker is
 * plain CommonJS and the module is TypeScript. That is only safe while the
 * file stays as flat as it is — so the parse asserts it found something. A
 * regex that silently matches nothing is the failure mode this repo already
 * hit once, in the first draft of check-privacy: a checker that cannot fail is
 * worse than no checker, because it is trusted.
 */
const displays = [...src.matchAll(/\bdisplay:\s*'([^']+)'/g)].map((m) => m[1]);
const reviews = [...src.matchAll(/\breviewBy:\s*'(\d{4}-\d{2}-\d{2})'/g)].map((m) => ({
  date: m[1],
  at: m.index ?? 0,
}));

if (displays.length === 0) {
  console.error(`check-figures: parsed 0 figures out of ${SRC} — the file's shape changed and this checker went blind. Fix the parse, do not delete the check.`);
  process.exit(1);
}

// ---- 1. Freshness.
const today = new Date(Date.now() + AHEAD * 86_400_000).toISOString().slice(0, 10);
for (const r of reviews) {
  if (r.date >= today) continue;
  if (AHEAD && r.date >= new Date().toISOString().slice(0, 10)) {
    const after = src.slice(r.at);
    const note = after.match(/reviewNote:\s*\n?\s*'([^']+)'/);
    fail.push(`a figure's reviewBy date (${r.date}) is within ${AHEAD} days; the build fails on it the day after.\n      ${note ? note[1] : ''}`);
    continue;
  }
  // The note lives just after its reviewBy; take the next one in the file.
  const after = src.slice(r.at);
  const note = after.match(/reviewNote:\s*\n?\s*'([^']+)'/);
  fail.push(
    `a figure's reviewBy date (${r.date}) has passed — re-check it against its source.\n` +
      `      ${note ? note[1] : 'No reviewNote was left. Add one when you update it.'}`,
  );
}

// ---- 2. No ungrouped second copy in any page's prose.
function text(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(nbsp|#160);/g, ' ')
    .replace(/\s+/g, ' ');
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

// Only figures whose display actually groups thousands can have an ungrouped
// twin. '563' and '5% of GDP' have nothing to disagree about.
const grouped = displays
  .map((d) => ({ display: d, digits: d.match(/\d{1,3}(?:,\d{3})+/g) || [] }))
  .filter((d) => d.digits.length > 0);

const pages = walk(ROOT);
for (const file of pages) {
  const body = text(fs.readFileSync(file, 'utf8'));
  for (const g of grouped) {
    for (const d of g.digits) {
      const bare = d.replace(/,/g, '');
      // Word-bounded, so 1266 does not match inside 12660 or 1266092.
      if (new RegExp(`(?<!\\d)${bare}(?!\\d)`).test(body)) {
        fail.push(
          `${path.relative(ROOT, file)} prints "${bare}" where the one copy of this figure is "${d}" ` +
            `(from "${g.display}"). Render it from src/lib/figures.ts instead of re-typing the number.`,
        );
      }
    }
  }
}

// ---- 3. Each read's length is its count.
const BLOCK = new Set(['address', 'article', 'aside', 'blockquote', 'br', 'caption', 'dd', 'div', 'dl', 'dt',
  'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'ol', 'p',
  'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul']);

async function countReads() {
  const { parse, ELEMENT_NODE, TEXT_NODE } = await import('ultrahtml');
  const { READS } = require('./load-ts.cjs')('reads');
  const say = (n) => {
    if (n.type === TEXT_NODE) return n.value.replace(/&nbsp;|&#160;/g, ' ');
    if (n.type !== ELEMENT_NODE && n.type !== 0) return '';
    if (n.type === ELEMENT_NODE) {
      if (n.name === 'script' || n.name === 'style' || n.attributes?.['aria-hidden'] === 'true') return '';
      const inner = (n.children || []).map(say).join('');
      return BLOCK.has(n.name) ? ` ${inner} ` : inner;
    }
    return (n.children || []).map(say).join('');
  };
  const find = (n) => {
    if (n.type === ELEMENT_NODE && n.name === 'article' && /(^|\s)body(\s|$)/.test(n.attributes?.class || '')) return n;
    for (const c of n.children || []) { const f = find(c); if (f) return f; }
    return null;
  };
  if (!READS.length) fail.push('src/lib/reads.ts exported no reads — this check went blind. Fix the load, do not delete the check.');
  for (const r of READS) {
    const file = path.join(ROOT, 'read', r.slug, 'index.html');
    if (!fs.existsSync(file)) { fail.push(`read/${r.slug} is in src/lib/reads.ts but the build has no page for it`); continue; }
    const body = find(parse(fs.readFileSync(file, 'utf8')));
    if (!body) { fail.push(`read/${r.slug} has no <article class="body">; the count cannot be taken`); continue; }
    const n = say(body).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
    if (n !== r.words) fail.push(`read/${r.slug} says ${r.words.toLocaleString('en-CA')} words and its article counts ${n.toLocaleString('en-CA')}. Set words: ${n} in src/lib/reads.ts.`);
  }
  return READS.length;
}

countReads().then((reads) => {
  if (fail.length) {
    console.error('check-figures: a hand-entered figure needs attention\n');
    for (const f of fail) console.error(`  ✗ ${f}`);
    console.error('');
    process.exit(1);
  }

  const next = reviews.map((r) => r.date).sort()[0];
  console.log(
    `check-figures: ${displays.length} fixed figures, ${reviews.length} with a review date` +
      `${next ? ` (next ${next})` : ''}, no re-typed copies in ${pages.length} pages, ${reads} reads counted`,
  );
});
