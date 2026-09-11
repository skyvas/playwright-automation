import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS } from '../../utils/testData';

test.describe('Orbit Authentication Smoke Suite @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-1: Valid admin login grants workspace access with ADMIN role', async ({ loginPage, workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-1' },
      { type: 'TMS_Suite', description: 'Authentication' },
      { type: 'Priority', description: 'Critical' }
    );

    await test.step('Submit admin credentials', async () => {
      await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
    });

    await test.step('Verify workspace is displayed with ADMIN privileges', async () => {
      await workspacePage.expectWorkspaceLoaded();
      await workspacePage.expectRoleBadge('ADMIN');
      await expect(workspacePage.manageUsersBtn).toBeVisible();
      await expect(workspacePage.newProjectBtn).toBeVisible();
    });
  });

  test('TC-2: Valid member login grants member-level workspace access', async ({ loginPage, workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-2' },
      { type: 'TMS_Suite', description: 'Authentication' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Submit member credentials', async () => {
      await loginPage.login(ORBIT_USERS.member.username, ORBIT_USERS.member.password);
    });

    await test.step('Verify workspace opens with MEMBER role badge', async () => {
      await workspacePage.expectWorkspaceLoaded();
      await workspacePage.expectRoleBadge('MEMBER');
      await expect(workspacePage.manageUsersBtn).toBeHidden();
    });
  });

  test('TC-3: Valid viewer login grants viewer-level workspace access', async ({ loginPage, workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-3' },
      { type: 'TMS_Suite', description: 'Authentication' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Submit viewer credentials', async () => {
      await loginPage.login(ORBIT_USERS.viewer.username, ORBIT_USERS.viewer.password);
    });

    await test.step('Verify workspace opens with VIEWER role badge', async () => {
      await workspacePage.expectWorkspaceLoaded();
      await workspacePage.expectRoleBadge('VIEWER');
      await expect(workspacePage.manageUsersBtn).toBeHidden();
      await expect(workspacePage.newProjectBtn).toBeHidden();
    });
  });

  test('TC-7: Logout invalidates active session and shows logout view', async ({ loginPage, workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-7' },
      { type: 'TMS_Suite', description: 'Authentication' },
      { type: 'Priority', description: 'Critical' }
    );

    await test.step('Authenticate as admin', async () => {
      await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
      await workspacePage.expectWorkspaceLoaded();
    });

    await test.step('Select logout', async () => {
      await loginPage.logout();
      await loginPage.expectLoggedOut();
    });

    await test.step('Attempt navigating back to workspace and verify session is terminated', async () => {
      await page.goto('/');
      await expect(page.locator('#login-view')).toBeVisible();
      await expect(page.locator('#app-view')).toBeHidden();
    });
  });

  test('TC-8: Post-logout session data is purged and login return is available', async ({ loginPage, workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-8' },
      { type: 'TMS_Suite', description: 'Authentication' },
      { type: 'Priority', description: 'Critical' }
    );

    await test.step('Authenticate and load workspace', async () => {
      await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
      await workspacePage.expectWorkspaceLoaded();
    });

    await test.step('Execute logout and observe purged session state', async () => {
      await loginPage.logout();
      await expect(loginPage.logoutView).toContainText('You Have Been Successfully Logged Out');
      await expect(loginPage.logoutView).toContainText('session has been completely invalidated');
    });

    await test.step('Select return to login', async () => {
      await loginPage.returnToLogin();
    });
  });
});
