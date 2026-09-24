#!/usr/bin/env node
/**
 * THE RECORD — the report, on the command line.
 *
 * Prints what src/lib/record.ts computes from the committed snapshot, with a
 * link to the official record on every number. It calls the site's own
 * compute() through tools/record/load.cjs rather than re-implementing it, so
 * the math exists in exactly one copy.
 *
 *   node tools/record/analyse.cjs            # report
 *   node tools/record/analyse.cjs --json     # the full computed record as JSON
 */
const r = require('./load.cjs')();

if (process.argv.includes('--json')) { process.stdout.write(JSON.stringify(r, null, 1)); process.exit(0); }

const pct = (x) => (x === null || x === undefined ? '—' : (x * 100).toFixed(1) + '%');
const fmt = new Intl.NumberFormat('en-CA');
const S = r.summary;

console.log(`# The record, ${r.session}: ${S.divisions} recorded divisions, ${r.first} to ${r.last}, snapshot ${r.fetched}\n`);
console.log(`Ballots ${fmt.format(S.ballots)}: cast ${fmt.format(S.cast)}, paired ${fmt.format(S.paired)}, recorded as "didn't vote" ${fmt.format(S.absent)}. Members with a party-line rate (>= 20 comparable votes): ${S.rated}.\n`);

console.log('## Party-line rate (share of a member\'s cast votes matching their party\'s majority)\n');
console.log('party           members   mean     lowest');
for (const p of r.parties) {
  const ms = r.members.filter((m) => m.party === p && m.rate !== null);
  if (!ms.length) continue;
  const low = ms.reduce((a, b) => (a.rate < b.rate ? a : b));
  console.log(`${p.padEnd(15)} ${String(ms.length).padStart(7)}   ${pct(ms.reduce((a, m) => a + m.rate, 0) / ms.length).padEnd(8)} ${pct(low.rate)} ${low.name} (${low.breaks.length} of ${low.comparable})`);
}
console.log(`\nNever once voted against their party: ${S.neverBroke} of ${S.rated} (${pct(S.neverBroke / S.rated)}). Overall: ${pct(S.partyLine)}.\n`);

console.log('## Broke with their party most often\n');
for (const m of r.members.filter((m) => m.rate !== null).sort((a, b) => a.rate - b.rate).slice(0, 8)) {
  console.log(`  ${pct(m.rate).padStart(6)}  ${m.name} (${m.party}) — ${m.breaks.length} of ${m.comparable}; ${m.breaks.slice(0, 3).map((n) => r.divisions.find((d) => d.n === n).official).join(' ')}`);
}

console.log('\n## Party-vs-party agreement (share of divisions where both majorities voted the same way)\n');
console.log(''.padEnd(15) + r.parties.map((p) => p.padStart(13)).join(''));
for (const a of r.parties) console.log(a.padEnd(15) + r.parties.map((b) => pct(r.agreement[a][b]).padStart(13)).join(''));

console.log(`\n## The House itself\n`);
console.log(`  divisions with any dissent inside a party: ${S.withDissent} of ${S.divisions}; any party split >= 10%: ${S.anyPartySplit10}; genuinely contested (>= 20% on the losing side): ${S.contested}; near-unanimous (< 5%): ${S.nearUnanimous}.`);
console.log(`  closest:`);
for (const n of S.closest) { const d = r.divisions.find((x) => x.n === n); const lose = Math.round(d.split * d.cast); console.log(`    ${d.cast - lose}–${lose}  ${d.date}  ${d.desc.slice(0, 80)}\n           ${d.official}`); }
