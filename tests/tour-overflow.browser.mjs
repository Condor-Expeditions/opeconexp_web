// Requires Playwright and Chromium; run against an Astro dev or preview server.
import assert from "node:assert/strict";
import { publishedTours } from "./helpers/tour-data.mjs";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4322";
const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: "reduce" });

async function assertNoOverflow(context) {
	const dimensions = await page.evaluate(() => ({
		viewport: innerWidth,
		document: document.documentElement.scrollWidth,
	}));
	assert.ok(dimensions.document <= dimensions.viewport, `${context}: ${JSON.stringify(dimensions)}`);
}

try {
	for (const tour of publishedTours) {
		await page.goto(`${base}/tours/${tour.slug}/`, { waitUntil: "networkidle" });
		await page.evaluate(() => document.fonts.ready);
		for (const width of [320, 360, 390, 600, 768, 850, 1024, 1440]) {
			await page.setViewportSize({ width, height: 1000 });
			await assertNoOverflow(`${tour.slug} at ${width}px`);
			for (const selector of ["#tour-date", "#tour-departure"]) {
				const bounds = await page.locator(selector).boundingBox();
				assert.ok(bounds && bounds.width <= 1 && bounds.height <= 1, `${selector} must stay visually hidden`);
			}
			if (width <= 850) {
				const bar = await page.locator(".tour-mobile-bar").boundingBox();
				assert.ok(bar && bar.x >= 0 && bar.x + bar.width <= width, "Mobile CTA must fit the viewport");
			}
		}
		// Opening the custom controls must not reintroduce horizontal scrolling.
		await page.setViewportSize({ width: 320, height: 844 });
		await page.locator("#date-picker-trigger").click();
		await assertNoOverflow(`${tour.slug}: calendar open`);
		await page.locator("#date-picker-trigger").click();
		await page.locator("#passengers-picker-trigger").click();
		await assertNoOverflow(`${tour.slug}: passengers open`);
		console.log(`PASS ${tour.slug}: eight viewports, hidden controls and open pickers`);
	}
} finally {
	await browser.close();
}
