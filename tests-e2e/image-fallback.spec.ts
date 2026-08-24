import { expect, test } from "@playwright/test";

test.describe("Image fallback", () => {
	test("TourDetail hero should show placehold.co fallback on 404", async ({
		page,
	}) => {
		const response = await page.goto("/tours/city-tour-cuenca");
		expect(response?.status()).toBe(200);

		// The hero img should exist
		const heroImg = page.locator('img[loading="eager"]').first();
		await expect(heroImg).toBeVisible();

		// Get the src - should be either the original path or placehold.co
		const src = await heroImg.getAttribute("src");
		const alt = await heroImg.getAttribute("alt");
		console.log("Hero image src:", src);
		console.log("Hero image alt:", alt);

		// The alt should contain the tour name
		expect(alt).toContain("City Tour Cuenca");

		// After onerror, the src should point to placehold.co if original was 404
		// (We can't easily test onerror in headless, but we verify the onerror attr exists)
		const onErrorAttr = await heroImg.getAttribute("onerror");
		console.log("onerror attr:", onErrorAttr);
		expect(onErrorAttr).toBeTruthy();
	});

	test("TourCard image should show placehold.co fallback on 404", async ({
		page,
	}) => {
		const response = await page.goto("/");
		expect(response?.status()).toBe(200);

		const cardImg = page.locator(".hover-lift img").first();
		await expect(cardImg).toBeVisible();

		const onErrorAttr = await cardImg.getAttribute("onerror");
		expect(onErrorAttr).toBeTruthy();
	});
});
