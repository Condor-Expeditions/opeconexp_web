// Requires Playwright and Chromium. BASE_URL defaults to an Astro preview server.
// PLAYWRIGHT_MODULE can point to an external Playwright installation.
import assert from "node:assert/strict";
import { publishedTours } from "./helpers/tour-data.mjs";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4322";
const routes = publishedTours.map(tour => tour.slug);
const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", locale: "es-EC" });
page.on("pageerror", error => errors.push(error.message));

try {
	for (const route of routes) {
		await page.goto(`${base}/tours/${route}/`, { waitUntil: "networkidle" });
		assert.equal(await page.locator("main h1").count(), 1);
		assert.equal(await page.locator(".inquiry-form").isVisible(), true);
		for (const width of [1440, 1024, 768, 390, 360]) {
			await page.setViewportSize({ width, height: 1000 });
			assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: overflow at ${width}px`);
			const nav = await page.locator(".tour-section-nav").evaluate(element => ({
				height: element.clientHeight, scrollHeight: element.scrollHeight,
				overflowY: getComputedStyle(element).overflowY,
				scrollbar: getComputedStyle(element).scrollbarWidth,
			}));
			assert.equal(nav.overflowY, "hidden");
			assert.equal(nav.scrollbar, "none");
			assert.ok(nav.scrollHeight <= nav.height + 1, `${route}: vertical nav overflow at ${width}px`);
		}
		assert.equal(await page.locator(".tour-more-photo img").count(), 3);
		assert.equal(await page.locator(".gallery-photo:visible").count(), 5);
		await page.locator("[data-gallery-open]").click();
		await page.waitForFunction(() => document.activeElement?.classList.contains("pswp"));
		assert.equal(await page.locator(".pswp__counter").innerText(), `1 de ${publishedTours.find(tour => tour.slug === route).photos.length}`);
		await page.keyboard.press("ArrowRight");
		await page.waitForFunction(() => document.querySelector(".pswp__counter")?.textContent?.startsWith("2 de"));
		await page.keyboard.press("Escape");
		await page.waitForFunction(() => !document.querySelector(".pswp"));
		// Reopen from a thumbnail and preserve its slide index.
		await page.locator(".gallery-photo").nth(2).click();
		await page.waitForSelector(".pswp--ui-visible");
		assert.match(await page.locator(".pswp__counter").innerText(), /^3 de /);
		await page.getByRole("button", { name: "Foto anterior", exact: true }).click();
		await page.waitForFunction(() => document.querySelector(".pswp__counter")?.textContent?.startsWith("2 de"));
		await page.getByRole("button", { name: "Cerrar galería", exact: true }).click();
		await page.waitForFunction(() => !document.querySelector(".pswp"));
		const free = route === "free-walking-tour-cuenca";
		const price = publishedTours.find(tour => tour.slug === route).price;
		assert.equal(await page.locator(".tour-inquiry .tour-price strong").innerText(), price.kind === "free" ? "Gratuito" : `$${price.adult}`);
		assert.equal(await page.locator(".child-price").count(), 0);
		if (free) {
			assert.equal(await page.locator(".tour-inquiry .tour-price small").innerText(), "Aporte voluntario al finalizar");
			assert.equal(await page.locator("#tour-children").count(), 0);
		}
		console.log(`PASS ${route}: five viewports, gallery, keyboard, pricing`);
	}

	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto(`${base}/tours/cajas-al-descubierto/`, { waitUntil: "networkidle" });
	// Prevent the real WhatsApp navigation; verify the prepared message locally.
	await page.locator("form").evaluate(form => form.addEventListener("submit", event => event.preventDefault()));
	await page.locator("#tour-date").fill("2099-01-07");
	await page.locator("#tour-adults").selectOption("3");
	await page.locator("#tour-children").selectOption("1");
	await page.locator("#tour-departure").selectOption({ index: 1 });
	await page.locator(".inquiry-submit").click();
	const message = await page.locator('input[name="text"]').inputValue();
	assert.match(message, /NAT-001/);
	assert.match(message, /2099/);
	assert.match(message, /Adultos: 3. Niños: 1/);
	assert.match(message, /Horario de salida solicitado: 14:00\./);
	assert.doesNotMatch(message, /Turno preferido:|Mañana|Tarde/);
	assert.match(message, /no confirma una reserva/);
	await page.locator("#tour-date").fill("2000-01-01");
	assert.equal(await page.locator("#tour-date").evaluate(input => input.checkValidity()), false);
	console.log("PASS inquiry: date, passengers, shift, past-date validation; no message sent");

	// Test Astro client-side navigation: old handlers and lightboxes must be destroyed.
	await page.locator('.tour-more-links a[href="/tours/cajas-de-laguna-a-lo-ancestral/"]').click();
	await page.waitForURL("**/tours/cajas-de-laguna-a-lo-ancestral/");
	await page.locator("[data-gallery-open]").click();
	await page.waitForFunction(() => document.activeElement?.classList.contains("pswp"));
	assert.equal(await page.locator(".pswp").count(), 1);
	await page.keyboard.press("Escape");
	await page.waitForFunction(() => !document.querySelector(".pswp"));
	await page.locator("#tour-date").fill("2099-01-05"); // Monday: this tour runs Wed–Sun.
	assert.equal(await page.locator("#tour-date").evaluate(input => input.validity.customError), true);
	console.log("PASS client navigation: single lightbox, correct per-tour operating days");

	// Mobile CTA and free-tour presentation.
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(`${base}/tours/free-walking-tour-cuenca/`, { waitUntil: "networkidle" });
	assert.equal(await page.locator(".tour-mobile-bar").isVisible(), true);
	await page.locator('.tour-mobile-bar a').click();
	await page.waitForFunction(() => document.querySelector(".tour-detail")?.getAttribute("data-inquiry-visible") === "true");
	assert.equal(await page.locator(".tour-mobile-bar").isVisible(), false);
	console.log("PASS mobile CTA: consultation anchor, fixed bar hides while form is in view");

	// Progressive enhancement: basic gallery and contact work without JavaScript.
	const noJS = await browser.newPage({ javaScriptEnabled: false });
	await noJS.goto(`${base}/tours/free-walking-tour-cuenca/`);
	assert.equal(await noJS.locator(".inquiry-fallback").isVisible(), true);
	assert.equal(await noJS.locator(".inquiry-form").isVisible(), false);
	const imageURL = new URL(await noJS.locator(".gallery-photo").first().getAttribute("href"), base);
	assert.ok(imageURL.pathname.endsWith(".webp") || imageURL.searchParams.get("f") === "webp");
	await noJS.close();
	assert.deepEqual(errors, []);
	console.log("PASS no-JS fallback and zero browser errors");
} finally {
	await browser.close();
}
