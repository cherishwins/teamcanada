import type { APIRoute } from 'astro';
import { getWater } from '../../lib/sources';

// AQUASTAT publishes on a long cycle — the reference year moves once a year at
// most — so this caches far harder than the daily and monthly series. A day at
// the edge, a week served stale while revalidating.
export const prerender = false;

export const GET: APIRoute = async () => {
  const water = await getWater();
  return new Response(JSON.stringify(water, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A fallback answer is cached for a minute, not like a live one: an outage
      // must not pin older published figures at the edge for the full window.
      'Cache-Control': water.live ? 'public, s-maxage=86400, stale-while-revalidate=604800' : 'public, s-maxage=60',
      // Public domain data, public endpoint. Anyone may build on it.
      'Access-Control-Allow-Origin': '*',
    },
  });
};
