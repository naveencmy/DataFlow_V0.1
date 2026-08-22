import { randomUUID } from 'crypto';
import { leaveRepository } from './leave.repository.js';
import { employeeRepository } from '../employee/employee.repository.js';
import { notificationRepository } from '../notification/notification.repository.js';
import { sendLeaveStatusEmail } from '../../shared/utils/emailService.js';
import { getIO } from '../../sockets/socket.server.js';
import { AppError, NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors/AppError.js';

export class LeaveService {
  constructor(repo = leaveRepository) {
    this.repo = repo;
  }

  calculateWorkingDays(startDateStr, endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (start > end) {
      throw new ValidationError('Start date cannot be after end date');
    }

    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, count);
  }

  getDateRangeArray(startDateStr, endDateStr) {
    const dates = [];
    const cur = new Date(startDateStr);
    const end = new Date(endDateStr);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) {
        dates.push(cur.toISOString().split('T')[0]);
      }
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }

  async applyLeave(user, data) {
    const employeeId = user.employeeId;
    if (!employeeId) {
      throw new ValidationError('No employee profile associated with this account');
    }

    const employee = await employeeRepository.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee profile not found');
    }

    const totalDays = data.totalDays || this.calculateWorkingDays(data.startDate, data.endDate);

    const leaveRecord = await this.repo.create({
      id: randomUUID(),
      employeeId,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays,
      remarks: data.remarks,
      attachmentUrl: data.attachmentUrl,
      attachmentFileName: data.attachmentFileName,
      appliedDate: new Date().toISOString().split('T')[0],
    });

    // Create Notification for Admins
    try {
      await notificationRepository.create({
        id: randomUUID(),
        title: 'New Leave Request Pending Review',
        message: `${employee.name} applied for ${data.leaveType} (${data.startDate} to ${data.endDate}, ${totalDays} days).`,
        type: 'leave',
        employeeId,
      });

      const io = getIO();
      if (io) {
        io.to('admin_room').emit('new_leave_request', {
          leave: leaveRecord,
          employee: { id: employee.id, name: employee.name, department: employee.department },
        });
      }
    } catch (e) {
      // Non-blocking notification failure
    }

    return leaveRecord;
  }

  async reviewLeave(leaveId, { status, reviewRemarks }, reviewerUser) {
    const leave = await this.repo.findById(leaveId);
    if (!leave) {
      throw new NotFoundError(`Leave request with ID ${leaveId} not found`);
    }

    const reviewerName = reviewerUser.employeeName || reviewerUser.loginId || 'Admin';
    const reviewedDate = new Date().toISOString().split('T')[0];

    const attendanceRecordsToCreate = [];

    if (status === 'Approved') {
      const dates = this.getDateRangeArray(leave.startDate, leave.endDate);
      for (const d of dates) {
        attendanceRecordsToCreate.push({
          id: randomUUID(),
          employeeId: leave.employeeId,
          date: d,
          status: 'Leave',
          notes: `Approved Leave: ${leave.leaveType} (Ref: ${leaveId.substring(0, 8)})`,
          workHours: 0,
          extraHours: 0,
        });
      }
    }

    // Atomic Transaction: Update Leave status AND create Attendance records
    const updated = await this.repo.reviewInTransaction({
      leaveId,
      status,
      reviewedBy: `${reviewerName} (${reviewerUser.role})`,
      reviewRemarks: reviewRemarks || `Leave ${status}`,
      reviewedDate,
      attendanceRecordsToCreate,
    });

    // Notify employee
    try {
      await notificationRepository.create({
        id: randomUUID(),
        title: `Leave Request ${status}`,
        message: `Your ${leave.leaveType} (${leave.startDate} - ${leave.endDate}) has been ${status.toLowerCase()} by ${reviewerName}.`,
        type: 'leave',
        employeeId: leave.employeeId,
      });

      sendLeaveStatusEmail(
        leave.employeeEmail,
        leave.employeeName,
        leave.leaveType,
        status,
        reviewRemarks
      ).catch(() => {});

      const io = getIO();
      if (io) {
        io.to(`emp_${leave.employeeId}`).emit('leave_status_updated', {
          leaveId,
          status,
          reviewRemarks,
        });
      }
    } catch (e) {
      // Non-blocking notification failure
    }

    return updated;
  }

  async getMyLeaves(user) {
    if (!user.employeeId) {
      throw new ValidationError('No employee profile associated with this account');
    }
    return this.repo.findByEmployee(user.employeeId);
  }

  async getAllLeaves(filters = {}) {
    return this.repo.findAll(filters);
  }
}

export const leaveService = new LeaveService();
export default leaveService;
