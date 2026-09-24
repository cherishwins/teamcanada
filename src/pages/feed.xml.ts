import type { APIRoute } from 'astro';
import { SITE, abs } from '../config.mjs';

/**
 * RSS for the long-form pieces. The old site had a feed and this one lost it;
 * a feed is the only way to follow something without an account, an algorithm,
 * or a platform in between — which is the same reason the rest of this site is
 * built the way it is.
 */
export const prerender = true;

interface Item {
  slug: string;
  title: string;
  imprint: string;
  summary: string;
  /** Publication date, RFC-822 via Date. */
  date: string;
}

const ITEMS: Item[] = [
  { slug: 'the-red-is-the-work', title: 'The Red Is the Work', imprint: 'A reading of the leaf',
    summary: 'The red on a maple leaf is not the leaf dying. The tree makes it, on purpose, to cover the work of taking back what it needs before winter. A reading of the flag.',
    date: '2026-09-24' },
  { slug: 'the-closed-loop', title: 'The Closed Loop', imprint: 'NPSI · Working Paper No. 6',
    summary: 'How Canadian energy, minerals and two-ocean geography become one forty-year trade with Korea. Korea holds the silicon; Canada holds the power.',
    date: '2026-06-01' },
  { slug: 'the-vertical-squeeze', title: 'The Vertical Squeeze', imprint: 'Fit For Gov · Dossier',
    summary: 'The order of government closest to you has the most responsibility and the least revenue. The imbalance, costed.',
    date: '2026-05-29' },
  { slug: 'changed-my-mind', title: 'I Campaigned Against This Man', imprint: 'An honest account',
    summary: 'A Conservative campaigner did the homework and changed his mind. Not a conversion — an argument for looking instead of yelling.',
    date: '2026-05-20' },
  { slug: 'two-leaders', title: 'The Wave Hit Every G7 Democracy. Two Leaders Beat It.', imprint: 'A governance reading',
    summary: 'Anti-incumbent anger flattened the West. Two leaders are the exceptions, and the reason is a method, not a party.',
    date: '2026-05-12' },
  { slug: 'honest-answer', title: 'One Question. Seven Leaders. An Honest Answer.', imprint: 'The record, set straight',
    summary: 'The viral "who is in recession" quiz, answered with every official G7 GDP figure. The trick is in the question.',
    date: '2026-05-04' },
];

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = () => {
  const items = ITEMS.map((i) => `
    <item>
      <title>${esc(i.title)}</title>
      <link>${abs(`/read/${i.slug}`)}</link>
      <guid isPermaLink="true">${abs(`/read/${i.slug}`)}</guid>
      <pubDate>${new Date(i.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <category>${esc(i.imprint)}</category>
      <description>${esc(i.summary)}</description>
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
