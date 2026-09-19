import { test, expect } from '../../tests/fixtures/baseTest';

test.describe('Dashboard with Mocked Network Routes @regression', () => {
  test('Renders profile successfully using mocked API', async ({ page }) => {
    // Intercept profile API call
    await page.route('**/api/v1/user/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'usr_123',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'Admin',
        }),
      });
    });

    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Welcome, Jane Doe' })).toBeVisible();
  });

  test('Displays error alert when profile endpoint returns 500', async ({ page }) => {
    // Intercept with simulated server fault
    await page.route('**/api/v1/user/profile', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/dashboard');
    await expect(page.getByRole('alert')).toContainText('Unable to load profile data');
  });
});
