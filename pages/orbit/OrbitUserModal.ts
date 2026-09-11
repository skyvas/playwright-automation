import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OrbitUserModal extends BasePage {
  readonly userMgmtModal: Locator;
  readonly manageUsersBtn: Locator;
  readonly userMgmtCloseBtn: Locator;
  readonly tabUsersList: Locator;
  readonly tabAddUser: Locator;

  // Add User form
  readonly addUserForm: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly fullnameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly submitAddUserBtn: Locator;
  readonly usersTableBody: Locator;

  // Admin edit name modal
  readonly adminEditModal: Locator;
  readonly adminEditFullnameInput: Locator;
  readonly adminEditSubmitBtn: Locator;

  // Admin password modal
  readonly adminPasswordModal: Locator;
  readonly adminNewPasswordInput: Locator;
  readonly adminPasswordSubmitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.userMgmtModal = page.locator('#user-mgmt-modal');
    this.manageUsersBtn = page.locator('#btn-manage-users');
    this.userMgmtCloseBtn = page.locator('#user-mgmt-close');
    this.tabUsersList = page.locator('#tab-users-list');
    this.tabAddUser = page.locator('#tab-users-add');

    this.addUserForm = page.locator('#add-user-form');
    this.usernameInput = page.locator('#add-user-username');
    this.passwordInput = page.locator('#add-user-password');
    this.fullnameInput = page.locator('#add-user-fullname');
    this.emailInput = page.locator('#add-user-email');
    this.roleSelect = page.locator('#add-user-role');
    this.submitAddUserBtn = page.locator('#add-user-form button[type="submit"]');
    this.usersTableBody = page.locator('#users-table-body');

    this.adminEditModal = page.locator('#admin-user-edit-modal');
    this.adminEditFullnameInput = page.locator('#admin-edit-fullname-input');
    this.adminEditSubmitBtn = page.locator('#admin-user-edit-form button[type="submit"]');

    this.adminPasswordModal = page.locator('#admin-password-modal');
    this.adminNewPasswordInput = page.locator('#admin-new-password-input');
    this.adminPasswordSubmitBtn = page.locator('#admin-password-form button[type="submit"]');
  }

  async openUserManagement(): Promise<void> {
    await this.manageUsersBtn.click();
    await expect(this.userMgmtModal).toBeVisible();
  }

  async openAddUserTab(): Promise<void> {
    await this.openUserManagement();
    await this.tabAddUser.click();
    await expect(this.usernameInput).toBeVisible();
  }

  async createUser(data: {
    username?: string;
    password?: string;
    fullName?: string;
    email?: string;
    role?: 'ADMIN' | 'MEMBER' | 'VIEWER';
  }): Promise<void> {
    if (data.username !== undefined) await this.usernameInput.fill(data.username);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
    if (data.fullName !== undefined) await this.fullnameInput.fill(data.fullName);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.role !== undefined) await this.roleSelect.selectOption(data.role);
    await this.submitAddUserBtn.click();
  }

  async closeUserManagement(): Promise<void> {
    await this.userMgmtCloseBtn.click();
    await expect(this.userMgmtModal).toBeHidden();
  }
}
