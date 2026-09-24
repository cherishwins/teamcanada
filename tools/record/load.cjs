/**
 * compute() from src/lib/record.ts, for the CommonJS tools.
 *
 * The site's math lives in exactly one file, src/lib/record.ts, and the page,
 * the endpoint, the report and the share card all call it. This bundles that
 * TypeScript module with esbuild (present transitively via Astro; it never
 * reaches a page) so a Node script can call the same compute() rather than
 * carrying a second copy of the method. This repo has watched a number typed
 * twice disagree with itself; a method typed twice would do the same, more
 * quietly.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const esbuild = require('esbuild');

let cached = null;

module.exports = function loadRecord() {
  if (cached) return cached;
  const out = path.join(os.tmpdir(), `nt-record-${process.pid}.cjs`);
  esbuild.buildSync({
    entryPoints: [path.join(__dirname, '..', '..', 'src', 'lib', 'record.ts')],
    bundle: true, platform: 'node', format: 'cjs', outfile: out,
    loader: { '.json': 'json' }, logLevel: 'error',
  });
  const { compute } = require(out);
  fs.unlinkSync(out);
  cached = compute();
  return cached;
};
