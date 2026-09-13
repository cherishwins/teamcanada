#!/usr/bin/env node
/**
 * Québec French typography and framing audit, run over the BUILT HTML.
 *
 * CLAUDE.md has claimed for some time that "both are checked by a regex pass".
 * They were not: the pass lived in a session and died with it, which is very
 * likely why the punctuation regressed within one commit of being fixed. This
 * is that pass, committed, wired into `npm run build`, and failing the build.
 *
 * It audits built HTML rather than .astro source so it sees what is actually
 * served — component output, interpolated values and generated alt text all get
 * checked, and no future page can slip past it by putting its French somewhere
 * new. Only a page whose own <html lang> is French is audited.
 *
 * The rules, and one correction worth recording:
 *
 *   1. NO space before ? ! ; — this is where Canadian usage leaves France,
 *      which thin-spaces all three.
 *   2. The COLON is NOT part of that divergence. Canadian French takes a
 *      non-breaking space before ":" exactly as France does (OQLF, Banque de
 *      dépannage linguistique). An earlier note in CLAUDE.md lumped the colon
 *      in with ? ! ; — it was wrong, and a pass written to that note would have
 *      stripped four correct spaces off /fr. Require U+202F here.
 *   3. Straight ASCII ' and " in prose — the surest single tell of machine
 *      translation. Use U+2019 for elision and guillemets for quotation.
 *   4. Guillemets take an inner space, and it must be U+202F so the mark can
 *      never wrap away from the words it encloses.
 *   5. Banned framings — the 1995 federal-propaganda register. They lose the
 *      Québec reader in one line, and that reader is why the page exists.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.vercel/output/static';

const SPACES = '[ \u00a0\u202f\u2009]';

const BANNED = [
  'unité nationale', 'notre grand pays', "d'un océan à l'autre",
  'd\u2019un océan à l\u2019autre', 'un canada uni', 'la nation canadienne',
];

/** Strip markup down to prose. Attribute text is prose too, so keep its values. */
function prose(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, (t) =>
      ' ' + [...t.matchAll(/(?:alt|content|title|aria-label)="([^"]*)"/gi)]
        .map((m) => m[1]).join(' ') + ' ')
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&(?:quot|ldquo|rdquo);/g, '"')
    .replace(/&laquo;/g, '\u00ab').replace(/&raquo;/g, '\u00bb')
    .replace(/&(?:rsquo|apos);/g, '\u2019');
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const failures = [];
const fail = (file, rule, detail) => failures.push({ file, rule, detail });
/** A window of context, so a failure can be found without grepping by hand. */
const near = (s, i, r = 36) => s.slice(Math.max(0, i - r), i + r).replace(/\s+/g, ' ').trim();

if (!fs.existsSync(ROOT)) {
  console.error(`check-french: no build at ${ROOT} \u2014 run astro build first`);
  process.exit(1);
}

// "hreflang" ends in "lang", so a looser test matches every English page that
// links to /fr. Only the document's own <html lang> decides.
const files = walk(ROOT).filter((f) =>
  /<html[^>]*\slang="fr(-[A-Z]{2})?"/.test(fs.readFileSync(f, 'utf8')));

for (const file of files) {
  const text = prose(fs.readFileSync(file, 'utf8'));
  const rel = path.relative(ROOT, file);

  for (const m of text.matchAll(new RegExp(SPACES + '([?!;])', 'g')))
    fail(rel, `space before "${m[1]}" \u2014 Canadian usage takes none`, near(text, m.index));

  // Only where a word ends: colons in URLs, clock times and ratios are not prose.
  for (const m of text.matchAll(new RegExp('([A-Za-zÀ-ÿ\u2019)\u00bb])(' + SPACES + '?):(?=\\s|$)', 'g'))) {
    if (m[2] === '') fail(rel, 'missing U+202F before ":"', near(text, m.index));
    else if (m[2] !== '\u202f') fail(rel, 'wrong space before ":" (use U+202F)', near(text, m.index));
  }

  for (const m of text.matchAll(/[A-Za-zÀ-ÿ]'[A-Za-zÀ-ÿ]/g))
    fail(rel, 'straight apostrophe (use \u2019)', near(text, m.index));
  for (const m of text.matchAll(/"[^"]{2,}"/g))
    fail(rel, 'straight double quote (use \u00ab \u00bb)', near(text, m.index));

  for (const m of text.matchAll(/\u00ab(.)/g))
    if (m[1] !== '\u202f') fail(rel, 'no U+202F after \u00ab', near(text, m.index));
  for (const m of text.matchAll(/(.)\u00bb/g))
    if (m[1] !== '\u202f') fail(rel, 'no U+202F before \u00bb', near(text, m.index));

  const low = text.toLowerCase();
  for (const phrase of BANNED) {
    const i = low.indexOf(phrase);
    if (i !== -1) fail(rel, `banned framing "${phrase}"`, near(text, i));
  }
}

if (!files.length) {
  console.log('check-french: no French pages found \u2014 nothing to audit');
  process.exit(0);
}
if (failures.length) {
  console.error(`\ncheck-french: ${failures.length} issue(s) across ${files.length} French page(s)\n`);
  for (const f of failures) console.error(`  ${f.file}\n    ${f.rule}\n    \u2026${f.detail}\u2026\n`);
  process.exit(1);
}
console.log(`check-french: ${files.length} French page(s), 0 issues`);
