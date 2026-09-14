import { test, expect } from '../fixtures/baseTest';

test.describe('Application Healthcheck Smoke Suite @smoke', () => {
  test('Base URL is reachable and returns successful response', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/.+/);
  });
});
