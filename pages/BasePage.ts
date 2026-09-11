import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage serves as the foundational Page Object model providing common
 * actions, explicit waiting strategies, and navigational primitives.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to the configured baseURL
   */
  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Get the current page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for network idle state
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Capture a full-page screenshot
   */
  async takeScreenshot(fileName: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${fileName}.png`, fullPage: true });
  }
}
