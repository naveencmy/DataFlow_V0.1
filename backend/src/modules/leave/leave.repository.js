import { pgPool } from '../../config/db.js';

export class LeaveRepository {
  async findById(id) {
    const query = `
      SELECT l.*, e.name as "employeeName", e.email as "employeeEmail", e."profilePicture" as "employeeAvatar", e.department
      FROM "LeaveRequest" l
      JOIN "Employee" e ON e.id = l."employeeId"
      WHERE l.id = $1
      LIMIT 1
    `;
    const res = await pgPool.query(query, [id]);
    return res.rows[0] || null;
  }

  async findByEmployee(employeeId) {
    const query = `
      SELECT l.*, e.name as "employeeName", e.department, e."profilePicture" as "employeeAvatar"
      FROM "LeaveRequest" l
      JOIN "Employee" e ON e.id = l."employeeId"
      WHERE l."employeeId" = $1
      ORDER BY l."createdAt" DESC
    `;
    const res = await pgPool.query(query, [employeeId]);
    return res.rows;
  }

  async findAll({ status, employeeId } = {}) {
    const conditions = [];
    const params = [];

    if (status) {
      params.push(status);
      conditions.push(`l.status = $${params.length}`);
    }

    if (employeeId) {
      params.push(employeeId);
      conditions.push(`l."employeeId" = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT l.*, e.name as "employeeName", e.department, e."profilePicture" as "employeeAvatar"
      FROM "LeaveRequest" l
      JOIN "Employee" e ON e.id = l."employeeId"
      ${whereClause}
      ORDER BY l."createdAt" DESC
    `;
    const res = await pgPool.query(query, params);
    return res.rows;
  }

  async create(data) {
    const query = `
      INSERT INTO "LeaveRequest" (
        "id", "employeeId", "leaveType", "startDate", "endDate",
        "totalDays", "remarks", "attachmentUrl", "attachmentFileName",
        "status", "appliedDate"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const res = await pgPool.query(query, [
      data.id,
      data.employeeId,
      data.leaveType,
      data.startDate,
      data.endDate,
      data.totalDays,
      data.remarks,
      data.attachmentUrl || null,
      data.attachmentFileName || null,
      'Pending',
      data.appliedDate || new Date().toISOString().split('T')[0],
    ]);
    return res.rows[0];
  }

  async reviewInTransaction({ leaveId, status, reviewedBy, reviewRemarks, reviewedDate, attendanceRecordsToCreate = [] }) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      // 1. Update LeaveRequest
      const updateQuery = `
        UPDATE "LeaveRequest"
        SET "status" = $1, "reviewedBy" = $2, "reviewRemarks" = $3, "reviewedDate" = $4, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = $5
        RETURNING *
      `;
      const updateRes = await client.query(updateQuery, [
        status,
        reviewedBy,
        reviewRemarks,
        reviewedDate,
        leaveId,
      ]);

      // 2. Insert or update Attendance records atomically if approved
      for (const att of attendanceRecordsToCreate) {
        const attQuery = `
          INSERT INTO "Attendance" (
            "id", "employeeId", "date", "status", "notes", "workHours", "extraHours"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT ("employeeId", "date")
          DO UPDATE SET
            "status" = EXCLUDED."status",
            "notes" = EXCLUDED."notes",
            "updatedAt" = CURRENT_TIMESTAMP
        `;
        await client.query(attQuery, [
          att.id,
          att.employeeId,
          att.date,
          att.status,
          att.notes,
          att.workHours || 0,
          att.extraHours || 0,
        ]);
      }

      await client.query('COMMIT');
      return updateRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

export const leaveRepository = new LeaveRepository();
export default leaveRepository;
