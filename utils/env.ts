import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  IS_CI: !!process.env.CI,
};
