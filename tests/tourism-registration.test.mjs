import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { siteConfig } from "../src/data/site.config.ts";

test("tourism registration: supplied identifiers are preserved as text", () => {
	assert.deepEqual(siteConfig.companyInfo.tourismRegistration, {
		denomination: "Agencia Operadora de Turismo Condor Expeditions",
		classification: "Agencia Operadora de Turismo",
		number: "0195167990001.001.4011862",
		annualLicense: "95876",
	});
});

test("tourism registration is visible in the footer of every generated page", async () => {
	const root = new URL("../dist/", import.meta.url);
	const files = await readdir(root, { recursive: true });
	const pages = files.filter(file => file.endsWith(".html"));
	assert.ok(pages.length > 0);
	for (const file of pages) {
		const html = await readFile(new URL(file, root), "utf8");
		const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
		assert.ok(footer, file);
		const registration = footer.match(/<section class="footer-registration[^\"]*"[\s\S]*?<\/section>/)?.[0];
		assert.ok(registration, file);
		for (const value of Object.values(siteConfig.companyInfo.tourismRegistration)) {
			assert.ok(registration.includes(value), `${file}: ${value}`);
		}
		assert.doesNotMatch(registration, /\bhidden\b/);
		assert.ok(html.includes(siteConfig.companyInfo.phone.href));
		assert.ok(html.includes(siteConfig.companyInfo.email.href));
	}
});
