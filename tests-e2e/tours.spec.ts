import { test, expect } from '@playwright/test';

test.describe('Tour pages', () => {
  test('should display tour detail content', async ({ page }) => {
    await page.goto('/tours/city-tour-cuenca');
    // Title is the first h1 (hero section — not Header)
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).not.toBeEmpty();
    // Must have includes section
    const includesSection = page.locator('text=Incluye').first();
    await expect(includesSection).toBeVisible();
    // Must have pricing / reserve button
    await expect(page.locator('text=Reservar este tour').first()).toBeVisible();
  });

  test('should display reviews with star rating', async ({ page }) => {
    await page.goto('/tours/cajas-trekking');
    // Reviews section should show for tours with reviews (cajas-trekking has 2)
    await expect(page.locator('text=Reseñas').first()).toBeVisible();
    const yellowStars = page.locator('svg.w-4.h-4.text-yellow-400');
    // 2 reviews × 5 stars = 10 star icons
    await expect(yellowStars).toHaveCount(10);
    // At least one review avatar
    // At least one review avatar
    expect(await page.locator('.w-10.h-10.rounded-full').count()).toBeGreaterThan(0);
  });

  test('all 18 tours should have valid detail pages', async ({ page }) => {
    const slugs = [
      'city-tour-cuenca', 'cajas-trekking', 'cajas-camping', 'banos-aventura',
      'gualaceo-chordeleg', 'ingapirca-desde-cuenca', 'parapente-ruta-cuenca',
      'giron-cascada', 'paute', 'sigsig-tejido', 'yunguilla', 'asis-azuay',
      'cotopaxi-ascenso', 'quilotoa-loop', 'chimborazo-ascenso',
      'cuyabeno-4-dias', 'yasuni-wao', 'ruta-otavalo'
    ];
    for (const slug of slugs) {
      const response = await page.goto(`/tours/${slug}`);
      expect(response?.status()).toBe(200);
      // Hero h1 is the first h1 (after Header)
      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).not.toBeEmpty();
    }
  });
});