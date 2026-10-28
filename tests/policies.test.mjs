import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { commercialPolicies } from "../src/data/commercial-policies.ts";

const load = route => readFile(new URL(`../dist/${route}/index.html`, import.meta.url), "utf8");

test("commercial policies: six complete sections with original terms and exceptions", async () => {
	const html = await load("politicas-comerciales");
	assert.equal((html.match(/<h1\b/g) || []).length, 1);
	assert.equal(commercialPolicies.length, 6);
	assert.equal(commercialPolicies.flatMap(section => section.items).length, 17);
	for (const section of commercialPolicies) {
		assert.ok(html.includes(`id="${section.id}"`));
		assert.ok(html.includes(`href="#${section.id}"`));
		if (section.intro) assert.ok(html.includes(section.intro));
		for (const item of section.items) assert.ok(html.includes(item.text), item.title);
	}
	assert.match(html, /OPECONEXP S\.A\.S\./);
});

test("every tour has complete policies, inquiry access and a footer link", async () => {
	for (const slug of await readdir(new URL("../dist/tours/", import.meta.url))) {
		if (slug === "index.html") continue;
		const html = await load(`tours/${slug}`);
		const policies = html.match(/<section id="politicas"[\s\S]*?<\/section>/)?.[0];
		assert.ok(policies, slug);
		for (const section of commercialPolicies) {
			for (const item of section.items) assert.ok(policies.includes(item.text), `${slug}: ${item.title}`);
		}
		const inquiry = html.match(/<aside id="consultar"[\s\S]*?<\/aside>/)[0];
		assert.match(inquiry, /href="#politicas"/);
		assert.match(html.match(/<footer\b[\s\S]*?<\/footer>/)[0], /href="\/politicas-comerciales"/);
		assert.doesNotMatch(html, /posibles gastos administrativos/);
		if (slug === "free-walking-tour-cuenca") {
			assert.match(policies, /no tiene tarifa fija ni requiere anticipo/);
			assert.doesNotMatch(policies, /<details open/);
		} else {
			assert.match(policies, /<details open/);
		}
	}
});
