import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addItemToCartByName(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    const addToCartButton = item.getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();
  }

  async removeItemFromCartByName(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    const removeButton = item.getByRole('button', { name: /remove/i });
    await removeButton.click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.innerText();
      return parseInt(text, 10);
    }
    return 0;
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
