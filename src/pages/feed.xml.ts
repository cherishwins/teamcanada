import type { APIRoute } from 'astro';
import { SITE, abs } from '../config.mjs';
import { READS } from '../lib/reads';

/**
 * RSS for the long-form pieces. The old site had a feed and this one lost it;
 * a feed is the only way to follow something without an account, an algorithm,
 * or a platform in between — which is the same reason the rest of this site is
 * built the way it is. Items, dates and summaries come from src/lib/reads.ts.
 */
export const prerender = true;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = () => {
  const newest = [...READS].sort((a, b) => b.published.localeCompare(a.published));
  const items = newest.map((i) => `
    <item>
      <title>${esc(i.title)}</title>
      <link>${abs(`/read/${i.slug}`)}</link>
      <guid isPermaLink="true">${abs(`/read/${i.slug}`)}</guid>
      <pubDate>${new Date(i.published + 'T12:00:00Z').toUTCString()}</pubDate>
      <category>${esc(i.imprint)}</category>
      <description>${esc(i.feed ?? i.blurb)}</description>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} — The Reads</title>
    <link>${SITE.origin}</link>
    <atom:link href="${abs('/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>Long-form pieces behind Northern Temper. Sourced in full, public domain, free to reproduce.</description>
    <language>en-ca</language>
    <copyright>CC0 1.0 — public domain. No permission needed, no attribution required.</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
