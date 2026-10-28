// PLAYWRIGHT_MODULE may point to an external Playwright installation.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4321";
const browser = await chromium.launch();
const ids = ["experiencia", "itinerario", "incluye", "preparacion", "encuentro"];
try {
	for (const reducedMotion of ["no-preference", "reduce"]) {
		const page = await browser.newPage({ reducedMotion });
		const errors = [];
		page.on("pageerror", error => errors.push(error.message));
		for (const width of [390, 768, 1440]) {
			await page.setViewportSize({ width, height: 1000 });
			await page.goto(`${base}/tours/cajas-al-descubierto/`, { waitUntil: "networkidle" });
			for (const id of [...ids, ...ids.toReversed()]) {
				await page.locator(`.tour-section-nav a[href="#${id}"]`).click();
				await page.waitForFunction(id => {
					const section = document.getElementById(id);
					return Math.abs(section.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(section).scrollMarginTop)) < 3;
				}, id);
				await page.waitForFunction(id => document.querySelector('.tour-section-nav a[aria-current="location"]')?.getAttribute("href") === `#${id}`, id);
				assert.equal(await page.locator('.tour-section-nav a[aria-current="location"]').count(), 1);
			}
			// No click/hash change: scrollspy must track ordinary scrolling too.
			for (const id of ids) {
				await page.evaluate(id => {
					const section = document.getElementById(id);
					window.scrollTo({ top: scrollY + section.getBoundingClientRect().top - 200, behavior: "instant" });
				}, id);
				await page.mouse.wheel(0, 100);
				await page.waitForFunction(id => document.querySelector('.tour-section-nav a[aria-current="location"]')?.getAttribute("href") === `#${id}`, id);
			}
			console.log(`PASS ${width}px / ${reducedMotion}: all anchors forward/backward and manual scrolling`);
		}
		// A fresh document verifies incoming deep links, without in-flight wheel events.
		await page.goto("about:blank");
		await page.goto(`${base}/tours/cajas-al-descubierto/#itinerario`, { waitUntil: "networkidle" });
		await page.waitForFunction(() => document.querySelector('.tour-section-nav a[aria-current="location"]')?.getAttribute("href") === "#itinerario");
		assert.deepEqual(errors, []);
		await page.close();
	}
} finally {
	await browser.close();
}
