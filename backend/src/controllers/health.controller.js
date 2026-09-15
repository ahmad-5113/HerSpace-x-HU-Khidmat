import prisma from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getHealthStatus = async (req, res, next) => {
  try {
    // Ping SQLite via Prisma raw query
    await prisma.$queryRaw`SELECT 1`;

    const healthData = {
      uptime: process.uptime(),
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'Connected (SQLite via Prisma)',
      version: '1.0.0'
    };

    return ApiResponse.success(res, healthData, 'HerSpace API is healthy and running smoothly.');
  } catch (error) {
    next(error);
  }
};
