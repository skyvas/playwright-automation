import { test, expect } from '../../tests/fixtures/baseTest';

/**
 * Example of a healed test spec:
 * - BEFORE: Flaky test using brittle CSS selector and waitForTimeout
 *   await page.waitForTimeout(2000);
 *   await page.locator('.btn-primary > span').click();
 *
 * - AFTER: Resilient, web-first accessible locator with auto-waiting
 */
test.describe('Healed Checkout Flow @regression', () => {
  test('Complete purchase with resilient locator', async ({ page }) => {
    await page.goto('/checkout');

    // Resilient accessible locator replaces fragile CSS class
    const submitBtn = page.getByRole('button', { name: 'Complete Order' });

    // Web-first auto-waiting assertion
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Confirmation assertion
    const confirmation = page.getByRole('heading', { name: 'Thank you for your order!' });
    await expect(confirmation).toBeVisible();
  });
});
