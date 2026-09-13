/**
 * Live figures for Northern Temper.
 *
 * Two public, key-free Canadian sources:
 *   · Bank of Canada Valet   — FX and the policy rate, daily
 *   · Statistics Canada WDS  — GDP, population, CPI, monthly/quarterly
 *
 * The governing rule here is that a figure NEVER renders blank. Every series
 * carries a hand-checked fallback with the date it was true. If the upstream
 * call fails, times out, or returns a shape we do not recognise, the page shows
 * the fallback and says so. A site whose entire claim is "every figure here is
 * public and checkable" cannot afford to show a dash because StatCan had a bad
 * morning — and it equally cannot afford to show a stale number silently.
 */

export interface Figure {
  /** Machine value, unrounded. */
  value: number;
  /** Reference period the value describes (YYYY-MM-DD), not the fetch time. */
  asOf: string;
  /** Where it came from, for the citation line. */
  source: string;
  /** False when the upstream call failed and the fallback is being shown. */
  live: boolean;
  /** Percent change vs the comparison period, when one was requested. */
  changePct?: number;
}

const TIMEOUT_MS = 6000;
const BOC = 'https://www.bankofcanada.ca/valet/observations';
const WDS = 'https://www150.statcan.gc.ca/t1/wds/rest';

async function getJSON(url: string, init?: RequestInit): Promise<unknown> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctl.signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Bank of Canada Valet — one series, most recent observation. */
async function boc(series: string, fallback: Figure): Promise<Figure> {
  try {
    const data = (await getJSON(`${BOC}/${series}/json?recent=1`)) as {
      observations?: Array<Record<string, { v: string } | string>>;
    };
    const obs = data.observations?.[0];
    const cell = obs?.[series];
    if (!obs || typeof cell !== 'object' || !('v' in cell)) throw new Error('unexpected shape');
    const value = Number(cell.v);
    if (!Number.isFinite(value)) throw new Error('non-numeric value');
    return { value, asOf: String(obs.d), source: 'Bank of Canada', live: true };
  } catch {
    return { ...fallback, live: false };
  }
}

/**
 * StatCan WDS — a batch of vectors in one round trip.
 * `periods` > 1 also yields the change against the OLDEST period returned,
 * which is how the year-over-year figures are derived (13 monthly points).
 */
async function statcan(
  want: Array<{ key: string; vector: number; periods: number; fallback: Figure }>,
): Promise<Record<string, Figure>> {
  const out: Record<string, Figure> = {};
  for (const w of want) out[w.key] = { ...w.fallback, live: false };

  try {
    const body = want.map((w) => ({ vectorId: w.vector, latestN: w.periods }));
    const data = (await getJSON(`${WDS}/getDataFromVectorsAndLatestNPeriods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })) as Array<{
      status?: string;
      object?: { vectorId?: number; vectorDataPoint?: Array<{ refPer: string; value: number }> };
    }>;

    for (const row of data ?? []) {
      if (row.status !== 'SUCCESS' || !row.object) continue;
      const spec = want.find((w) => w.vector === row.object!.vectorId);
      const pts = row.object.vectorDataPoint;
      if (!spec || !pts?.length) continue;

      const last = pts[pts.length - 1];
      if (!Number.isFinite(last.value)) continue;

      const fig: Figure = {
        value: last.value,
        asOf: last.refPer,
        source: 'Statistics Canada',
        live: true,
      };
      const first = pts[0];
      if (pts.length > 1 && Number.isFinite(first.value) && first.value !== 0) {
        fig.changePct = (last.value / first.value - 1) * 100;
      }
      out[spec.key] = fig;
    }
  } catch {
    /* every key already holds its fallback */
  }
  return out;
}

/** Hand-verified 2026-09-13. Each is the real published figure for its period. */
const FALLBACK = {
  usdcad:     { value: 1.3866,     asOf: '2026-09-11', source: 'Bank of Canada',     live: false },
  policyRate: { value: 2.25,       asOf: '2026-09-11', source: 'Bank of Canada',     live: false },
  gdp:        { value: 2369309,    asOf: '2026-06-01', source: 'Statistics Canada',  live: false },
  population: { value: 41417056,   asOf: '2026-04-01', source: 'Statistics Canada',  live: false },
  cpi:        { value: 169.9,      asOf: '2026-07-01', source: 'Statistics Canada',  live: false, changePct: 3.03 },
} satisfies Record<string, Figure>;

export interface Figures {
  usdcad: Figure;
  policyRate: Figure;
  gdp: Figure;
  population: Figure;
  cpi: Figure;
  /** When this set was assembled (ISO). */
  fetchedAt: string;
  /** True only when every series came back live. */
  allLive: boolean;
}

export async function getFigures(): Promise<Figures> {
  const [usdcad, policyRate, sc] = await Promise.all([
    boc('FXUSDCAD', FALLBACK.usdcad),
    boc('V39079', FALLBACK.policyRate),
    statcan([
      { key: 'gdp',        vector: 65201210, periods: 13, fallback: FALLBACK.gdp },
      { key: 'population', vector: 1,        periods: 1,  fallback: FALLBACK.population },
      { key: 'cpi',        vector: 41690973, periods: 13, fallback: FALLBACK.cpi },
    ]),
  ]);

  const figures = {
    usdcad,
    policyRate,
    gdp: sc.gdp,
    population: sc.population,
    cpi: sc.cpi,
  };

  return {
    ...figures,
    fetchedAt: new Date().toISOString(),
    allLive: Object.values(figures).every((f) => f.live),
  };
}

/* ==========================================================================
   Rivers — Environment and Climate Change Canada, hydrometric-realtime.
   https://api.weather.gc.ca — OGC API Features, public, key-free.

   The site's central claim is about water. Everywhere else it is quoted as a
   published statistic; here it is a gauge reading taken minutes ago. Same
   claim, but measured rather than cited — which is the whole posture of the
   page. Discharge is in cubic metres per second.
   ========================================================================== */

const WEATHER = 'https://api.weather.gc.ca/collections/hydrometric-realtime/items';

export interface River {
  /** Water Survey of Canada station number. */
  station: string;
  /** Short name for display, not the station's own shouting-caps name. */
  name: string;
  province: string;
  /** Cubic metres per second. */
  discharge: number;
  /** Observation timestamp (ISO, UTC). */
  at: string;
  live: boolean;
}

/**
 * Four rivers, one per drainage basin, chosen so the row reads as the country
 * rather than as one region: Pacific, Arctic, and two in the St. Lawrence /
 * Great Lakes system.
 */
const RIVERS: Array<Omit<River, 'discharge' | 'at' | 'live'> & { fallback: number; fallbackAt: string }> = [
  { station: '08MF005', name: 'Fraser, at Hope',            province: 'BC', fallback: 1590,  fallbackAt: '2026-09-13T19:10:00Z' },
  { station: '10LC014', name: 'Mackenzie, at Arctic Red',   province: 'NT', fallback: 11400, fallbackAt: '2026-09-13T18:35:00Z' },
  { station: '02OA016', name: 'St. Lawrence, at LaSalle',   province: 'QC', fallback: 8950,  fallbackAt: '2026-09-13T19:15:00Z' },
  { station: '02KF005', name: 'Ottawa, at Britannia',       province: 'ON', fallback: 697,   fallbackAt: '2026-09-13T18:35:00Z' },
];

async function river(spec: (typeof RIVERS)[number]): Promise<River> {
  const base = { station: spec.station, name: spec.name, province: spec.province };
  try {
    const url =
      `${WEATHER}?STATION_NUMBER=${spec.station}&limit=1&sortby=-DATETIME&f=json`;
    const data = (await getJSON(url)) as {
      features?: Array<{ properties?: { DISCHARGE?: number | null; DATETIME?: string } }>;
    };
    const props = data.features?.[0]?.properties;
    // A gauge can report level without discharge; that is not a usable reading.
    if (!props || typeof props.DISCHARGE !== 'number' || !Number.isFinite(props.DISCHARGE)) {
      throw new Error('no discharge in latest observation');
    }
    return { ...base, discharge: props.DISCHARGE, at: props.DATETIME ?? '', live: true };
  } catch {
    return { ...base, discharge: spec.fallback, at: spec.fallbackAt, live: false };
  }
}

export interface Rivers {
  rivers: River[];
  /** Sum of the four, m³/s. */
  total: number;
  fetchedAt: string;
  allLive: boolean;
}

export async function getRivers(): Promise<Rivers> {
  const rivers = await Promise.all(RIVERS.map(river));
  return {
    rivers,
    total: rivers.reduce((sum, r) => sum + r.discharge, 0),
    fetchedAt: new Date().toISOString(),
    allLive: rivers.every((r) => r.live),
  };
}

/* ==========================================================================
   Trade by partner — Statistics Canada, table 12-10-0011.
   "International merchandise trade for all countries and by Principal
   Trading Partners, monthly." Customs basis, seasonally adjusted, exports.

   This is the evidence under Act IV. The argument is not that Canada should
   find other partners; it is that the diversification is already measurable,
   monthly, in an official series. Claimed vs. measured, again.

   GOTCHA, and it matters: getDataFromVectorsAndLatestNPeriods returns rows in
   an ORDER OF ITS OWN, not the order they were requested. Zipping the response
   against the request array silently mislabels every country. Always index the
   response by its own vectorId, which is what buildTrade does below.
   ========================================================================== */

export interface Partner {
  name: string;
  /** Most recent month's merchandise exports, $ millions. */
  exports: number;
  /** Change against the same month a year earlier, percent. */
  changePct: number | null;
  /** Share of the partners tracked here, percent. */
  sharePct: number;
  live: boolean;
}

/**
 * Vector IDs resolved from the cube's own coordinates
 * (Canada / Export / Customs / Seasonally adjusted / <partner>).
 * Fallbacks are the July 2026 published values, $M.
 */
const PARTNERS: Array<{ name: string; vector: number; fallback: number; fallbackChange: number }> = [
  { name: 'United States',  vector: 87008898, fallback: 48896, fallbackChange: 7.7 },
  { name: 'United Kingdom', vector: 87008900, fallback: 6604,  fallbackChange: 112.2 },
  { name: 'European Union', vector: 87008899, fallback: 4264,  fallbackChange: 28.3 },
  { name: 'China',          vector: 87008907, fallback: 4049,  fallbackChange: 44.0 },
  { name: 'Japan',          vector: 87008909, fallback: 1250,  fallbackChange: -10.4 },
  { name: 'Mexico',         vector: 87008908, fallback: 1024,  fallbackChange: 38.5 },
  { name: 'South Korea',    vector: 87008910, fallback: 863,   fallbackChange: 57.3 },
  { name: 'India',          vector: 87008915, fallback: 456,   fallbackChange: 34.7 },
  { name: 'Australia',      vector: 87008921, fallback: 386,   fallbackChange: 75.8 },
];

export interface Trade {
  partners: Partner[];
  /** Reference month of the latest figures (YYYY-MM-DD). */
  asOf: string;
  /** United States share of the tracked partners, percent. */
  usSharePct: number;
  /** Everyone except the United States, $M per month. */
  restOfWorld: number;
  fetchedAt: string;
  allLive: boolean;
}

export async function getTrade(): Promise<Trade> {
  // Start from the published fallbacks so a total failure still renders a
  // complete, correctly-labelled table.
  const values = new Map<number, { exports: number; changePct: number | null; live: boolean }>(
    PARTNERS.map((p) => [p.vector, { exports: p.fallback, changePct: p.fallbackChange, live: false }]),
  );
  let asOf = '2026-07-01';

  try {
    const body = PARTNERS.map((p) => ({ vectorId: p.vector, latestN: 13 }));
    const data = (await getJSON(`${WDS}/getDataFromVectorsAndLatestNPeriods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })) as Array<{
      status?: string;
      object?: { vectorId?: number; vectorDataPoint?: Array<{ refPer: string; value: number }> };
    }>;

    for (const row of data ?? []) {
      // Index by the row's own vectorId — never by position. See the note above.
      const vec = row.object?.vectorId;
      if (row.status !== 'SUCCESS' || vec == null || !values.has(vec)) continue;
      const pts = row.object?.vectorDataPoint;
      if (!pts?.length) continue;

      const last = pts[pts.length - 1];
      const first = pts[0];
      if (!Number.isFinite(last.value)) continue;

      values.set(vec, {
        exports: last.value,
        changePct:
          pts.length > 1 && Number.isFinite(first.value) && first.value !== 0
            ? (last.value / first.value - 1) * 100
            : null,
        live: true,
      });
      asOf = last.refPer;
    }
  } catch {
    /* fallbacks stand, and `live` stays false on every row */
  }

  const total = PARTNERS.reduce((sum, p) => sum + (values.get(p.vector)?.exports ?? 0), 0);
  const partners: Partner[] = PARTNERS.map((p) => {
    const v = values.get(p.vector)!;
    return {
      name: p.name,
      exports: v.exports,
      changePct: v.changePct,
      sharePct: total ? (v.exports / total) * 100 : 0,
      live: v.live,
    };
  }).sort((a, b) => b.exports - a.exports);

  const us = partners.find((p) => p.name === 'United States');
  return {
    partners,
    asOf,
    usSharePct: us?.sharePct ?? 0,
    restOfWorld: total - (us?.exports ?? 0),
    fetchedAt: new Date().toISOString(),
    allLive: partners.every((p) => p.live),
  };
}

/* ==========================================================================
   Provinces — StatCan population (17-10-0009) and GDP (36-10-0222).

   Feeds the separation calculator. The point of pulling these live rather than
   hard-coding them is that the calculator's inputs are then checkable against
   the same tables anyone else can open, which is the only reason its outputs
   are worth anything.
   ========================================================================== */

export interface Province {
  code: string;
  name: string;
  /** Most recent quarterly estimate. */
  population: number;
  /** GDP at market prices, current dollars, $ millions, annual. */
  gdp: number;
  gdpYear: string;
  live: boolean;
}

const PROV: Array<{ code: string; name: string; popVec: number; gdpVec: number; pop: number; gdp: number }> = [
  { code: 'ON', name: 'Ontario',                   popVec: 12, gdpVec: 62788002, pop: 16103890, gdp: 1197020 },
  { code: 'QC', name: 'Quebec',                    popVec: 11, gdpVec: 62787885, pop: 9016222,  gdp: 616771 },
  { code: 'BC', name: 'British Columbia',          popVec: 3,  gdpVec: 62788470, pop: 5646420,  gdp: 429089 },
  { code: 'AB', name: 'Alberta',                   popVec: 15, gdpVec: 62788353, pop: 5057077,  gdp: 473937 },
  { code: 'MB', name: 'Manitoba',                  popVec: 13, gdpVec: 62788119, pop: 1503865,  gdp: 96125 },
  { code: 'SK', name: 'Saskatchewan',              popVec: 14, gdpVec: 62788236, pop: 1266092,  gdp: 112839 },
  { code: 'NS', name: 'Nova Scotia',               popVec: 9,  gdpVec: 62787651, pop: 1090852,  gdp: 65338 },
  { code: 'NB', name: 'New Brunswick',             popVec: 10, gdpVec: 62787768, pop: 866497,   gdp: 48302 },
  { code: 'NL', name: 'Newfoundland and Labrador', popVec: 2,  gdpVec: 62787417, pop: 547910,   gdp: 42219 },
  { code: 'PE', name: 'Prince Edward Island',      popVec: 8,  gdpVec: 62787534, pop: 181715,   gdp: 10889 },
];

export interface Provinces {
  provinces: Province[];
  /** National population, for the federal debt-share calculation. */
  canadaPopulation: number;
  fetchedAt: string;
  allLive: boolean;
}

export async function getProvinces(): Promise<Provinces> {
  const pop = new Map<number, number>();
  const gdp = new Map<number, { v: number; per: string }>();

  try {
    const body = [
      ...PROV.map((p) => ({ vectorId: p.popVec, latestN: 1 })),
      ...PROV.map((p) => ({ vectorId: p.gdpVec, latestN: 1 })),
    ];
    const data = (await getJSON(`${WDS}/getDataFromVectorsAndLatestNPeriods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })) as Array<{
      status?: string;
      object?: { vectorId?: number; vectorDataPoint?: Array<{ refPer: string; value: number }> };
    }>;
    // Indexed by the row's own vectorId. The WDS does not preserve request order.
    for (const row of data ?? []) {
      const vec = row.object?.vectorId;
      const pts = row.object?.vectorDataPoint;
      if (row.status !== 'SUCCESS' || vec == null || !pts?.length) continue;
      const last = pts[pts.length - 1];
      if (!Number.isFinite(last.value)) continue;
      if (PROV.some((p) => p.popVec === vec)) pop.set(vec, last.value);
      else gdp.set(vec, { v: last.value, per: last.refPer });
    }
  } catch {
    /* fallbacks below */
  }

  const provinces: Province[] = PROV.map((p) => {
    const pv = pop.get(p.popVec);
    const gv = gdp.get(p.gdpVec);
    return {
      code: p.code,
      name: p.name,
      population: pv ?? p.pop,
      gdp: gv?.v ?? p.gdp,
      gdpYear: (gv?.per ?? '2024-01-01').slice(0, 4),
      live: pv != null && gv != null,
    };
  });

  return {
    provinces,
    canadaPopulation: provinces.reduce((s, p) => s + p.population, 0),
    fetchedAt: new Date().toISOString(),
    allLive: provinces.every((p) => p.live),
  };
}
