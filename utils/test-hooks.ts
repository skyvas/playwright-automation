import { FullConfig } from '@playwright/test';
import logger from './logger';

async function globalSetup(config: FullConfig) {
  logger.info('Global setup before tests...');
}
async function globalTeardown(config: FullConfig) {
  logger.info('Global teardown after all tests...');
}

export { globalSetup, globalTeardown };
