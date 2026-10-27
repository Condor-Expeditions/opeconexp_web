import { readFile, readdir } from "node:fs/promises";
import { registerHooks } from "node:module";

// Read the editable catalog in Node without Astro/Vite or hardcoded tour counts.
const directory = new URL("../../src/data/tours/", import.meta.url);
const hooks = registerHooks({
	resolve(specifier, context, nextResolve) {
		if (context.parentURL?.startsWith(directory.href) && specifier.startsWith("./") && !specifier.endsWith(".ts")) {
			return nextResolve(new URL(`${specifier}.ts`, context.parentURL).href, context);
		}
		return nextResolve(specifier, context);
	},
});
export const allTours = [];
try {
	for (const name of (await readdir(directory)).sort()) {
		if (!name.endsWith(".ts")) continue;
		const url = new URL(name, directory);
		if ((await readFile(url, "utf8")).includes("satisfies Tour")) allTours.push((await import(url.href)).default);
	}
} finally {
	hooks.deregister();
}
export const publishedTours = allTours.filter(tour => tour.enabled);
