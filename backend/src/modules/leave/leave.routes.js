import { Router } from 'express';
import { leaveController } from './leave.controller.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

router.post('/', leaveController.applyLeave);
router.get('/my', leaveController.getMyLeaves);
router.get('/', leaveController.getAllLeaves);
router.put('/:id/review', requireRole(['ADMIN', 'HR']), leaveController.reviewLeave);
router.patch('/:id/review', requireRole(['ADMIN', 'HR']), leaveController.reviewLeave);

export default router;
