/**
 * Astro adds an on-demand /_image route to any site with a server route, and
 * nothing on this site uses astro:assets. Left alone, it ran Sharp for anyone
 * who asked (/_image?href=/og/home.png&w=1199&f=avif: 2 s, a cache miss per
 * distinct query), which is a free-tier invocation anyone can spend. This
 * answers 404 without touching an image.
 */
export const prerender = false;
export const GET = () => new Response(null, { status: 404 });
