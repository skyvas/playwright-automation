import { defineConfig } from '@playwright/test';
import { env } from './utils/custom-env';
import { globalSetup, globalTeardown } from './utils/test-hooks';
// dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: env.RETRIES,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    baseURL:  env.BASE_URL,
  },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'WebKit', use: { browserName: 'webkit' } },
  ],
});