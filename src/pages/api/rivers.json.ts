import type { APIRoute } from 'astro';
import { getRivers } from '../../lib/sources';

// Gauges report every five minutes. Cached for five, served stale for an hour.
export const prerender = false;

export const GET: APIRoute = async () => {
  const rivers = await getRivers();
  return new Response(JSON.stringify(rivers, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
