import type { getCollection } from 'astro:content';
import dayjs from 'dayjs';

export interface Entry {
  entries: { [key: string]: Entry };
  count: number;
}

export async function sortCategories(collection: Awaited<ReturnType<typeof getCollection>>) {
  const blogEntriesWithRender = await Promise.all(
    collection.map(async (entry) => ({ ...entry, lastModified: dayjs((await entry.render()).remarkPluginFrontmatter.lastModified).valueOf() }))
  );
  blogEntriesWithRender.sort((a, b) => b.lastModified - a.lastModified);

  const res: { [key: string]: Awaited<ReturnType<typeof getCollection>> } = {};
  blogEntriesWithRender.forEach((entry) => {
    const slashSlug = entry.slug.split('/');
    const slugs = [''].concat(slashSlug.slice(0, -1));
    slugs.forEach((slug) => {
      if (!Object.hasOwn(res, slug)) res[slug] = [];
      res[slug].push(entry);
    });
  });

  return res;
}

export function parseSlug(slug: string) {
  return slug.split('/').map((key) => {
    switch (key) {
      case '':
        return '전체';

      case 'devops':
        return 'DevOps';

      case 'database':
        return 'DB';

      case 'elixir':
        return 'Elixir';

      case 'typescript':
        return 'Typescript';

      default:
        return '';
    }
  });
}
