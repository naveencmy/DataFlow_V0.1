import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { requestLogger } from './shared/middlewares/requestLogger.middleware.js';
import { notFoundHandler, globalErrorHandler } from './shared/middlewares/error.middleware.js';
import { seed } from './prisma/seed.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import employeeRoutes from './modules/employee/employee.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import leaveRoutes from './modules/leave/leave.routes.js';
import payrollRoutes from './modules/payroll/payroll.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';

const app = express();

// ─── Security & Core Middlewares ──────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI inline assets
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost frontend or configured frontend origin
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// ─── Swagger Documentation ───────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Health Check & Seed Trigger ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Dayflow HRMS REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.post('/api/seed', async (req, res, next) => {
  try {
    await seed();
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully with 5 demo employees, attendance, leaves, and payroll records.',
    });
  } catch (error) {
    next(error);
  }
});

// ─── Versioned API Routes (/api/v1 and /api aliases) ─────────────────────────
const v1Router = express.Router();
v1Router.use('/auth', authRoutes);
v1Router.use('/employees', employeeRoutes);
v1Router.use('/attendance', attendanceRoutes);
v1Router.use('/leaves', leaveRoutes);
v1Router.use('/payroll', payrollRoutes);
v1Router.use('/notifications', notificationRoutes);

app.use('/api/v1', v1Router);
app.use('/api', v1Router); // Alias for seamless frontend compatibility

// ─── Error Handlers ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
