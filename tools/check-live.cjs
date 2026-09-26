#!/usr/bin/env node
/**
 * A figure never renders blank, and never passes off an old number as live.
 *
 * CLAUDE.md has stated that rule since the first live figure shipped: on
 * failure, a page shows the fallback AND says a source is not responding. In
 * September 2026 an audit found /hand, /bloc and /calculator printed their
 * fallbacks with no notice at all, and the home page said so only from a
 * client script, never in the HTML a crawler or a reader without JavaScript
 * gets. The sweep's comment claimed its 503 stubs tested this; it asserted
 * nothing, and the build ran with the network up, so no fallback was ever on
 * the page to test.
 *
 * The contract, in markup:
 *   data-live="true|false"   on anything that shows a live figure
 *   data-live-note           the note for the smallest block that holds them
 * and three checks on every built page:
 *   1. every data-live="false" has a note in its block, and the note says a
 *      source is not responding (or a gauge is not reporting);
 *   2. a block whose figures are all live carries no such notice (no false
 *      alarm, which would teach readers to ignore the real one);
 *   3. with NT_OFFLINE=1, when every upstream is down by construction, every
 *      data-live on the site is "false". verify.yml's offline-build job runs
 *      the build that way, so the fallback path is rendered and checked on
 *      every PR instead of only on the day StatCan has a bad morning.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.vercel/output/static';
const OFFLINE = process.env.NT_OFFLINE === '1';
const NOTICE = /not responding|not reporting|ne répond pas|ne transmet pas/i;

function pages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '_astro' ? [] : pages(p);
    return e.name.endsWith('.html') ? [p] : [];
  });
}

(async () => {
  const { parse, ELEMENT_NODE, TEXT_NODE } = await import('ultrahtml');
  const text = (n) => (n.type === TEXT_NODE ? n.value : (n.children || []).map(text).join(''));
  const has = (n, a) => n.type === ELEMENT_NODE && Object.prototype.hasOwnProperty.call(n.attributes || {}, a);
  const findAll = (n, pred, out = []) => {
    if (pred(n)) out.push(n);
    for (const c of n.children || []) findAll(c, pred, out);
    return out;
  };

  const problems = [];
  let flagged = 0, notes = 0, pageCount = 0;
  for (const file of pages(ROOT)) {
    const rel = path.relative(ROOT, file);
    const doc = parse(fs.readFileSync(file, 'utf8'));
    // ultrahtml gives each node its parent, which is all the nesting we need.
    const lives = findAll(doc, (n) => has(n, 'data-live'));
    if (!lives.length) continue;
    pageCount++;
    const blockOf = (n) => {
      for (let p = n; p; p = p.parent) if (findAll(p, (x) => has(x, 'data-live-note')).length) return p;
      return null;
    };
    for (const n of lives) {
      const live = n.attributes['data-live'];
      if (live !== 'true' && live !== 'false') problems.push(`${rel}: data-live="${live}" is neither true nor false`);
      if (OFFLINE && live !== 'false') problems.push(`${rel}: with every upstream down, <${n.name}> still says data-live="${live}"`);
      if (live !== 'false') continue;
      flagged++;
      const block = blockOf(n);
      const note = block && findAll(block, (x) => has(x, 'data-live-note'))[0];
      if (!note) problems.push(`${rel}: a fallback figure (<${n.name}> "${text(n).trim().slice(0, 40)}") has no note in its block`);
      else if (!NOTICE.test(text(note))) problems.push(`${rel}: a fallback figure's note does not say a source is not responding: "${text(note).trim().slice(0, 80)}"`);
    }
    for (const note of findAll(doc, (x) => has(x, 'data-live-note'))) {
      notes++;
      let block = note.parent;
      while (block && !findAll(block, (x) => has(x, 'data-live')).length) block = block.parent;
      const inBlock = block ? findAll(block, (x) => has(x, 'data-live')) : [];
      if (inBlock.length && inBlock.every((x) => x.attributes['data-live'] === 'true') && NOTICE.test(text(note))) {
        problems.push(`${rel}: every figure is live but the note says otherwise: "${text(note).trim().slice(0, 80)}"`);
      }
    }
  }

  if (problems.length) {
    console.error(`\ncheck-live: ${problems.length} problem(s)\n`);
    for (const p of problems) console.error(`  ✗ ${p}`);
    console.error('');
    process.exit(1);
  }
  console.log(`check-live: ${pageCount} pages with live figures, ${flagged} on fallback, every one noted${OFFLINE ? ' (offline build: all upstreams down, all fallbacks rendered)' : ''}`);
})().catch((e) => { console.error('check-live:', e); process.exit(1); });
