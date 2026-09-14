#!/usr/bin/env node
/**
 * CLAUDE.md names real files. Verified, not assumed.
 *
 * This is the third time that file has described something untrue:
 *   · it claimed a French typography pass ran, and none was in the repo;
 *   · it described a console-error filter the sweep does not have;
 *   · it pointed at src/lib/og-alt.json for a commit after the rename.
 *
 * Each was found by accident. A path is the cheapest kind of claim to check —
 * either the file is there or it is not — so check it in the build and stop
 * finding these by luck. This does not verify that the PROSE is true; nothing
 * can. It verifies the one part that a machine can settle.
 */
const fs = require('fs');
const path = require('path');

const DOC = process.argv[2] || 'CLAUDE.md';
const text = fs.readFileSync(DOC, 'utf8');
const IGNORED = ignoredPrefixes();

// Only backticked paths rooted at a real top-level directory. Prose like
// `npm run build` or a bare filename is not a path claim and is left alone.
const ROOTS = ['src/', 'tools/', 'public/', '.github/', 'legacy/'];

/**
 * Paths the deploy does not receive are not this check's business.
 *
 * `.vercelignore` keeps legacy/, source-material/ and notes/ out of the upload,
 * so on Vercel those directories genuinely do not exist — and the first version
 * of this file failed the production build for saying they should. The check
 * passed locally and broke in the only environment that mattered, which is the
 * same shape of mistake as hardcoding a sandbox path into verify.cjs.
 *
 * Read the ignore file rather than hardcoding an exception, so this stays true
 * if the ignore list changes. Skips are PRINTED, never silent: a check that
 * quietly stops checking things is worse than one that never checked them.
 */
function ignoredPrefixes() {
  const f = path.join(path.dirname(DOC), '.vercelignore');
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => (l.endsWith('/') ? l : l + '/'));
}

const missing = [];
const skipped = [];
const seen = new Set();

for (const m of text.matchAll(/`([A-Za-z0-9_.@/-]+)`/g)) {
  const p = m[1];
  if (!ROOTS.some((r) => p.startsWith(r))) continue;
  if (seen.has(p)) continue;
  seen.add(p);
  if (IGNORED.some((ig) => p === ig.slice(0, -1) || p.startsWith(ig))) { skipped.push(p); continue; }
  // A glob stands for its directory: src/styles/tokens/*.css -> src/styles/tokens
  const probe = p.includes('*') ? path.dirname(p) : p;
  if (!fs.existsSync(probe)) missing.push(p);
}

if (missing.length) {
  console.error(`\ncheck-docs: ${DOC} names ${missing.length} path(s) that do not exist\n`);
  for (const p of missing) console.error('  ' + p);
  console.error('\nRename or remove them. A file that documents the wrong filename is worse');
  console.error('than one that documents nothing — it sends the next reader somewhere empty.\n');
  process.exit(1);
}
const note = skipped.length
  ? ` (${skipped.length} not checked — .vercelignore keeps them out of the deploy: ${skipped.join(', ')})`
  : '';
console.log(`check-docs: ${DOC} — ${seen.size - skipped.length} paths present${note}`);
