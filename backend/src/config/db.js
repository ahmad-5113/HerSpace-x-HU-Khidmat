import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ SQLite Database connected successfully via Prisma.');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

export default prisma;
