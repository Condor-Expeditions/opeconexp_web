import { test, expect } from "@playwright/test";

test.describe("Video Optimization", () => {
	test("hero video has source tags with mp4 streams", async ({ page }) => {
		await page.goto("/");
		const video = page.locator("#hero-video");
		const sources = video.locator("source");
		const count = await sources.count();
		expect(count).toBeGreaterThanOrEqual(2);

		const srcs = await sources.evaluateAll((nodes) =>
			nodes.map((n) => ({ src: n.getAttribute("src"), type: n.getAttribute("type") })),
		);
		// Debe tener sources para desktop + mobile (landscape + portrait)
		expect(srcs.some((s) => s.src === "/videos/landscape_hero.mp4")).toBe(true);
		expect(srcs.some((s) => s.src === "/videos/portrait_hero.mp4")).toBe(true);
	});

	test("video has preload=metadata to avoid lazy-loading full video", async ({ page }) => {
		await page.goto("/");
		const video = page.locator("#hero-video");
		await expect(video).toBeVisible();
		const preload = await video.getAttribute("preload");
		expect(preload).toBe("metadata");
	});
});
