import { test as baseTest, expect } from '@playwright/test';
import { BasePage } from '../../pages/BasePage';

/**
 * Common Page Object fixtures interface.
 * Extend this type as you synthesize new Page Objects for your application.
 *
 * Example:
 * export type TestFixtures = {
 *   loginPage: LoginPage;
 *   dashboardPage: DashboardPage;
 * };
 */
export type TestFixtures = {
  /**
   * Common base navigation helper fixture
   */
  navigateTo: (path?: string) => Promise<void>;
};

/**
 * Custom Playwright test fixture.
 * Extend baseTest to inject pre-instantiated page objects and state fixtures.
 */
export const test = baseTest.extend<TestFixtures>({
  navigateTo: async ({ page }, use) => {
    await use(async (targetPath: string = '/') => {
      await page.goto(targetPath);
    });
  },
});

export { expect, BasePage };
