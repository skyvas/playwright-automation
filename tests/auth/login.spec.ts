import { test, expect } from '@playwright/test';
import logger from '../../utils/logger';
import { LoginPage } from '../../pages/LoginPage';
import { credentials } from '../../utils/testData';

test.describe('@smoke Login Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    logger.info('Navigating to login page');
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(/inventory/);
  });
});