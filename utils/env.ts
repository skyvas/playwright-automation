import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',
  IS_CI: !!process.env.CI,
};
