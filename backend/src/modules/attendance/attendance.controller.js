import { attendanceService } from './attendance.service.js';

export class AttendanceController {
  constructor(service = attendanceService) {
    this.service = service;
  }

  checkIn = async (req, res, next) => {
    try {
      const record = await this.service.checkIn(req.user, req.body);
      res.status(200).json({
        success: true,
        message: 'Checked in successfully 🟢',
        data: record,
        attendance: record,
      });
    } catch (error) {
      next(error);
    }
  };

  checkOut = async (req, res, next) => {
    try {
      const record = await this.service.checkOut(req.user, req.body);
      res.status(200).json({
        success: true,
        message: 'Checked out successfully 🔴',
        data: record,
        attendance: record,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyAttendance = async (req, res, next) => {
    try {
      const records = await this.service.getMyAttendance(req.user, {
        month: req.query.month,
        year: req.query.year ? parseInt(req.query.year, 10) : undefined,
      });
      res.status(200).json({
        success: true,
        data: records,
        attendance: records,
      });
    } catch (error) {
      next(error);
    }
  };

  getAttendanceByDate = async (req, res, next) => {
    try {
      const date = req.query.date;
      const records = await this.service.getAttendanceByDate(date);
      
      const totalEmployees = await this.service.repo.countEmployees();
      const presentCount = records.filter(r => r.status === 'Present').length;
      const onLeaveCount = records.filter(r => r.status === 'On Leave').length;
      const absentCount = Math.max(0, totalEmployees - presentCount - onLeaveCount);

      res.status(200).json({
        success: true,
        date: date || new Date().toISOString().split('T')[0],
        summary: {
          present: presentCount,
          onLeave: onLeaveCount,
          absent: absentCount,
          total: totalEmployees,
        },
        data: records,
        attendance: records,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const attendanceController = new AttendanceController();
export default attendanceController;
