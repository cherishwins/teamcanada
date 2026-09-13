import type { APIRoute } from 'astro';
import { getTrade } from '../../lib/sources';

// Monthly series; an hour of edge cache, a day of stale-while-revalidate.
export const prerender = false;

export const GET: APIRoute = async () => {
  const trade = await getTrade();
  return new Response(JSON.stringify(trade, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
