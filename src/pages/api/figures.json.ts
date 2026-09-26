import type { APIRoute } from 'astro';
import { getFigures } from '../../lib/sources';

// On-demand rather than baked in at build: the whole point is that the numbers
// are current without a redeploy. Cached at the edge for an hour, and served
// stale for a day while revalidating, so an upstream outage is invisible.
export const prerender = false;

export const GET: APIRoute = async () => {
  const figures = await getFigures();
  return new Response(JSON.stringify(figures, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A fallback answer is cached for a minute, not like a live one: an outage
      // must not pin older published figures at the edge for the full window.
      'Cache-Control': figures.allLive ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'public, s-maxage=60',
      // Public domain data, public endpoint. Anyone may build on it.
      'Access-Control-Allow-Origin': '*',
    },
  });
};
