/**
 * Northern Temper — service worker.
 *
 * The governing rule is that this must never be the reason somebody sees an
 * old number. Every HTML and JSON request goes to the network first; the cache
 * is only consulted when the network genuinely fails. Only fonts, marks and
 * images — which are immutable and versioned by filename — are served from
 * cache first.
 *
 * Bump VERSION whenever a cached asset changes. The activate handler deletes
 * every cache that is not the current one, so a bump is a clean slate.
 */
const VERSION = 'nt-v3';

/**
 * Enough to render something useful with no network at all. NOT the home
 * page: this site travels by share link, so most first visits land elsewhere,
 * and precaching / cost every one of them ~23 kB br for a page they rarely
 * open. Pages are cached as they are visited (network first, below), so a
 * reader who has seen / still gets it offline.
 */
const CORE = [
  '/offline',
  '/fonts/Oswald-700.woff2',
  '/fonts/Inter-400.woff2',
  '/favicon.svg',
];

const isImmutable = (url) =>
  /\/(fonts|marks|og)\//.test(url.pathname) ||
  /\.(woff2|png|jpg|jpeg|svg|ico|webp)$/.test(url.pathname);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      // A single missing file must not fail the whole install.
      .then((cache) => Promise.allSettled(CORE.map((u) => cache.add(u))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Immutable assets: cache first, since the filename changes when they do.
  if (isImmutable(url)) {
    event.respondWith(
      caches.match(request).then((hit) =>
        hit ?? fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
          }
          return res;
        }),
      ),
    );
    return;
  }

  // Everything else — pages and live data — network first, always.
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && request.destination === 'document') {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(request);
        if (hit) return hit;
        if (request.destination === 'document') {
          return (await caches.match('/offline')) ?? Response.error();
        }
        return Response.error();
      }),
  );
});
