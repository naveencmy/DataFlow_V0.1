import { Router } from 'express';
import {
  getDashboardKPIs,
  getAttendanceAnalytics,
  getLeaveAnalytics,
  getPayrollAnalytics,
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.use(protect, requireAdmin);

router.get('/dashboard', getDashboardKPIs);
router.get('/attendance', getAttendanceAnalytics);
router.get('/leaves', getLeaveAnalytics);
router.get('/payroll', getPayrollAnalytics);

export default router;
