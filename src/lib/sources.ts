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
