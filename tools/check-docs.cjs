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

// Only backticked paths rooted at a real top-level directory. Prose like
// `npm run build` or a bare filename is not a path claim and is left alone.
const ROOTS = ['src/', 'tools/', 'public/', '.github/', 'legacy/'];
const missing = [];
const seen = new Set();

for (const m of text.matchAll(/`([A-Za-z0-9_.@/-]+)`/g)) {
  const p = m[1];
  if (!ROOTS.some((r) => p.startsWith(r))) continue;
  if (seen.has(p)) continue;
  seen.add(p);
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
console.log(`check-docs: ${DOC} — ${seen.size} paths, all present`);
