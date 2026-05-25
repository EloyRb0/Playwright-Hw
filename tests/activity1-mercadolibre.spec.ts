import { test, expect } from '@playwright/test';

/**
 * Activity 1: MercadoLibre
 * Single test block that exercises the 7 recommended Playwright locators:
 *   1. getByRole
 *   2. getByText
 *   3. getByLabel
 *   4. getByPlaceholder
 *   5. getByAltText
 *   6. getByTitle
 *   7. getByTestId
 */
test.describe('Activity 1 - MercadoLibre 7 recommended locators', () => {
  // MercadoLibre is heavy; give this test a longer ceiling
  test.setTimeout(90_000);

  test('uses the 7 recommended locators on MercadoLibre', async ({ page }) => {
    await page.goto('https://www.mercadolibre.com.mx/', { waitUntil: 'domcontentloaded' });

    // 1. getByRole - "Categorías" navigation menu (it's an <a> with role="button")
    const categoriasLink = page.getByRole('button', { name: 'Categorías' }).first();
    await expect(categoriasLink).toBeVisible({ timeout: 30_000 });

    // 2. getByText - the "Envío gratis" promo text on the homepage
    const envioGratis = page.getByText('Envío gratis', { exact: true }).first();
    await expect(envioGratis).toBeVisible();

    // 3. getByLabel - the search container has aria-label="Buscar"
    const searchLabel = page.getByLabel('Buscar').first();
    await expect(searchLabel).toBeVisible();

    // 4. getByPlaceholder - the actual search input
    const searchInput = page.getByPlaceholder('Buscar productos, marcas y más…');
    await expect(searchInput).toBeVisible();

    // 5. getByAltText - one of the promo banners (banner alt text varies, use a regex)
    const promoBanner = page.getByAltText(/OFF|OFERTAS|HASTA/i).first();
    await expect(promoBanner).toBeVisible({ timeout: 15_000 });

    // 6. getByTitle - the cart link has title="Carrito"
    const cart = page.getByTitle('Carrito').first();
    await expect(cart).toBeVisible();

    // 7. getByTestId - the cookie-banner "Entendido" button has data-testid="action:understood-button"
    const testIdEl = page.getByTestId('action:understood-button').first();
    await expect(testIdEl).toBeVisible();

    // Bonus: use the search input to actually fire a search
    await searchInput.fill('laptop');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/laptop/i);
  });
});
