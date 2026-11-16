import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),            // <title> / SEO title (~32 full-width chars)
    description: z.string(),      // meta description (~80-120 chars)
    h1: z.string(),
    keyword: z.string(),          // primary target keyword
    category: z.enum(['写真', 'iCloud', 'アプリ', 'Safari', 'セキュリティ']),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    readingMinutes: z.number(),
    imageAlt: z.string(),
    summary: z.array(z.string()).min(2).max(5), // "この記事の要点" bullets
    verdict: z.object({
      protects: z.array(z.string()).min(1).max(4), // 守られること
      exposes: z.array(z.string()).min(1).max(4),  // 見えてしまうこと / 守られないこと
    }),
    eyecatch: z.string().max(18),  // short catchphrase printed on the hero image
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).min(1),
    related: z.array(z.string()).default([]),   // other guide slugs
    order: z.number().default(100),
  }),
});

export const collections = { guides };
