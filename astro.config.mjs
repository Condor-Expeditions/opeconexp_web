// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
      site: import.meta.env.DEV ? "http://localhost:4321" : "https://condorexpedition.com/",
    integrations: [],
    vite: {
        plugins: [tailwindcss()],
    },
});
