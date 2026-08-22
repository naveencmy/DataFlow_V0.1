import { pgPool } from '../../config/db.js';

export class AttendanceRepository {
  async countEmployees() {
    const res = await pgPool.query('SELECT COUNT(*) FROM "Employee"');
    return parseInt(res.rows[0]?.count, 10) || 0;
  }

  async findByEmployeeAndDate(employeeId, date) {
    const query = `
      SELECT * FROM "Attendance"
      WHERE "employeeId" = $1 AND "date" = $2
      LIMIT 1
    `;
    const res = await pgPool.query(query, [employeeId, date]);
    return res.rows[0] || null;
  }

  async findByEmployee(employeeId, limit = 60) {
    const query = `
      SELECT * FROM "Attendance"
      WHERE "employeeId" = $1
      ORDER BY "date" DESC
      LIMIT $2
    `;
    const res = await pgPool.query(query, [employeeId, limit]);
    return res.rows;
  }

  async findByDate(date) {
    if (date) {
      const query = `
        SELECT a.*, e.name as "employeeName", e.department, e."profilePicture", e."jobPosition"
        FROM "Attendance" a
        JOIN "Employee" e ON e.id = a."employeeId"
        WHERE a."date" = $1
        ORDER BY e.name ASC
      `;
      const res = await pgPool.query(query, [date]);
      return res.rows;
    } else {
      const query = `
        SELECT a.*, e.name as "employeeName", e.department, e."profilePicture", e."jobPosition"
        FROM "Attendance" a
        JOIN "Employee" e ON e.id = a."employeeId"
        ORDER BY a."date" DESC, e.name ASC
        LIMIT 100
      `;
      const res = await pgPool.query(query);
      return res.rows;
    }
  }

  async createOrUpdate(record) {
    const query = `
      INSERT INTO "Attendance" (
        "id", "employeeId", "date", "checkInTime", "checkOutTime",
        "workHours", "extraHours", "status", "notes"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT ("employeeId", "date")
      DO UPDATE SET
        "checkInTime" = COALESCE(EXCLUDED."checkInTime", "Attendance"."checkInTime"),
        "checkOutTime" = COALESCE(EXCLUDED."checkOutTime", "Attendance"."checkOutTime"),
        "workHours" = EXCLUDED."workHours",
        "extraHours" = EXCLUDED."extraHours",
        "status" = EXCLUDED."status",
        "notes" = COALESCE(EXCLUDED."notes", "Attendance"."notes"),
        "updatedAt" = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [
      record.id,
      record.employeeId,
      record.date,
      record.checkInTime || null,
      record.checkOutTime || null,
      record.workHours || 0,
      record.extraHours || 0,
      record.status || 'Present',
      record.notes || null,
    ];
    const res = await pgPool.query(query, values);
    return res.rows[0];
  }

  async getMonthAttendance(employeeId, yearMonthPrefix) {
    const query = `
      SELECT * FROM "Attendance"
      WHERE "employeeId" = $1 AND "date" LIKE $2
      ORDER BY "date" ASC
    `;
    const res = await pgPool.query(query, [employeeId, `${yearMonthPrefix}%`]);
    return res.rows;
  }
}

export const attendanceRepository = new AttendanceRepository();
export default attendanceRepository;
