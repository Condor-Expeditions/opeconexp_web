import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const load = path => readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
// Destination assignments are editable content, not fixed test fixtures.
const listing = await load("tours/index.html");
const places = [...new Set([...listing.matchAll(/data-destinations="([^"]+)"/g)].flatMap(match => match[1].split(" ")))];

test("catalog: seven data-backed cards, destinations, experience filters and real links", async () => {
	const html = await load("tours/index.html");
	const cards = [...html.matchAll(/<article class="tour-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
	assert.equal(cards.length, 7);
	assert.equal((html.match(/<h1\b/g) || []).length, 1);
	for (const place of places) assert.match(html, new RegExp(`name="lugar" value="${place}"`));
	for (const type of ["naturaleza", "aventura", "cultura", "historia", "arqueologia", "gastronomia", "artesania", "recorrido-a-pie"]) assert.match(html, new RegExp(`name="experiencia" value="${type}"`));
	for (const card of cards) {
		assert.match(card, /data-destinations="[^"]+"/);
		assert.match(card, /data-experiences="[^"]+"/);
		assert.doesNotMatch(card, /Fotos ilustrativas|card-photo-note|card-photo-count/);
		assert.match(card, /class="sr-only" aria-live="polite"/);
		assert.match(card, /<template data-card-image/);
		const href = card.match(/href="(\/tours\/[^"?]+\/)/)?.[1];
		assert.ok(href);
		await assert.doesNotReject(load(`${href.slice(1)}index.html`));
	}
	assert.match(cards.find(card => card.includes("free-walking-tour")), /Aporte voluntario/);
	assert.match(html, /<noscript>/);
});

test("hero: intro without tours and exactly one slide per destination", async () => {
	const html = await load("index.html");
	const slides = [...html.matchAll(/<section class="embla__slide"[\s\S]*?<\/section>/g)].map(match => match[0]);
	assert.equal(slides.length, places.length + 1);
	assert.doesNotMatch(slides[0], /hero-tours|Explora nuestros tours/);
	assert.equal((html.match(/<h1\b/g) || []).length, 1);
	for (const slide of slides.slice(1)) {
		assert.match(slide, /hero-tours/);
		const links = [...slide.matchAll(/href="(\/tours\/[^"?]+\/)/g)];
		assert.ok(links.length > 0);
		for (const [, href] of links) await assert.doesNotReject(load(`${href.slice(1)}index.html`));
	}
});

test("masonry: every destination opens a filtered list, without Déleg or Los Andes", async () => {
	const html = await load("index.html");
	const menu = html.match(/<div class="destination-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/)?.[0];
	assert.ok(menu);
	for (const place of places) assert.match(menu, new RegExp(`href="/tours/\\?lugar=${place}"`));
	assert.doesNotMatch(menu, /Déleg|Los Andes|\/tours\/(?!\?)/);
});

test("Guachapala: clearly provisional, no invented tariff, reservation form or operational promises", async () => {
	const html = await load("tours/guachapala-entre-paisajes-y-tradicion/index.html");
	assert.match(html, /Experiencia en preparación/);
	assert.match(html, /Fotografías ilustrativas/);
	assert.match(html, /Todavía no hay salidas disponibles/);
	assert.doesNotMatch(html, /class="inquiry-form"|id="tour-date"|0 personas confirmadas/);
	const inquiry = html.match(/<aside id="consultar"[\s\S]*?<\/aside>/)?.[0];
	assert.match(inquiry, /Por confirmar/);
	assert.match(inquiry, /inquiry-fallback/);
	assert.doesNotMatch(inquiry, /\$\d/);
});
