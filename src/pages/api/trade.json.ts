import type { APIRoute } from 'astro';
import { getTrade } from '../../lib/sources';
import { ALL, OPTIONS, CORS, caching, headOf, withoutQuery } from '../../lib/api';

// Monthly series: five minutes in a browser, an hour at the edge, a day stale.
// Public domain data, public endpoint, CORS-open: anyone may build on it. See
// src/lib/api.ts for what every endpoint here does besides its data.
export const prerender = false;
export { ALL, OPTIONS };

export const GET: APIRoute = async (ctx) => {
  const bounce = withoutQuery(ctx);
  if (bounce) return bounce;
  const trade = await getTrade();
  return new Response(JSON.stringify(trade, null, 2), {
    headers: {
      ...CORS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': caching(trade.allLive, 300, 3600, 86400),
    },
  });
};

export const HEAD = headOf(GET);
