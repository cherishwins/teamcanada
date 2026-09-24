// THE RECORD, step one. Spike fetcher: every recorded division of a session, every ballot, and the
// party each member sat for AT THE TIME of the vote. Polite: sequential, a
// pause between requests, an honest User-Agent, retries with backoff.
const fs = require('fs');
const BASE = 'https://api.openparliament.ca';
const SESSION = process.argv[2] || '45-1';
const OUT = process.env.RECORD_OUT || `record-${SESSION}.json`;
const UA = 'northerntemper.ca record spike (contact: jesse@northerntemper.ca)';
const PAUSE = 150;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path, tries = 3) {
  const url = BASE + path + (path.includes('?') ? '&' : '?') + 'format=json';
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', 'API-Version': 'v1' } });
      if (r.status === 429 || r.status >= 500) throw new Error('HTTP ' + r.status);
      if (!r.ok) return null;
      await sleep(PAUSE);
      return await r.json();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1000 * 2 ** i);
    }
  }
}
async function all(path) {
  const out = [];
  let next = path + (path.includes('?') ? '&' : '?') + 'limit=500';
  while (next) {
    const r = await get(next.replace(/[?&]format=json/, ''));
    out.push(...r.objects);
    next = r.pagination.next_url;
  }
  return out;
}

(async () => {
  const t0 = Date.now();
  const data = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { session: SESSION, votes: [], ballots: {}, memberships: {}, politicians: {} };

  // 1. Every vote in the session.
  const votes = await all(`/votes/?session=${SESSION}`);
  data.votes = votes.map((v) => ({ number: v.number, date: v.date, description: v.description.en, bill: v.bill_url, result: v.result, yea: v.yea_total, nay: v.nay_total, paired: v.paired_total, url: v.url }));
  console.log(`votes: ${data.votes.length}`);

  // 2. Every ballot, per vote (resumable).
  let n = 0;
  for (const v of data.votes) {
    if (data.ballots[v.number]) continue;
    const b = await all(`/votes/ballots/?vote=${encodeURIComponent(v.url)}`);
    data.ballots[v.number] = b.map((x) => [x.politician_url, x.politician_membership_url, x.ballot]);
    if (++n % 20 === 0) { fs.writeFileSync(OUT, JSON.stringify(data)); console.log(`  ballots fetched for ${n} votes (${Math.round((Date.now() - t0) / 1000)}s)`); }
  }
  fs.writeFileSync(OUT, JSON.stringify(data));
  const ballotValues = new Set(); for (const b of Object.values(data.ballots)) for (const x of b) ballotValues.add(x[2]);
  console.log(`ballots: ${Object.values(data.ballots).reduce((a, b) => a + b.length, 0)}  values: ${[...ballotValues].join(' | ')}`);

  // 3. Memberships seen on ballots -> party at the time of the vote.
  const mems = new Set(); for (const b of Object.values(data.ballots)) for (const x of b) mems.add(x[1]);
  let m = 0;
  for (const u of mems) {
    if (data.memberships[u]) continue;
    const r = await get(u);
    data.memberships[u] = r ? { politician: r.politician_url, party: r.party?.short_name?.en || null, party_full: r.party?.name?.en || null, riding: r.riding?.name?.en || null, province: r.riding?.province || null, start: r.start_date, end: r.end_date } : { missing: true };
    if (++m % 50 === 0) fs.writeFileSync(OUT, JSON.stringify(data));
  }
  console.log(`memberships: ${mems.size} (${Object.values(data.memberships).filter((x) => x.missing).length} missing)`);

  // 4. Names and ridings for everyone who cast a ballot.
  const pols = await all('/politicians/');
  for (const p of pols) data.politicians[p.url] = { name: p.name, party: p.current_party?.short_name?.en || null, riding: p.current_riding?.name?.en || null, province: p.current_riding?.province || null };
  const formers = new Set(); for (const b of Object.values(data.ballots)) for (const x of b) if (!data.politicians[x[0]]) formers.add(x[0]);
  for (const u of formers) { const r = await get(u); if (r) data.politicians[u] = { name: r.name, party: r.current_party?.short_name?.en || null, riding: r.current_riding?.name?.en || null, province: r.current_riding?.province || null, former: true }; }
  data.fetched_at = new Date().toISOString();
  fs.writeFileSync(OUT, JSON.stringify(data));
  console.log(`politicians: ${Object.keys(data.politicians).length} (${formers.size} no longer sitting)  ->  ${OUT} ${Math.round(fs.statSync(OUT).size / 1024)} KB in ${Math.round((Date.now() - t0) / 1000)}s`);
})().catch((e) => { console.error('fetch failed:', e.message); process.exit(1); });

// Usage: node tools/record/fetch.cjs 45-1   (writes record-45-1.json, ~4.4 MB, in
// the working directory; resumable; ~3 minutes at a polite pace). Then
// node tools/record/analyse.cjs 45-1 prints the math with a link on every
// number. Neither is in the build yet: this is the spike that proved the data
// is clean and keyless. See CLAUDE.md, "The record".
