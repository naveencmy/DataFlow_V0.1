import { payrollService } from './payroll.service.js';

export class PayrollController {
  constructor(service = payrollService) {
    this.service = service;
  }

  processMonthlyBatch = async (req, res, next) => {
    try {
      const result = await this.service.processMonthlyPayroll(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyPayroll = async (req, res, next) => {
    try {
      const runs = await this.service.getMyPayroll(req.user);
      res.status(200).json({
        success: true,
        data: runs,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllPayroll = async (req, res, next) => {
    try {
      const runs = await this.service.getAllPayroll({
        year: req.query.year ? parseInt(req.query.year, 10) : undefined,
        month: req.query.month,
        employeeId: req.query.employeeId,
      });
      res.status(200).json({
        success: true,
        data: runs,
      });
    } catch (error) {
      next(error);
    }
  };

  downloadPayslipPdf = async (req, res, next) => {
    try {
      const pdfStream = await this.service.generatePayslipPdfStream(req.params.id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=payslip-${req.params.id}.pdf`);

      pdfStream.pipe(res);
      pdfStream.end();
    } catch (error) {
      next(error);
    }
  };
}

export const payrollController = new PayrollController();
export default payrollController;
