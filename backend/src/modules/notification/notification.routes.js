import { Router } from 'express';
import { notificationController } from './notification.controller.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', notificationController.getMyNotifications);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
