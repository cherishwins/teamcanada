import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config.mjs';

// Static by default — every act ships as pre-rendered HTML with no client JS.
// The adapter exists only so `src/pages/api/*` can run on demand for live data.
export default defineConfig({
  site: SITE.origin,
  output: 'static',
  // TWO analytics vendors now ship on every page, and that is a live decision
  // rather than a settled one — see CLAUDE.md. Umami has always been here.
  // Vercel Web Analytics was removed once as redundant, then re-enabled
  // through the Vercel dashboard's one-click integration.
  //
  // Measured on the deployed page, gzipped: the site's own script is 1,172 B
  // and /_vercel/insights/script.js is 1,497 B, so enabling this MORE THAN
  // DOUBLES first-party JavaScript against a documented ~2 kB budget. It is
  // cookieless and uses no browser storage (checked: the script touches
  // neither document.cookie nor localStorage), so the no-consent-banner
  // posture survives — the cost is bytes and a second party receiving reader
  // data, not a legal one.
  //
  // THE TRAP: the adapter writes <script src="/_vercel/insights/script.js">
  // into every page at BUILD time, but the file behind it exists only on
  // Vercel's edge. So the tag is in the local output and the asset is not —
  // which made `tools/verify.cjs` report 200 broken references and turned
  // `main` red the moment this merged. verify.cjs now answers /_vercel/* with
  // 204, the same way it answers a third-party origin, so the sweep still
  // proves the page works without it. tools/check-privacy.cjs reads both this
  // flag and that tag, and fails the build if /privacy disagrees with either.
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
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
