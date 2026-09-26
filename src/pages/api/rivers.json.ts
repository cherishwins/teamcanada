import type { APIRoute } from 'astro';
import { getRivers } from '../../lib/sources';
import { ALL, OPTIONS, CORS, caching, headOf, withoutQuery } from '../../lib/api';

// Gauges report every five minutes: a minute in a browser, five at the edge,
// an hour stale.
// Public domain data, public endpoint, CORS-open: anyone may build on it. See
// src/lib/api.ts for what every endpoint here does besides its data.
export const prerender = false;
export { ALL, OPTIONS };

export const GET: APIRoute = async (ctx) => {
  const bounce = withoutQuery(ctx);
  if (bounce) return bounce;
  const rivers = await getRivers();
  return new Response(JSON.stringify(rivers, null, 2), {
    headers: {
      ...CORS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': caching(rivers.allLive, 60, 300, 3600),
    },
  });
};

export const HEAD = headOf(GET);
