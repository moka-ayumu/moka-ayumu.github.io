import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { remarkReadingTime } from './src/remarkPlugins/remark-reading-time.mjs';
import { remarkModifiedTime } from './src/remarkPlugins/remark-modified-time.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
    remarkPlugins: [remarkReadingTime, remarkModifiedTime],
  },
  site: 'https://moka-ayumu.github.io',
  experimental: {
    devOverlay: true,
  },
});
