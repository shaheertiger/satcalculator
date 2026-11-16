import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://satcalculator.co',
  trailingSlash: 'always',
  integrations: [sitemap({ lastmod: new Date() })],
  redirects: { '/ja/': '/' },
});
