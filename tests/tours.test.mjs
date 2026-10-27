import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { allTours } from "./helpers/tour-data.mjs";

// Build first: pnpm build && node --test tests/*.test.mjs
const cases = [
	["NAT-001", "cajas-al-descubierto", "25", 7],
	["NAT-002", "cajas-de-laguna-a-lo-ancestral", "40", 6],
	["ARQ-001", "raices-ancestrales-del-ecuador", "40", 8],
	["CULT-001", "pueblitos-magicos", "35", 11],
	["NAT-003", "cascada-de-giron", "35", 5],
	["NAT-004", "aventura-en-cuadron", "85", 7],
	["FWT-001", "free-walking-tour-cuenca", null, 5],
	["ARTE-001", "compras-y-artesanias", "35", 6],
	["ARQ-002", "raices-ancestrales-sigsig", "40", 7],
	["CULT-002", "guachapala-entre-paisajes-y-tradicion", "40", 7],
	["NAT-006", "paute-dinosaurios-naturaleza-y-sabores", "35", 7],
];

for (const [id, slug, price, stops] of cases) {
	test(`${id}: complete detail, gallery, price and inquiry`, async () => {
		const tour = allTours.find(tour => tour.slug === slug);
		if (!tour.enabled) {
			await assert.rejects(readFile(new URL(`../dist/tours/${slug}/index.html`, import.meta.url)), { code: "ENOENT" });
			return;
		}
		const html = await readFile(new URL(`../dist/tours/${slug}/index.html`, import.meta.url), "utf8");
		assert.equal((html.match(/<h1\b/g) || []).length, 1);
		const backLink = html.match(/<a class="tour-back-link" href="\/tours"[\s\S]*?<\/a>/)?.[0];
		assert.ok(backLink, "Detail links directly to the tour catalog");
		assert.match(backLink, /Todos los tours/);
		assert.ok(html.indexOf(backLink) < html.indexOf("<h1"), "Back link appears above the tour title");
		assert.match(html, new RegExp(`EXPEDICIÓN <strong>${id}</strong>`));
		assert.doesNotMatch(html, /hero-image|breadcrumb|92,029|123 4567|Radio VHF|tarifa neta/i);
		assert.doesNotMatch(html, /Fotografías ilustrativas|Pronto compartiremos imágenes/);
		assert.match(html, /data-icon="share"/);
		assert.match(html, /Ver todas las fotos/);
		assert.equal((html.match(/class="tour-more-photo"/g) || []).length, 3);
		const gallery = html.match(/<div class="tour-gallery"[\s\S]*?<\/section>/)?.[0];
		assert.ok(gallery);
		assert.equal((gallery.match(/class="gallery-photo\b/g) || []).length, tour.photos.length);
		assert.ok((gallery.match(/data-pswp-width="\d+"/g) || []).length >= 5);
		assert.ok((gallery.match(/data-pswp-height="\d+"/g) || []).length >= 5);
		assert.match(gallery, /fetchpriority="high"/);
		assert.match(gallery, /srcset=/);
		const timeline = html.match(/<ol class="tour-timeline"[\s\S]*?<\/ol>/)?.[0];
		assert.equal((timeline?.match(/<li>/g) || []).length, stops);
		for (const section of ["experiencia", "itinerario", "incluye", "preparacion", "encuentro", "consultar"]) assert.match(html, new RegExp(`id="${section}"`));
		const inquiry = html.match(/<aside id="consultar"[\s\S]*?<\/aside>/)?.[0];
		assert.ok(inquiry);
		assert.match(inquiry, /https:\/\/wa\.me\/593995900614/);
		assert.match(inquiry, /Sujeto a confirmación/);
		assert.match(inquiry, /type="date" required/);
		assert.doesNotMatch(inquiry, /child-price|Niños \([^<]+\): desde/);
		assert.match(html, /Consulta disponibilidad de guía en inglés/);
		if (price) {
			assert.match(inquiry, /class="price-from">Desde/);
			assert.match(inquiry, new RegExp(`<strong>\\$${price}</strong>`));
		} else {
			assert.match(inquiry, /<strong>Gratuito<\/strong>\s*<small>Aporte voluntario al finalizar<\/small>/);
			assert.doesNotMatch(inquiry, /price-from|\$0|50%|anticipo/i);
		}
		for (const match of html.matchAll(/href="(\/tours\/[^"#?]+)"/g)) {
			await assert.doesNotReject(readFile(new URL(`../dist${match[1]}index.html`, import.meta.url)));
		}
	});
	test(`${id}: full FICHA TOUR provenance is preserved`, async () => {
		const snapshot = JSON.parse(await readFile(new URL(`../src/data/tours/source/${id}.json`, import.meta.url), "utf8"));
		assert.equal(snapshot.sheet, "FICHA TOUR");
		assert.equal(snapshot.tourId, id);
		assert.ok(snapshot.cells.B6, "Preserve the original workbook ID, including known mismatches");
		assert.match(snapshot.file, /\.xlsx$/);
		assert.ok(Object.keys(snapshot.cells).length > 100);
		assert.ok(Object.keys(snapshot.formulas).length > 0);
		assert.ok(snapshot.cells.B8);
		const content = await readFile(new URL(`../src/data/tours/${slug}.ts`, import.meta.url), "utf8");
		const published = [...content.matchAll(/durationMinutes:\s*(\d+)/g)].map(match => Number(match[1]));
		const original = Array.from({ length: stops }, (_, index) => {
			const value = snapshot.cells[`A${22 + index}`];
			assert.ok(value, `${id}: missing stage duration in FICHA TOUR`);
			const hours = Number(value.match(/(\d+)\s*h/i)?.[1] ?? 0);
			const minutes = Number(value.match(/(\d+)\s*min/i)?.[1] ?? 0);
			return hours * 60 + minutes;
		});
		assert.deepEqual(published, original, "Every published stage follows FICHA TOUR, not commercial summaries");
	});
}

test("catalog IDs, one starting price, updated routes and source cells", async () => {
	assert.equal(new Set(cases.map(([id]) => id)).size, 11);
	const pueblos = await readFile(new URL("../dist/tours/pueblitos-magicos/index.html", import.meta.url), "utf8");
	const story = pueblos.match(/<div class="tour-story">[\s\S]*?<div class="tour-inquiry-column">/)?.[0];
	assert.match(story, /Ingapirca/);
	assert.doesNotMatch(story, /Sígsig|Chobshi|Castillo de Duma/);
	const sigsig = await readFile(new URL("../dist/tours/raices-ancestrales-sigsig/index.html", import.meta.url), "utf8");
	assert.match(sigsig, /almuerzo se paga por separado/);
	const cajas = await readFile(new URL("../dist/tours/cajas-de-laguna-a-lo-ancestral/index.html", import.meta.url), "utf8");
	assert.match(cajas, /dos variantes al mismo precio/i);
	for (const [id, slug] of cases) {
		const content = await readFile(new URL(`../src/data/tours/${slug}.ts`, import.meta.url), "utf8");
		assert.doesNotMatch(content, /child:|childAges:/);
		const snapshot = JSON.parse(await readFile(new URL(`../src/data/tours/source/${id}.json`, import.meta.url), "utf8"));
		const refs = content.match(/source\("[^"]+", \[([^\]]*)\]/)?.[1] ?? "";
		for (const [, cell] of refs.matchAll(/"([A-Z]+\d+)"/g)) assert.ok(snapshot.cells[cell], `${id}: missing price source ${cell}`);
	}
});

test("brand styles contain no cream token, hex or alpha variants", async () => {
	const walk = async (directory) => {
		for (const entry of await readdir(directory, { withFileTypes: true })) {
			const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
			if (entry.isDirectory()) await walk(path);
			else if (/\.(astro|css|ts)$/.test(entry.name)) assert.doesNotMatch(await readFile(path, "utf8"), /--color-crema|#f4efdc/i, path.pathname);
		}
	};
	await walk(new URL("../src/", import.meta.url));
});

test("internal source snapshots and editorial notes are absent from client bundles", async () => {
	for (const file of await readdir(new URL("../dist/_astro/", import.meta.url))) {
		if (!file.endsWith(".js")) continue;
		const js = await readFile(new URL(`../dist/_astro/${file}`, import.meta.url), "utf8");
		assert.doesNotMatch(js, /pendingReview|PLANTILLA MAESTRA DE CREACIÓN|123 4567/);
	}
});
