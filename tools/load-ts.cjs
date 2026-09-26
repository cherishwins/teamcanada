/**
 * A module from src/lib, for the CommonJS tools.
 *
 * The site writes each fact once, in TypeScript under src/lib: the record's
 * math in record.ts, the reads in reads.ts. The pages import those modules;
 * the tools are plain CommonJS and cannot. Rather than carry a second copy (a
 * number typed twice on this site has disagreed with itself, and a method
 * typed twice would do the same, more quietly), this bundles the module with
 * esbuild, a declared devDependency that never reaches a page, and returns
 * its exports.
 *
 *   const { READS } = require('./load-ts.cjs')('reads');
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const esbuild = require('esbuild');

const cache = new Map();

module.exports = function loadTs(name) {
  if (cache.has(name)) return cache.get(name);
  const out = path.join(os.tmpdir(), `nt-${name}-${process.pid}.cjs`);
  esbuild.buildSync({
    entryPoints: [path.join(__dirname, '..', 'src', 'lib', `${name}.ts`)],
    bundle: true, platform: 'node', format: 'cjs', outfile: out,
    loader: { '.json': 'json' }, logLevel: 'error',
  });
  const mod = require(out);
  fs.unlinkSync(out);
  cache.set(name, mod);
  return mod;
};
