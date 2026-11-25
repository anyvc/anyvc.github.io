import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://anyvc.github.io', // user site: no `base` needed
  output: 'static',
  trailingSlash: 'ignore',
});
