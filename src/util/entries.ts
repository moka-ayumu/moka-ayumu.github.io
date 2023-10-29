import type { getCollection } from 'astro:content';

export interface Entry {
  entries: { [key: string]: Entry };
  count: number;
}

export function sortCategories(collection: Awaited<ReturnType<typeof getCollection>>) {
  const res: { [key: string]: Awaited<ReturnType<typeof getCollection>> } = {};
  collection.forEach((entry) => {
    const slashSlug = entry.slug.split('/');
    const slugs = [''].concat(slashSlug.slice(0, -1));
    slugs.forEach((slug) => {
      if (!Object.hasOwn(res, slug)) res[slug] = [];
      res[slug].push(entry);
    });
  });
  // Object.values(res).forEach((entries) => {
  //   entries.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  // });
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
