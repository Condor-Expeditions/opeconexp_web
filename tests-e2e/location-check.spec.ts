import { expect, test } from "@playwright/test";

test("location shown on tour cards and detail", async ({ page }) => {
  await page.goto("/explora");
  await page.waitForSelector(".hover-lift");
  const card = page.locator(".hover-lift").first();
  // El texto incluye el emoji 📍
  await expect(card.locator("text=/📍.*Cuenca.*Azuay/i")).toBeVisible();
  await card.click();
  await page.waitForLoadState("networkidle");
  // En detail también aparece
  await expect(page.locator("text=/📍.*Cuenca.*Azuay/i").first()).toBeVisible();
});
