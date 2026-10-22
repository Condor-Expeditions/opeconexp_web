// Run with an Astro preview server; never sends a real inquiry.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4322";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const visibleCards = () => page.locator("[data-tour-card]:visible");
const expectCards = async count => { await page.waitForFunction(expected => [...document.querySelectorAll("[data-tour-card]")].filter(card => !card.hidden).length === expected, count); assert.equal(await visibleCards().count(), count); };
const openFilter = key => page.locator(`[data-filter="${key}"] > .filter-toggle`).click();

try {
	await page.goto(`${base}/tours/`, { waitUntil: "networkidle" });
	await expectCards(7);
	const archaeologyPlace = (await page.locator('[data-tour-card][data-experiences~="arqueologia"]').first().getAttribute("data-destinations")).split(" ")[0];
	// Only cover images are downloaded before interaction; templates stay inert.
	assert.equal(await page.locator(".card-slide img").count(), 7);
	for (const [width, height] of [[1440, 1000], [1024, 768], [768, 1024], [390, 844], [360, 740], [844, 390]]) {
		await page.setViewportSize({ width, height });
		assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow ${width}×${height}`);
		await openFilter("lugar");
		const panel = await page.locator('[data-filter="lugar"] .filter-panel').boundingBox();
		assert.ok(panel.x >= 0 && panel.x + panel.width <= width, "filter stays within viewport");
		await page.waitForFunction(() => {
			const panel = document.querySelector('[data-filter="lugar"] .filter-panel');
			return panel.getBoundingClientRect().bottom <= innerHeight + 1;
		});
		await page.keyboard.press("Escape");
		assert.equal(await page.locator('[data-filter="lugar"] .filter-toggle').getAttribute("aria-expanded"), "false");
		await page.locator("[data-tour-card]").last().scrollIntoViewIfNeeded();
		await page.waitForFunction(() => {
			const image = document.querySelector("[data-tour-card]:last-child img");
			return image.complete && image.naturalWidth > 0;
		});
		await page.evaluate(() => scrollTo(0, 0));
	}
	console.log("PASS catalog: six viewports, panels, lazy images, zero horizontal overflow");

	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.mouse.move(0, 0);
	const first = page.locator("[data-tour-card]").first();
	await first.scrollIntoViewIfNeeded();
	await page.mouse.move(0, 0);
	assert.equal(await first.locator(".card-next").evaluate(element => getComputedStyle(element).opacity), "0");
	await first.locator(".card-gallery").hover();
	await first.locator(".card-next").click();
	await page.waitForFunction(() => document.querySelector("[data-photo-current]").textContent === "2");
	assert.equal(await first.locator(".card-slide img").count(), 2);
	assert.equal(new URL(page.url()).pathname, "/tours/");
	await first.locator(".card-next").focus();
	await page.keyboard.press("ArrowRight");
	await page.waitForFunction(() => document.querySelector("[data-photo-current]").textContent === "3");
	await page.keyboard.press("ArrowLeft");
	await page.waitForFunction(() => document.querySelector("[data-photo-current]").textContent === "2");
	await page.setViewportSize({ width: 390, height: 844 });
	await page.mouse.move(0, 0);
	assert.equal(await first.locator(".card-next").evaluate(element => getComputedStyle(element).opacity), "1");
	console.log("PASS card carousel: hover, portrait controls, keyboard, lazy slides, no accidental navigation");
	const touch = await browser.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
	touch.on("pageerror", error => errors.push(error.message));
	await touch.goto(`${base}/tours/`, { waitUntil: "networkidle" });
	const touchCard = touch.locator("[data-tour-card]").first();
	await touchCard.scrollIntoViewIfNeeded();
	assert.equal(await touchCard.locator(".card-next").evaluate(element => getComputedStyle(element).opacity), "1");
	await touchCard.locator(".card-next").tap();
	await touch.waitForFunction(() => document.querySelector("[data-photo-current]").textContent === "2");
	const gallery = await touchCard.locator(".card-viewport").boundingBox();
	const cdp = await touch.context().newCDPSession(touch);
	const x = gallery.x + gallery.width * .8;
	const y = gallery.y + gallery.height * .5;
	await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
	for (let step = 1; step <= 8; step++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - step * gallery.width * .075, y }] });
	await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
	await touch.waitForFunction(() => document.querySelector("[data-photo-current]").textContent !== "2");
	assert.equal(new URL(touch.url()).pathname, "/tours/");
	await touch.close();
	console.log("PASS touch landscape: always-visible arrows, tap and native swipe");

	// Reproduce filtering during an active animation, without reduced motion.
	const stress = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: "no-preference" });
	stress.on("pageerror", error => errors.push(error.message));
	stress.on("crash", () => errors.push("Renderer crashed while filtering"));
	await stress.goto(`${base}/tours/`, { waitUntil: "networkidle" });
	const destinations = await stress.locator('input[name="lugar"]').evaluateAll(inputs => inputs.map(input => input.value));
	for (let round = 0; round < 3; round++) for (const destination of destinations) {
		await stress.evaluate(id => {
			// Hide a moving track in the same task, before it can finish its animation.
			for (const button of document.querySelectorAll(".card-next")) button.click();
			const input = [...document.querySelectorAll('input[name="lugar"]')].find(input => input.value === id);
			input.checked = true;
			input.dispatchEvent(new Event("change", { bubbles: true }));
		}, destination);
		await stress.waitForFunction(() => [...document.querySelectorAll("[data-tour-card]")].every(card => card.hidden !== card.hasAttribute("data-carousel-ready")));
		assert.equal(await stress.locator("[data-tour-card][hidden][data-carousel-ready]").count(), 0);
		await stress.locator(".catalog-clear").click();
		assert.equal(await stress.locator("[data-carousel-ready]").count(), 7);
	}
	await stress.locator(".card-gallery").first().hover();
	await stress.locator(".card-next").first().click();
	await stress.waitForFunction(() => document.querySelector("[data-photo-current]").textContent === "2");
	await stress.close();
	console.log("PASS 1920×1080: 33 filter cycles during animation; hidden carousels destroyed and restored without duplicate handlers");

	await page.goto(`${base}/tours/?lugar=chordeleg`, { waitUntil: "networkidle" });
	await expectCards(1);
	assert.match(await visibleCards().innerText(), /Pueblitos Mágicos/);
	assert.equal(await page.locator('input[value="chordeleg"]').isChecked(), true);
	await openFilter("lugar");
	await page.locator(`input[value="${archaeologyPlace}"]`).check();
	await expectCards(2); // OR within destinations.
	await openFilter("experiencia");
	await page.locator('input[value="arqueologia"]').check();
	await expectCards(1); // AND between filter groups.
	assert.match(await visibleCards().innerText(), /Raíces Ancestrales/);
	assert.ok(new URL(page.url()).searchParams.getAll("lugar").includes(archaeologyPlace));
	await page.keyboard.press("Escape");
	await visibleCards().locator(".card-cta").click();
	await page.waitForURL("**/tours/raices-ancestrales-del-ecuador/");
	await page.goBack();
	await page.waitForURL("**/tours/?**");
	await expectCards(1);
	assert.equal(await page.locator('input[value="arqueologia"]').isChecked(), true);
	await page.locator('[aria-label="Quitar filtro Arqueología"]').click();
	await expectCards(2);
	await page.locator(".catalog-clear").click();
	await expectCards(7);
	assert.equal(new URL(page.url()).search, "");
	console.log("PASS filters: incoming URL, OR/AND, selection labels, detail/back restoration, clearing");

	await page.goto(`${base}/tours/?lugar=guachapala&experiencia=arqueologia`, { waitUntil: "networkidle" });
	await expectCards(0);
	assert.equal(await page.locator("[data-empty-results]").isVisible(), true);
	await page.locator("[data-empty-results] button").click();
	await expectCards(7);
	await page.goto(`${base}/tours/?lugar=unknown&experiencia=unknown`, { waitUntil: "networkidle" });
	await expectCards(7);
	console.log("PASS empty state, reset and unknown URL parameters");

	await page.goto(`${base}/`, { waitUntil: "networkidle" });
	const slides = page.locator(".hero .embla__slide");
	assert.equal(await slides.count(), destinations.length + 1);
	assert.equal(await slides.first().locator(".hero-tours").count(), 0);
	assert.equal(await page.locator(".hero h1").count(), 1);
	await page.locator(".embla__next").click();
	await page.waitForFunction(() => document.querySelector(".hero-current").textContent === "02");
	assert.equal(await slides.nth(1).locator(".hero-tour-link").count(), 2);
	await slides.nth(1).locator(".hero-tour-link").first().click();
	await page.waitForURL("**/tours/cajas-al-descubierto/");
	await page.goBack();
	await page.waitForURL(`${base}/`);
	for (const [width, height] of [[1440, 1000], [390, 844], [844, 390]]) {
		await page.setViewportSize({ width, height });
		await page.locator("#menu-button").click();
		await page.waitForFunction(() => document.querySelector("#site-header").dataset.menuState === "open");
		assert.equal(await page.locator(".destination-grid a").count(), destinations.length);
		const guachapala = page.locator('.destination-grid a[href="/tours/?lugar=guachapala"]');
		await guachapala.waitFor({ state: "visible" });
		await guachapala.scrollIntoViewIfNeeded();
		await guachapala.click();
		await page.waitForURL("**/tours/?lugar=guachapala");
		await expectCards(1);
		assert.match(await visibleCards().innerText(), /En preparación|EN PREPARACIÓN/);
		await visibleCards().locator(".card-gallery").hover();
		await visibleCards().locator(".card-next").click();
		await page.waitForFunction(() => document.querySelector('[data-tour-card]:not([hidden]) [data-photo-current]').textContent === "2");
		await page.goto(`${base}/`, { waitUntil: "networkidle" });
	}
	console.log("PASS hero and masonry: destination counts, real tour links, filtered client navigation on three viewports");

	await page.goto(`${base}/tours/guachapala-entre-paisajes-y-tradicion/`, { waitUntil: "networkidle" });
	assert.equal(await page.locator(".tour-provisional-notice").isVisible(), true);
	assert.equal(await page.locator(".inquiry-form").count(), 0);
	assert.equal(await page.locator(".inquiry-fallback").isVisible(), true);
	const withoutCarousel = await browser.newPage();
	withoutCarousel.on("pageerror", error => errors.push(error.message));
	await withoutCarousel.route(/embla-carousel.*\.js/, route => route.abort());
	await withoutCarousel.goto(`${base}/tours/?lugar=chordeleg`, { waitUntil: "networkidle" });
	assert.equal(await withoutCarousel.locator("[data-filter-section]").isVisible(), true);
	assert.equal(await withoutCarousel.locator("[data-tour-card]:visible").count(), 1);
	await withoutCarousel.locator(".catalog-clear").click();
	assert.equal(await withoutCarousel.locator("[data-tour-card]:visible").count(), 7);
	assert.equal(await withoutCarousel.locator(".card-gallery-controls").first().getAttribute("hidden"), null);
	assert.equal(await withoutCarousel.locator(".card-next").first().isVisible(), true);
	await withoutCarousel.close();
	console.log("PASS filters and native galleries work without third-party carousel code");
	const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
	await noJS.goto(`${base}/tours/?lugar=chordeleg`);
	assert.equal(await noJS.locator("[data-tour-card]:visible").count(), 7);
	assert.equal(await noJS.locator(".catalog-filter-section").isVisible(), false);
	assert.equal(await noJS.locator(".card-gallery-controls").first().isVisible(), false);
	assert.equal(await noJS.locator(".card-cta").count(), 7);
	await noJS.close();
	assert.deepEqual(errors, []);
	console.log("PASS provisional tour, no-JS fallback and zero browser errors");
} finally {
	await browser.close();
}
