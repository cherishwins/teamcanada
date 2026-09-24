import type { APIRoute } from 'astro';
import { compute } from '../../lib/record';

/**
 * The record as data: every division with every party's position, every
 * member with their rate and breaks, the agreement matrix and the summary.
 *
 * Pre-rendered, unlike the other /api routes: the snapshot it reads is
 * committed and only changes with a deploy, so there is nothing to fetch on
 * demand and a static file is the honest shape. Ballot strings are included
 * (one character per member per division) so the whole thing is reproducible
 * from this one document.
 */
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(compute(), null, 1), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
