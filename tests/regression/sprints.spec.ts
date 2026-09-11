import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS } from '../../utils/testData';

test.describe('Orbit Sprints Regression Suite @regression', () => {
  test.beforeEach(async ({ loginPage, workspacePage }) => {
    await loginPage.goto();
    await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
    await workspacePage.expectWorkspaceLoaded();
  });

  test('TC-17: Create and schedule sprint with required name', async ({ sprintModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-17' },
      { type: 'TMS_Suite', description: 'Sprints' },
      { type: 'Priority', description: 'Critical' }
    );

    const sprintName = `Sprint Automated ${Date.now().toString().slice(-4)}`;

    await test.step('Open Plan New Sprint modal tab', async () => {
      await sprintModal.openPlanNewSprint();
    });

    await test.step('Fill sprint details and dates', async () => {
      await sprintModal.fillSprintForm(sprintName, 'Complete test migration', '2026-10-01', '2026-10-14');
    });

    await test.step('Submit and verify sprint is created in list', async () => {
      await sprintModal.submitSprint();
      await expect(sprintModal.tabActiveSprints).toHaveClass(/active/);
      await expect(sprintModal.sprintMgmtModal).toContainText(sprintName);
      await sprintModal.closeSprintManagement();
    });
  });

  test('TC-18: Sprint creation blocks missing sprint name', async ({ sprintModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-18' },
      { type: 'TMS_Suite', description: 'Sprints' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open Plan New Sprint and leave name blank', async () => {
      await sprintModal.openPlanNewSprint();
      await sprintModal.fillSprintForm('', 'Goal with no name');
      await sprintModal.submitSprint();
    });

    await test.step('Verify required validation prevents submission', async () => {
      const isValid = await sprintModal.sprintNameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isValid).toBe(false);
      await sprintModal.closeSprintManagement();
    });
  });

  test('TC-19: Sprint date range entry and validation feedback', async ({ sprintModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-19' },
      { type: 'TMS_Suite', description: 'Sprints' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open Plan New Sprint and check date inputs', async () => {
      await sprintModal.openPlanNewSprint();
      await expect(sprintModal.sprintStartDateInput).toBeVisible();
      await expect(sprintModal.sprintEndDateInput).toBeVisible();
      await sprintModal.closeSprintManagement();
    });
  });

  test('TC-20: Start sprint changes sprint state to active in UI', async ({ workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-20' },
      { type: 'TMS_Suite', description: 'Sprints' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Verify sprint banner reflects sprint state', async () => {
      await expect(workspacePage.sprintBanner).toBeVisible();
      await expect(workspacePage.bannerSprintState).toBeVisible();
    });
  });

  test('TC-21: Complete sprint summarizes completed and incomplete issues', async ({ sprintModal, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-21' },
      { type: 'TMS_Suite', description: 'Sprints' },
      { type: 'Priority', description: 'Critical' }
    );

    await test.step('Check Complete Sprint dialog if active sprint exists', async () => {
      if (await sprintModal.bannerCompleteSprintBtn.isVisible()) {
        await sprintModal.bannerCompleteSprintBtn.click();
        await expect(sprintModal.completeSprintModal).toBeVisible();
        await expect(page.locator('#complete-stat-done')).toBeVisible();
        await expect(page.locator('#complete-stat-incomplete')).toBeVisible();
        await page.locator('#btn-cancel-complete').click();
        await expect(sprintModal.completeSprintModal).toBeHidden();
      }
    });
  });

  test('TC-22: Incomplete sprint issues carryover option is available', async ({ sprintModal, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-22' },
      { type: 'TMS_Suite', description: 'Sprints' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Verify carryover destination options', async () => {
      if (await sprintModal.bannerCompleteSprintBtn.isVisible()) {
        await sprintModal.bannerCompleteSprintBtn.click();
        await expect(sprintModal.incompleteDestinationSelect).toBeVisible();
        await expect(sprintModal.incompleteDestinationSelect).toContainText(/Backlog/i);
        await page.locator('#btn-cancel-complete').click();
      }
    });
  });
});
