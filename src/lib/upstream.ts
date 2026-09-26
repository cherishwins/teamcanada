/**
 * The upstream page or endpoint behind a series ID, so "checkable" is one
 * click rather than a search. /sources links every table ID through this, and
 * the Dataset markup (src/lib/schema.ts) cites the same URLs in isBasedOn, so
 * the receipts page and the machine-readable provenance cannot disagree. The
 * weekly link check (tools/check-links.cjs) keeps them alive.
 *
 *   Statistics Canada  NN-NN-NNNN  → the web table (pid is the ID plus "01")
 *   Bank of Canada     Valet series → the most recent observation, as JSON
 *   World Bank         indicator    → Canada and the US, latest value, JSON
 *   ECCC               hydrometric-realtime → the OGC API collection
 *   OpenParliament     votes/45-1   → every recorded division of that session
 *
 * Returns null for anything it does not recognise; the ID then renders as
 * plain text rather than a link to nowhere.
 */
export function upstream(id: string): string | null {
  if (/^\d{2}-\d{2}-\d{4}$/.test(id)) return `https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=${id.replace(/-/g, '')}01`;
  if (/^(V\d+|FX[A-Z]{6})$/.test(id)) return `https://www.bankofcanada.ca/valet/observations/${id}/json?recent=1`;
  if (/^ER\.H2O\./.test(id)) return `https://api.worldbank.org/v2/country/CAN;USA/indicator/${id}?format=json&mrv=1`;
  if (id === 'hydrometric-realtime') return 'https://api.weather.gc.ca/collections/hydrometric-realtime';
  if (/^votes\/\d+-\d+$/.test(id)) return `https://openparliament.ca/${id}/`;
  return null;
}
