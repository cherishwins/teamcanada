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
      filter: (page) => !page.includes('/fr'),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
