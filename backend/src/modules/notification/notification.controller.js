import { notificationService } from './notification.service.js';

export class NotificationController {
  constructor(service = notificationService) {
    this.service = service;
  }

  getMyNotifications = async (req, res, next) => {
    try {
      const notifs = await this.service.getMyNotifications(req.user);
      res.status(200).json({
        success: true,
        data: notifs,
      });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req, res, next) => {
    try {
      const updated = await this.service.markAsRead(req.params.id, req.user);
      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req, res, next) => {
    try {
      const result = await this.service.markAllAsRead(req.user);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteNotification = async (req, res, next) => {
    try {
      const result = await this.service.deleteNotification(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export const notificationController = new NotificationController();
export default notificationController;
