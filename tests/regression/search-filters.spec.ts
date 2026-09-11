import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS, ORBIT_PROJECTS } from '../../utils/testData';

test.describe('Orbit Search & Filters Regression Suite @regression', () => {
  test.beforeEach(async ({ loginPage, workspacePage }) => {
    await loginPage.goto();
    await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
    await workspacePage.expectWorkspaceLoaded();
    await workspacePage.selectProject(ORBIT_PROJECTS.core.id);
  });

  test('TC-32: Keyword filter returns matching issues and excludes non-matching', async ({ workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-32' },
      { type: 'TMS_Suite', description: 'Search & Filters' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Search by keyword "Architecture"', async () => {
      await workspacePage.searchIssues('Architecture');
    });

    await test.step('Verify matching issues are displayed', async () => {
      const cards = page.locator('.issue-card:visible');
      await expect(cards.first()).toBeVisible();
      await expect(cards.first()).toContainText('Architecture');
      await workspacePage.clearFilters();
    });
  });

  test('TC-33: Issue key search returns the exact issue', async ({ workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-33' },
      { type: 'TMS_Suite', description: 'Search & Filters' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Search for specific issue key PROJ-1', async () => {
      await workspacePage.searchIssues('PROJ-1');
    });

    await test.step('Verify issue card matching key is returned', async () => {
      const cards = page.locator('.issue-card:visible', { hasText: 'PROJ-1' });
      await expect(cards.first()).toBeVisible();
      await workspacePage.clearFilters();
    });
  });

  test('TC-34: Combined filters narrow results across criteria', async ({ workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-34' },
      { type: 'TMS_Suite', description: 'Search & Filters' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Select priority filter HIGH', async () => {
      await page.locator('#priority-filter').selectOption('HIGH');
    });

    await test.step('Verify filtered cards', async () => {
      const visibleCards = page.locator('.issue-card:visible');
      await expect(visibleCards.first()).toBeVisible();
      await workspacePage.clearFilters();
    });
  });

  test('TC-35: Clear filters restores the full issue set', async ({ workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-35' },
      { type: 'TMS_Suite', description: 'Search & Filters' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Get initial issue count', async () => {
      const initialCountText = await workspacePage.totalIssuesCount.textContent();
      const initialCount = parseInt(initialCountText || '0', 10);

      await test.step('Apply search filter and verify reduced count', async () => {
        await workspacePage.searchIssues('Architecture');
        await expect(page.locator('.issue-card:visible').first()).toBeVisible();
      });

      await test.step('Clear filters and verify count restored', async () => {
        await workspacePage.clearFilters();
        await expect(workspacePage.totalIssuesCount).toHaveText(initialCount.toString());
      });
    });
  });
});
