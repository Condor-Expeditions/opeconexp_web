// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	site: import.meta.env.DEV
		? "http://localhost:4321"
		: "https://condorexpedition.com/",
	integrations: [],
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
	output: "server",
	adapter: node({
		mode: "standalone"
	}),
});
