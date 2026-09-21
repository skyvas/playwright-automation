import { test as baseTest, expect } from '@playwright/test';

/**
 * Base test fixture providing clean extension points for synthesized Page Object Models.
 * Adheres to AGENTS.md standards for custom fixture injection.
 */
export type TestFixtures = {
  // Page object models are registered here as tests are synthesized
};

export const test = baseTest.extend<TestFixtures>({});

export { expect };
