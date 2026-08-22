import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';
import { getTodayDateString, formatTime12h, calcWorkHours } from '../utils/formatters.js';

// GET /api/attendance — Admin: all, Employee: own records
export const getAttendance = async (req, res, next) => {
  try {
    const { date, employeeId, month, year } = req.query;
    let query = {};

    if (req.user.role === 'EMPLOYEE') {
      query.employeeId = req.user.employeeId;
    } else if (employeeId) {
      query.employeeId = employeeId;
    }

    if (date) query.date = date;

    if (month && year) {
      // Filter records in a given month YYYY-MM
      const prefix = `${year}-${String(month).padStart(2, '0')}`;
      query.date = { $regex: `^${prefix}` };
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('employeeId', 'name email department profilePicture');

    res.status(200).json({ success: true, total: records.length, attendance: records });
  } catch (error) {
    next(error);
  }
};

// GET /api/attendance/today — Today's attendance for all employees (Admin)
export const getTodayAttendance = async (req, res, next) => {
  try {
    const today = getTodayDateString();
    const records = await Attendance.find({ date: today }).populate(
      'employeeId',
      'name email department profilePicture status'
    );
    res.status(200).json({ success: true, date: today, attendance: records });
  } catch (error) {
    next(error);
  }
};

// GET /api/attendance/:employeeId — History for a specific employee
export const getEmployeeAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ employeeId: req.params.employeeId }).sort({ date: -1 });
    res.status(200).json({ success: true, total: records.length, attendance: records });
  } catch (error) {
    next(error);
  }
};

// POST /api/attendance/checkin
export const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId || req.body.employeeId;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID required.' });
    }

    const today = getTodayDateString();
    const timeStr = formatTime12h();

    // Check if already checked in today
    const existing = await Attendance.findOne({ employeeId, date: today });

    if (existing?.checkInTime) {
      return res.status(409).json({
        success: false,
        message: `Already checked in at ${existing.checkInTime}.`,
      });
    }

    const record = await Attendance.findOneAndUpdate(
      { employeeId, date: today },
      {
        $set: {
          checkInTime: timeStr,
          status: 'Present',
          notes: req.body.notes || 'Checked in via Dayflow Portal',
        },
      },
      { new: true, upsert: true }
    );

    await Notification.create({
      title: 'Check-In Recorded',
      message: `Status updated to Present 🟢 at ${timeStr}.`,
      type: 'attendance',
      targetUserId: req.user._id,
    });

    res.status(200).json({ success: true, message: `Checked in at ${timeStr}`, record });
  } catch (error) {
    next(error);
  }
};

// PUT /api/attendance/checkout
export const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId || req.body.employeeId;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID required.' });
    }

    const today = getTodayDateString();
    const existing = await Attendance.findOne({ employeeId, date: today });

    if (!existing || !existing.checkInTime) {
      return res.status(409).json({ success: false, message: 'You must check in first.' });
    }

    if (existing.checkOutTime) {
      return res.status(409).json({
        success: false,
        message: `Already checked out at ${existing.checkOutTime}.`,
      });
    }

    const timeStr = formatTime12h();
    const workHours = calcWorkHours(existing.checkInTime, timeStr);
    const extraHours = Math.max(0, Number((workHours - 8).toFixed(2)));
    const status = workHours < 4.5 ? 'Half-day' : 'Present';

    const record = await Attendance.findByIdAndUpdate(
      existing._id,
      { $set: { checkOutTime: timeStr, workHours, extraHours, status } },
      { new: true }
    );

    await Notification.create({
      title: 'Check-Out Completed',
      message: `Logged ${workHours} hrs today (Extra: ${extraHours} hrs).`,
      type: 'attendance',
      targetUserId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: `Checked out at ${timeStr}. ${workHours} hours logged.`,
      record,
    });
  } catch (error) {
    next(error);
  }
};
