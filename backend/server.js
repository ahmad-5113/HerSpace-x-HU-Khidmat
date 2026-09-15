import app from './src/app.js';
import { env } from './src/config/env.js';
import prisma, { connectDatabase } from './src/config/db.js';

const startServer = async () => {
  // Connect and verify database
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 HerSpace Backend Server is running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
    console.log(`🔗 Health Check: http://localhost:${env.PORT}/api/v1/health`);
  });

  // Graceful Shutdown
  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log('💤 HTTP server closed.');
      await prisma.$disconnect();
      console.log('🗄️ Database disconnected.');
      process.exit(0);
    });

    // Force shutdown after 10s if hung
    setTimeout(() => {
      console.error('⚠️ Forcing server shutdown.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
