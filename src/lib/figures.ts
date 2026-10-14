/**
 * Every hand-entered figure on this site, written once.
 *
 * `src/lib/sources.ts` covers the LIVE figures — fetched, with a fallback and a
 * date. This file covers the other kind: numbers that come out of a document
 * rather than an endpoint, and therefore have to be typed by a person. The site
 * has a long record of what happens to typed numbers. The water ratio was typed
 * and went wrong for years. `llms.txt` restated a live figure and drifted from
 * it in a day. `CLAUDE.md` has described something untrue four times. Every one
 * of those was a value written down in more than one place, or written down and
 * never looked at again.
 *
 * So the rule is the same as everywhere else here: write it once, render it
 * from the one copy, and make the build say something when it goes stale.
 *
 * WHAT THIS FIXES, CONCRETELY. The federal accumulated deficit was typed in
 * three places — a number in the calculator's constants, the string `$1,266B`
 * in /math, and the string `$1,266B` again in /sources. The calculator
 * interpolated its raw constant and rendered **`$1266B`** while the other two
 * rendered **`$1,266B`**: the same figure, printed two different ways, on a
 * site whose whole argument is that its figures are checkable. Nobody typed
 * that inconsistency on purpose. It is just what three copies do.
 *
 * ADDING A FIGURE. Put it here, give it a `display` that is exactly how it
 * should print, and cite it. If the source republishes on a cycle, set
 * `reviewBy` — `tools/check-figures.cjs` fails the build the day it passes,
 * which is the only part of this that cannot be forgotten.
 */

export interface StaticFigure {
  /** The machine value, for arithmetic. Unformatted. */
  readonly value: number;
  /** Exactly how this figure prints, everywhere it appears. */
  readonly display: string;
  /** Who published it. Matches the `source` column on /sources. */
  readonly source: string;
  /** The period it describes, or '—' where the figure has no vintage. */
  readonly period: string;
  /**
   * ISO date after which this figure must be re-checked against its source,
   * for figures whose publisher runs on a cycle. The build FAILS once it
   * passes — see tools/check-figures.cjs. Omit for figures that do not have
   * a next edition: the number of lakes over 100 km² is not waiting on a
   * release, and a review date on it would be noise that teaches people to
   * ignore the real ones.
   */
  readonly reviewBy?: string;
  /** Why it expires, and what to replace it with. Read by whoever it wakes. */
  readonly reviewNote?: string;
}

/**
 * The federal accumulated deficit, and the reason this file exists.
 *
 * Verified against the primary source rather than carried forward: the Annual
 * Financial Report for 2024-25 (Department of Finance, published 7 November
 * 2025) states "the accumulated deficit … or federal debt, stood at $1,266.5
 * billion at March 31, 2025". The site rounds to $1,266B and says March 2025.
 *
 * DO NOT swap this for StatCan table 10-10-0002. That series is "central
 * government debt", which is a DIFFERENT definition, and substituting it would
 * repeat precisely the error that retired "eleven times" — two numbers that
 * look comparable, computed on different bases. The replacement is the next
 * Public Accounts, or nothing.
 *
 * It is not live because there is no key-free endpoint for it. Public Accounts
 * is tabled as a document. That is exactly why it needs `reviewBy`.
 */
export const FEDERAL_DEBT: StaticFigure = {
  value: 1266,
  display: '$1,266B',
  source: 'Public Accounts of Canada',
  period: 'March 2025',
  // Public Accounts 2025 (for FY2024-25) was tabled in November 2025. The next
  // edition covers FY2025-26 and lands on the same autumn cycle. The Fiscal
  // Monitor's running year-end number is NOT a substitute — Finance states it
  // is before end-of-year adjustments and is superseded by Public Accounts.
  reviewBy: '2026-12-15',
  reviewNote:
    'Public Accounts of Canada for FY2025-26 should be tabled by now. Take the accumulated deficit at 31 March 2026 from the Annual Financial Report, update value/display/period here, and move reviewBy on a year. Do not use the Fiscal Monitor year-end figure: Finance labels it pre-adjustment.',
};

/**
 * Trade-friction cost of separation. Trevor Tombe, University of Calgary: a 5%
 * rise in friction with the rest of Canada costs about 4% of GDP, 8% friction
 * about 6%. A published elasticity, not a release — no next edition, so no
 * review date.
 */
export const FRICTION_LOW = 0.04;
export const FRICTION_HIGH = 0.06;

/**
 * Cost of standing up a state, taken from the separation campaign's own
 * costing so the argument runs on their numbers rather than ours. Scaled per
 * person for other provinces, which is generous to their case: smaller states
 * do not get proportionally cheaper departments. The per-person base is
 * Alberta's population in the calculator's own dataset (see calculator.astro),
 * so Alberta reproduces $98-107B exactly; it is not a figure typed here.
 */
export const BUILD_STATE_LOW_B = 98;
export const BUILD_STATE_HIGH_B = 107;

/** NATO's Hague pledge, 2025: 5% of GDP by 2035. */
export const NATO_PCT = 0.05;
/** The direct-military part of that pledge; the other 1.5% is defence-related. */
export const NATO_DIRECT_PCT = 0.035;

/**
 * Nitrogen a plant recovers from a leaf before dropping it.
 *
 * Vergütz, Manzoni, Porporato, Novais & Jackson, "Global resorption
 * efficiencies and concentrations of carbon and nutrients in leaves of
 * terrestrial plants", Ecological Monographs 82(2): 205–220, 2012,
 * doi:10.1890/11-0416.1. From the abstract: a meta-analysis of 86 studies and
 * about 1,000 data points across six plant types found N resorption "differed
 * significantly from the commonly used global value of 50% (62.1%)".
 *
 * A GLOBAL mean across ferns, forbs, grasses, conifers and both kinds of woody
 * angiosperm — not a maple figure. /read/the-red-is-the-work says "a plant",
 * not "a maple", for that reason; do not tighten the prose to maples without
 * a maple source. A published finding, not a release: no next edition, so no
 * review date.
 */
export const N_RESORPTION: StaticFigure = {
  value: 62.1,
  display: '62%',
  source: 'Vergütz et al., Ecological Monographs',
  period: '2012 paper',
};

/**
 * Bill C-5's retained GDP, per Canadian, per year. From the 2022
 * Macdonald-Laurier Institute paper by Manucha and Tombe on full mutual
 * recognition between provinces. A published estimate, not a release: no next
 * edition, so no review date.
 *
 * /math and /build print it, and so do their share cards. Most copies were
 * typed as `$5,100`, and the one Act III's playbook section builds to had been
 * lost in migration: its label printed with no number above it. Every copy
 * now renders `display` from here. /sources shows it with its unit, "per
 * Canadian", composed below rather than typed a second time.
 */
export const C5_RETAINED_GDP: StaticFigure = {
  value: 5100,
  display: '$5,100',
  source: 'Macdonald-Laurier Institute',
  period: '2022 paper',
};

/**
 * The oil sands tailings figures Paper No. 02 (/read/the-waiting-discount)
 * runs on. Three numbers from two annual documents, neither with an endpoint.
 *
 * FLUID_TAILINGS is the regional inventory of fluid tailings, new and legacy,
 * from the Alberta Energy Regulator's "State of Fluid Tailings Management for
 * Mineable Oil Sands, 2024" (cover-dated 30 October 2025), section 7: "Total
 * fluid tailings volumes increased from 1075 million cubic metres (Mm³) in
 * 2014 to 1505 Mm³ in 2024." The same section gives the year's net addition
 * (43.8 Mm³) and section 7.2 the water held in the ponds (380.7 Mm³); those
 * print in the paper from the report, footnoted, and are not repeated here
 * because nothing else on the site prints them. The report's own Appendix 3
 * sums to about 55 Mm³ more and is footnoted as possibly including
 * ready-to-reclaim volumes; cite the headline as the report states it.
 *
 * TAILINGS_SECURITY and TAILINGS_LIABILITY are the Mine Financial Security
 * Program's oil sands mine figures as of September 2025: $1.8 billion held
 * against $51.9 billion of operator-estimated closure liability. The pair
 * quoted most often, $2.6 billion against $52.7 billion, INCLUDES the coal
 * mines; the Auditor General of Alberta's December 2025 audit of the program
 * and the ABlawg analysis of the AER's 2025 data both give the oil-sands-only
 * split. Do not mix the two bases: that is the two-vintages error again.
 *
 * Both publishers run on a yearly cycle (the AER's tailings report each
 * autumn, the MFSP figures each September), which is exactly the case
 * `reviewBy` exists for.
 */
export const FLUID_TAILINGS: StaticFigure = {
  value: 1505,
  display: '1,505 million m³',
  source: 'Alberta Energy Regulator',
  period: '2024',
  reviewBy: '2026-12-15',
  reviewNote:
    'The AER\'s State of Fluid Tailings Management report for 2025 should be out by now (the 2024 edition was published 30 October 2025). Take the regional total from its section on fluid tailings volumes, update value/display/period, re-read the paper\'s section 7 figures (the year\'s net addition and the ponded water) and its Figure 1 series, and move reviewBy on a year.',
};

export const TAILINGS_SECURITY: StaticFigure = {
  value: 1.8,
  display: '$1.8B',
  source: 'Alberta Energy Regulator, MFSP',
  period: 'September 2025',
  reviewBy: '2026-12-15',
  reviewNote:
    'The MFSP security and liability figures for September 2026 should be published by now. Take the OIL SANDS MINE figures (not the combined oil sands and coal total) for security held and estimated liability, update TAILINGS_SECURITY and TAILINGS_LIABILITY together, and move both reviewBy dates on a year.',
};

export const TAILINGS_LIABILITY: StaticFigure = {
  value: 51.9,
  display: '$51.9B',
  source: 'Alberta Energy Regulator, MFSP',
  period: 'September 2025',
  reviewBy: '2026-12-15',
  reviewNote:
    'Update with TAILINGS_SECURITY, from the same MFSP publication, oil sands mines only.',
};

/** The share of the oil sands closure liability that is secured. Computed, never typed. */
export const TAILINGS_SECURED_PCT = (TAILINGS_SECURITY.value / TAILINGS_LIABILITY.value) * 100;

/**
 * The figures /sources lists as fixed, in the order the page shows them.
 *
 * /sources used to retype each of these. It now renders this array, so a figure
 * cannot appear on the receipts page saying one thing and on an act saying
 * another — the failure mode the whole page exists to prevent.
 */
export const FIXED_FIGURES: readonly (StaticFigure & { figure: string; note?: string })[] = [
  { figure: 'Lakes larger than 100 km²', value: 563, display: '563',
    source: 'Statistics Canada', period: '—',
    note: 'Volume-based. No denominator, so no vintage problem.' },
  { figure: 'Share of the world’s wetlands', value: 25, display: '~25%',
    source: 'Statistics Canada', period: '—' },
  { figure: 'Great Lakes share of global fresh surface water', value: 18, display: '~18%',
    source: 'Statistics Canada', period: '—' },
  { figure: 'Canada–US border that is water', value: 40, display: '~40%',
    source: 'Statistics Canada', period: '—' },
  { figure: 'Passengers diverted, 11 September 2001', value: 33000, display: '33,000+',
    source: 'Transport Canada', period: '2001' },
  { figure: 'Aircraft and people received at Gander', value: 6595, display: '38 · 6,595',
    source: 'Transport Canada', period: '2001' },
  { figure: 'Canadian deaths, Afghanistan', value: 158, display: '158',
    source: 'Canadian Armed Forces', period: '2001–2014' },
  { figure: 'Federal accumulated deficit', ...FEDERAL_DEBT },
  { figure: 'Trade-friction cost of separation', value: 4, display: '4–6% of GDP',
    source: 'Tombe, University of Calgary', period: '—',
    note: '4% at a 5% rise in friction; 6% at 8%. Feeds the calculator.' },
  { figure: 'Cost of standing up a state', value: BUILD_STATE_LOW_B, display: '$98–107B',
    source: 'Alberta Prosperity Project', period: '—',
    note: 'The separation campaign’s own costing, used as published and scaled per person for other provinces.' },
  { figure: 'Defence floor', value: 5, display: '5% of GDP',
    source: 'NATO, Hague summit', period: '2025' },
  { figure: 'Bill C-5 retained GDP', ...C5_RETAINED_GDP,
    display: `${C5_RETAINED_GDP.display} per Canadian` },
  { figure: 'Oil sands fluid tailings, new and legacy', ...FLUID_TAILINGS,
    note: 'The regional inventory across every mine. The paper on it prints the year’s addition and the ponded water from the same report.' },
  { figure: 'Oil sands mine closure security held', ...TAILINGS_SECURITY,
    note: 'Oil sands mines only; the figure usually quoted includes the coal mines.' },
  { figure: 'Oil sands mine closure liability, operator-estimated', ...TAILINGS_LIABILITY,
    note: 'Oil sands mines only. The security above covers about ' + TAILINGS_SECURED_PCT.toFixed(1) + '% of it.' },
  { figure: 'Leaf nitrogen a plant takes back before the leaf falls', ...N_RESORPTION,
    note: 'Global mean across six plant types, 86 studies, about 1,000 data points. Not a maple-specific figure, and the read that cites it says “a plant”, not “a maple”.' },
];
