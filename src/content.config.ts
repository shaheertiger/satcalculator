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
    conclusion: z.string().min(80),  // 「まとめ」 paragraph(s); blank line = new paragraph
    // Numbered options ("方法1：…" H2s in the body, in the same order). Drives the
    // comparison table, the 目的別のおすすめ picks and the ItemList schema.
    methods: z.array(z.object({
      name: z.string().max(40),
      bestFor: z.string().max(40),                     // 向いている人・場面
      strength: z.enum(['低', '中', '高']),            // 守りの強さ / 効果
      effort: z.enum(['かんたん', 'ふつう', '手間がかかる']),
      cost: z.string().max(24),                        // e.g. 無料（標準機能）
      pick: z.string().max(16).optional(),             // e.g. いちばん手軽
    })).min(2).max(10).optional(),
    criteria: z.array(z.object({ name: z.string(), detail: z.string() })).min(3).max(5).optional(), // この記事の評価基準
    checklist: z.array(z.string()).min(3).max(6).optional(), // 選ぶ前のチェックリスト
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(5),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).min(1),
    related: z.array(z.string()).default([]),   // other guide slugs
    order: z.number().default(100),
  }),
});

export const collections = { guides };
