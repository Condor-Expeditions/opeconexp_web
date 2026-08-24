import { test, expect } from '@playwright/test';

test.describe('SSR routes', () => {
  test('should return 200 for /tours/region with valid region', async ({ page }) => {
    const response = await page.goto('/tours/region?region=cuenca');
    expect(response?.status()).toBe(200);
    // Should show tours filtered for cuenca region (ToursGrid default shows 6)
    const regionTitle = page.locator('h1').first();
    await expect(regionTitle).toContainText(/Tours en Cuenca/i);
    const tourCards = page.locator('.hover-lift');
    await expect(tourCards).toHaveCount(6);
  });

  test('should return 200 for /tours/region with empty region', async ({ page }) => {
    const response = await page.goto('/tours/region');
    expect(response?.status()).toBe(200);
    // Shows first 6 tours as default
    const tourCards = page.locator('.hover-lift');
    await expect(tourCards).toHaveCount(6);
  });

  test('should return 200 for /tours/temporada', async ({ page }) => {
    const response = await page.goto('/tours/temporada');
    expect(response?.status()).toBe(200);
    const title = page.locator('h1').first();
    await expect(title).toContainText(/Temporada/i);
  });

  test('should handle 400 page', async ({ page }) => {
    await page.goto('/400');
    await expect(page.locator('h1').filter({ hasText: /Solicitud incorrecta/i })).toBeVisible();
  });

  test('should handle 404 page', async ({ page }) => {
    await page.goto('/404');
    await expect(page.locator('h1').filter({ hasText: /Página no encontrada/i })).toBeVisible();
  });
});