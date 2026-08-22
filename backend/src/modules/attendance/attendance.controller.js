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
        message: 'Check-in recorded successfully',
        data: record,
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
        message: 'Check-out recorded successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyAttendance = async (req, res, next) => {
    try {
      const records = await this.service.getMyAttendance(req.user);
      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };

  getAttendanceByDate = async (req, res, next) => {
    try {
      const records = await this.service.getAllAttendanceForDate(req.query.date);
      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const attendanceController = new AttendanceController();
export default attendanceController;
