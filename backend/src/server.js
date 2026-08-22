import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { initializeDatabase, pgPool } from './config/db.js';
import { initializeSocketServer } from './sockets/socket.server.js';
import { initializeCronJobs } from './jobs/cron.js';

async function bootstrap() {
  // 1. Initialize PostgreSQL
  await initializeDatabase();

  // 2. Create HTTP Server
  const server = http.createServer(app);

  // 3. Initialize Socket.io Real-Time Server
  initializeSocketServer(server);

  // 4. Initialize Background Cron Scheduler
  initializeCronJobs();

  // 5. Start Listening
  server.listen(env.PORT, () => {
    logger.info(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                 DAYFLOW HRMS BACKEND API                     ║
    ║                                                              ║
    ║   🚀 Server running on: http://localhost:${env.PORT}                ║
    ║   📚 Swagger API Docs:  http://localhost:${env.PORT}/api-docs        ║
    ║   ⚡ WebSocket:         ws://localhost:${env.PORT}/notifications   ║
    ║   🐘 Database:          PostgreSQL 15                        ║
    ║   🔴 Cache & Queue:     Redis 7 + BullMQ                     ║
    ║   🌍 CORS Origin:       ${env.FRONTEND_URL}        ║
    ╚══════════════════════════════════════════════════════════════╝
    `);
  });

  // Graceful Shutdown
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      await pgPool.end();
      logger.info('PostgreSQL pool drained.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error({ err }, '❌ Fatal server bootstrap error');
  process.exit(1);
});

export default app;
