import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import astroI18next from "astro-i18next";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://4rays.net",
  integrations: [mdx(), sitemap(), astroI18next()],
  vite: {
    plugins: [tailwindcss()],
  },
});
