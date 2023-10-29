/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            p: {
              marginTop: 4,
              marginBottom: 4,
            },
          },
        },
      }),
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
};
