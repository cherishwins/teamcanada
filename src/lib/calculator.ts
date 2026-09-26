/**
 * The separation bill's arithmetic, in one copy.
 *
 * /calculator runs it for every province at build time, and
 * tools/generate-og.cjs runs it for the share card. The card used to carry a
 * typed "$253B" beside a page that printed $254B for the same province: a
 * figure typed twice, disagreeing with itself.
 *
 * Every constant here is published and cited on the page itself. The
 * calculator's only claim is arithmetic: it does not estimate anything it
 * cannot show the source for, and each line states its own method. Every
 * sourced value comes from src/lib/figures.ts, the one place a hand-entered
 * number on this site is written; the one assumption of the calculator's own,
 * the markup for a negotiation going badly, is named here and printed on the
 * page from here.
 */
import {
  FEDERAL_DEBT, FRICTION_LOW, FRICTION_HIGH,
  BUILD_STATE_LOW_B, BUILD_STATE_HIGH_B, NATO_PCT, NATO_DIRECT_PCT,
} from './figures';

export const DEBT_HIGH_MARKUP = 0.15;

export interface Basis {
  /** Canada's population, in the same StatCan release as the province's. */
  canadaPopulation: number;
  /**
   * Alberta's population in that release. The Alberta Prosperity Project
   * costed an Alberta state at $98-107B; other provinces are scaled per person
   * from that, and dividing by Alberta's count in the SAME dataset makes
   * Alberta reproduce the published range exactly.
   */
  buildBasePop: number;
}

/**
 * The bill for a province of `pop` people and `gdpM` million dollars of GDP.
 *
 * The arithmetic used to run twice on the page: once at build for the
 * default province, and again in an inline script that carried the live
 * StatCan population in its source via define:vars. Two copies of the math
 * could drift, and worse, the script's CSP hash moved whenever StatCan
 * published a new quarter or timed out during a build, so the next deploy
 * after either failed check-csp. Now each <option> carries its province's
 * finished lines as text, and the script only swaps them in.
 */
export function bill(pop: number, gdpM: number, { canadaPopulation, buildBasePop }: Basis) {
  const lossLow = gdpM * FRICTION_LOW;
  const lossHigh = gdpM * FRICTION_HIGH;
  const debtLow = FEDERAL_DEBT.value * 1000 * (pop / canadaPopulation);
  const debtHigh = debtLow * (1 + DEBT_HIGH_MARKUP);
  const buildLow = ((BUILD_STATE_LOW_B * 1000) / buildBasePop) * pop;
  const buildHigh = ((BUILD_STATE_HIGH_B * 1000) / buildBasePop) * pop;
  const natoLow = gdpM * NATO_DIRECT_PCT;
  const natoHigh = gdpM * NATO_PCT;
  const totLow = debtLow + buildLow;
  const totHigh = debtHigh + buildHigh;
  const recurring = lossLow + natoHigh;
  return { lossLow, lossHigh, debtLow, debtHigh, buildLow, buildHigh,
           natoLow, natoHigh, totLow, totHigh, recurring };
}

/** Millions of dollars as "$254B", "$6.2B" or "$840M". */
export const big = (m: number) => {
  const b = m / 1000;
  return b >= 1 ? `$${b.toFixed(b < 10 ? 1 : 0)}B` : `$${Math.round(m)}M`;
};
