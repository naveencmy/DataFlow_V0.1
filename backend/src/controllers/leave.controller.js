import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';
import { getTodayDateString } from '../utils/formatters.js';

// GET /api/leaves
export const getLeaves = async (req, res, next) => {
  try {
    const { status, employeeId, leaveType } = req.query;
    let query = {};

    if (req.user.role === 'EMPLOYEE') {
      query.employeeId = req.user.employeeId;
    } else if (employeeId) {
      query.employeeId = employeeId;
    }

    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;

    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .populate('employeeId', 'name email department profilePicture');

    res.status(200).json({ success: true, total: leaves.length, leaves });
  } catch (error) {
    next(error);
  }
};

// POST /api/leaves — Apply for leave
export const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, remarks, attachmentFileName } = req.body;

    const employeeId = req.user.employeeId;
    if (!employeeId) {
      return res.status(403).json({ success: false, message: 'Admin accounts cannot apply for leave.' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found.' });

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return res.status(400).json({ success: false, message: 'Start date must be before end date.' });
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      employeeId,
      employeeName: employee.name,
      employeeAvatar: employee.profilePicture,
      department: employee.department,
      leaveType,
      startDate,
      endDate,
      totalDays: Math.max(1, diffDays),
      remarks,
      attachmentFileName,
      status: 'Pending',
      appliedDate: getTodayDateString(),
    });

    await Notification.create({
      title: `New Leave Request: ${employee.name}`,
      message: `${employee.name} applied for ${leaveType} (${diffDays} day${diffDays > 1 ? 's' : ''}).`,
      type: 'leave',
    });

    res.status(201).json({ success: true, leave });
  } catch (error) {
    next(error);
  }
};

// PUT /api/leaves/:id/review — Admin only: approve or reject
export const reviewLeave = async (req, res, next) => {
  try {
    const { status, reviewRemarks } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected.' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found.' });

    if (leave.status !== 'Pending') {
      return res.status(409).json({ success: false, message: `Leave is already ${leave.status}.` });
    }

    leave.status = status;
    leave.reviewRemarks = reviewRemarks || '';
    leave.reviewedBy = req.user.email;
    leave.reviewedDate = getTodayDateString();
    await leave.save();

    // Cross-module: if Approved, auto-create attendance records as 'Leave'
    if (status === 'Approved') {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const datesToMark = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0 && d.getDay() !== 6) {
          datesToMark.push(d.toISOString().split('T')[0]);
        }
      }

      for (const dateStr of datesToMark) {
        await Attendance.findOneAndUpdate(
          { employeeId: leave.employeeId, date: dateStr },
          {
            $set: {
              status: 'Leave',
              notes: `Approved ${leave.leaveType}`,
              workHours: 0,
            },
          },
          { upsert: true, new: true }
        );
      }
    }

    await Notification.create({
      title: `Leave Request ${status}`,
      message: `${leave.employeeName}'s ${leave.leaveType} has been ${status.toLowerCase()}.`,
      type: 'leave',
    });

    res.status(200).json({ success: true, leave });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/leaves/:id — Cancel pending leave (own only)
export const cancelLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found.' });

    if (leave.status !== 'Pending') {
      return res.status(409).json({ success: false, message: 'Only pending leave requests can be cancelled.' });
    }

    if (leave.employeeId.toString() !== req.user.employeeId?.toString()) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own leave.' });
    }

    leave.status = 'Cancelled';
    await leave.save();

    res.status(200).json({ success: true, message: 'Leave request cancelled.', leave });
  } catch (error) {
    next(error);
  }
};
