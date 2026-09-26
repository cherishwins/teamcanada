/**
 * What every public endpoint under /api/ does besides its data.
 *
 * The figures are public-domain and served CORS-open so anyone can build on
 * them. An audit of the live site found that promise half kept:
 *   - a cross-origin fetch that sent any header (Content-Type, Cache-Control)
 *     needs a preflight, and OPTIONS answered 404, so the fetch failed;
 *   - POST and the rest answered 404 or 403, where RFC 9110 says 405 with an
 *     Allow header;
 *   - any query string made a request a cache miss at the edge, so
 *     ?cb=<random> ran the function and hit StatCan on every call: a
 *     serverless invocation per request on a free tier, for anyone to spend;
 *   - browsers got a bare `Cache-Control: public` (the edge strips s-maxage and
 *     stale-while-revalidate from the copy it forwards), so each fetch went back
 *     to the edge.
 * Each on-demand endpoint exports OPTIONS, ALL and HEAD from here, bounces a
 * query string to the bare path, and builds its cache header with `caching()`.
 * /api/record.json is a prerendered file; its headers are in vercel.json.
 */
import type { APIContext, APIRoute } from 'astro';

const METHODS = 'GET, HEAD, OPTIONS';
export const CORS = { 'Access-Control-Allow-Origin': '*' } as const;

export const OPTIONS: APIRoute = () =>
  new Response(null, {
    status: 204,
    headers: {
      ...CORS,
      'Access-Control-Allow-Methods': METHODS,
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  });

export const ALL: APIRoute = () => new Response(null, { status: 405, headers: { ...CORS, Allow: METHODS } });

/** HEAD is GET without the body, same status and headers. */
export const headOf = (get: APIRoute): APIRoute => async (ctx) => {
  const res = await get(ctx);
  return new Response(null, { status: res.status, headers: res.headers });
};

/** The data never depends on a query, so a query only defeats the cache. */
export function withoutQuery({ request }: Pick<APIContext, 'request'>): Response | null {
  const url = new URL(request.url);
  if (!url.search) return null;
  return new Response(null, {
    status: 308,
    headers: { ...CORS, Location: url.pathname, 'Cache-Control': 'public, max-age=86400' },
  });
}

/**
 * Browsers keep a live answer for `browser` seconds; the edge for `edge`, then
 * serves it stale for `stale` more while it revalidates. A fallback answer is
 * kept for a minute everywhere, so an outage does not pin older figures.
 */
export function caching(live: boolean, browser: number, edge: number, stale: number): string {
  return live
    ? `public, max-age=${browser}, s-maxage=${edge}, stale-while-revalidate=${stale}`
    : 'public, max-age=60, s-maxage=60';
}
