import { Router } from 'express';
import {
  getAttendance,
  getTodayAttendance,
  getEmployeeAttendance,
  checkIn,
  checkOut,
} from '../controllers/attendance.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getAttendance);
router.get('/today', requireAdmin, getTodayAttendance);
router.get('/:employeeId', getAttendance);
router.post('/checkin', checkIn);
router.put('/checkout', checkOut);

export default router;
