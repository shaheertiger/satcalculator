import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://satcalculator.co';

// Per-guide lastmod + hero image for the sitemap, read from each guide's frontmatter.
const guidesDir = './src/content/guides';
const guideMeta = Object.fromEntries(
  fs.readdirSync(guidesDir).filter((f) => f.endsWith('.md')).map((f) => {
    const fm = fs.readFileSync(path.join(guidesDir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const get = (k) => fm.match(new RegExp(`^${k}:\\s*["']?(.*?)["']?\\s*$`, 'm'))?.[1];
    const slug = f.replace(/\.md$/, '');
    return [slug, { updated: get('updated'), h1: get('h1'), alt: get('imageAlt') }];
  }),
);
const newest = Object.values(guideMeta).map((m) => m.updated).sort().at(-1);

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/ja/'),
      serialize(item) {
        const p = new URL(item.url).pathname;
        const slug = p.match(/^\/ja\/guides\/([^/]+)\/$/)?.[1];
        if (slug && guideMeta[slug]) {
          const m = guideMeta[slug];
          item.lastmod = new Date(m.updated).toISOString();
          item.changefreq = 'monthly';
          item.priority = 0.8;
          item.img = [{ url: `${SITE}/images/guides/${slug}.webp`, title: m.h1, caption: m.alt }];
        } else if (p === '/' || p === '/ja/guides/') {
          item.lastmod = new Date(newest).toISOString();
          item.changefreq = 'weekly';
          item.priority = p === '/' ? 1.0 : 0.9;
        } else {
          item.changefreq = 'yearly';
          item.priority = 0.3;
        }
        return item;
      },
    }),
  ],
});
