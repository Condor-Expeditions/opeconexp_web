// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    site: import.meta.env.DEV
        ? "http://localhost:4321"
        : "https://condorexpedition.com/",
    integrations: [icon()],
    i18n: {
        defaultLocale: "es",
        locales: ["es", "en"],
        routing: {
            prefixDefaultLocale: false,
        },
    },
    vite: {
        plugins: [tailwindcss()],
        // Prebundle gallery and carousel dependencies before serving any route.
        optimizeDeps: {
            include: ["photoswipe", "photoswipe/lightbox", "embla-carousel", "embla-carousel-fade"],
        },
    },
});
