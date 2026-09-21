import { expect, test } from "@playwright/test";

test("mega menu Explora: tabs cambian las cards", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto("/");
  await page.hover('[data-mega-trigger="explora"]');
  await page.waitForTimeout(400);
  await expect(page.locator("#explora-tab-categoria")).toBeChecked();
  const gridCat = page.locator('[data-grid="categoria"]');
  await expect(gridCat).toBeVisible();
  await expect(gridCat.locator("a").first()).toBeVisible();
  await page.screenshot({ path: "test-results/mega-tab-categoria.png" });

  // Click tab Region -> grid region visible, categoria oculta
  await page.click('label[for="explora-tab-region"]');
  await page.waitForTimeout(300);
  const gridRegion = page.locator('[data-grid="region"]');
  await expect(gridRegion).toBeVisible();
  await expect(page.locator('[data-grid="categoria"]')).toBeHidden();
  await page.screenshot({ path: "test-results/mega-tab-region.png" });

  // La primera card de region apunta al filtro correcto
  const href = await gridRegion.locator("a").first().getAttribute("href");
  expect(href).toContain("/explora?tipo=region&valor=");
});

test("filtro tipo=region funciona en /explora", async ({ page }) => {
  await page.goto("/explora?tipo=region&valor=sierra");
  await expect(page.locator("h1").first()).not.toHaveText("Explora");
});

test("legacy ?categoria= sigue funcionando", async ({ page }) => {
  await page.goto("/explora?categoria=trekking");
  await expect(page.locator("h1").first()).toBeVisible();
});
