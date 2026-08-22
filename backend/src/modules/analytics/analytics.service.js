import { pgPool } from '../../config/db.js';

export class AnalyticsService {
  async getDashboardKPIs() {
    const today = new Date().toISOString().split('T')[0];

    // Total headcount
    const countRes = await pgPool.query('SELECT COUNT(*) FROM "Employee"');
    const totalHeadcount = parseInt(countRes.rows[0].count, 10) || 0;

    // Today's attendance
    const attRes = await pgPool.query(
      'SELECT COUNT(*) FROM "Attendance" WHERE "date" = $1 AND "checkInTime" IS NOT NULL',
      [today]
    );
    const presentCount = parseInt(attRes.rows[0].count, 10) || 0;

    // On leave today
    const leaveRes = await pgPool.query(
      `SELECT COUNT(*) FROM "LeaveRequest"
       WHERE "status" = 'Approved' AND $1 >= "startDate" AND $1 <= "endDate"`,
      [today]
    );
    const onLeaveCount = parseInt(leaveRes.rows[0].count, 10) || 0;

    const absentCount = Math.max(0, totalHeadcount - presentCount - onLeaveCount);

    // Department breakdown
    const deptRes = await pgPool.query(
      `SELECT department, COUNT(*) as count FROM "Employee" GROUP BY department`
    );

    return {
      kpis: {
        totalHeadcount,
        presentCount,
        onLeaveCount,
        absentCount,
      },
      headcount: totalHeadcount,
      present: presentCount,
      onLeave: onLeaveCount,
      absent: absentCount,
      departments: deptRes.rows.map(r => ({ department: r.department, count: parseInt(r.count, 10) })),
    };
  }

  async getAttendanceAnalytics(params = {}) {
    const deptRes = await pgPool.query(
      `SELECT e.department, COUNT(a.id) as "presentCount"
       FROM "Attendance" a
       JOIN "Employee" e ON e.id = a."employeeId"
       WHERE a.status = 'Present'
       GROUP BY e.department`
    );
    return deptRes.rows;
  }

  async getLeaveAnalytics() {
    const leaveRes = await pgPool.query(
      `SELECT "leaveType", COUNT(*) as count FROM "LeaveRequest" GROUP BY "leaveType"`
    );
    return leaveRes.rows;
  }

  async getPayrollAnalytics(params = {}) {
    const payrollRes = await pgPool.query(
      `SELECT month, year, SUM("netPayableAmount") as "totalPayout", SUM("totalDeductions") as "totalDeductions"
       FROM "PayrollRun"
       GROUP BY month, year, "monthIndex"
       ORDER BY year DESC, "monthIndex" DESC
       LIMIT 12`
    );
    return payrollRes.rows;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
