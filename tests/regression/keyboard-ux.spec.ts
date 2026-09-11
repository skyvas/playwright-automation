import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS } from '../../utils/testData';

test.describe('Orbit Keyboard & UX Regression Suite @regression', () => {
  test.beforeEach(async ({ loginPage, workspacePage }) => {
    await loginPage.goto();
    await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
    await workspacePage.expectWorkspaceLoaded();
  });

  test('TC-45: "c" shortcut opens Create New Issue modal', async ({ page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-45' },
      { type: 'TMS_Suite', description: 'Keyboard & UX' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Press "c" shortcut and verify create issue modal opens', async () => {
      await page.keyboard.press('c');
      await expect(page.locator('#create-modal')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#create-modal')).toBeHidden();
    });
  });

  test('TC-46: "/" shortcut focuses issue filter input', async ({ workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-46' },
      { type: 'TMS_Suite', description: 'Keyboard & UX' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Press "/" shortcut and verify search input receives focus', async () => {
      await page.keyboard.press('/');
      await expect(workspacePage.searchInput).toBeFocused();
    });
  });

  test('TC-47: "Esc" shortcut closes open modal or preview', async ({ workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-47' },
      { type: 'TMS_Suite', description: 'Keyboard & UX' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Open Create Issue modal and press Escape to close', async () => {
      await workspacePage.openCreateIssue();
      await expect(page.locator('#create-modal')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#create-modal')).toBeHidden();
    });
  });

  test('TC-48: "?" shortcut opens keyboard shortcuts guide', async ({ workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-48' },
      { type: 'TMS_Suite', description: 'Keyboard & UX' },
      { type: 'Priority', description: 'Low' }
    );

    await test.step('Press "?" shortcut and verify shortcuts guide modal opens', async () => {
      await page.keyboard.press('?');
      await expect(workspacePage.shortcutsModal).toBeVisible();
      await workspacePage.closeShortcutsBtn.click();
      await expect(workspacePage.shortcutsModal).toBeHidden();
    });
  });
});
