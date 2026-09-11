import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OrbitWorkspacePage extends BasePage {
  readonly appView: Locator;
  readonly projectSelect: Locator;
  readonly newProjectBtn: Locator;
  readonly sprintSelect: Locator;
  readonly manageSprintsBtn: Locator;
  readonly manageColumnsBtn: Locator;
  readonly createIssueBtn: Locator;
  readonly notifBell: Locator;
  readonly notifBadge: Locator;
  readonly notifPopover: Locator;
  readonly notifUnreadCount: Locator;
  readonly markAllReadBtn: Locator;
  readonly tabNotifAll: Locator;
  readonly tabNotifUnread: Locator;
  readonly notifList: Locator;
  readonly userProfile: Locator;
  readonly userName: Locator;
  readonly userRoleBadge: Locator;
  readonly manageUsersBtn: Locator;
  readonly sprintBanner: Locator;
  readonly bannerSprintState: Locator;
  readonly searchInput: Locator;
  readonly resetFiltersBtn: Locator;
  readonly totalIssuesCount: Locator;
  readonly shortcutsModal: Locator;
  readonly closeShortcutsBtn: Locator;

  // Profile modal
  readonly profileModal: Locator;
  readonly profileFullnameInput: Locator;
  readonly profileSaveBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.appView = page.locator('#app-view');
    this.projectSelect = page.locator('#project-select');
    this.newProjectBtn = page.locator('#btn-new-project');
    this.sprintSelect = page.locator('#sprint-select');
    this.manageSprintsBtn = page.locator('#btn-manage-sprints');
    this.manageColumnsBtn = page.locator('#btn-manage-columns');
    this.createIssueBtn = page.locator('#btn-create-issue');
    this.notifBell = page.locator('#notif-bell');
    this.notifBadge = page.locator('#notif-badge');
    this.notifPopover = page.locator('#notif-popover');
    this.notifUnreadCount = page.locator('#notif-unread-count');
    this.markAllReadBtn = page.locator('#btn-mark-all-read');
    this.tabNotifAll = page.locator('#tab-notif-all');
    this.tabNotifUnread = page.locator('#tab-notif-unread');
    this.notifList = page.locator('#notif-list');
    this.userProfile = page.locator('#user-profile');
    this.userName = page.locator('#user-name');
    this.userRoleBadge = page.locator('#user-role-badge');
    this.manageUsersBtn = page.locator('#btn-manage-users');
    this.sprintBanner = page.locator('#sprint-banner');
    this.bannerSprintState = page.locator('#banner-sprint-state');
    this.searchInput = page.locator('#search-input');
    this.resetFiltersBtn = page.locator('#btn-reset-filters');
    this.totalIssuesCount = page.locator('#total-issues-count');
    this.shortcutsModal = page.locator('#shortcuts-modal');
    this.closeShortcutsBtn = page.locator('#btn-close-shortcuts');

    this.profileModal = page.locator('#user-profile-modal');
    this.profileFullnameInput = page.locator('#profile-fullname-input');
    this.profileSaveBtn = page.locator('#user-profile-form button[type="submit"]');
  }

  async expectWorkspaceLoaded(): Promise<void> {
    await expect(this.appView).toBeVisible();
    await expect(this.projectSelect).toBeVisible();
    await expect(this.page.locator('.kanban-column').first()).toBeVisible();
  }

  async selectProject(projectValue: string): Promise<void> {
    await this.projectSelect.selectOption(projectValue);
    await this.waitForNetworkIdle();
  }

  async selectSprint(sprintValue: string): Promise<void> {
    await this.sprintSelect.selectOption(sprintValue);
    await this.waitForNetworkIdle();
  }

  async openCreateIssue(): Promise<void> {
    await this.createIssueBtn.click();
    await expect(this.page.locator('#create-modal')).toBeVisible();
  }

  async openNotifications(): Promise<void> {
    await this.notifBell.click();
    await expect(this.notifPopover).toBeVisible();
  }

  async markAllNotificationsRead(): Promise<void> {
    await this.markAllReadBtn.click();
    await expect(this.notifUnreadCount).toContainText('0 Unread');
  }

  async filterNotifications(tab: 'all' | 'unread'): Promise<void> {
    if (tab === 'all') {
      await this.tabNotifAll.click();
    } else {
      await this.tabNotifUnread.click();
    }
  }

  async openUserProfile(): Promise<void> {
    await this.userProfile.click();
    await expect(this.profileModal).toBeVisible();
  }

  async updateUserDisplayName(newName: string): Promise<void> {
    await this.openUserProfile();
    await this.profileFullnameInput.fill(newName);
    await this.profileSaveBtn.click();
    await expect(this.profileModal).toBeHidden();
    await expect(this.userName).toContainText(newName);
  }

  async searchIssues(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async clearFilters(): Promise<void> {
    if (await this.resetFiltersBtn.isVisible()) {
      await this.resetFiltersBtn.click();
    } else {
      await this.searchInput.fill('');
      await this.page.keyboard.press('Enter');
    }
  }

  async triggerShortcut(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async expectRoleBadge(role: string): Promise<void> {
    await expect(this.userRoleBadge).toHaveText(role);
  }
}
