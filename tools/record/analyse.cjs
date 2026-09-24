// The math. Nothing here is a judgement: every number is a count over the
// official record, and every vote it names links to the record.
const fs = require('fs');
const SESSION = process.argv[2] || '45-1';
const d = JSON.parse(fs.readFileSync(`record-${SESSION}.json`, 'utf8'));
const [parl, sess] = SESSION.split('-');
const official = (n) => `https://www.ourcommons.ca/members/en/votes/${parl}/${sess}/${n}`;
const op = (n) => `https://openparliament.ca/votes/${SESSION}/${n}/`;

const val = (b) => (b === 'Yes' ? 1 : b === 'No' ? 0 : null);
const partyOf = (mem) => d.memberships[mem]?.party || 'Unknown';
const name = (u) => d.politicians[u]?.name || u;
const pct = (x) => (x * 100).toFixed(1) + '%';

// ---- Per vote: each party's position (majority of its cast ballots) and its dissent.
const votes = d.votes.map((v) => {
  const rows = (d.ballots[v.number] || []).map(([pol, mem, b]) => ({ pol, party: partyOf(mem), v: val(b) })).filter((r) => r.v !== null);
  const byParty = {};
  for (const r of rows) (byParty[r.party] ||= { yes: 0, no: 0 })[r.v ? 'yes' : 'no']++;
  const position = {};
  for (const [p, c] of Object.entries(byParty)) position[p] = { pos: c.yes >= c.no ? 1 : 0, n: c.yes + c.no, minority: Math.min(c.yes, c.no) };
  const cast = rows.length, yes = rows.filter((r) => r.v).length;
  return { ...v, rows, position, cast, yes, no: cast - yes, splitShare: cast ? Math.min(yes, cast - yes) / cast : 0 };
});

// ---- Per MP: votes cast, party-line rate, and the votes where they broke.
const mps = {};
for (const v of votes) for (const r of v.rows) {
  const m = (mps[r.pol] ||= { pol: r.pol, name: name(r.pol), party: r.party, cast: 0, withParty: 0, against: [] });
  const p = v.position[r.party];
  if (!p || p.n < 3) continue; // no meaningful party line to compare against
  m.cast++;
  if (r.v === p.pos) m.withParty++; else m.against.push(v.number);
}
const mpList = Object.values(mps).filter((m) => m.cast >= 20).map((m) => ({ ...m, rate: m.withParty / m.cast }));

// ---- Party-vs-party agreement: share of votes where both parties' positions matched.
const parties = [...new Set(mpList.map((m) => m.party))].filter((p) => p !== 'Unknown' && p !== 'Independent');
const agree = {};
for (const a of parties) for (const b of parties) {
  let same = 0, both = 0;
  for (const v of votes) { const pa = v.position[a], pb = v.position[b]; if (pa && pb && pa.n >= 3 && pb.n >= 3) { both++; if (pa.pos === pb.pos) same++; } }
  (agree[a] ||= {})[b] = both ? same / both : null;
}

// ---- Pairwise MP agreement (over votes both cast), summarised within vs across parties.
const ids = mpList.map((m) => m.pol); const idx = Object.fromEntries(ids.map((u, i) => [u, i]));
const ballotsByMp = ids.map(() => new Map());
for (const v of votes) for (const r of v.rows) if (idx[r.pol] !== undefined) ballotsByMp[idx[r.pol]].set(v.number, r.v);
const within = [], across = [];
for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
  let same = 0, both = 0;
  for (const [n, b] of ballotsByMp[i]) { const o = ballotsByMp[j].get(n); if (o !== undefined) { both++; if (o === b) same++; } }
  if (both < 20) continue;
  (mpList[i].party === mpList[j].party ? within : across).push(same / both);
}
const mean = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };

// ---- Report.
console.log(`# The record, ${SESSION}: ${votes.length} recorded divisions, ${d.votes[0]?.date} to ${d.votes.at(-1)?.date}, fetched ${d.fetched_at}\n`);
console.log(`Members with >= 20 comparable votes: ${mpList.length}. Ballots counted: ${votes.reduce((a, v) => a + v.cast, 0)}.\n`);

console.log('## Party-line rate (share of a member\'s cast votes matching their own party\'s majority)\n');
console.log('party           members   mean     median   lowest');
for (const p of parties) {
  const ms = mpList.filter((m) => m.party === p); if (!ms.length) continue;
  const low = ms.reduce((a, b) => (a.rate < b.rate ? a : b));
  console.log(`${p.padEnd(15)} ${String(ms.length).padStart(7)}   ${pct(mean(ms.map((m) => m.rate))).padEnd(8)} ${pct(median(ms.map((m) => m.rate))).padEnd(8)} ${pct(low.rate)} ${low.name} (${low.against.length} of ${low.cast})`);
}
const perfect = mpList.filter((m) => m.rate === 1).length;
console.log(`\nMembers who voted with their party on every comparable division: ${perfect} of ${mpList.length} (${pct(perfect / mpList.length)}).`);
console.log(`Overall party-line rate, all members: ${pct(mean(mpList.map((m) => m.rate)))}.\n`);

console.log('## Members who broke with their party most often\n');
for (const m of [...mpList].sort((a, b) => a.rate - b.rate).slice(0, 8)) console.log(`  ${pct(m.rate).padStart(6)}  ${m.name} (${m.party}) — ${m.against.length} of ${m.cast}; e.g. ${m.against.slice(0, 3).map(op).join(' ')}`);

console.log('\n## Party-vs-party agreement (share of divisions where both parties\' majorities voted the same way)\n');
console.log(''.padEnd(15) + parties.map((p) => p.slice(0, 12).padStart(13)).join(''));
for (const a of parties) console.log(a.padEnd(15) + parties.map((b) => (agree[a][b] === null ? '—' : pct(agree[a][b])).padStart(13)).join(''));

console.log(`\n## Pairwise member agreement over shared votes\n`);
console.log(`  same party:      mean ${pct(mean(within))}, median ${pct(median(within))}  (${within.length} pairs)`);
console.log(`  different party: mean ${pct(mean(across))}, median ${pct(median(across))}  (${across.length} pairs)`);

const contested = votes.filter((v) => v.cast >= 100).sort((a, b) => b.splitShare - a.splitShare);
const near = votes.filter((v) => v.cast >= 100 && v.splitShare < 0.05).length;
console.log(`\n## The House itself\n`);
console.log(`  divisions with >= 100 ballots: ${contested.length}; of those, near-unanimous (< 5% on the losing side): ${near}; genuinely contested (>= 20% on the losing side): ${contested.filter((v) => v.splitShare >= 0.2).length}.`);
console.log(`  closest divisions:`);
for (const v of contested.slice(0, 6)) console.log(`    ${v.yes}–${v.no}  ${v.date}  ${v.description.slice(0, 80)}\n           ${official(v.number)}`);

const free = votes.filter((v) => Object.values(v.position).filter((p) => p.n >= 5 && p.minority / p.n >= 0.1).length >= 2);
console.log(`\n  divisions where at least two parties each split 10%+ internally (free votes, by the numbers): ${free.length}`);
for (const v of free.slice(0, 5)) console.log(`    ${v.date}  ${v.description.slice(0, 80)}\n           ${official(v.number)}`);

// A machine-readable summary for the next step.
fs.writeFileSync(`summary-${SESSION}.json`, JSON.stringify({ session: SESSION, votes: votes.length, members: mpList.length, parties, partyLine: Object.fromEntries(parties.map((p) => [p, mean(mpList.filter((m) => m.party === p).map((m) => m.rate))])), agree, within: { mean: mean(within), median: median(within) }, across: { mean: mean(across), median: median(across) } }, null, 1));
