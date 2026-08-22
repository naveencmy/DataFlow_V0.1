import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard', analyticsController.getDashboardKPIs);
router.get('/attendance', analyticsController.getAttendanceAnalytics);
router.get('/leaves', analyticsController.getLeaveAnalytics);
router.get('/payroll', analyticsController.getPayrollAnalytics);

export default router;
