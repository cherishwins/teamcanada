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
 *
 *   3. ai.txt NAMES EVERY ENDPOINT, AND ONLY REAL ONES. ai.txt is the other
 *      hand-written file machines are told to trust, and it said "four public
 *      JSON endpoints" and listed four while six shipped — the third time a
 *      typed endpoint count drifted on this site (/sources and llms-full.txt
 *      were the first two). Its `Data:` lines must equal src/pages/api, both
 *      ways.
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

// ---- 3. ai.txt lists exactly the endpoints the site serves.
const AI = path.join(path.dirname(FILE), 'ai.txt');
const API = path.join('src', 'pages', 'api');
let endpoints = 0;
if (!fs.existsSync(AI)) {
  fail.push(`${AI} not found`);
} else if (fs.existsSync(API)) {
  const listed = new Set([...fs.readFileSync(AI, 'utf8').matchAll(/^Data:\s*\S*?(\/api\/[^\s]+)\s*$/gm)].map((m) => m[1]));
  const served = new Set(fs.readdirSync(API).filter((f) => /\.json\.[cm]?[jt]s$/.test(f)).map((f) => '/api/' + f.replace(/\.[cm]?[jt]s$/, '')));
  endpoints = served.size;
  for (const e of served) if (!listed.has(e)) fail.push(`ai.txt: no "Data:" line for ${e}, which the site serves`);
  for (const e of listed) if (!served.has(e)) fail.push(`ai.txt: "Data:" names ${e}, which the site does not serve`);
  if (/\b(two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(public\s+)?(JSON\s+)?endpoints\b/i.test(fs.readFileSync(AI, 'utf8'))) {
    fail.push('ai.txt: states a count of endpoints in prose — list them as Data: lines instead; a typed count drifts');
  }
}

if (fail.length) {
  console.error(`\ncheck-llms: ${fail.length} issue(s) in ${FILE}\n`);
  for (const f of fail) console.error('  ' + f);
  console.error('');
  process.exit(1);
}
const sections = (text.match(/^## /gm) || []).length;
const links = (text.match(/^[-*] \[[^\]]+\]\([^)]+\)/gm) || []).length;
console.log(`check-llms: ${FILE} — H1 ok, ${sections} sections, ${links} links, 0 restated figures; ai.txt lists all ${endpoints} endpoints`);
