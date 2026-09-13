import type { APIRoute } from 'astro';
import { getProvinces } from '../../lib/sources';

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await getProvinces();
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
