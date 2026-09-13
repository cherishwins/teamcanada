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
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-CA', fr: 'fr-CA' } } })],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
