import { test, expect } from "@playwright/test";

test.describe("Video Optimization", () => {
	test("hero video has source tags with webm + mp4", async ({ page }) => {
		await page.goto("/");
		const video = page.locator("#hero-video");
		const sources = video.locator("source");
		const count = await sources.count();
		expect(count).toBeGreaterThanOrEqual(4);
		const srcs = await sources.evaluateAll((nodes) =>
			nodes.map((n) => ({ src: n.getAttribute("src"), type: n.getAttribute("type") })),
		);
		expect(srcs.some((s) => s.type === "video/webm" && s.src?.endsWith(".webm"))).toBe(true);
		expect(srcs.some((s) => s.type === "video/mp4" && s.src?.endsWith(".mp4"))).toBe(true);
	});

	test("video has preload=metadata to avoid lazy-loading full video", async ({ page }) => {
		await page.goto("/");
		const video = page.locator("#hero-video");
		await expect(video).toBeVisible();
		const preload = await video.getAttribute("preload");
		expect(preload).toBe("metadata");
	});
});
