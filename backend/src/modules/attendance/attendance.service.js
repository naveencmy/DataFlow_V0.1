import { attendanceRepository } from './attendance.repository.js';
import { calculateWorkHours } from '../../shared/utils/salaryEngine.js';
import { NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { randomUUID } from 'crypto';

export class AttendanceService {
  constructor(repo = attendanceRepository) {
    this.repo = repo;
  }

  async checkIn(user, { notes } = {}) {
    const employeeId = user.employeeId;
    if (!employeeId) {
      throw new ValidationError('No employee profile associated with this user account');
    }

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const existing = await this.repo.findByEmployeeAndDate(employeeId, today);
    if (existing && existing.checkInTime) {
      return existing; // Idempotent check-in
    }

    const record = {
      id: existing ? existing.id : `att-${employeeId}-${today}`,
      employeeId,
      date: today,
      checkInTime: nowTime,
      checkOutTime: null,
      workHours: 0,
      extraHours: 0,
      status: 'Present',
      notes: notes || 'Self Check-in',
    };

    return this.repo.createOrUpdate(record);
  }

  async checkOut(user, { notes } = {}) {
    const employeeId = user.employeeId;
    if (!employeeId) {
      throw new ValidationError('No employee profile associated with this user account');
    }

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const existing = await this.repo.findByEmployeeAndDate(employeeId, today);
    if (!existing || !existing.checkInTime) {
      throw new ValidationError('Cannot check out before checking in today');
    }

    const hours = calculateWorkHours(existing.checkInTime, nowTime);

    const record = {
      ...existing,
      checkOutTime: nowTime,
      workHours: hours.workHours,
      extraHours: hours.extraHours,
      notes: notes || existing.notes,
    };

    return this.repo.createOrUpdate(record);
  }

  async getMyAttendance(user, { month, year } = {}) {
    const employeeId = user.employeeId;
    if (!employeeId) {
      return [];
    }

    if (month && year) {
      const monthStr = String(month).padStart(2, '0');
      return this.repo.getMonthAttendance(employeeId, `${year}-${monthStr}`);
    }

    return this.repo.findByEmployee(employeeId, 60);
  }

  async getAttendanceByDate(date) {
    return this.repo.findByDate(date);
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
