/**
 * compute() from src/lib/record.ts, for the CommonJS tools.
 *
 * The site's math lives in exactly one file, src/lib/record.ts, and the page,
 * the endpoint, the report and the share card all call it. This hands a Node
 * script the same compute() (bundled by tools/load-ts.cjs) rather than a
 * second copy of the method.
 */
const loadTs = require('../load-ts.cjs');

let cached = null;

module.exports = function loadRecord() {
  if (!cached) cached = loadTs('record').compute();
  return cached;
};
