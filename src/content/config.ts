import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    short: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
