import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { registerHooks } from "node:module";
import test from "node:test";

const catalogDirectory = new URL("../src/data/tours/", import.meta.url);

test("publication switch: the real catalog excludes disabled tours without editing files", async () => {
	let disabled = new Set();
	let scenario = 0;
	// Node needs explicit .ts extensions; isolate the module cache for each scenario.
	const hooks = registerHooks({
		resolve(specifier, context, nextResolve) {
			if (context.parentURL?.startsWith(catalogDirectory.href) && specifier.startsWith("./")) {
				return nextResolve(new URL(`${specifier}.ts?publication=${scenario}`, context.parentURL).href, context);
			}
			return nextResolve(specifier, context);
		},
		load(url, context, nextLoad) {
			const loaded = nextLoad(url, context);
			if (!url.startsWith(catalogDirectory.href)) return loaded;
			const slug = new URL(url).pathname.split("/").pop().replace(/\.ts$/, "");
			if (disabled.has(slug)) return { ...loaded, source: String(loaded.source).replace("enabled: true", "enabled: false") };
			return loaded;
		},
	});
	const loadCatalog = async slugs => {
		disabled = new Set(slugs);
		scenario++;
		return (await import(new URL(`index.ts?publication=${scenario}`, catalogDirectory).href)).tours;
	};
	try {
		const original = await loadCatalog([]);
		assert.equal(original.length, 11);
		assert.ok(original.every(tour => tour.enabled === true));
		const slugs = original.map(tour => tour.slug);
		const oneDisabled = await loadCatalog([slugs[0]]);
		assert.deepEqual(oneDisabled.map(tour => tour.slug), slugs.slice(1), "Preserve the order of enabled tours");
		assert.ok(oneDisabled.some(tour => tour.destinations.includes("el-cajas")), "A shared destination remains while another tour is enabled");
		const cajasSlugs = original.filter(tour => tour.destinations.includes("el-cajas")).map(tour => tour.slug);
		const withoutCajas = await loadCatalog(cajasSlugs);
		assert.ok(!withoutCajas.some(tour => tour.destinations.includes("el-cajas")), "Destinations with no enabled tours disappear");
		assert.deepEqual(await loadCatalog(slugs), [], "Disabling every tour produces an empty public catalog");
		assert.deepEqual((await loadCatalog([])).map(tour => tour.slug), slugs, "Re-enabling restores the catalog");
	} finally {
		hooks.deregister();
	}
});

test("every editable tour declares an explicit publication boolean", async () => {
	for (const name of await readdir(catalogDirectory)) {
		if (!name.endsWith(".ts")) continue;
		const source = await readFile(new URL(name, catalogDirectory), "utf8");
		if (source.includes("satisfies Tour")) assert.match(source, /enabled:\s*(true|false)\s*,/, name);
	}
});

test("all public consumers and static detail paths use the filtered catalog", async () => {
	for (const path of [
		"src/components/sections/index/Hero.astro",
		"src/components/sections/index/HomeInformation.astro",
		"src/data/navigation.config.ts",
		"src/pages/tours.astro",
		"src/pages/tours/[slug].astro",
		"src/pages/contacto.astro",
	]) {
		const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
		assert.match(source, /import \{ tours[, }][^\n]*from ["'](?:@\/data\/tours|\.\/tours)["']/, path);
	}
	const detail = await readFile(new URL("../src/pages/tours/[slug].astro", import.meta.url), "utf8");
	assert.match(detail, /getStaticPaths\s*=\s*\(\(\)\s*=>\s*tours\.map/);
});
