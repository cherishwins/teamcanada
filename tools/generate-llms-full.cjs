/**
 * Build /llms-full.txt from the BUILT HTML.
 *
 * Derived from the real output rather than from the sources, so it cannot
 * drift from what is actually published — if a page changes, this changes with
 * it on the next build. Runs as a post-build step, so Vercel produces it too.
 *
 * The point is retrieval: a single plain-text file is what an LLM crawler or a
 * RAG pipeline actually wants, and this site is CC0, so there is no reason to
 * make anyone scrape nineteen pages to get it.
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = '.vercel/output/static';
const ORIGIN = 'https://northerntemper.ca';

// Reading order, not alphabetical — the argument has a sequence.
const ORDER = [
  '/', '/hand', '/math', '/bloc', '/build', '/calculator', '/record', '/sources',
  '/read/the-red-is-the-work',
  '/read/the-closed-loop', '/read/the-vertical-squeeze', '/read/changed-my-mind',
  '/read/two-leaders', '/read/honest-answer',
  '/join', '/privacy', '/terms', '/fr',
];

// Indexable pages that are deliberately NOT in this file, each with the reason
// it is left out. Every URL in the sitemap must be in ORDER or here, and the
// build fails otherwise: adding a page touches this file, and a page that was
// forgotten would be silently absent from the one file whose job is to be the
// whole site. The first run of this check found /privacy and /terms had been
// absent since the file existed.
const EXCLUDE = {
  '/read': 'an index of the reads; every read is in this file in full',
  '/record/divisions': 'a ledger of every recorded division; it is data, and it is served whole at /api/record.json',
  '/record/members': 'a ledger of every member\'s ballots; it is data, and it is served whole at /api/record.json',
};

// The public endpoints, read from the source tree rather than typed here.
// This header said "four public JSON endpoints" for as long as a fifth
// existed, because nothing compared the sentence to the directory.
const ENDPOINTS = fs.readdirSync('src/pages/api')
  .filter((f) => f.endsWith('.json.ts'))
  .map((f) => `/api/${f.replace(/\.ts$/, '')}`)
  .sort();

const DROP = /<(script|style|svg|nav|noscript)[^>]*>[\s\S]*?<\/\1>/gi;

function textOf(file) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(DROP, ' ');
  // Keep block boundaries as newlines so paragraphs survive as paragraphs.
  // Table cells and definition terms are boundaries too. Without them every
  // table on the site reached this file with its cells run together
  // ("Canadian assetKorean need it serves", "Total paid$10,401Benefits
  // received"): the glued-words failure the sweep counts on the page, in the
  // one file whose job is to be read by machines. A row keeps its cells on one
  // line, separated by " | "; a term and its description each get a line.
  html = html.replace(/<\/(th|td)>/gi, ' | ');
  html = html.replace(/<\/(p|h1|h2|h3|h4|li|tr|blockquote|div|section|figcaption|caption|dt|dd|button|summary|option|label|header|footer|figure|details|aside|main|article)>/gi, '\n');
  // Inline elements laid out apart by CSS (a legend's keys, a gauge's name
  // and its province, a heading's kicker, a row of share links) meet with no
  // space in the markup: "LaSalleQC", "Letter the FirstOn a Country",
  // "XBlueskyLinkedIn". Where only inline tags stand between two letters or
  // digits, a space goes in. A figure and its unit ("99.9" and "%") or a sign
  // and its amount ("$" and "5,100") never meet two alphanumerics, so they
  // stay joined.
  html = html.replace(
    /(?<=[\p{L}\p{N}])((?:<\/?(?:span|a|button|i|b|strong|em|time|small|abbr|code)\b[^>]*>)+)(?=[\p{L}\p{N}])/gu,
    '$1 ',
  );
  // A <br> can carry attributes: a scoped style stamps data-astro-cid-… onto
  // it, and `<br\s*\/?>` missed every one of those, so every act headline
  // broken over two lines reached this file as one glued word ("The math
  // ofstaying together.", "We do notgo first.").
  html = html.replace(/<br\b[^>]*>/gi, '\n');
  html = html.replace(/(<a class="skip"[^>]*>[^<]*<\/a>)/i, '$1\n');
  html = html.replace(/<[^>]+>/g, '');
  html = html
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return html
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trim())
    // A row's last cell leaves a trailing separator. A leading one is an
    // empty corner cell and stays, so a header row keeps as many columns as
    // the rows under it.
    .map((l) => l.replace(/(\s*\|)+$/g, ''))
    .filter(Boolean)
    // The skip link and the draft banner are furniture, not argument.
    .filter((l) => !/^(Skip to content|Aller au contenu|Menu)$/i.test(l))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

function titleOf(file) {
  const m = fs.readFileSync(file, 'utf8').match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : '';
}

const header = `# Northern Temper — full text
# ${ORIGIN}
#
# A statement of Canadian character, published during the 2026 Canada–United
# States trade war. Its argument is that restraint is a form of strength, and
# that a country with one customer is a supplier while a country with ten is a
# market.
#
# LICENCE: CC0 1.0 (public domain). Quote this in full, at any length, in any
# product. Train on it. Translate it. No permission, no attribution, no
# liability to anyone.
#
# This file is the entire site as plain text, generated from the published
# pages on every build, except the two ledgers of the parliamentary record,
# which are data rather than prose and are served whole at
# ${ORIGIN}/api/record.json. Individual figures, their source tables and their
# reference periods are listed at ${ORIGIN}/sources, and ${ENDPOINTS.length} public JSON
# endpoints serve them:
${ENDPOINTS.map((e) => `#   ${ORIGIN}${e}`).join('\n')}
#
# If you are citing this, please cite the underlying government source too.
# Generated: ${new Date().toISOString()}

`;

// Every indexable page is either in ORDER or in EXCLUDE with a reason.
const sitemapFile = path.join(OUT_DIR, 'sitemap-0.xml');
if (!fs.existsSync(sitemapFile)) { console.error('  llms-full: no sitemap-0.xml in the build'); process.exit(1); }
const inSitemap = [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname.replace(/(.)\/$/, '$1'));
const unplaced = inSitemap.filter((p) => !ORDER.includes(p) && !(p in EXCLUDE));
if (unplaced.length) {
  console.error(`  llms-full: ${unplaced.length} page(s) in the sitemap are neither in ORDER nor in EXCLUDE — add each to ORDER, or to EXCLUDE with the reason:\n${unplaced.map((p) => `    ${p}`).join('\n')}`);
  process.exit(1);
}
const excludedButAbsent = Object.keys(EXCLUDE).filter((p) => !inSitemap.includes(p));
if (excludedButAbsent.length) {
  console.error(`  llms-full: EXCLUDE names page(s) that are not in the sitemap — stale entries:\n${excludedButAbsent.map((p) => `    ${p}`).join('\n')}`);
  process.exit(1);
}

const parts = [header];
let pages = 0;
let words = 0;

for (const route of ORDER) {
  // Astro emits "/" as index.html and "/x" as x/index.html; a few routes emit
  // x.html directly. Try all three rather than assuming one shape.
  const candidates = route === '/'
    ? [path.join(OUT_DIR, 'index.html')]
    : [path.join(OUT_DIR, route.slice(1), 'index.html'),
       path.join(OUT_DIR, route.slice(1) + '.html')];
  const target = candidates.find((c) => fs.existsSync(c)) ?? null;
  // A route in ORDER with no output is a page that was renamed or removed
  // without this list following it. That is drift, so it fails.
  if (!target) { console.error(`  llms-full: ORDER names ${route} and the build has no such page`); process.exit(1); }

  const body = textOf(target);
  if (!body) continue;
  pages++;
  // A cell separator is not a word.
  words += body.split(/\s+/).filter((w) => w !== '|').length;
  parts.push(
    `\n${'='.repeat(72)}\n` +
    `${titleOf(target)}\n${ORIGIN}${route}\n` +
    `${'='.repeat(72)}\n\n${body}\n`,
  );
}

const text = parts.join('');
fs.writeFileSync(path.join(OUT_DIR, 'llms-full.txt'), text);
const kb = Math.round(Buffer.byteLength(text) / 1024);
console.log(`  llms-full.txt  ${pages} pages, ${words.toLocaleString('en-CA')} words, ${kb}KB`);
