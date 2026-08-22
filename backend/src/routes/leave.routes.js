import { Router } from 'express';
import { getLeaves, applyLeave, reviewLeave, cancelLeave } from '../controllers/leave.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getLeaves);
router.post('/', applyLeave);
router.put('/:id/review', requireAdmin, reviewLeave);
router.delete('/:id', cancelLeave);

export default router;
