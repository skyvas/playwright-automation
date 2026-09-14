/**
 * Test credentials and configuration loaded from environment variables.
 */
export const credentials = {
  validUser: {
    username: process.env.TEST_USERNAME || 'test_user',
    password: process.env.TEST_PASSWORD || 'test_password',
  },
  adminUser: {
    username: process.env.ADMIN_USERNAME || 'admin_user',
    password: process.env.ADMIN_PASSWORD || 'admin_password',
  },
};

/**
 * Reusable test constants and data factories.
 */
export const testData = {
  defaultTimeoutMs: 30000,
};