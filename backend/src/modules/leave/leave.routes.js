import { Router } from 'express';
import { leaveController } from './leave.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';
import { applyLeaveSchema, reviewLeaveSchema, queryLeaveSchema } from './leave.validation.js';

const router = Router();

router.use(authenticateJWT);

router.post('/', validate(applyLeaveSchema), leaveController.applyLeave);
router.get('/my', leaveController.getMyLeaves);
router.get('/', requireRole(['ADMIN', 'HR']), validate(queryLeaveSchema, 'query'), leaveController.getAllLeaves);
router.patch('/:id/review', requireRole(['ADMIN', 'HR']), validate(reviewLeaveSchema), leaveController.reviewLeave);

export default router;
