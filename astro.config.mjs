import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config.mjs';

// Static by default — every act ships as pre-rendered HTML with no client JS.
// The adapter exists only so `src/pages/api/*` can run on demand for live data.
export default defineConfig({
  site: SITE.origin,
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
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
