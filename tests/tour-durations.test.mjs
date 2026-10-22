import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { formatStageDuration } from "../src/data/tours/duration.ts";

test("stage durations are readable minutes/hours, never clock times", () => {
	for (const [minutes, expected] of [[15, "15 min"], [40, "40 min"], [60, "1 h"], [75, "1 h 15 min"], [120, "2 h"], [140, "2 h 20 min"], [150, "2 h 30 min"], [160, "2 h 40 min"], [null, "Por confirmar"]]) {
		assert.equal(formatStageDuration(minutes), expected);
	}
	for (const invalid of [0, -15, 1.5, Number.NaN]) assert.throws(() => formatStageDuration(invalid));
});

// Expected values preserve the original schedule intervals rather than inventing travel times.
const stages = {
	"cajas-al-descubierto": [15, 45, 40, 60, 40, 45, 40],
	"cajas-de-laguna-a-lo-ancestral": [15, 50, 60, 150, 160, 60],
	"raices-ancestrales-del-ecuador": [15, 60, 60, 90, 75, 60, 120, 75],
	"pueblitos-magicos": [15, 75, 45, 30, 60, 60, 45, 30, 30, 90, 15, 45, 45],
	"aventura-en-cuadron": [15, 40, 60, 140, 60, 120, 60],
	"free-walking-tour-cuenca": [15, 30, 30, 30, 45],
	"guachapala-entre-paisajes-y-tradicion": [null],
};

for (const [slug, minutes] of Object.entries(stages)) {
	test(`${slug}: editable durations and public content without fixed clock times`, async () => {
		const source = await readFile(new URL(`../src/data/tours/${slug}.ts`, import.meta.url), "utf8");
		const values = [...source.matchAll(/durationMinutes:\s*(\d+|null)/g)].map(match => match[1] === "null" ? null : Number(match[1]));
		assert.deepEqual(values, minutes);
		assert.doesNotMatch(source, /\btime:\s*"/);
		const html = await readFile(new URL(`../dist/tours/${slug}/index.html`, import.meta.url), "utf8");
		const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
		assert.ok(main);
		assert.doesNotMatch(main, /\b\d{1,2}:\d{2}\b/, "Tour details do not publish clock times");
		const labels = [...main.matchAll(/class="timeline-duration">([^<]+)</g)].map(match => match[1]);
		assert.deepEqual(labels, minutes.map(formatStageDuration));
		const selector = main.match(/<select id="tour-departure"[\s\S]*?<\/select>/)?.[0];
		if (slug.startsWith("guachapala")) assert.equal(selector, undefined);
		else {
			assert.ok(selector);
			assert.match(selector, /Mañana/);
			assert.doesNotMatch(selector, /\d/);
		}
	});
}

test("every tour data file is covered by the duration migration", async () => {
	for (const name of await readdir(new URL("../src/data/tours/", import.meta.url))) {
		if (!name.endsWith(".ts")) continue;
		const text = await readFile(new URL(`../src/data/tours/${name}`, import.meta.url), "utf8");
		if (text.includes("satisfies Tour")) assert.ok(name.replace(/\.ts$/, "") in stages, `Missing coverage: ${name}`);
	}
});
