import { randomUUID } from 'crypto';
import { notificationRepository } from './notification.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class NotificationService {
  constructor(repo = notificationRepository) {
    this.repo = repo;
  }

  async getMyNotifications(user) {
    return this.repo.findByUserOrEmployee(user.userId, user.employeeId);
  }

  async markAsRead(id, user) {
    const updated = await this.repo.markAsRead(id, user.userId, user.employeeId);
    if (!updated) {
      throw new NotFoundError(`Notification ${id} not found`);
    }
    return updated;
  }

  async markAllAsRead(user) {
    await this.repo.markAllAsRead(user.userId, user.employeeId);
    return { success: true, message: 'All notifications marked as read' };
  }

  async deleteNotification(id) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Notification ${id} not found`);
    }
    return { success: true, message: 'Notification deleted' };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
