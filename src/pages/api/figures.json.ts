import type { APIRoute } from 'astro';
import { getFigures } from '../../lib/sources';
import { ALL, OPTIONS, CORS, caching, headOf, withoutQuery } from '../../lib/api';

// On-demand rather than baked in at build: the whole point is that the numbers
// are current without a redeploy. Browsers keep an answer five minutes, the
// edge an hour, then serves it stale for a day while revalidating.
// Public domain data, public endpoint, CORS-open: anyone may build on it. See
// src/lib/api.ts for what every endpoint here does besides its data.
export const prerender = false;
export { ALL, OPTIONS };

export const GET: APIRoute = async (ctx) => {
  const bounce = withoutQuery(ctx);
  if (bounce) return bounce;
  const figures = await getFigures();
  return new Response(JSON.stringify(figures, null, 2), {
    headers: {
      ...CORS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': caching(figures.allLive, 300, 3600, 86400),
    },
  });
};

export const HEAD = headOf(GET);
