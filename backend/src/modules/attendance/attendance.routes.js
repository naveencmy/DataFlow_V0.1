import { Router } from 'express';
import { attendanceController } from './attendance.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';
import { checkInSchema, checkOutSchema, queryAttendanceSchema } from './attendance.validation.js';

const router = Router();

router.use(authenticateJWT);

router.post('/check-in', validate(checkInSchema), attendanceController.checkIn);
router.post('/check-out', validate(checkOutSchema), attendanceController.checkOut);
router.get('/my', attendanceController.getMyAttendance);
router.get('/', requireRole(['ADMIN', 'HR']), validate(queryAttendanceSchema, 'query'), attendanceController.getAttendanceByDate);

export default router;
