import type { APIRoute } from 'astro';
import { getRivers } from '../../lib/sources';

// Gauges report every five minutes. Cached for five, served stale for an hour.
export const prerender = false;

export const GET: APIRoute = async () => {
  const rivers = await getRivers();
  return new Response(JSON.stringify(rivers, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A fallback answer is cached for a minute, not like a live one: an outage
      // must not pin older published figures at the edge for the full window.
      'Cache-Control': rivers.allLive ? 'public, s-maxage=300, stale-while-revalidate=3600' : 'public, s-maxage=60',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
