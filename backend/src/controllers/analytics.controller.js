import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Payroll from '../models/Payroll.js';
import { getTodayDateString } from '../utils/formatters.js';

// GET /api/analytics/dashboard — KPI Summary cards
export const getDashboardKPIs = async (req, res, next) => {
  try {
    const today = getTodayDateString();

    const [totalHeadcount, todayAttendance, todayLeaves] = await Promise.all([
      Employee.countDocuments({ status: 'Active' }),
      Attendance.find({ date: today }).populate('employeeId', 'name department'),
      Leave.find({ startDate: { $lte: today }, endDate: { $gte: today }, status: 'Approved' }),
    ]);

    const presentIds = new Set(todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Half-day').map((a) => a.employeeId?._id?.toString()));
    const onLeaveIds = new Set(todayLeaves.map((l) => l.employeeId?.toString()));
    const presentCount = presentIds.size;
    const onLeaveCount = onLeaveIds.size;
    const absentCount = Math.max(0, totalHeadcount - presentCount - onLeaveCount);

    res.status(200).json({
      success: true,
      kpis: {
        totalHeadcount,
        presentToday: presentCount,
        onLeaveToday: onLeaveCount,
        absentToday: absentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/attendance — Department-wise attendance breakdown
export const getAttendanceAnalytics = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const today = getTodayDateString();
    const prefix = month && year ? `${year}-${String(month).padStart(2, '0')}` : today.slice(0, 7);

    const records = await Attendance.find({ date: { $regex: `^${prefix}` } }).populate(
      'employeeId',
      'department'
    );

    const deptMap = {};
    for (const rec of records) {
      const dept = rec.employeeId?.department || 'Unknown';
      if (!deptMap[dept]) deptMap[dept] = { present: 0, absent: 0, leave: 0, halfDay: 0 };
      if (rec.status === 'Present') deptMap[dept].present++;
      else if (rec.status === 'Absent') deptMap[dept].absent++;
      else if (rec.status === 'Leave') deptMap[dept].leave++;
      else if (rec.status === 'Half-day') deptMap[dept].halfDay++;
    }

    const departments = Object.entries(deptMap).map(([name, counts]) => ({ name, ...counts }));
    res.status(200).json({ success: true, period: prefix, departments });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/leaves — Leave type breakdown
export const getLeaveAnalytics = async (req, res, next) => {
  try {
    const breakdown = await Leave.aggregate([
      { $group: { _id: '$leaveType', count: { $sum: 1 }, totalDays: { $sum: '$totalDays' } } },
      { $sort: { count: -1 } },
    ]);

    const statusBreakdown = await Leave.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({ success: true, byType: breakdown, byStatus: statusBreakdown });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/payroll — Payroll summary for a given month
export const getPayrollAnalytics = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    let query = {};
    if (year) query.year = parseInt(year);
    if (month) query.month = { $regex: month, $options: 'i' };

    const summary = await Payroll.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$month',
          totalNetPayable: { $sum: '$netPayableAmount' },
          totalGross: { $sum: '$grossMonthlyWage' },
          totalDeductions: { $sum: '$totalDeductions' },
          employeeCount: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({ success: true, payrollSummary: summary });
  } catch (error) {
    next(error);
  }
};
