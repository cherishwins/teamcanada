import type { APIRoute } from 'astro';
import { getProvinces } from '../../lib/sources';
import { ALL, OPTIONS, CORS, caching, headOf, withoutQuery } from '../../lib/api';

// Quarterly population, annual GDP: an hour in a browser, a day at the edge,
// a week stale.
// Public domain data, public endpoint, CORS-open: anyone may build on it. See
// src/lib/api.ts for what every endpoint here does besides its data.
export const prerender = false;
export { ALL, OPTIONS };

export const GET: APIRoute = async (ctx) => {
  const bounce = withoutQuery(ctx);
  if (bounce) return bounce;
  const data = await getProvinces();
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      ...CORS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': caching(data.allLive, 3600, 86400, 604800),
    },
  });
};

export const HEAD = headOf(GET);
