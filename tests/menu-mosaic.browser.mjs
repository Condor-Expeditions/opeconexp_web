// Run against Astro dev/preview. Both orientations must show every destination.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { publishedTours } from "./helpers/tour-data.mjs";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: "reduce" });
const base = process.env.BASE_URL || "http://localhost:4322";
const screenshots = process.env.SCREENSHOT_DIR || "/tmp/opencode/menu-mosaic";
await mkdir(screenshots, { recursive: true });
const expected = new Set(publishedTours.flatMap(tour => tour.destinations)).size;
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
	for (const [width, height] of [[2560, 1440], [1920, 1080], [1440, 900], [1136, 690], [1024, 768], [844, 390], [667, 375], [1080, 1920], [768, 1024], [430, 932], [390, 844], [360, 640]]) {
		await page.setViewportSize({ width, height });
		await page.goto(base, { waitUntil: "networkidle" });
		await page.locator("#menu-button").click();
		await page.waitForFunction(() => document.querySelector("#site-header").dataset.menuState === "open");
		const layout = await page.locator(".destination-grid").evaluate(grid => {
			const style = getComputedStyle(grid);
			const bounds = element => {
				const rect = element.getBoundingClientRect();
				return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
			};
			const rect = bounds(grid);
			const columns = style.gridTemplateColumns.split(" ").map(Number.parseFloat);
			const rows = style.gridTemplateRows.split(" ").map(Number.parseFloat);
			const cards = [...grid.children].map(bounds);
			const holes = [];
			let y = rect.top;
			for (const row of rows) {
				let x = rect.left;
				for (const column of columns) {
					const hits = cards.filter(card => x + column / 2 > card.left && x + column / 2 < card.right && y + row / 2 > card.top && y + row / 2 < card.bottom);
					if (hits.length !== 1) holes.push({ x, y, hits: hits.length });
					x += column + Number.parseFloat(style.columnGap);
				}
				y += row + Number.parseFloat(style.rowGap);
			}
			return { columns: columns.length, rows: rows.length, cards, holes, rect, overflow: document.documentElement.scrollWidth > innerWidth };
		});
		assert.equal(layout.cards.length, expected);
		assert.equal(layout.overflow, false, `${width}: no horizontal overflow`);
		if (expected === 7) {
			assert.equal(layout.rows, layout.columns === 2 ? 5 : 4, `${width}: no implicit trailing row`);
			assert.deepEqual(layout.holes, [], `${width}: complete rectangle, no gaps or overlaps`);
		}
		for (const card of layout.cards) {
			assert.ok(card.width >= 80 && card.height >= 96, `${width}: readable cards`);
			assert.ok(card.height / card.width <= 3, `${width}: no excessively tall image strips`);
			assert.ok(card.left >= layout.rect.left - 1 && card.right <= layout.rect.right + 1, `${width}: card inside mosaic`);
		}
		for (const card of await page.locator(".destination").all()) {
			await card.focus();
			await card.locator("img").evaluate(image => image.decode());
			assert.equal(await card.evaluate(element => {
				const card = element.getBoundingClientRect();
				const gallery = element.closest(".menu-destinations").getBoundingClientRect();
				return card.top >= gallery.top - 1 && card.bottom <= gallery.bottom + 1;
			}), true, `${width}: every destination reachable with the keyboard`);
		}
		await page.locator(".menu-destinations").evaluate(element => { element.scrollTop = 0; });
		await page.screenshot({ path: `${screenshots}/menu-${width}x${height}.png` });
		console.log(`PASS ${width}×${height}: ${expected} destinations, ${layout.columns} columns, complete mosaic and keyboard access`);
	}
	assert.deepEqual(errors, []);
} finally {
	await browser.close();
}
