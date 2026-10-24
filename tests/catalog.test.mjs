import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const load = path => readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
// Destination assignments are editable content, not fixed test fixtures.
const listing = await load("tours/index.html");
const places = [...new Set([...listing.matchAll(/data-destinations="([^"]+)"/g)].flatMap(match => match[1].split(" ")))];

test("catalog: eleven data-backed cards, destinations, experience filters and real links", async () => {
	const html = await load("tours/index.html");
	const cards = [...html.matchAll(/<article class="tour-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
	assert.equal(cards.length, 11);
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

test("hero and listing: all eleven updated tours have matching names and destination assignments", async () => {
	const home = await load("index.html");
	const cards = [...listing.matchAll(/<article class="tour-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
	const tours = cards.map(card => {
		const [, href, title] = card.match(/<h2[^>]*>\s*<a href="([^"]+)">([^<]+)<\/a>/);
		return { href, title, destinations: card.match(/data-destinations="([^"]+)"/)[1].split(" ") };
	});
	const places = [...listing.matchAll(/name="lugar" value="([^"]+)" data-label="([^"]+)"/g)];
	const slides = [...home.matchAll(/<section class="embla__slide"[\s\S]*?<\/section>/g)].map(match => match[0]);
	const heroLinks = new Set();
	for (const [, id, label] of places) {
		const slide = slides.find(slide => slide.includes(`: Descubre ${label}"`));
		assert.ok(slide, `Missing hero slide for ${label}`);
		const actual = [...slide.matchAll(/<a href="([^"]+)" class="hero-tour-link[^>]*>\s*<span>([^<]+)<\/span>/g)]
			.map(([, href, title]) => ({ href, title }));
		const expected = tours.filter(tour => tour.destinations.includes(id)).map(({ href, title }) => ({ href, title }));
		assert.deepEqual(actual, expected, `${label}: hero links match current catalog, without missing or stale tours`);
		for (const link of actual) heroLinks.add(link.href);
	}
	assert.equal(places.length, 10);
	assert.equal(heroLinks.size, 11);
	for (const tour of tours) {
		assert.ok(heroLinks.has(tour.href), `${tour.title} is reachable from the hero`);
		const detail = await load(`${tour.href.slice(1)}index.html`);
		assert.equal(detail.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1], tour.title);
	}
	assert.doesNotMatch(listing, /USD \/ adulto|child-price|En preparación/);
	assert.doesNotMatch(home, /Por adulto · sujeto a confirmación/);
});

test("San Fernando is grouped under Girón without losing the Busa itinerary", async () => {
	const home = await load("index.html");
	const slides = [...home.matchAll(/<section class="embla__slide"[\s\S]*?<\/section>/g)].map(match => match[0]);
	assert.equal(slides.length, 11, "Intro plus ten destinations");
	assert.ok(!slides.some(slide => slide.includes(": Descubre San Fernando\"")));
	const giron = slides.find(slide => slide.includes(": Descubre Girón\""));
	assert.ok(giron);
	assert.match(giron, /href="\/tours\/aventura-en-cuadron\/"/);
	assert.match(giron, /href="\/tours\/cascada-de-giron\/"/);
	assert.match(giron, /laguna de Busa en San Fernando/);
	assert.doesNotMatch(listing, /name="lugar" value="san-fernando"|data-destinations="[^"]*san-fernando/);
	const menu = home.match(/<div class="destination-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/)?.[0];
	assert.doesNotMatch(menu, /lugar=san-fernando/);
	assert.match(menu, /lugar=giron/);
	const detail = await load("tours/aventura-en-cuadron/index.html");
	assert.match(detail, /Laguna de Busa/);
	assert.match(detail, /San Fernando/);
});

test("masonry: every destination opens a filtered list, without Déleg or Los Andes", async () => {
	const html = await load("index.html");
	const menu = html.match(/<div class="destination-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/)?.[0];
	assert.ok(menu);
	for (const place of places) assert.match(menu, new RegExp(`href="/tours/\\?lugar=${place}"`));
	assert.doesNotMatch(menu, /Déleg|Los Andes|\/tours\/(?!\?)/);
});

test("Guachapala: updated operational itinerary, starting price and inquiry", async () => {
	const html = await load("tours/guachapala-entre-paisajes-y-tradicion/index.html");
	assert.doesNotMatch(html, /Experiencia en preparación|Todavía no hay salidas disponibles|0 personas confirmadas/);
	assert.match(html, /id="tour-date"/);
	assert.match(html, /Puente tibetano y columpio/);
	const inquiry = html.match(/<aside id="consultar"[\s\S]*?<\/aside>/)?.[0];
	assert.match(inquiry, /\$40/);
	assert.match(inquiry, /inquiry-fallback/);
});
