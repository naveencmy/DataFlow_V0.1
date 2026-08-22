import { pgPool } from '../../config/db.js';

export class NotificationRepository {
  async findByUserOrEmployee(userId, employeeId) {
    const query = `
      SELECT * FROM "Notification"
      WHERE "userId" = $1 OR "employeeId" = $2 OR ("userId" IS NULL AND "employeeId" IS NULL)
      ORDER BY "createdAt" DESC
      LIMIT 100
    `;
    const res = await pgPool.query(query, [userId, employeeId || '']);
    return res.rows;
  }

  async create(notif) {
    const query = `
      INSERT INTO "Notification" ("id", "userId", "employeeId", "title", "message", "type", "read")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const res = await pgPool.query(query, [
      notif.id,
      notif.userId || null,
      notif.employeeId || null,
      notif.title,
      notif.message,
      notif.type || 'system',
      notif.read || false,
    ]);
    return res.rows[0];
  }

  async markAsRead(id, userId, employeeId) {
    const query = `
      UPDATE "Notification"
      SET "read" = true, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = $1
      RETURNING *
    `;
    const res = await pgPool.query(query, [id]);
    return res.rows[0] || null;
  }

  async markAllAsRead(userId, employeeId) {
    const query = `
      UPDATE "Notification"
      SET "read" = true, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "userId" = $1 OR "employeeId" = $2
    `;
    await pgPool.query(query, [userId, employeeId || '']);
    return true;
  }

  async delete(id) {
    const query = `DELETE FROM "Notification" WHERE "id" = $1 RETURNING *`;
    const res = await pgPool.query(query, [id]);
    return res.rows[0] || null;
  }
}

export const notificationRepository = new NotificationRepository();
export default notificationRepository;
