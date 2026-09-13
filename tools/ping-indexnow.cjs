/**
 * Tell Bing and Yandex the site changed. IndexNow is free, needs no account,
 * and is the only instant-indexing path that does not go through a dashboard.
 *
 *   node tools/ping-indexnow.cjs
 *
 * Google ignores IndexNow — for Google, submit the sitemap once in Search
 * Console and it re-crawls on its own.
 */
const fs = require('fs');
const path = require('path');

const HOST = 'northerntemper.ca';
const OUT = '.vercel/output/static';

const key = fs.readdirSync(OUT).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.replace('.txt', '');
if (!key) { console.error('No IndexNow key file found in the build output.'); process.exit(1); }

const sitemap = fs.readFileSync(path.join(OUT, 'sitemap-0.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

(async () => {
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
  });
  console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length} URLs submitted`);
})();
