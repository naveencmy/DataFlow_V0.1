import { analyticsService } from './analytics.service.js';

export class AnalyticsController {
  constructor(service = analyticsService) {
    this.service = service;
  }

  getDashboardKPIs = async (req, res, next) => {
    try {
      const data = await this.service.getDashboardKPIs();
      res.status(200).json({
        success: true,
        kpis: data.kpis,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getAttendanceAnalytics = async (req, res, next) => {
    try {
      const data = await this.service.getAttendanceAnalytics(req.query);
      res.status(200).json({
        success: true,
        departments: data,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getLeaveAnalytics = async (req, res, next) => {
    try {
      const data = await this.service.getLeaveAnalytics();
      res.status(200).json({
        success: true,
        byType: data.byType,
        byStatus: data.byStatus,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getPayrollAnalytics = async (req, res, next) => {
    try {
      const data = await this.service.getPayrollAnalytics(req.query);
      res.status(200).json({
        success: true,
        payrollSummary: data,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const analyticsController = new AnalyticsController();
export default analyticsController;
