import type { MarkdownHeading } from 'astro';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { getCollection } from 'astro:content';
import dayjs from 'dayjs';

export interface Entry {
  entries: { [key: string]: Entry };
  count: number;
}

export type Collection = Awaited<ReturnType<typeof getCollection>>;
export type RenderedData = {
  Content: AstroComponentFactory;
  headings: MarkdownHeading[];
  remarkPluginFrontmatter: {
    readingTime: {
      minutes: number;
      words: number;
    };
    lastModified: string;
  };
};
export type RenderedCollection = (Omit<Collection[number], 'render'> & { render: RenderedData })[];

export async function sortCategories(collection: Collection) {
  const blogEntriesWithRender = await Promise.all(
    collection.map(async (entry) => ({ ...entry, lastModified: dayjs((await entry.render()).remarkPluginFrontmatter.lastModified).valueOf() }))
  );
  blogEntriesWithRender.sort((a, b) => b.lastModified - a.lastModified);

  const res: { [key: string]: Collection } = {};
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

export async function entreisRender(entries: Collection): Promise<RenderedCollection> {
  return await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      render: (await entry.render()) as RenderedData,
    }))
  );
}
