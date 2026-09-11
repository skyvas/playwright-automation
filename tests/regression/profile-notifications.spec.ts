import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS } from '../../utils/testData';

test.describe('Orbit Profile & Notifications Regression Suite @regression', () => {
  test.beforeEach(async ({ loginPage, workspacePage }) => {
    await loginPage.goto();
    await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
    await workspacePage.expectWorkspaceLoaded();
  });

  test('TC-41: User can update own profile name', async ({ workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-41' },
      { type: 'TMS_Suite', description: 'Profile' },
      { type: 'Priority', description: 'Medium' }
    );

    const newName = `Admin Name ${Date.now().toString().slice(-4)}`;

    await test.step('Update user display name in profile modal', async () => {
      await workspacePage.updateUserDisplayName(newName);
    });

    await test.step('Verify name is updated in top navbar', async () => {
      await expect(workspacePage.userName).toHaveText(newName);
    });
  });

  test('TC-42: Notification unread count is displayed on bell icon', async ({ workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-42' },
      { type: 'TMS_Suite', description: 'Notifications' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Observe notification bell and unread badge', async () => {
      await expect(workspacePage.notifBell).toBeVisible();
      await workspacePage.openNotifications();
      await expect(workspacePage.notifPopover).toBeVisible();
      await expect(workspacePage.notifUnreadCount).toBeVisible();
    });
  });

  test('TC-43: Mark all notifications as read clears unread state', async ({ workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-43' },
      { type: 'TMS_Suite', description: 'Notifications' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open notifications popover', async () => {
      await workspacePage.openNotifications();
    });

    await test.step('Click mark all as read and verify unread count becomes zero', async () => {
      await workspacePage.markAllNotificationsRead();
      await expect(workspacePage.notifUnreadCount).toContainText('0 Unread');
    });
  });

  test('TC-44: Notification filter switches between all and unread', async ({ workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-44' },
      { type: 'TMS_Suite', description: 'Notifications' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Open notifications and toggle tabs', async () => {
      await workspacePage.openNotifications();
      await workspacePage.filterNotifications('unread');
      await expect(workspacePage.tabNotifUnread).toHaveClass(/active/);

      await workspacePage.filterNotifications('all');
      await expect(workspacePage.tabNotifAll).toHaveClass(/active/);
    });
  });
});
