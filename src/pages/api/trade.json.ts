import type { APIRoute } from 'astro';
import { getTrade } from '../../lib/sources';

// Monthly series; an hour of edge cache, a day of stale-while-revalidate.
export const prerender = false;

export const GET: APIRoute = async () => {
  const trade = await getTrade();
  return new Response(JSON.stringify(trade, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A fallback answer is cached for a minute, not like a live one: an outage
      // must not pin older published figures at the edge for the full window.
      'Cache-Control': trade.allLive ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'public, s-maxage=60',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
