#!/usr/bin/env node
/**
 * llms.txt validator, run in the build.
 *
 * This file exists because of a real failure, not a hypothetical one. When the
 * water claim was replaced, every generated surface updated itself — /,  /fr,
 * /sources and llms-full.txt are all built from live data or from the published
 * HTML, so none of them could drift. llms.txt is hand-written, and it kept
 * asserting the retired 11:1 ratio as fact for a day, on the one file whose
 * entire job is to be read and quoted by machines. Google PageSpeed's agentic
 * browsing audit is what surfaced it.
 *
 * Two checks, both cheap:
 *
 *   1. SHAPE — llmstxt.org requires an H1 first, an optional blockquote, then
 *      H2-delimited sections whose lists are markdown links, `- [name](url)`,
 *      optionally followed by `: notes`. A bare path in backticks does not
 *      parse as a link and the file is silently less useful than it looks.
 *
 *   2. NO LIVE FIGURES. The rule this file now follows is link, do not restate:
 *      a static copy of a live number is a number that will eventually be
 *      wrong. So per-capita water figures and any ratio phrased as "N:1" are
 *      refused outright, and the retired pair is named explicitly so it can
 *      never reappear.
 */
const fs = require('fs');
const path = require('path');

const FILE = process.argv[2] || path.join('public', 'llms.txt');

if (!fs.existsSync(FILE)) {
  console.error(`check-llms: ${FILE} not found`);
  process.exit(1);
}
const text = fs.readFileSync(FILE, 'utf8');
const lines = text.split('\n');
const fail = [];

// ---- 1. Shape.
const firstContent = lines.find((l) => l.trim() !== '');
if (!firstContent || !/^# \S/.test(firstContent)) {
  fail.push('must open with an H1 naming the project (llmstxt.org: the only required section)');
}

let section = null;
lines.forEach((line, i) => {
  const h2 = line.match(/^## (.+)$/);
  if (h2) { section = h2[1].trim(); return; }
  // Only list items inside an H2 section are "file lists" and must be links.
  if (section && /^[-*] /.test(line)) {
    const isLink = /^[-*] \[[^\]]+\]\([^)]+\)(:|$)/.test(line);
    // A section may legitimately carry a plain prose list (standing facts, key
    // statements). Those are allowed; what is not allowed is a list that LOOKS
    // like a file list — a bare path or URL — without being a markdown link.
    const looksLikeAPath = /^[-*] [`"']?(\/|https?:\/\/)/.test(line);
    if (looksLikeAPath && !isLink) {
      fail.push(`line ${i + 1}: list item points at a path but is not a markdown link — ${line.trim().slice(0, 64)}`);
    }
  }
});

// ---- 2. No live figures restated.
const BANNED = [
  { re: /109[,\s]?837/, why: 'the retired Canadian per-capita water figure' },
  { re: /\b9[,\s]?980\b/, why: 'the retired US per-capita water figure' },
  { re: /\b\d{1,3}\s?:\s?1\b/, why: 'a hard-coded ratio — link to /api/water.json instead' },
  { re: /\b\d{2,3},\d{3}\s?m³/, why: 'a per-capita water figure — link to /api/water.json instead' },
];
lines.forEach((line, i) => {
  // The correction note is allowed to NAME the retired claim in words; it just
  // cannot restate the numbers.
  for (const b of BANNED) {
    if (b.re.test(line)) fail.push(`line ${i + 1}: ${b.why} — ${line.trim().slice(0, 64)}`);
  }
});

if (fail.length) {
  console.error(`\ncheck-llms: ${fail.length} issue(s) in ${FILE}\n`);
  for (const f of fail) console.error('  ' + f);
  console.error('');
  process.exit(1);
}
const sections = (text.match(/^## /gm) || []).length;
const links = (text.match(/^[-*] \[[^\]]+\]\([^)]+\)/gm) || []).length;
console.log(`check-llms: ${FILE} — H1 ok, ${sections} sections, ${links} links, 0 restated figures`);
