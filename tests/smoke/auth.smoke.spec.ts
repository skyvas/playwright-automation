import { test, expect } from '../fixtures/baseTest';
import { credentials } from '../../utils/testData';

test.describe('Authentication Smoke Suite @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should successfully log in with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(credentials.validUser.username, credentials.validUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should display error message for locked out user', async ({ loginPage }) => {
    await loginPage.login(credentials.lockedOutUser.username, credentials.lockedOutUser.password);
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Sorry, this user has been locked out.');
  });
});
