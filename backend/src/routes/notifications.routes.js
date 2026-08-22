import { Router } from 'express';
import { getNotifications, markRead, markAllRead } from '../controllers/notifications.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);

export default router;
