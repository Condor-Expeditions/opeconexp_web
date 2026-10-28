// Run against `pnpm preview --port 4322`. No inquiries or external navigation.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { publishedTours } from "./helpers/tour-data.mjs";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4322";
const screenshots = process.env.SCREENSHOT_DIR || "/tmp/opencode/tour-photo-preview";
await mkdir(screenshots, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
page.on("response", response => {
	if (response.url().includes("/_astro/") && response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`);
});
page.on("request", request => {
	if (new URL(request.url()).pathname.startsWith("/tmp/")) errors.push(`Original requested: ${request.url()}`);
});
const loaded = async locator => {
	await locator.scrollIntoViewIfNeeded();
	await locator.evaluate(image => image.decode());
	assert.ok(await locator.evaluate(image => image.complete && image.naturalWidth > 0));
};

try {
	await page.goto(base, { waitUntil: "networkidle" });
	const intro = page.locator(".hero-image").first();
	await loaded(intro);
	assert.match(await intro.getAttribute("src"), /20261012_0233.*\.webp/);
	await page.screenshot({ path: `${screenshots}/hero-desktop.png` });
	await page.locator(".embla__next").click();
	await page.waitForFunction(() => document.querySelector(".hero-current").textContent === "02");
	await loaded(page.locator(".hero-image").nth(1));
	assert.match(await page.locator(".hero-image").nth(1).getAttribute("src"), /20261012_0293/);
	await page.screenshot({ path: `${screenshots}/hero-cajas.png` });
	await page.locator("#menu-button").click();
	await page.waitForFunction(() => document.querySelector("#site-header").dataset.menuState === "open");
	await loaded(page.locator('.destination-grid a[href="/tours/?lugar=el-cajas"] img'));
	await page.screenshot({ path: `${screenshots}/menu-desktop.png` });
	await page.locator("#menu-button").click();
	await page.goto(`${base}/tours/`, { waitUntil: "networkidle" });
	assert.equal(await page.locator("[data-tour-card]").count(), publishedTours.length);
	assert.equal(await page.locator(".card-slide img").count(), publishedTours.length, "Only cover images load before carousel interaction");
	await loaded(page.locator(".card-slide img").first());
	await page.screenshot({ path: `${screenshots}/catalog-desktop.png` });
	const updated = publishedTours.filter(tour => !tour.illustrativePhotos);
	for (const tour of updated) {
		await page.goto(`${base}/tours/${tour.slug}/`, { waitUntil: "networkidle" });
		assert.equal(await page.locator(".gallery-photo").count(), tour.photos.length);
		for (const width of [1440, 390]) {
			await page.setViewportSize({ width, height: 1000 });
			await loaded(page.locator(".gallery-photo img").first());
			assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
			await page.screenshot({ path: `${screenshots}/${tour.slug}-${width}.png` });
		}
		await page.locator("[data-gallery-open]").click();
		await page.waitForSelector(".pswp--ui-visible");
		assert.equal(await page.locator(".pswp__counter").innerText(), `1 de ${tour.photos.length}`);
		await loaded(page.locator(".pswp__img:not(.pswp__img--placeholder)").first());
		await page.getByRole("button", { name: "Foto anterior", exact: true }).click();
		await page.waitForFunction(count => document.querySelector(".pswp__counter").textContent === `${count} de ${count}`, tour.photos.length);
		await page.keyboard.press("Escape");
		await page.waitForFunction(() => !document.querySelector(".pswp"));
		console.log(`PASS ${tour.slug}: responsive images, desktop/mobile layout and ${tour.photos.length}-photo lightbox`);
	}
	assert.deepEqual(errors, []);
	console.log(`PASS hero, masonry, catalog, lazy carousel covers and zero image errors. Screenshots: ${screenshots}`);
} finally {
	await browser.close();
}
