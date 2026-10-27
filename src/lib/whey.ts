/**
 * The whey plan's arithmetic, in one copy.
 *
 * Paper No. 05 (/read/the-protein-leaves-as-water) is built on a planning
 * model: one skid beside one cheese vat, a hundred thousand litres of sweet
 * whey a day, three hundred days a year. The paper prints about forty numbers
 * from it, and every one of them is a consequence of the inputs below. The
 * PDF the paper came from typed each of them, and a typed consequence is a
 * number that drifts from its premise the first time the premise moves: the
 * same page said "under 6 months" for a payback the inputs put at 6.0. So the
 * page runs the model and prints what comes out, and so does its share card.
 *
 * None of this is a published figure. It is the paper's own model, stated on
 * the page as one, and nothing here goes to /sources: the receipts page is for
 * figures somebody else published. What IS published (the surtax, the import
 * share, the price series, the program) lives in src/lib/figures.ts.
 *
 * The mass balance follows the plan behind the paper (kept in
 * notes/canadian-whey-business-plan.md): raw sweet whey at 6.5% solids of
 * which 0.85% is true protein and 0.35% fat; the clarifier takes the fat down
 * to 0.04%, and that fat is sold as 40% cream; ultrafiltration keeps 92% of
 * the protein; the powder is 76% protein as it ships (80% on a dry basis at
 * 5% moisture). The base case does not use what the membranes could yield;
 * it uses 650 kg a day, and the paper says why.
 */

export const MODEL = {
  /** Sweet whey into the skid, litres a day. */
  litresPerDay: 100_000,
  /** Operating days a year. */
  days: 300,
  /** Whey density, kg per litre. */
  density: 1.025,
  /** True whey protein, share of mass. */
  proteinShare: 0.0085,
  /** Fat in the raw whey, and what the clarifier leaves behind. */
  fatInShare: 0.0035,
  fatOutShare: 0.0004,
  /** Cream is sold at 40% fat. */
  creamFatShare: 0.40,
  /** Dollars a kilogram of butterfat, held conservative. */
  fatPricePerKg: 8.5,
  /** Share of the protein the ultrafiltration membranes keep. */
  ufRetention: 0.92,
  /** Protein share of the powder as it ships (80% dry basis, 5% moisture). */
  powderProteinAsIs: 0.76,
  /** The base case's powder, kg a day. Deliberately below what the membranes could yield. */
  basePowderKgDay: 650,
  /** Protein retentate leaving the skid, litres a day, at 25% solids. */
  retentateLitres: 3_000,
  /** Permeate (lactose, minerals, water) leaving the skid, litres a day. */
  permeateLitres: 95_000,
  /** Bulk powder price, dollars a kilogram, base and downside. */
  pricePerKg: 17.5,
  downsidePricePerKg: 14,
  /** Toll drying, dollars a kilogram of powder. */
  tollPerKg: 2.25,
  /** Fixed lines, dollars a year. Power and membranes rise a little at full yield. */
  freight: 195_000,
  labour: 410_000,
  power: 180_000,
  powerAtMaxYield: 195_000,
  membranes: 120_000,
  membranesAtMaxYield: 135_000,
  licence: 95_000,
  /** Repayment on a $630,000 interest-free loan over five years, if one is ever made. */
  loanRepayment: 126_000,
  /** Installed capital, no spray dryer: the range and the middle the paper models. */
  capexLow: 1_100_000,
  capexHigh: 2_200_000,
  capex: 1_800_000,
  /** The share a grant would have to cover for the rest to be $990,000. The ask, not a published rate. */
  grantShare: 0.45,
  /** The share of what is left that goes back to the host cheese plant. */
  plantShare: 0.30,
  /** The capital lines, low and high, dollars. */
  skid: [
    { label: 'Clarifier and cream separator', low: 150_000, high: 300_000 },
    { label: 'Ultrafiltration and diafiltration skid', low: 450_000, high: 900_000 },
    { label: 'Clean-in-place, and water recovery', low: 100_000, high: 200_000 },
    { label: 'Two chilled tanks', low: 120_000, high: 250_000 },
    { label: 'Heat exchangers and a chiller', low: 80_000, high: 150_000 },
    { label: 'Stainless tie-in and commissioning', low: 200_000, high: 400_000 },
  ],
} as const;

/** What one day of whey becomes, before anything is sold. */
export function day() {
  const kg = MODEL.litresPerDay * MODEL.density;
  // 102,500 kg × 0.31% is 317.75 kg exactly; the float is a hair under, and
  // the year's cream would then round to $810,262 instead of $810,263.
  const fatKg = Math.round(kg * (MODEL.fatInShare - MODEL.fatOutShare) * 100) / 100;
  const creamKg = fatKg / MODEL.creamFatShare;
  const proteinKg = kg * MODEL.proteinShare * MODEL.ufRetention;
  // What the membranes could yield, rounded down: a ceiling is rounded toward
  // caution, and the plan behind the paper prints the same number.
  const maxPowderKg = Math.floor(proteinKg / MODEL.powderProteinAsIs);
  const volumeCutPct = (1 - MODEL.retentateLitres / MODEL.litresPerDay) * 100;
  return { fatKg, creamKg, proteinKg, maxPowderKg, volumeCutPct };
}

/** Cream revenue for the year: it comes off the clarifier, so it is the same in every case. */
export const creamRevenue = () => day().fatKg * MODEL.days * MODEL.fatPricePerKg;

export interface Year {
  name: string;
  powderKgDay: number;
  pricePerKg: number;
  powderKg: number;
  powderRevenue: number;
  cream: number;
  revenue: number;
  toll: number;
  freight: number;
  labour: number;
  power: number;
  membranes: number;
  licence: number;
  opex: number;
  ebitda: number;
  loan: number;
  left: number;
  /** Months to pay back the capital a grant does not cover, from what is left. */
  paybackMonths: number;
}

/** Capital the plan has to find without a grant. */
export const netCapital = () => MODEL.capex * (1 - MODEL.grantShare);
/** What the grant would cover, if it covered the share the paper asks for. */
export const grantAmount = () => MODEL.capex * MODEL.grantShare;

export function year(name: string, powderKgDay: number, pricePerKg: number, atMaxYield = false): Year {
  const powderKg = powderKgDay * MODEL.days;
  const powderRevenue = powderKg * pricePerKg;
  const cream = creamRevenue();
  const revenue = powderRevenue + cream;
  const toll = powderKg * MODEL.tollPerKg;
  const power = atMaxYield ? MODEL.powerAtMaxYield : MODEL.power;
  const membranes = atMaxYield ? MODEL.membranesAtMaxYield : MODEL.membranes;
  const opex = toll + MODEL.freight + MODEL.labour + power + membranes + MODEL.licence;
  const ebitda = revenue - opex;
  const left = ebitda - MODEL.loanRepayment;
  return {
    name, powderKgDay, pricePerKg, powderKg, powderRevenue, cream, revenue, toll,
    freight: MODEL.freight, labour: MODEL.labour, power, membranes, licence: MODEL.licence,
    opex, ebitda, loan: MODEL.loanRepayment, left,
    paybackMonths: netCapital() / (left / 12),
  };
}

/** The three cases the paper prints, in its order. */
export function cases() {
  const d = day();
  return {
    downside: year('Downside', MODEL.basePowderKgDay, MODEL.downsidePricePerKg),
    base: year('Base', MODEL.basePowderKgDay, MODEL.pricePerKg),
    max: year('If yield holds', d.maxPowderKg, MODEL.pricePerKg, true),
  };
}

/** What the host plant is paid in the base case: its share of what is left, and that per litre. */
export function plant() {
  const b = cases().base;
  const share = b.left * MODEL.plantShare;
  const litres = MODEL.litresPerDay * MODEL.days;
  return { share, litres, centsPerLitre: (share / litres) * 100 };
}

/**
 * What a kilogram of United States powder costs landed in Canada, before
 * freight: the US price a pound, in kilograms, in Canadian dollars, with the
 * surtax on top. The surtax is applied to the value for duty, which is the
 * price, not a price after freight; this is the low end of the bill.
 */
export const LB_PER_KG = 1 / 0.45359237;
export function landed(usdPerLb: number, fx: number, surtax: number) {
  const usdPerKg = usdPerLb * LB_PER_KG;
  const cadPerKg = usdPerKg * fx;
  const withSurtax = cadPerKg * (1 + surtax);
  return { usdPerKg, cadPerKg, withSurtax, surtaxPerKg: withSurtax - cadPerKg };
}

/** Sum of the skid's capital lines, low and high. */
export const skidTotal = () => ({
  low: MODEL.skid.reduce((s, r) => s + r.low, 0),
  high: MODEL.skid.reduce((s, r) => s + r.high, 0),
});

/** Dollars, grouped, no cents: the form the paper prints. */
export const dollars = (v: number) => `$${new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 }).format(Math.round(v))}`;
export const kg = (v: number) => `${new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 }).format(Math.round(v))} kg`;
