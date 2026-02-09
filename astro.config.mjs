import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://satcalculator.co',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      lastmod: new Date(),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        if (item.url === 'https://satcalculator.co/') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        } else if (item.url.includes('/blog/')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        } else if (item.url.includes('/about/')) {
          item.changefreq = 'monthly';
          item.priority = 0.5;
        } else if (
          item.url.includes('/privacy-policy/') ||
          item.url.includes('/terms-of-service/') ||
          item.url.includes('/disclaimer/')
        ) {
          item.changefreq = 'yearly';
          item.priority = 0.3;
        }
        return item;
      },
    }),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  vite: {
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || ''),
    },
  },
});
