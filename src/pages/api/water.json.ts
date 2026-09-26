import type { APIRoute } from 'astro';
import { getWater } from '../../lib/sources';
import { ALL, OPTIONS, CORS, caching, headOf, withoutQuery } from '../../lib/api';

// AQUASTAT publishes on a long cycle (the reference year moves once a year at
// most): an hour in a browser, a day at the edge, a week stale.
// Public domain data, public endpoint, CORS-open: anyone may build on it. See
// src/lib/api.ts for what every endpoint here does besides its data.
export const prerender = false;
export { ALL, OPTIONS };

export const GET: APIRoute = async (ctx) => {
  const bounce = withoutQuery(ctx);
  if (bounce) return bounce;
  const water = await getWater();
  return new Response(JSON.stringify(water, null, 2), {
    headers: {
      ...CORS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': caching(water.live, 3600, 86400, 604800),
    },
  });
};

export const HEAD = headOf(GET);
