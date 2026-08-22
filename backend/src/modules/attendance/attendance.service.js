import { randomUUID } from 'crypto';
import { attendanceRepository } from './attendance.repository.js';
import { employeeRepository } from '../employee/employee.repository.js';
import { AppError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';

export class AttendanceService {
  constructor(repo = attendanceRepository) {
    this.repo = repo;
  }

  getCurrentTimeFormatted() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  getTodayDateFormatted() {
    return new Date().toISOString().split('T')[0];
  }

  parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.trim().split(/[:\s]/);
    let hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const ampm = parts[2]?.toUpperCase();

    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  async checkIn(user, { notes, date }) {
    const employeeId = user.employeeId;
    if (!employeeId) {
      throw new ValidationError('No employee profile associated with this account');
    }

    const todayDate = date || this.getTodayDateFormatted();
    const existing = await this.repo.findByEmployeeAndDate(employeeId, todayDate);

    if (existing && existing.checkInTime) {
      throw new ValidationError(`Already checked in today at ${existing.checkInTime}`);
    }

    const checkInTime = this.getCurrentTimeFormatted();

    const record = await this.repo.createOrUpdate({
      id: existing?.id || randomUUID(),
      employeeId,
      date: todayDate,
      checkInTime,
      checkOutTime: existing?.checkOutTime || null,
      workHours: existing?.workHours || 0,
      extraHours: existing?.extraHours || 0,
      status: 'Present',
      notes: notes || existing?.notes || 'Standard check-in',
    });

    return record;
  }

  async checkOut(user, { notes, date }) {
    const employeeId = user.employeeId;
    if (!employeeId) {
      throw new ValidationError('No employee profile associated with this account');
    }

    const todayDate = date || this.getTodayDateFormatted();
    const existing = await this.repo.findByEmployeeAndDate(employeeId, todayDate);

    if (!existing || !existing.checkInTime) {
      throw new ValidationError('Cannot check out before checking in for the day');
    }

    const checkOutTime = this.getCurrentTimeFormatted();
    const inMins = this.parseTimeToMinutes(existing.checkInTime);
    const outMins = this.parseTimeToMinutes(checkOutTime);

    let diffHours = Math.max(0, (outMins - inMins) / 60);
    diffHours = Number(diffHours.toFixed(2));
    const extraHours = Math.max(0, Number((diffHours - 8.0).toFixed(2)));

    const status = diffHours >= 4 ? (diffHours >= 8 ? 'Present' : 'Half-day') : 'Absent';

    const record = await this.repo.createOrUpdate({
      id: existing.id,
      employeeId,
      date: todayDate,
      checkInTime: existing.checkInTime,
      checkOutTime,
      workHours: diffHours,
      extraHours,
      status,
      notes: notes || existing.notes,
    });

    return record;
  }

  async getMyAttendance(user) {
    if (!user.employeeId) {
      throw new ValidationError('No employee profile associated with this user');
    }
    return this.repo.findByEmployee(user.employeeId);
  }

  async getAllAttendanceForDate(date) {
    const targetDate = date || this.getTodayDateFormatted();
    return this.repo.findByDate(targetDate);
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
