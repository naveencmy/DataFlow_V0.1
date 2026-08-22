import { payrollService } from './payroll.service.js';

export class PayrollController {
  constructor(service = payrollService) {
    this.service = service;
  }

  processMonthlyBatch = async (req, res, next) => {
    try {
      const { month, year, monthIndex } = req.body;
      const results = await this.service.processMonthlyBatch({
        month,
        year: parseInt(year, 10),
        monthIndex: parseInt(monthIndex, 10),
      });

      res.status(200).json({
        success: true,
        message: `Processed payroll for ${results.length} active employees`,
        data: results,
        payroll: results,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyPayroll = async (req, res, next) => {
    try {
      const records = await this.service.getMyPayroll(req.user);
      res.status(200).json({
        success: true,
        data: records,
        payroll: records,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllPayroll = async (req, res, next) => {
    try {
      const records = await this.service.getAllPayroll({
        month: req.query.month,
        year: req.query.year ? parseInt(req.query.year, 10) : undefined,
        employeeId: req.query.employeeId,
      });
      res.status(200).json({
        success: true,
        data: records,
        payroll: records,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePayrollStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await this.service.updatePayrollStatus(id, status);
      res.status(200).json({
        success: true,
        message: `Payroll status updated to ${status}`,
        data: updated,
        payroll: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  downloadPayslipPdf = async (req, res, next) => {
    try {
      const { id } = req.params;
      const pdfBuffer = await this.service.generatePayslipPdf(id, req.user);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=payslip-${id}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };
}

export const payrollController = new PayrollController();
export default payrollController;
