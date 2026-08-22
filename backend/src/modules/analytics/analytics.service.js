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
    const presentToday = parseInt(attRes.rows[0].count, 10) || 0;

    // On leave today
    const leaveRes = await pgPool.query(
      `SELECT COUNT(*) FROM "LeaveRequest"
       WHERE "status" = 'Approved' AND $1 >= "startDate" AND $1 <= "endDate"`,
      [today]
    );
    const onLeaveToday = parseInt(leaveRes.rows[0].count, 10) || 0;
    const absentToday = Math.max(0, totalHeadcount - presentToday - onLeaveToday);

    // Payroll count
    const payRes = await pgPool.query('SELECT COUNT(*) FROM "PayrollRun"');
    const payrollRunsCount = parseInt(payRes.rows[0].count, 10) || 0;

    return {
      kpis: {
        totalHeadcount,
        presentToday,
        onLeaveToday,
        absentToday,
        payrollRunsCount,
      },
      headcount: totalHeadcount,
      present: presentToday,
      onLeave: onLeaveToday,
      absent: absentToday,
    };
  }

  async getAttendanceAnalytics(params = {}) {
    const deptRes = await pgPool.query(
      `SELECT e.department as name, COUNT(a.id) as present
       FROM "Attendance" a
       JOIN "Employee" e ON e.id = a."employeeId"
       WHERE a.status = 'Present'
       GROUP BY e.department`
    );
    return deptRes.rows.map(r => ({ name: r.name, present: parseInt(r.present, 10) }));
  }

  async getLeaveAnalytics() {
    const typeRes = await pgPool.query(
      `SELECT "leaveType" as name, "leaveType" as _id, COUNT(*) as count FROM "LeaveRequest" GROUP BY "leaveType"`
    );
    const statusRes = await pgPool.query(
      `SELECT status as name, status as _id, COUNT(*) as count FROM "LeaveRequest" GROUP BY status`
    );
    return {
      byType: typeRes.rows.map(r => ({ name: r.name, _id: r._id, count: parseInt(r.count, 10) })),
      byStatus: statusRes.rows.map(r => ({ name: r.name, _id: r._id, count: parseInt(r.count, 10) })),
    };
  }

  async getPayrollAnalytics(params = {}) {
    const payrollRes = await pgPool.query(
      `SELECT id, "employeeId", month, year, "grossMonthlyWage", "netPayableAmount", "totalDeductions", status, "processedDate"
       FROM "PayrollRun"
       ORDER BY year DESC, "monthIndex" DESC, id ASC`
    );
    return payrollRes.rows;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
