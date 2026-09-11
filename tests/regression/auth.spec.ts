import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS } from '../../utils/testData';

test.describe('Orbit Authentication Regression Suite @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-4: Invalid password is rejected and user remains on sign-in screen', async ({ loginPage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-4' },
      { type: 'TMS_Suite', description: 'Authentication' },
      { type: 'Priority', description: 'Critical' }
    );

    await test.step('Enter valid username and incorrect password', async () => {
      await loginPage.login(ORBIT_USERS.admin.username, 'wrongpassword123');
    });

    await test.step('Verify error message and user remains on login view', async () => {
      await loginPage.expectErrorMessage('Invalid username or password');
      await expect(loginPage.loginView).toBeVisible();
    });
  });

  test('TC-5: Unknown username is rejected with error feedback', async ({ loginPage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-5' },
      { type: 'TMS_Suite', description: 'Authentication' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Enter nonexistent username and password', async () => {
      await loginPage.login('nonexistent_user_xyz', 'any_password');
    });

    await test.step('Verify authentication fails with error alert', async () => {
      await loginPage.expectErrorMessage('Invalid username or password');
      await expect(loginPage.loginView).toBeVisible();
    });
  });

  test('TC-6: Required login fields are validated and prevent submission', async ({ loginPage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-6' },
      { type: 'TMS_Suite', description: 'Authentication' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Leave both fields blank and attempt to submit', async () => {
      await loginPage.signInButton.click();
    });

    await test.step('Verify form HTML5 validation prevents submission', async () => {
      const isUsernameValid = await loginPage.usernameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isUsernameValid).toBe(false);
    });

    await test.step('Enter username only and verify password validation', async () => {
      await loginPage.usernameInput.fill('admin');
      await loginPage.signInButton.click();
      const isPasswordValid = await loginPage.passwordInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isPasswordValid).toBe(false);
    });
  });
});
