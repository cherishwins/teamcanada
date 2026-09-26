import type { APIRoute } from 'astro';
import { getProvinces } from '../../lib/sources';

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await getProvinces();
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A fallback answer is cached for a minute, not like a live one: an outage
      // must not pin older published figures at the edge for the full window.
      'Cache-Control': data.allLive ? 'public, s-maxage=86400, stale-while-revalidate=604800' : 'public, s-maxage=60',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
