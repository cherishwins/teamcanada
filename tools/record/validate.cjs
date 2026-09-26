#!/usr/bin/env node
/**
 * THE RECORD — the snapshot must add up.
 *
 * fetch.cjs never fetches a division twice, so a division saved half-fetched
 * (OpenParliament answering the ballot list short, say) would stay wrong for
 * ever, and the build would render it, because rendering proves only that the
 * page draws. An audit simulated exactly that: a division with totals of 300
 * and 20 saved with nine ballots, exit 0, committed. These are the invariants
 * every one of the 174 divisions on record already satisfies:
 *
 *   - Yea, Nay and Paired ballots count to the division's own totals;
 *   - every division has one ballot slot per member;
 *   - every ballot a member CAST (Yea, Nay, Paired) falls inside a
 *     membership, so the party it is scored against is known. Not "didn't
 *     vote": OpenParliament lists Bill Blair that way in seven divisions after
 *     his membership ended on 2 February 2026, and a non-vote is never scored
 *     against a party, so it needs none;
 *   - divisions are numbered 1..N with no gap.
 *
 * fetch.cjs runs this before it writes, and exits without writing on any
 * failure so the next day retries. The build runs it too, so a snapshot
 * edited by hand or converted with --from-raw is held to the same rules.
 *
 *   node tools/record/validate.cjs [snapshot.json]
 */
const fs = require('fs');
const path = require('path');

/** The one place the current session is named: the import in src/lib/record.ts. */
function currentSnapshotPath() {
  const src = fs.readFileSync(path.join('src', 'lib', 'record.ts'), 'utf8');
  const m = src.match(/import\s+snapshot\s+from\s+'\.\.\/data\/record\/([\w-]+)\.json'/);
  if (!m) throw new Error("src/lib/record.ts no longer imports '../data/record/<session>.json' as snapshot");
  return { session: m[1], file: path.join('src', 'data', 'record', `${m[1]}.json`) };
}

function validate(snap) {
  const problems = [];
  const members = snap.members.length;
  snap.votes.forEach((v, k) => {
    if (v.n !== k + 1) problems.push(`division ${v.n} sits where ${k + 1} should: a division is missing`);
    if (v.ballots.length !== members) problems.push(`division ${v.n}: ${v.ballots.length} ballot slots for ${members} members`);
    const c = { Y: 0, N: 0, P: 0 };
    for (const ch of v.ballots) if (ch in c) c[ch]++;
    if (c.Y !== v.yea || c.N !== v.nay || c.P !== v.paired) {
      problems.push(`division ${v.n}: ballots count ${c.Y}–${c.N}, ${c.P} paired, against totals of ${v.yea}–${v.nay}, ${v.paired} paired`);
    }
    for (let i = 0; i < v.ballots.length; i++) {
      if (!'YNP'.includes(v.ballots[i])) continue;
      const on = snap.memberships.some((x) => x.m === i && x.from <= v.date && (!x.to || x.to >= v.date));
      if (!on) problems.push(`division ${v.n}: ${snap.members[i]?.name ?? i} has a ballot but no membership on ${v.date}`);
    }
  });
  return problems;
}

module.exports = { validate, currentSnapshotPath };

if (require.main === module) {
  const file = process.argv[2] || currentSnapshotPath().file;
  const snap = JSON.parse(fs.readFileSync(file, 'utf8'));
  const problems = validate(snap);
  if (problems.length) {
    console.error(`\nrecord validate: ${problems.length} problem(s) in ${file}\n`);
    for (const p of problems.slice(0, 40)) console.error(`  ✗ ${p}`);
    if (problems.length > 40) console.error(`  … and ${problems.length - 40} more`);
    console.error('');
    process.exit(1);
  }
  const ballots = snap.votes.reduce((a, v) => a + [...v.ballots].filter((c) => c !== '-').length, 0);
  console.log(`record validate: ${file}, ${snap.votes.length} divisions numbered 1–${snap.votes.length}, ${ballots} ballots, every count matching its totals and every ballot inside a membership`);
}
