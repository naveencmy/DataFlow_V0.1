import { Router } from 'express';
import { attendanceController } from './attendance.controller.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateJWT);

// Check-in (supports /checkin and /check-in)
router.post('/checkin', attendanceController.checkIn);
router.post('/check-in', attendanceController.checkIn);

// Check-out (supports /checkout and /check-out, PUT and POST)
router.put('/checkout', attendanceController.checkOut);
router.post('/checkout', attendanceController.checkOut);
router.post('/check-out', attendanceController.checkOut);

// Queries
router.get('/today', attendanceController.getAttendanceByDate);
router.get('/my', attendanceController.getMyAttendance);
router.get('/:employeeId', (req, res, next) => {
  if (req.params.employeeId === 'my' || req.params.employeeId === 'today') return next();
  return attendanceController.getMyAttendance({ ...req, user: { ...req.user, employeeId: req.params.employeeId } }, res, next);
});
router.get('/', attendanceController.getAttendanceByDate);

export default router;
