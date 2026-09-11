import { test, expect } from '../fixtures/baseTest';
import { credentials, products } from '../../utils/testData';

test.describe('Ingested Manual Tests Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('C101 - Verify valid user can login successfully @smoke', async ({ loginPage, inventoryPage, page }) => {
    // Bi-directional TMS Traceability Annotations
    test.info().annotations.push({ type: 'TMS_ID', description: 'C101' });
    test.info().annotations.push({ type: 'TMS_System', description: 'TestRail' });
    test.info().annotations.push({ type: 'Source_File', description: 'testrail-export.csv' });

    await test.step('Step 1: Enter valid username in Username field', async () => {
      await loginPage.usernameInput.fill(credentials.validUser.username);
    });

    await test.step('Step 2: Enter valid password in Password field', async () => {
      await loginPage.passwordInput.fill(credentials.validUser.password);
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
      await expect(page).toHaveURL(/inventory\.html/);
    });

  });

  test('C102 - Verify locked out user receives error message @regression', async ({ loginPage, inventoryPage, page }) => {
    // Bi-directional TMS Traceability Annotations
    test.info().annotations.push({ type: 'TMS_ID', description: 'C102' });
    test.info().annotations.push({ type: 'TMS_System', description: 'TestRail' });
    test.info().annotations.push({ type: 'Source_File', description: 'testrail-export.csv' });

    await test.step('Step 1: Enter \'locked_out_user\' in Username field', async () => {
      await loginPage.usernameInput.fill(credentials.lockedOutUser.username);
    });

    await test.step('Step 2: Enter valid password in Password field', async () => {
      await loginPage.passwordInput.fill(credentials.validUser.password);
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Sorry, this user has been locked out.');
    });

  });

  test('C103 - Add product to cart and verify cart badge @smoke', async ({ loginPage, inventoryPage, page }) => {
    // Bi-directional TMS Traceability Annotations
    test.info().annotations.push({ type: 'TMS_ID', description: 'C103' });
    test.info().annotations.push({ type: 'TMS_System', description: 'TestRail' });
    test.info().annotations.push({ type: 'Source_File', description: 'testrail-export.csv' });

    // Handle Preconditions
    await test.step('Precondition: Login as valid user', async () => {
      await loginPage.login(credentials.validUser.username, credentials.validUser.password);
      await expect(page).toHaveURL(/inventory\.html/);
    });

    await test.step('Step 1: Locate \'Sauce Labs Backpack\'', async () => {
      await expect(inventoryPage.inventoryItems.filter({ hasText: products.backpack })).toBeVisible();
    });

    await test.step('Step 2: Click \'Add to cart\' button', async () => {
      await inventoryPage.addItemToCartByName(products.backpack);
    });

    await test.step('Step 3: Check shopping cart badge', async () => {
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

  });

  test('C104 - Remove product from cart from inventory page @regression', async ({ loginPage, inventoryPage, page }) => {
    // Bi-directional TMS Traceability Annotations
    test.info().annotations.push({ type: 'TMS_ID', description: 'C104' });
    test.info().annotations.push({ type: 'TMS_System', description: 'TestRail' });
    test.info().annotations.push({ type: 'Source_File', description: 'testrail-export.csv' });

    // Handle Preconditions
    await test.step('Precondition: Login as valid user', async () => {
      await loginPage.login(credentials.validUser.username, credentials.validUser.password);
      await expect(page).toHaveURL(/inventory\.html/);
    });

    // Precondition: Add item to cart
    await test.step('Precondition: Add product to cart', async () => {
      await inventoryPage.addItemToCartByName(products.backpack);
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

    await test.step('Step 1: Click \'Remove\' button on \'Sauce Labs Backpack\'', async () => {
      await inventoryPage.removeItemFromCartByName(products.backpack);
    });

    await test.step('Step 2: Check shopping cart badge', async () => {
      expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    });

  });

});
