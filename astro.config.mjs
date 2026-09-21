// @ts-check

import { resolve } from "node:path";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: import.meta.env.DEV
		? "http://localhost:4321"
		: "https://condorexpedition.com/",
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
		mode: "standalone",
	}),
	integrations: [sitemap()],
});
