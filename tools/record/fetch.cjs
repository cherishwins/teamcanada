#!/usr/bin/env node
/**
 * THE RECORD — the fetcher.
 *
 * Every recorded division of a session of the House of Commons, every
 * member's ballot, and the party each member sat for ON THE DAY OF THE VOTE,
 * from OpenParliament.ca (keyless), written as one compact snapshot the site
 * builds from:
 *
 *     src/data/record/<session>.json
 *
 * The snapshot is COMMITTED. The build never touches the network for this:
 * a page that renders 60,000 ballots cannot depend on a volunteer-run API
 * answering during every Vercel build, and hammering that API on every
 * preview deploy would be rude. Freshness comes from
 * .github/workflows/record.yml, which runs this daily, fetches only the
 * divisions the snapshot does not have yet, builds the site to prove the new
 * data renders, and commits the delta.
 *
 * Polite by construction: sequential, an honest User-Agent with a contact,
 * a pause between requests, retries with backoff, and incremental — a run
 * with nothing new makes about three requests.
 *
 *   node tools/record/fetch.cjs 45-1                # incremental refresh
 *   node tools/record/fetch.cjs 45-1 --from-raw f   # convert a raw dump (spike)
 *
 * Snapshot shape (kept flat so tools/record/analyse.cjs and src/lib/record.ts
 * can both read it without a library):
 *
 *   members[i]      { id, name, party, riding, province }   party/riding = latest
 *   memberships[]   { m, party, from, to }                  m = index into members
 *   votes[]         { n, date, desc, bill, result, yea, nay, paired, ballots }
 *   votes[].ballots one character per member index:
 *                   Y yea · N nay · P paired · A recorded as "didn't vote" ·
 *                   - no ballot on record (not a member that day)
 */
const fs = require('fs');
const path = require('path');

const SESSION = process.argv[2] || '45-1';
const FROM_RAW = (() => { const i = process.argv.indexOf('--from-raw'); return i > 0 ? process.argv[i + 1] : null; })();
const OUT = path.join('src', 'data', 'record', `${SESSION}.json`);
const BASE = 'https://api.openparliament.ca';
const UA = 'northerntemper.ca/record (contact: jesse@northerntemper.ca)';
const PAUSE = 150;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CODE = { Yes: 'Y', No: 'N', Paired: 'P', "Didn't vote": 'A' };

async function get(p, tries = 3) {
  const url = BASE + p + (p.includes('?') ? '&' : '?') + 'format=json';
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
async function all(p) {
  const out = [];
  let next = p + (p.includes('?') ? '&' : '?') + 'limit=500';
  while (next) {
    const r = await get(next.replace(/[?&]format=json/, ''));
    out.push(...r.objects);
    next = r.pagination.next_url;
  }
  return out;
}

/** Load the snapshot, or start one. */
function load() {
  if (fs.existsSync(OUT)) return JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const [parliament, sessionNumber] = SESSION.split('-').map(Number);
  return { session: SESSION, parliament, sessionNumber, fetched: null, source: BASE + '/', members: [], memberships: [], votes: [] };
}

/** Member index by OpenParliament slug, adding new members as they appear. */
function indexer(snap) {
  const byId = new Map(snap.members.map((m, i) => [m.id, i]));
  return (id, info) => {
    if (!byId.has(id)) { byId.set(id, snap.members.length); snap.members.push({ id, name: info?.name || id, party: info?.party || null, riding: info?.riding || null, province: info?.province || null }); }
    else if (info) Object.assign(snap.members[byId.get(id)], info);
    return byId.get(id);
  };
}
const slug = (url) => url.replace(/^\/politicians\//, '').replace(/\/$/, '');

/**
 * One row per OpenParliament membership URL. The URL is kept so an incremental
 * run recognises a membership it already has from the ballot alone, without a
 * request — otherwise every new division would cost ~340 membership fetches.
 */
function addMembership(snap, m, party, from, to, url) {
  const hit = snap.memberships.find((x) => (url && x.url === url) || (x.m === m && x.party === party && x.from === from));
  if (hit) Object.assign(hit, { to, url: url || hit.url });
  else snap.memberships.push({ m, party, from, to, url });
}

/** Write with members sorted by name and votes by number, ballots re-indexed. */
function save(snap) {
  const order = snap.members.map((_, i) => i).sort((a, b) => snap.members[a].name.localeCompare(snap.members[b].name, 'en-CA'));
  const remap = new Map(order.map((old, neu) => [old, neu]));
  const members = order.map((i) => snap.members[i]);
  const memberships = snap.memberships.map((x) => ({ ...x, m: remap.get(x.m) })).sort((a, b) => a.m - b.m || a.from.localeCompare(b.from));
  const votes = snap.votes.map((v) => {
    const b = Array(members.length).fill('-');
    for (let i = 0; i < v.ballots.length; i++) if (v.ballots[i] !== '-') b[remap.get(i)] = v.ballots[i];
    return { ...v, ballots: b.join('') };
  }).sort((a, b) => a.n - b.n);
  const out = { ...snap, members, memberships, votes };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out));
  return out;
}

(async () => {
  const t0 = Date.now();
  const snap = load();
  const idx = indexer(snap);
  const known = new Set(snap.votes.map((v) => v.n));

  if (FROM_RAW) {
    // Convert the spike's raw dump (tools/record/fetch.cjs, first version) without refetching.
    const raw = JSON.parse(fs.readFileSync(FROM_RAW, 'utf8'));
    for (const [u, p] of Object.entries(raw.politicians)) idx(slug(u), { name: p.name, party: p.party, riding: p.riding, province: p.province });
    for (const [url, m] of Object.entries(raw.memberships)) if (!m.missing) addMembership(snap, idx(slug(m.politician)), m.party, m.start, m.end, url);
    for (const v of raw.votes) {
      if (known.has(v.number)) continue;
      const b = Array(snap.members.length).fill('-');
      for (const [pol, , ballot] of raw.ballots[v.number] || []) { const i = idx(slug(pol)); while (b.length <= i) b.push('-'); b[i] = CODE[ballot] || '-'; }
      snap.votes.push({ n: v.number, date: v.date, desc: v.description, bill: v.bill ? v.bill.replace(/^\/bills\/[^/]+\//, '').replace(/\/$/, '') : null, result: v.result, yea: v.yea, nay: v.nay, paired: v.paired, ballots: b.join('') });
    }
    snap.fetched = raw.fetched_at || new Date().toISOString();
  } else {
    // 1. Which divisions exist now? Fetch only the ones the snapshot lacks.
    const list = await all(`/votes/?session=${SESSION}`);
    const fresh = list.filter((v) => !known.has(v.number));
    console.log(`record ${SESSION}: ${list.length} divisions on record, ${known.size} in the snapshot, ${fresh.length} new`);
    for (const v of fresh) {
      const ballots = await all(`/votes/ballots/?vote=${encodeURIComponent(v.url)}`);
      const b = Array(snap.members.length).fill('-');
      for (const x of ballots) {
        const id = slug(x.politician_url);
        const i = idx(id);
        while (b.length <= i) b.push('-');
        b[i] = CODE[x.ballot] || '-';
        // Party on the day: resolve the membership once per membership URL.
        const mu = x.politician_membership_url;
        if (!snap.memberships.some((m) => m.url === mu)) {
          const mem = await get(mu);
          if (mem) {
            addMembership(snap, i, mem.party?.short_name?.en || null, mem.start_date, mem.end_date, mu);
            Object.assign(snap.members[i], { party: mem.party?.short_name?.en || snap.members[i].party, riding: mem.riding?.name?.en || snap.members[i].riding, province: mem.riding?.province || snap.members[i].province });
          }
        }
      }
      snap.votes.push({ n: v.number, date: v.date, desc: v.description.en, bill: v.bill_url ? v.bill_url.replace(/^\/bills\/[^/]+\//, '').replace(/\/$/, '') : null, result: v.result, yea: v.yea_total, nay: v.nay_total, paired: v.paired_total, ballots: b.join('') });
    }
    // 2. Names for anyone new.
    for (const m of snap.members) if (m.name === m.id) { const p = await get(`/politicians/${m.id}/`); if (p) m.name = p.name; }
    if (fresh.length) snap.fetched = new Date().toISOString();
  }

  const out = save(snap);
  const ballots = out.votes.reduce((a, v) => a + [...v.ballots].filter((c) => c !== '-').length, 0);
  console.log(`record ${SESSION}: ${out.votes.length} divisions, ${out.members.length} members, ${ballots} ballots → ${OUT} (${Math.round(fs.statSync(OUT).size / 1024)} KB) in ${Math.round((Date.now() - t0) / 1000)}s`);
})().catch((e) => { console.error('record fetch failed:', e.message); process.exit(1); });
