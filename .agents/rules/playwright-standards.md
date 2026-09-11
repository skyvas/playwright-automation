# Playwright Automation Standards

## Locator Hierarchy
Always select elements in order of precedence:
1. `page.getByRole('button' | 'textbox' | 'link', { name: ... })` (User-facing accessibility semantics)
2. `page.getByLabel(...)` (Form inputs with associated labels)
3. `page.getByPlaceholder(...)` (Input placeholders)
4. `page.getByText(...)` (Non-interactive visible text)
5. `page.locator('[data-test="..."]')` or `page.getByTestId(...)` (Dedicated test attributes)
6. *Avoid*: Generic CSS selectors (`.btn-primary`), deep hierarchies (`div > ul > li:nth-child(2)`), or XPath.

## Test Structure
- Organize tests by intent:
  - `tests/smoke/*.smoke.spec.ts`: High-priority sanity checks tagged with `@smoke`.
  - `tests/regression/*.spec.ts`: Comprehensive end-to-end user journeys tagged with `@regression`.
- Use custom fixtures in `tests/fixtures/baseTest.ts` to inject page objects rather than manually instantiating `new LoginPage(page)`.
- Use `test.describe(...)` to logically group scenarios.

## Assertions
- Always use web-first async assertions:
  - Correct: `await expect(locator).toBeVisible();`
  - Correct: `await expect(page).toHaveURL(/inventory/);`
  - Avoid: `expect(await locator.isVisible()).toBeTruthy();` (Non-waiting, causes race conditions)
- Never use `page.waitForTimeout()`.

## Page Object Architecture
- All page objects MUST extend `BasePage` in `pages/BasePage.ts`.
- Encapsulate locators as `readonly` class properties initialized in the constructor.
- Provide descriptive action methods (`login()`, `addItemToCartByName()`).
