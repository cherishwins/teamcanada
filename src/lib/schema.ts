import { SITE, abs } from '../config.mjs';

/**
 * Structured data.
 *
 * Two things worth having beyond the site-level graph:
 *
 *  1. Article on each long-form piece, so a search engine understands them as
 *     articles with an author and a date rather than as anonymous pages.
 *  2. Dataset on the public endpoints. This site publishes six open,
 *     key-free, CORS-open feeds — five of Canadian government figures and one
 *     of the House of Commons' own record — that is a genuine dataset, and
 *     Dataset markup is how it becomes findable as one.
 *     For a site whose only real asset is checkability, being indexed as a
 *     data source is the discovery channel that actually fits.
 */

const PERSON = { '@type': 'Person', name: SITE.author, url: SITE.origin } as const;
const PUBLISHER = {
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.origin,
  logo: { '@type': 'ImageObject', url: abs('/icon-512.png') },
} as const;

/** CC0 applies to everything here, and saying so machine-readably matters. */
const LICENCE = 'https://creativecommons.org/publicdomain/zero/1.0/';

export interface ArticleMeta {
  title: string;
  description: string;
  path: string;
  image: string;
  published: string;
  section: string;
  words?: number;
}

export function articleSchema(a: ArticleMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: abs(a.path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(a.path) },
    image: abs(a.image),
    datePublished: a.published,
    dateModified: a.published,
    author: PERSON,
    publisher: PUBLISHER,
    articleSection: a.section,
    inLanguage: 'en-CA',
    isAccessibleForFree: true,
    license: LICENCE,
    creditText: 'Public domain. No attribution required.',
    ...(a.words ? { wordCount: a.words } : {}),
  };
}

export interface DatasetMeta {
  name: string;
  description: string;
  endpoint: string;
  /** e.g. "Statistics Canada" */
  provider: string;
  /** ISO-8601 repeat interval, e.g. "PT1H" */
  frequency: string;
  keywords: string[];
  /**
   * The one-line blurb /sources prints beside the endpoint. It lives here so
   * that the receipts page lists its endpoints FROM this array and cannot
   * omit one: it did, for as long as /api/water.json existed, because the list
   * there was typed by hand and said "four endpoints" while five shipped.
   */
  short: string;
  /**
   * Where the data is ABOUT, as plain text.
   *
   * Google's Dataset documentation accepts Text, a Place carrying `geo`, or a
   * GeoShape — and nothing else. It does NOT accept Country, which is what
   * this file emitted, and Search Console flagged all five datasets with
   * "Invalid object type for field spatialCoverage". Country is perfectly good
   * schema.org (it descends from Place); Google's Dataset parser is simply
   * narrower than schema.org, which is the trap.
   *
   * Text is used rather than a Place with a bounding box because a box means
   * typing four coordinates, and this repo does not type numbers it cannot
   * cite. Google documents the named-location form explicitly.
   *
   * It is per-dataset because it is NOT the same for all of them: the water
   * dataset covers Canada AND the United States, and saying "Canada" there was
   * wrong on the facts as well as the type.
   */
  spatialCoverage: string;
}

export function datasetSchema(d: DatasetMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: d.name,
    description: d.description,
    url: abs('/sources'),
    license: LICENCE,
    isAccessibleForFree: true,
    creator: PERSON,
    publisher: PUBLISHER,
    keywords: d.keywords,
    spatialCoverage: d.spatialCoverage,
    includedInDataCatalog: { '@type': 'DataCatalog', name: `${SITE.name} — public figures`, url: abs('/sources') },
    distribution: [{
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: abs(d.endpoint),
    }],
    // Where the underlying numbers actually come from. The site is a
    // redistributor, not the source, and the markup should say that.
    isBasedOn: { '@type': 'Organization', name: d.provider },
  };
}

export const DATASETS: DatasetMeta[] = [
  {
    name: 'Recorded divisions of the House of Commons of Canada, 45th Parliament',
    description: 'Every recorded division of the 45th Parliament with every member\'s ballot, each party\'s majority position and dissent count, each member\'s party-line rate and the divisions where they broke with their party, and the party-vs-party agreement matrix. Counted from the House of Commons record as published by OpenParliament.ca; the party attributed to a member is the one they sat for on the day of the vote. Rebuilt after each sitting day.',
    endpoint: '/api/record.json',
    short: 'every recorded division and every ballot of the 45th Parliament, rebuilt after each sitting day',
    spatialCoverage: 'Canada',
    provider: 'House of Commons of Canada; OpenParliament.ca',
    frequency: 'P1D',
    keywords: ['Canada', 'House of Commons', 'Parliament', 'recorded divisions', 'votes', 'members of Parliament', 'party discipline', 'open data'],
  },
  {
    name: 'Renewable fresh water, Canada and the United States',
    description: 'Renewable internal freshwater resources per capita and in total, for Canada and the United States, from FAO AQUASTAT via the World Bank. One source, one reference year and one definition on both sides of the border, so the ratio between them is a figure anyone can reproduce in a single request.',
    endpoint: '/api/water.json',
    short: 'renewable fresh water, Canada and the United States, one source and one year',
    spatialCoverage: 'Canada and the United States',
    provider: 'FAO AQUASTAT; The World Bank',
    frequency: 'P1Y',
    keywords: ['Canada', 'United States', 'fresh water', 'renewable water resources', 'AQUASTAT', 'per capita', 'open data'],
  },
  {
    name: 'Canadian economic figures, live',
    description: 'Real GDP, population, CPI, the policy interest rate and USD/CAD, read on request from Statistics Canada and the Bank of Canada. Each figure carries the reference period it describes and a flag saying whether it came back live.',
    endpoint: '/api/figures.json',
    short: 'GDP · population · CPI · policy rate · USD/CAD',
    spatialCoverage: 'Canada',
    provider: 'Statistics Canada; Bank of Canada',
    frequency: 'PT1H',
    keywords: ['Canada', 'GDP', 'population', 'inflation', 'CPI', 'exchange rate', 'open data'],
  },
  {
    name: 'Canadian river discharge, real time',
    description: 'Discharge in cubic metres per second at four gauges, one per major drainage basin — Fraser, Mackenzie, St. Lawrence and Ottawa — from the Environment and Climate Change Canada hydrometric network.',
    endpoint: '/api/rivers.json',
    short: 'river discharge, four gauges, every five minutes',
    spatialCoverage: 'Canada',
    provider: 'Environment and Climate Change Canada',
    frequency: 'PT5M',
    keywords: ['Canada', 'hydrometric', 'river discharge', 'fresh water', 'open data'],
  },
  {
    name: 'Canadian merchandise exports by trading partner',
    description: 'Monthly merchandise exports, customs basis, seasonally adjusted, for nine principal trading partners, with year-over-year change and share.',
    endpoint: '/api/trade.json',
    short: 'merchandise exports by trading partner, monthly',
    spatialCoverage: 'Canada',
    provider: 'Statistics Canada',
    frequency: 'P1M',
    keywords: ['Canada', 'trade', 'exports', 'trading partners', 'open data'],
  },
  {
    name: 'Canadian provincial GDP and population',
    description: 'GDP at market prices and the most recent quarterly population estimate for all ten provinces.',
    endpoint: '/api/provinces.json',
    short: 'provincial GDP and population',
    spatialCoverage: 'Canada',
    provider: 'Statistics Canada',
    frequency: 'P1Y',
    keywords: ['Canada', 'provinces', 'GDP', 'population', 'open data'],
  },
];
