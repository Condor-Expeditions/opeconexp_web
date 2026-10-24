import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { formatStageDuration, itineraryDuration } from "../src/data/tours/duration.ts";

test("stage durations are readable minutes/hours, never clock times", () => {
	for (const [minutes, expected] of [[15, "15 min"], [40, "40 min"], [60, "1 h"], [75, "1 h 15 min"], [120, "2 h"], [140, "2 h 20 min"], [150, "2 h 30 min"], [160, "2 h 40 min"], [null, "Por confirmar"]]) {
		assert.equal(formatStageDuration(minutes), expected);
	}
	for (const invalid of [0, -15, 1.5, Number.NaN]) assert.throws(() => formatStageDuration(invalid));
});

// Exact stage durations from the updated FICHA TOUR sheets.
const stages = {
	"cajas-al-descubierto": [15, 45, 40, 60, 40, 45, 40],
	"cajas-de-laguna-a-lo-ancestral": [15, 50, 40, 90, 160, 30],
	"raices-ancestrales-del-ecuador": [15, 60, 60, 90, 75, 60, 120, 75],
	"pueblitos-magicos": [15, 75, 90, 75, 60, 45, 15, 25, 35, 15, 45],
	"aventura-en-cuadron": [15, 40, 60, 140, 60, 120, 60],
	"free-walking-tour-cuenca": [15, 30, 30, 30, 45],
	"guachapala-entre-paisajes-y-tradicion": [15, 90, 45, 135, 75, 75, 120],
	"cascada-de-giron": [15, 45, 45, 105, 45],
	"compras-y-artesanias": [45, 60, 15, 45, 45, 30],
	"raices-ancestrales-sigsig": [90, 75, 75, 75, 60, 105, 90],
	"paute-dinosaurios-naturaleza-y-sabores": [15, 60, 60, 45, 45, 45, 45],
};

for (const [slug, minutes] of Object.entries(stages)) {
	test(`${slug}: stage durations remain separate from departure times`, async () => {
		const source = await readFile(new URL(`../src/data/tours/${slug}.ts`, import.meta.url), "utf8");
		const values = [...source.matchAll(/durationMinutes:\s*(\d+|null)/g)].map(match => match[1] === "null" ? null : Number(match[1]));
		assert.deepEqual(values, minutes);
		assert.doesNotMatch(source, /\btime:\s*"/);
		const html = await readFile(new URL(`../dist/tours/${slug}/index.html`, import.meta.url), "utf8");
		const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
		assert.ok(main);
		const timeline = main.match(/<ol class="tour-timeline"[\s\S]*?<\/ol>/)?.[0];
		assert.doesNotMatch(timeline, /\b\d{1,2}:\d{2}\b/, "Itinerary stages show elapsed duration, not fixed clock times");
		const labels = [...main.matchAll(/class="timeline-duration">([^<]+)</g)].map(match => match[1]);
		assert.deepEqual(labels, minutes.map(formatStageDuration));
		const total = itineraryDuration(minutes.map(durationMinutes => ({ durationMinutes })));
		assert.match(main, new RegExp(`<span>Duración</span><strong>${total}</strong>`), "Published total is the sum of every stage");
		const selector = main.match(/<select id="tour-departure"[\s\S]*?<\/select>/)?.[0];
		assert.ok(selector);
		const expected = slug === "free-walking-tour-cuenca" ? ["Horario a convenir"]
			: ["cajas-al-descubierto", "compras-y-artesanias", "paute-dinosaurios-naturaleza-y-sabores"].includes(slug) ? ["08:30", "14:00"] : ["08:30"];
		const departures = JSON.parse(source.match(/departures:\s*(\[[^\]]*\])/)?.[1]);
		assert.deepEqual(departures, expected);
		const options = [...selector.matchAll(/<option[^>]*>([^<]+)<\/option>/g)].map(match => match[1]);
		assert.deepEqual(options, expected);
		assert.ok(main.includes(`<dt>Horarios de salida</dt><dd>${expected.join(" / ")}</dd>`));
		assert.doesNotMatch(main, /Turno preferido|Turnos de salida|La hora exacta se coordina/);
		const id = source.match(/source\("([^"]+)"/)?.[1];
		const snapshot = JSON.parse(await readFile(new URL(`../src/data/tours/source/${id}.json`, import.meta.url), "utf8"));
		if (slug === "free-walking-tour-cuenca") {
			assert.equal(snapshot.cells.B17, "Salida flexible");
			assert.doesNotMatch(selector, /\d{2}:\d{2}/);
		} else for (const time of expected) assert.ok(snapshot.cells.B17.includes(time), `${slug}: ${time} must come from FICHA TOUR B17`);
	});
}

test("total duration follows itinerary edits, including pauses, and handles pending stages", () => {
	assert.equal(itineraryDuration([{ durationMinutes: 45 }, { durationMinutes: 60 }]), "1 h 45 min");
	assert.equal(itineraryDuration([{ durationMinutes: 45 }, { durationMinutes: null }]), "Por confirmar");
	assert.equal(itineraryDuration([]), "Por confirmar");
});

test("every tour data file is covered by the duration migration", async () => {
	for (const name of await readdir(new URL("../src/data/tours/", import.meta.url))) {
		if (!name.endsWith(".ts")) continue;
		const text = await readFile(new URL(`../src/data/tours/${name}`, import.meta.url), "utf8");
		if (text.includes("satisfies Tour")) assert.ok(name.replace(/\.ts$/, "") in stages, `Missing coverage: ${name}`);
	}
});
