// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import image from "@astrojs/image";
import { resolve } from "node:path";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV
    ? "http://localhost:4321"
    : "https://condorexpedition.com/",
  integrations: [
    image({
      // Service config para producción: usar Sharp si está disponible
      service: undefined, // Usa default service (solo AVIF/WebP/PNG/JPG)
      // remotePatterns removed - solo imágenes locales
      // shapes: ['png', 'webp', 'jpg', 'jpeg', 'svg', 'avif', 'gif']
    }),
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve("src"),
        "@/components": resolve("src/components"),
        "@/data": resolve("src/data"),
        "@/layouts": resolve("src/layouts"),
        "@/i18n": resolve("src/i18n"),
      },
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
});