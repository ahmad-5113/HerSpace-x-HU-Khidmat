import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'herspace_dev_secret_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};
