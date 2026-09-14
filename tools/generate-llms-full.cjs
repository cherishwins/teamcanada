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
  '/', '/hand', '/math', '/bloc', '/build', '/calculator', '/sources',
  '/read/the-closed-loop', '/read/the-vertical-squeeze', '/read/changed-my-mind',
  '/read/two-leaders', '/read/honest-answer',
  '/join', '/fr',
];

const DROP = /<(script|style|svg|nav|noscript)[^>]*>[\s\S]*?<\/\1>/gi;

function textOf(file) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(DROP, ' ');
  // Keep block boundaries as newlines so paragraphs survive as paragraphs.
  html = html.replace(/<\/(p|h1|h2|h3|h4|li|tr|blockquote|div|section|figcaption)>/gi, '\n');
  html = html.replace(/<br\s*\/?>/gi, '\n');
  html = html.replace(/<[^>]+>/g, '');
  html = html
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return html
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trim())
    .filter(Boolean)
    // The skip link and the draft banner are furniture, not argument.
    .filter((l) => !/^(Skip to content|Menu)$/i.test(l))
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
# pages on every build. Individual figures, their source tables and their
# reference periods are listed at ${ORIGIN}/sources, and four public JSON
# endpoints serve the live ones:
#   ${ORIGIN}/api/figures.json
#   ${ORIGIN}/api/rivers.json
#   ${ORIGIN}/api/trade.json
#   ${ORIGIN}/api/provinces.json
#
# If you are citing this, please cite the underlying government source too.
# Generated: ${new Date().toISOString()}

`;

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
  if (!target) { console.warn(`  llms-full: no output for ${route}`); continue; }

  const body = textOf(target);
  if (!body) continue;
  pages++;
  words += body.split(/\s+/).length;
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
