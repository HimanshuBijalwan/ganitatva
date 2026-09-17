import { defineConfig } from 'astro/config';

// Zero JS by default. Only widgets hydrate, as islands (ADR-006).
// site/base are set for GitHub Pages; override via env for other hosts.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://himanshubijalwan.github.io',
  base: process.env.BASE_PATH ?? '/ganitatva',
  build: { inlineStylesheets: 'auto' },
});
