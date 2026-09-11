import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS } from '../../utils/testData';

test.describe('Orbit User Management Regression Suite @regression', () => {
  test.beforeEach(async ({ loginPage, workspacePage }) => {
    await loginPage.goto();
    await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
    await workspacePage.expectWorkspaceLoaded();
  });

  test('TC-36: Admin can create a team member', async ({ userModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-36' },
      { type: 'TMS_Suite', description: 'User Management' },
      { type: 'Priority', description: 'Critical' }
    );

    const suffix = Date.now().toString().slice(-4);
    const newUsername = `dev_${suffix}`;
    const newFullname = `Dev User ${suffix}`;

    await test.step('Open Add New User form', async () => {
      await userModal.openAddUserTab();
    });

    await test.step('Fill new user information and submit', async () => {
      await userModal.createUser({
        username: newUsername,
        password: 'password123',
        fullName: newFullname,
        email: `${newUsername}@orbit.local`,
        role: 'MEMBER',
      });
    });

    await test.step('Verify user appears in users table', async () => {
      await expect(userModal.tabUsersList).toHaveClass(/active/);
      await expect(userModal.usersTableBody).toContainText(newUsername);
      await userModal.closeUserManagement();
    });
  });

  test('TC-37: User creation validates required fields', async ({ userModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-37' },
      { type: 'TMS_Suite', description: 'User Management' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open Add User and submit empty form', async () => {
      await userModal.openAddUserTab();
      await userModal.submitAddUserBtn.click();
    });

    await test.step('Verify HTML5 required validation on username input', async () => {
      const isValid = await userModal.usernameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isValid).toBe(false);
      await userModal.closeUserManagement();
    });
  });

  test('TC-38: User role controls permitted actions (RBAC)', async ({ loginPage, workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-38' },
      { type: 'TMS_Suite', description: 'User Management' },
      { type: 'Priority', description: 'Critical' }
    );

    await test.step('Verify Admin has management controls', async () => {
      await expect(workspacePage.manageUsersBtn).toBeVisible();
      await expect(workspacePage.newProjectBtn).toBeVisible();
    });

    await test.step('Switch to Viewer and verify restricted controls are hidden', async () => {
      await loginPage.logout();
      await loginPage.returnToLogin();
      await loginPage.login(ORBIT_USERS.viewer.username, ORBIT_USERS.viewer.password);
      await workspacePage.expectWorkspaceLoaded();
      await expect(workspacePage.manageUsersBtn).toBeHidden();
      await expect(workspacePage.newProjectBtn).toBeHidden();
    });
  });

  test('TC-39: Admin can change another user name', async ({ userModal, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-39' },
      { type: 'TMS_Suite', description: 'User Management' },
      { type: 'Priority', description: 'Medium' }
    );

    const updatedName = `Alex Updated ${Date.now().toString().slice(-4)}`;

    await test.step('Open User Management list', async () => {
      await userModal.openUserManagement();
    });

    await test.step('Click Edit Name for user alex and update name', async () => {
      const editBtn = page.locator('button.btn-admin-edit-name').first();
      await editBtn.click();
      await expect(userModal.adminEditModal).toBeVisible();
      await userModal.adminEditFullnameInput.fill(updatedName);
      await userModal.adminEditSubmitBtn.click();
      await expect(userModal.adminEditModal).toBeHidden();
      await expect(userModal.usersTableBody).toContainText(updatedName);
      await userModal.closeUserManagement();
    });
  });

  test('TC-40: Password change enforces minimum length', async ({ userModal, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-40' },
      { type: 'TMS_Suite', description: 'User Management' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open User Management and open password modal', async () => {
      await userModal.openUserManagement();
      const pwdBtn = page.locator('button.btn-admin-change-pwd').first();
      await pwdBtn.click();
      await expect(userModal.adminPasswordModal).toBeVisible();
    });

    await test.step('Enter short password and verify validation', async () => {
      await userModal.adminNewPasswordInput.fill('12');
      await userModal.adminPasswordSubmitBtn.click();
      const isValid = await userModal.adminNewPasswordInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isValid).toBe(false);
      await page.locator('#admin-password-close').click();
      await userModal.closeUserManagement();
    });
  });
});
