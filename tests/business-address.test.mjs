import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { siteConfig } from "../src/data/site.config.ts";

test("business address and map use the supplied address and Google Maps link", () => {
	assert.equal(siteConfig.companyInfo.address, "Gran Colombia 1-82 y Manuel Vega, Cuenca, Azuay, Ecuador");
	assert.equal(siteConfig.companyInfo.location, "https://maps.app.goo.gl/svLCXzi8TXEqzuRKA");
});

test("shared footer and contact page publish the updated business address", async () => {
	for (const route of ["", "contacto/", "tours/cajas-al-descubierto/"]) {
		const html = await readFile(new URL(`../dist/${route}index.html`, import.meta.url), "utf8");
		const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
		assert.ok(footer.includes(siteConfig.companyInfo.address));
		assert.ok(footer.includes(siteConfig.companyInfo.location.replaceAll("&", "&amp;")) || footer.includes(siteConfig.companyInfo.location));
		if (route === "contacto/") {
			const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
			assert.ok(main.includes(siteConfig.companyInfo.address));
			assert.match(main, /Dirección del establecimiento/);
			assert.doesNotMatch(main, /esta referencia no indica una oficina/);
		}
	}
});
