import { SITE, abs } from '../config.mjs';

/**
 * Structured data.
 *
 * Two things worth having beyond the site-level graph:
 *
 *  1. Article on each long-form piece, so a search engine understands them as
 *     articles with an author and a date rather than as anonymous pages.
 *  2. Dataset on the public endpoints. This site publishes four open,
 *     key-free, CORS-open feeds of Canadian government figures — that is a
 *     genuine dataset, and Dataset markup is how it becomes findable as one.
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
    spatialCoverage: { '@type': 'Country', name: 'Canada' },
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
    name: 'Renewable fresh water, Canada and the United States',
    description: 'Renewable internal freshwater resources per capita and in total, for Canada and the United States, from FAO AQUASTAT via the World Bank. One source, one reference year and one definition on both sides of the border, so the ratio between them is a figure anyone can reproduce in a single request.',
    endpoint: '/api/water.json',
    provider: 'FAO AQUASTAT; The World Bank',
    frequency: 'P1Y',
    keywords: ['Canada', 'United States', 'fresh water', 'renewable water resources', 'AQUASTAT', 'per capita', 'open data'],
  },
  {
    name: 'Canadian economic figures, live',
    description: 'Real GDP, population, CPI, the policy interest rate and USD/CAD, read on request from Statistics Canada and the Bank of Canada. Each figure carries the reference period it describes and a flag saying whether it came back live.',
    endpoint: '/api/figures.json',
    provider: 'Statistics Canada; Bank of Canada',
    frequency: 'PT1H',
    keywords: ['Canada', 'GDP', 'population', 'inflation', 'CPI', 'exchange rate', 'open data'],
  },
  {
    name: 'Canadian river discharge, real time',
    description: 'Discharge in cubic metres per second at four gauges, one per major drainage basin — Fraser, Mackenzie, St. Lawrence and Ottawa — from the Environment and Climate Change Canada hydrometric network.',
    endpoint: '/api/rivers.json',
    provider: 'Environment and Climate Change Canada',
    frequency: 'PT5M',
    keywords: ['Canada', 'hydrometric', 'river discharge', 'fresh water', 'open data'],
  },
  {
    name: 'Canadian merchandise exports by trading partner',
    description: 'Monthly merchandise exports, customs basis, seasonally adjusted, for nine principal trading partners, with year-over-year change and share.',
    endpoint: '/api/trade.json',
    provider: 'Statistics Canada',
    frequency: 'P1M',
    keywords: ['Canada', 'trade', 'exports', 'trading partners', 'open data'],
  },
  {
    name: 'Canadian provincial GDP and population',
    description: 'GDP at market prices and the most recent quarterly population estimate for all ten provinces.',
    endpoint: '/api/provinces.json',
    provider: 'Statistics Canada',
    frequency: 'P1Y',
    keywords: ['Canada', 'provinces', 'GDP', 'population', 'open data'],
  },
];
