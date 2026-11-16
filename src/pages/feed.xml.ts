import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_NAME, SITE_TAGLINE } from '../consts';

export async function GET(context: APIContext) {
  const guides = (await getCollection('guides')).sort((a, b) => b.data.updated.getTime() - a.data.updated.getTime());
  return rss({
    title: SITE_NAME,
    description: SITE_TAGLINE,
    site: context.site!,
    customData: '<language>ja</language>',
    items: guides.map((g) => ({
      title: g.data.h1,
      description: g.data.description,
      pubDate: g.data.published,
      link: `/ja/guides/${g.id}/`,
      categories: [g.data.category],
    })),
  });
}
