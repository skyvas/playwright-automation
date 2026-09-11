import { test, expect } from '../fixtures/baseTest';
import { credentials, products } from '../../utils/testData';

test.describe('End-to-End Shopping Flow @regression', () => {
  test('should allow user to log in, add items to cart, and verify cart count', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    // 1. Authenticate
    await loginPage.goto();
    await loginPage.login(credentials.validUser.username, credentials.validUser.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // 2. Add product to cart
    await inventoryPage.addItemToCartByName(products.backpack);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    // 3. Add second product
    await inventoryPage.addItemToCartByName(products.bikeLight);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // 4. Navigate to cart and verify items
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });
});
