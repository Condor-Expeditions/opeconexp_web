import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
	test("should load and display key sections", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle(/Inicio|Home/i);
		// StatsBar
		await expect(page.locator("text=Nuestros Números")).toBeVisible();
		// SustainabilityBar
		await expect(page.locator("text=Sostenibilidad")).toBeVisible();
		// TestimonialsSection
		await expect(
			page.locator("text=Lo que dicen nuestros viajeros"),
		).toBeVisible();
		// ToursGrid — 3 featured tours
		const tourCards = page.locator(".hover-lift");
		await expect(tourCards).toHaveCount(3);
	});

	test("should show tours in the grid", async ({ page }) => {
		await page.goto("/");
		const firstCard = page.locator(".hover-lift").first();
		await expect(firstCard).toContainText("Reservar");
	});
});
