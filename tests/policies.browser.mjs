// Run against Astro preview. No external inquiry is submitted.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4322";
const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
	for (const width of [1440, 768, 360]) {
		await page.setViewportSize({ width, height: 900 });
		for (const route of ["/politicas-comerciales/", "/tours/cajas-al-descubierto/#politicas", "/tours/free-walking-tour-cuenca/#politicas"]) {
			await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
			assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: overflow at ${width}`);
		}
	}
	await page.goto(`${base}/tours/cajas-al-descubierto/#politicas`, { waitUntil: "networkidle" });
	assert.equal(await page.locator("#politicas details[open]").count(), 1);
	await page.locator("#politicas summary").first().focus();
	await page.keyboard.press("Enter");
	assert.equal(await page.locator("#politicas details").first().getAttribute("open"), "");
	await page.locator("#politicas .tour-policy-link").click();
	await page.waitForURL("**/politicas-comerciales");
	await page.locator('nav.policy-index a[href="#cancelaciones"]').click();
	assert.equal(await page.locator("#cancelaciones").isVisible(), true);
	const noJS = await browser.newPage({ javaScriptEnabled: false });
	await noJS.goto(`${base}/tours/cajas-al-descubierto/#politicas`);
	await noJS.locator("#politicas summary").first().click();
	assert.equal(await noJS.locator("#politicas details").first().getAttribute("open"), "");
	await noJS.close();
	assert.deepEqual(errors, []);
	console.log("PASS policies: responsive layout, keyboard accordions, full-document links and no-JS access");
} finally { await browser.close(); }
