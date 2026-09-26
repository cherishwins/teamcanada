/**
 * RFC 9116 security.txt, written at build time.
 *
 * The standard makes `Expires` REQUIRED and recommends a date under a year
 * ahead, so a reader of the file can tell a maintained contact from an
 * abandoned one. It shipped for months without the field, which made the file
 * technically invalid. A hand-typed date is a date somebody has to remember to
 * move; this one moves itself on every deploy, and the record bot deploys
 * whenever the House sits. If the site ever stops deploying for six months, the
 * file expires, which is the honest thing for it to say.
 *
 * The address is SITE.email, the same one /join writes, so the two cannot
 * disagree.
 */
import type { APIRoute } from 'astro';
import { SITE, abs } from '../../config.mjs';

export const prerender = true;

const VALID_DAYS = 180;

export const GET: APIRoute = () => {
  const expires = new Date(Date.now() + VALID_DAYS * 86_400_000);
  expires.setUTCHours(0, 0, 0, 0);
  const body = [
    `Contact: mailto:${SITE.email}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en, fr',
    `Canonical: ${abs('/.well-known/security.txt')}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
