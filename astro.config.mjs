// @ts-check

import { resolve } from "node:path";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: import.meta.env.DEV
		? "http://localhost:4321"
		: "https://condorexpedition.com/",
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
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
	adapter: vercel(),
	integrations: [sitemap()],
});
