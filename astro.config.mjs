// @ts-check
import { defineConfig } from "astro/config";

// Fully static site. No adapter, SSR, sessions, actions or i18n routing.
export default defineConfig({
  site: "https://anyvc.github.io",
  output: "static",
});
