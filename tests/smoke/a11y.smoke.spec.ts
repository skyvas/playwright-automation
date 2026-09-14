import { test, expect } from '../fixtures/baseTest';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit Suite @smoke @a11y', () => {
  test('Application root should have zero critical accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    // Filter for critical or serious accessibility violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(criticalViolations).toEqual([]);
  });
});
