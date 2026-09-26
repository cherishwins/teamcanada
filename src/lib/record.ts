/**
 * The record: every recorded division of a session, counted.
 *
 * Reads the committed snapshot written by tools/record/fetch.cjs and turns it
 * into numbers. Nothing in here is a judgement. A party's position on a
 * division is the majority of the ballots its members cast; a member's
 * party-line rate is the share of their cast votes that matched it; agreement
 * between two parties is the share of divisions where both majorities went
 * the same way. Paired ballots and "didn't vote" are counted as exactly that,
 * never as a position. The party a member is scored against is the party they
 * sat for ON THE DAY, from the membership record, so a floor-crosser is
 * measured against the right bench on both sides of the crossing.
 *
 * All divisions, always. A curated "key votes" list is where an editorial
 * hand would enter, so there is none; a reader who wants a subset filters.
 */
import snapshot from '../data/record/45-1.json';

export interface Member { id: string; name: string; party: string | null; riding: string | null; province: string | null }
export interface Membership { m: number; party: string | null; from: string; to: string | null }
export interface Vote { n: number; date: string; desc: string; bill: string | null; result: string; yea: number; nay: number; paired: number; ballots: string }
export interface Snapshot { session: string; parliament: number; sessionNumber: number; fetched: string; source: string; members: Member[]; memberships: Membership[]; votes: Vote[] }

export const RECORD = snapshot as Snapshot;
/** The session this record counts, named once: the snapshot imported above. */
export const SESSION = RECORD.session;

/** Parties with a bench big enough to have a line. Greens (one seat) and independents are reported, not rated. */
const MIN_BENCH = 3;

/**
 * The standard abbreviation of each party, for a column too narrow for its
 * name, and the full name an <abbr title> expands it to. Keyed by the short
 * name OpenParliament uses and every page prints. Not math, but the record's
 * vocabulary, so it lives beside the math rather than in whichever page first
 * needed it. A party missing here falls back to its short name, unabbreviated.
 */
export const PARTY_NAMES: Record<string, { abbr: string; name: string }> = {
  Liberal: { abbr: 'LPC', name: 'Liberal Party of Canada' },
  Conservative: { abbr: 'CPC', name: 'Conservative Party of Canada' },
  Bloc: { abbr: 'BQ', name: 'Bloc Québécois' },
  NDP: { abbr: 'NDP', name: 'New Democratic Party' },
  Green: { abbr: 'GPC', name: 'Green Party of Canada' },
};

export interface PartyPosition { pos: 'Y' | 'N'; yes: number; no: number; dissent: number }
export interface Division extends Vote {
  /** party short name -> how its members voted, where the bench cast >= MIN_BENCH ballots */
  positions: Record<string, PartyPosition>;
  cast: number;
  /** share of cast ballots on the losing side: 0 = unanimous, 0.5 = a tie */
  split: number;
  /** did any party with a line split by even one ballot */
  dissent: boolean;
  official: string;
  openparliament: string;
}
export interface MemberRecord extends Member {
  /** ballots actually cast (Y or N) */
  cast: number;
  paired: number;
  absent: number;
  /** cast votes where a party line existed */
  comparable: number;
  withParty: number;
  rate: number | null;
  /** division numbers where the member voted against their party's majority */
  breaks: number[];
  /** Every party they sat for during the session, in order. More than one means
   *  they crossed the floor or left their caucus; `party` alone is only the last. */
  parties: string[];
  /** The day their seat ended, if it has; null while they sit. */
  left: string | null;
  openparliament: string;
}
export interface TheRecord {
  session: string; parliament: number; sessionNumber: number; fetched: string; source: string;
  first: string; last: string;
  divisions: Division[];
  members: MemberRecord[];
  parties: string[];
  /** parties[a][b] = share of divisions where both majorities voted the same way */
  agreement: Record<string, Record<string, number | null>>;
  summary: {
    divisions: number; ballots: number; cast: number; paired: number; absent: number;
    rated: number; neverBroke: number; partyLine: number;
    contested: number; nearUnanimous: number; withDissent: number; anyPartySplit10: number;
    closest: number[];
  };
}

/** The party a member sat for on a given date. */
function partyOn(memberships: Membership[], m: number, date: string): string | null {
  const hit = memberships.filter((x) => x.m === m && x.from <= date && (!x.to || x.to >= date)).sort((a, b) => b.from.localeCompare(a.from))[0];
  return hit?.party ?? null;
}

export function compute(s: Snapshot = RECORD): TheRecord {
  const { parliament, sessionNumber } = s;
  const official = (n: number) => `https://www.ourcommons.ca/members/en/votes/${parliament}/${sessionNumber}/${n}`; // lowercase: the capitalised path 403s
  const op = (n: number) => `https://openparliament.ca/votes/${s.session}/${n}/`;

  // Party of each member on each vote day, memoised per (member, date).
  const partyCache = new Map<string, string | null>();
  const party = (m: number, date: string) => {
    const k = m + '|' + date;
    if (!partyCache.has(k)) partyCache.set(k, partyOn(s.memberships, m, date) ?? s.members[m].party);
    return partyCache.get(k)!;
  };

  const votes = [...s.votes].sort((a, b) => a.n - b.n);
  const divisions: Division[] = votes.map((v) => {
    const tally: Record<string, { yes: number; no: number }> = {};
    let cast = 0, yes = 0;
    for (let i = 0; i < v.ballots.length; i++) {
      const c = v.ballots[i];
      if (c !== 'Y' && c !== 'N') continue;
      cast++; if (c === 'Y') yes++;
      const p = party(i, v.date) ?? 'Independent';
      (tally[p] ||= { yes: 0, no: 0 })[c === 'Y' ? 'yes' : 'no']++;
    }
    const positions: Record<string, PartyPosition> = {};
    for (const [p, t] of Object.entries(tally)) {
      if (t.yes + t.no < MIN_BENCH || p === 'Independent') continue;
      positions[p] = { pos: t.yes >= t.no ? 'Y' : 'N', yes: t.yes, no: t.no, dissent: Math.min(t.yes, t.no) };
    }
    return { ...v, positions, cast, split: cast ? Math.min(yes, cast - yes) / cast : 0, dissent: Object.values(positions).some((p) => p.dissent > 0), official: official(v.n), openparliament: op(v.n) };
  });

  const dates = s.votes.map((v) => v.date).sort();
  const [firstDay, lastDay] = [dates[0] ?? '', dates[dates.length - 1] ?? ''];
  const members: MemberRecord[] = s.members.map((m, i) => {
    const sat = s.memberships
      .filter((x) => x.m === i && x.from <= lastDay && (!x.to || x.to >= firstDay))
      .sort((a, b) => (a.from < b.from ? -1 : 1));
    const parties = [...new Set(sat.map((x) => x.party ?? 'Independent'))];
    const left = sat.length && sat.every((x) => x.to) ? sat.map((x) => x.to as string).sort().pop() ?? null : null;
    let cast = 0, paired = 0, absent = 0, comparable = 0, withParty = 0;
    const breaks: number[] = [];
    for (const d of divisions) {
      const c = d.ballots[i] ?? '-';
      if (c === 'P') { paired++; continue; }
      if (c === 'A') { absent++; continue; }
      if (c !== 'Y' && c !== 'N') continue;
      cast++;
      const line = d.positions[party(i, d.date) ?? ''];
      if (!line) continue;
      comparable++;
      if (c === line.pos) withParty++; else breaks.push(d.n);
    }
    return { ...m, cast, paired, absent, comparable, withParty, rate: comparable >= 20 ? withParty / comparable : null, breaks, parties, left, openparliament: `https://openparliament.ca/politicians/${m.id}/` };
  });

  const parties = [...new Set(divisions.flatMap((d) => Object.keys(d.positions)))].sort((a, b) => members.filter((m) => m.party === b).length - members.filter((m) => m.party === a).length);
  const agreement: Record<string, Record<string, number | null>> = {};
  for (const a of parties) { agreement[a] = {}; for (const b of parties) {
    let same = 0, both = 0;
    for (const d of divisions) { const pa = d.positions[a], pb = d.positions[b]; if (pa && pb) { both++; if (pa.pos === pb.pos) same++; } }
    agreement[a][b] = both ? same / both : null;
  } }

  const rated = members.filter((m) => m.rate !== null);
  const withBallots = divisions.filter((d) => d.cast >= 100);
  const summary = {
    divisions: divisions.length,
    ballots: divisions.reduce((a, d) => a + [...d.ballots].filter((c) => c !== '-').length, 0),
    cast: divisions.reduce((a, d) => a + d.cast, 0),
    paired: members.reduce((a, m) => a + m.paired, 0),
    absent: members.reduce((a, m) => a + m.absent, 0),
    rated: rated.length,
    neverBroke: rated.filter((m) => m.breaks.length === 0).length,
    partyLine: rated.length ? rated.reduce((a, m) => a + (m.rate as number), 0) / rated.length : 0,
    contested: withBallots.filter((d) => d.split >= 0.2).length,
    nearUnanimous: withBallots.filter((d) => d.split < 0.05).length,
    withDissent: divisions.filter((d) => d.dissent).length,
    anyPartySplit10: divisions.filter((d) => Object.values(d.positions).some((p) => p.yes + p.no >= 5 && p.dissent / (p.yes + p.no) >= 0.1)).length,
    closest: [...withBallots].sort((a, b) => b.split - a.split).slice(0, 5).map((d) => d.n),
  };

  return { session: s.session, parliament, sessionNumber, fetched: s.fetched, source: s.source, first: votes[0]?.date ?? '', last: votes.at(-1)?.date ?? '', divisions, members, parties, agreement, summary };
}
