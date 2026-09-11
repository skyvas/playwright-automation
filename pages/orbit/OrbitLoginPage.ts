import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OrbitLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorAlert: Locator;
  readonly errorText: Locator;
  readonly quickLoginAdmin: Locator;
  readonly quickLoginMember: Locator;
  readonly quickLoginViewer: Locator;
  readonly logoutButton: Locator;
  readonly logoutView: Locator;
  readonly returnLoginButton: Locator;
  readonly loginView: Locator;

  constructor(page: Page) {
    super(page);
    this.loginView = page.locator('#login-view');
    this.usernameInput = page.locator('#standalone-username');
    this.passwordInput = page.locator('#standalone-password');
    this.signInButton = page.locator('#btn-standalone-signin');
    this.errorAlert = page.locator('#login-error-alert');
    this.errorText = page.locator('#login-error-text');
    this.quickLoginAdmin = page.locator('.demo-chip-btn[data-user="admin"]');
    this.quickLoginMember = page.locator('.demo-chip-btn[data-user="alex"]');
    this.quickLoginViewer = page.locator('.demo-chip-btn[data-user="sam"]');
    this.logoutButton = page.locator('#btn-auth-action');
    this.logoutView = page.locator('#logout-view');
    this.returnLoginButton = page.locator('#btn-return-login');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForNetworkIdle();
  }

  async login(username?: string, password?: string): Promise<void> {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
    await this.signInButton.click();
  }

  async quickSignIn(role: 'admin' | 'alex' | 'sam'): Promise<void> {
    if (role === 'admin') await this.quickLoginAdmin.click();
    else if (role === 'alex') await this.quickLoginMember.click();
    else if (role === 'sam') await this.quickLoginViewer.click();
    await this.signInButton.click();
  }

  async logout(): Promise<void> {
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
    await expect(this.logoutView).toBeVisible();
  }

  async returnToLogin(): Promise<void> {
    await this.returnLoginButton.click();
    await expect(this.loginView).toBeVisible();
  }

  async expectErrorMessage(text?: string): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    if (text) {
      await expect(this.errorText).toContainText(text);
    }
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.logoutView).toBeVisible();
    await expect(this.page.locator('#app-view')).toBeHidden();
  }
}
