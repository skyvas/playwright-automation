import dotenv from 'dotenv';
dotenv.config();

export const env = {
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',
  HEADLESS: process.env.HEADLESS === 'true',
  RETRIES: parseInt(process.env.RETRIES || '0', 10),
};
