#!/usr/bin/env node
/**
 * The Content-Security-Policy in vercel.json must match the scripts the build
 * actually ships — in both directions.
 *
 * The policy allows inline scripts by HASH, not by 'unsafe-inline'. That is
 * the whole value of it: an injected <script> that is not on the list does not
 * run. The cost is that the list has to be exact, and every one of these makes
 * it drift:
 *
 *   · an inline script in a component is edited (the Share band, the nav
 *     toggle, the reveal fallback, the calculator's constants block);
 *   · the Vercel adapter is upgraded and its analytics bootstrap changes by a
 *     character;
 *   · a new page adds an inline script nobody hashed.
 *
 * Any of those ships a page whose script is silently blocked by the browser —
 * a nav that does not open, a share button that does nothing, a calculator
 * that never computes. tools/verify.cjs would not see it, because the sweep
 * serves the local output without production headers. So this reads the
 * policy out of vercel.json, hashes every executable inline script in the
 * built HTML, and refuses a build where the two sets differ. It prints the
 * exact 'sha256-…' token to add, so fixing it is a paste.
 *
 * It also refuses the ways a CSP quietly stops being one: 'unsafe-inline' in
 * script-src, a missing frame-ancestors, object-src not 'none', and an
 * external script origin the policy does not name.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.argv[2] || '.vercel/output/static';
const CONFIG = 'vercel.json';
const fail = [];

for (const f of [CONFIG, ROOT]) {
  if (!fs.existsSync(f)) {
    console.error(`check-csp: ${f} not found — run \`astro build\` first`);
    process.exit(1);
  }
}

// ---- The policy, out of vercel.json.
const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
const rule = (cfg.headers || []).find((h) => h.source === '/(.*)');
const cspHeader = rule?.headers?.find((h) => h.key.toLowerCase() === 'content-security-policy');
if (!cspHeader) {
  console.error('check-csp: vercel.json has no Content-Security-Policy on the "/(.*)" rule');
  process.exit(1);
}
const directives = Object.fromEntries(
  cspHeader.value.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
    const [name, ...vals] = d.split(/\s+/);
    return [name, vals];
  }),
);
const scriptSrc = directives['script-src'] || [];
const allowedHashes = new Set(scriptSrc.filter((v) => /^'sha256-/.test(v)).map((v) => v.slice(1, -1)));
const allowedOrigins = new Set(scriptSrc.filter((v) => /^https?:\/\//.test(v)));

// ---- The scripts, out of the build.
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Inline hash -> pages carrying it; external origin -> pages loading it. */
const inline = new Map();
const external = new Map();
const pages = walk(ROOT);
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const where = path.relative(ROOT, file);
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    const src = attrs.match(/\ssrc=["']([^"']+)["']/);
    if (src) {
      if (/^https?:\/\//.test(src[1])) {
        const origin = new URL(src[1]).origin;
        (external.get(origin) || external.set(origin, new Set()).get(origin)).add(where);
      }
      continue; // same-origin src is covered by 'self'
    }
    // Data blocks are never executed, so CSP never consults them.
    const type = (attrs.match(/\stype=["']([^"']+)["']/) || [])[1] || '';
    if (/json/i.test(type)) continue;
    const hash = 'sha256-' + crypto.createHash('sha256').update(m[2]).digest('base64');
    (inline.get(hash) || inline.set(hash, new Set()).get(hash)).add(where);
  }
}

if (inline.size === 0) {
  console.error('check-csp: found 0 inline scripts in the build — the parse went blind. Fix the parse, do not delete the check.');
  process.exit(1);
}

// ---- 1. Every inline script the build ships is on the list.
for (const [hash, where] of inline) {
  if (!allowedHashes.has(hash)) {
    const sample = [...where].slice(0, 3).join(', ') + (where.size > 3 ? ` +${where.size - 3} more` : '');
    fail.push(`inline script on ${where.size} page(s) (${sample}) is not in the CSP — add '${hash}' to script-src in vercel.json`);
  }
}

// ---- 2. Nothing on the list is stale.
// A hash no page uses is not a hole, but it is a policy that no longer
// describes the site, which is how the next real hole gets missed.
for (const hash of allowedHashes) {
  if (!inline.has(hash)) fail.push(`'${hash}' is in the CSP but no built page carries that script — remove it from vercel.json`);
}

// ---- 3. Every external script origin is named.
for (const [origin, where] of external) {
  if (!allowedOrigins.has(origin)) {
    fail.push(`${origin} serves a <script> on ${where.size} page(s) but script-src does not allow it`);
  }
}
for (const origin of allowedOrigins) {
  if (!external.has(origin)) fail.push(`script-src allows ${origin} but no built page loads a script from it — remove it`);
}

// ---- 4. The policy still has teeth.
if (scriptSrc.includes("'unsafe-inline'")) fail.push("script-src carries 'unsafe-inline', which makes the hash list decorative");
if (!directives['frame-ancestors']) fail.push('no frame-ancestors directive — the site can be framed');
if (!(directives['object-src'] || []).includes("'none'")) fail.push("object-src is not 'none'");
if (!directives['base-uri']) fail.push('no base-uri directive');

if (fail.length) {
  console.error('check-csp: vercel.json and the build disagree about what may run\n');
  for (const f of fail) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-csp: ${inline.size} inline script hashes and ${external.size} external origin(s) match the policy across ${pages.length} pages`,
);
