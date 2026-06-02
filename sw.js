/* Team Canada — service worker
   Network-first for pages (always fresh), cache-first for immutable assets.
   Keeps the app instant on repeat visits and usable offline. */
const VERSION = 'tcs-v5';
const CORE = ['/', '/offline.html'];
const MEDIA = /\.(png|jpg|jpeg|webp|gif|svg|ico|woff2)$/i;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // let cross-origin (fonts) pass through
  if (url.pathname === '/sw.js') return;

  // Images & fonts only: cache-first (they're versioned/immutable, safe to pin)
  if (MEDIA.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // Everything else (HTML, CSS, JS): network-first so edits always show;
  // fall back to cache offline, then the offline page for navigations.
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then((hit) =>
      hit || (req.mode === 'navigate' ? caches.match('/offline.html') : undefined)
    ))
  );
});
