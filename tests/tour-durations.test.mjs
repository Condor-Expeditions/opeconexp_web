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
	"cajas-el-secreto-de-los-andes": [15, 50, 40, 90, 160, 30],
	"raices-ancestrales-del-ecuador": [15, 60, 60, 90, 75, 60, 120, 75],
	"pueblitos-magicos": [15, 75, 90, 75, 60, 45, 15, 25, 35, 15, 45],
	"aventura-en-cuadron": [15, 40, 60, 140, 60, 120, 60],
	"free-walking-tour-cuenca": [15, 30, 30, 30, 45],
	"guachapala-entre-paisajes-y-tradicion": [15, 90, 45, 135, 75, 75, 120],
	"cascada-de-giron": [15, 45, 45, 105, 45],
	"compras-y-artesanias": [45, 60, 15, 45, 45, 30],
	"el-origen-de-los-ancestros": [90, 75, 75, 75, 60, 105, 90],
	"paute-dinosaurios-naturaleza-y-sabores": [15, 60, 60, 45, 45, 45, 45],
};

for (const [slug, minutes] of Object.entries(stages)) {
	test(`${slug}: stage durations remain separate from departure times`, async () => {
		const source = await readFile(new URL(`../src/data/tours/${slug}.ts`, import.meta.url), "utf8");
		const values = [...source.matchAll(/durationMinutes:\s*(\d+|null)/g)].map(match => match[1] === "null" ? null : Number(match[1]));
		assert.deepEqual(values, minutes);
		assert.doesNotMatch(source, /\btime:\s*"/);
		if (/enabled:\s*false/.test(source)) {
			await assert.rejects(readFile(new URL(`../dist/tours/${slug}/index.html`, import.meta.url)), { code: "ENOENT" });
			return;
		}
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
	assert.equal(itineraryDuration([{ durationMinutes: 45 }, { durationMinutes: 60 }]), "Aprox. 2 horas");
	for (const [minutes, expected] of [[1, "Aprox. 0.5 horas"], [60, "Aprox. 1 hora"], [240, "Aprox. 4 horas"], [254, "Aprox. 4 horas"], [255, "Aprox. 4.5 horas"], [270, "Aprox. 4.5 horas"], [284, "Aprox. 4.5 horas"], [285, "Aprox. 5 horas"], [495, "Aprox. 8.5 horas"]]) {
		assert.equal(itineraryDuration([{ durationMinutes: minutes }]), expected);
	}
	for (const invalid of [0, -15, 1.5, Number.NaN]) assert.throws(() => itineraryDuration([{ durationMinutes: invalid }]));
	assert.equal(itineraryDuration([{ durationMinutes: 45 }, { durationMinutes: null }]), "Por confirmar");
	assert.equal(itineraryDuration([]), "Por confirmar");
});

test("approximate totals are shared by the catalog, home features and detail pages", async () => {
	const { publishedTours } = await import("./helpers/tour-data.mjs");
	const listing = await readFile(new URL("../dist/tours/index.html", import.meta.url), "utf8");
	const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
	for (const tour of publishedTours) {
		const total = itineraryDuration(tour.itinerary);
		const card = [...listing.matchAll(/<article class="tour-card"[\s\S]*?<\/article>/g)].find(match => match[0].includes(`/tours/${tour.slug}/`))?.[0];
		assert.ok(card?.includes(total), `${tour.slug}: approximate duration on catalog card`);
		const featured = [...home.matchAll(/<article class="home-tour"[\s\S]*?<\/article>/g)].find(match => match[0].includes(`/tours/${tour.slug}/`))?.[0];
		if (featured) assert.ok(featured.includes(total), `${tour.slug}: same duration on home card`);
	}
});

test("Cajas al Descubierto keeps Dos Chorreras without gastronomic promotion", async () => {
	const { allTours } = await import("./helpers/tour-data.mjs");
	const tour = allTours.find(tour => tour.id === "NAT-001");
	assert.doesNotMatch([tour.summary, tour.description, ...tour.highlights.map(item => item.description), ...tour.itinerary.map(item => item.description)].join(" "), /gastronom|sabores|degustación/i);
	assert.ok(tour.itinerary.some(stage => stage.title === "Chocolatería Dos Chorreras" && stage.durationMinutes === 45));
	assert.ok(tour.photos.some(photo => photo.src.includes("/dos-chorreras/")));
	assert.ok(!tour.experienceTypes.includes("gastronomia"));
});

test("every tour data file is covered by the duration migration", async () => {
	for (const name of await readdir(new URL("../src/data/tours/", import.meta.url))) {
		if (!name.endsWith(".ts")) continue;
		const text = await readFile(new URL(`../src/data/tours/${name}`, import.meta.url), "utf8");
		if (text.includes("satisfies Tour")) assert.ok(name.replace(/\.ts$/, "") in stages, `Missing coverage: ${name}`);
	}
});
