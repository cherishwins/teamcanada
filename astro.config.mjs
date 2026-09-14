import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config.mjs';

// Static by default — every act ships as pre-rendered HTML with no client JS.
// The adapter exists only so `src/pages/api/*` can run on demand for live data.
export default defineConfig({
  site: SITE.origin,
  output: 'static',
  // Umami is the analytics, and it is the only analytics. Vercel Web Analytics
  // was also on, which put a second vendor's script on all twenty pages to
  // collect what Umami already collects. On Hobby it cannot bill — it simply
  // stops at the event cap, well below the traffic this site is built for — so
  // the case against it is not cost but redundancy: one more script against a
  // ~2 kB client-JS budget, and one more party receiving reader data on a site
  // whose entire privacy posture is that there is almost nobody to name.
  adapter: vercel(),
  integrations: [
    sitemap({
      // /fr is a noindex draft. Listing it in the sitemap while the page tells
      // crawlers not to index it is a contradictory signal — submit it only
      // once the BROUILLON banner comes off and the noindex goes with it.
      // /fr is a noindex draft; /support is hidden until the owner is ready
      // for it to exist publicly. Both carry noindex, and submitting a URL
      // while telling crawlers not to index it is a contradictory signal.
      filter: (page) => !page.includes('/fr') && !page.includes('/support'),
    }),
  ],
  // MEASURED, and this reverses an earlier call recorded in CLAUDE.md.
  //
  // The old note argued 'auto' wins "for anyone reading more than a single
  // page". The premise was wrong for how this site is actually reached: it
  // travels by share link, so the overwhelming majority of sessions are one
  // page — Lighthouse even labels its run "Single page session".
  //
  // Measured, gzipped, on the real build:
  //   auto    15,359 B HTML + 9,830 B CSS = 25,189 B over 4 requests, 2 blocking
  //   always  21,198 B HTML                = 21,198 B over 1 request,  0 blocking
  // Inlining is 3,991 B SMALLER on first load — the CSS compresses better in
  // context than as three separately-gzipped files — and removes a blocking
  // chain PageSpeed costs at 730 ms on Slow 4G.
  //
  // The cost is +4,253 B on each additional page, since the shared CSS is
  // re-sent rather than cached. Break-even is under one extra page on bytes
  // alone, before counting the 730 ms that only the first load ever pays.
  // Re-measure before changing this back.
  build: { inlineStylesheets: 'always' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
