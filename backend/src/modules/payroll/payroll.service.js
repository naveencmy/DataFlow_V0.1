import { randomUUID } from 'crypto';
import { payrollRepository } from './payroll.repository.js';
import { employeeRepository } from '../employee/employee.repository.js';
import { attendanceRepository } from '../attendance/attendance.repository.js';
import { leaveRepository } from '../leave/leave.repository.js';
import { computeLivePayroll } from '../../shared/utils/salaryEngine.js';
import { generatePayslipPdf } from '../../shared/utils/pdfGenerator.js';
import { AppError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';

export class PayrollService {
  constructor(repo = payrollRepository) {
    this.repo = repo;
  }

  async processMonthlyPayroll({ month, year, monthIndex, totalWorkingDays = 22 }) {
    const employeesResult = await employeeRepository.findAll({ limit: 1000 });
    const employees = employeesResult.data;

    const monthNum = String(monthIndex + 1).padStart(2, '0');
    const yearMonthPrefix = `${year}-${monthNum}`;

    const processedRuns = [];

    for (const emp of employees) {
      const salary = emp.salary || {};
      const monthlyWage = Number(salary.monthlyWage) || 60000;

      // Fetch monthly attendance records
      const attendances = await attendanceRepository.getMonthAttendance(emp.id, yearMonthPrefix);

      // Fetch approved unpaid leaves in this month
      const leaves = await leaveRepository.findByEmployee(emp.id);
      let unpaidDays = 0;

      for (const leave of leaves) {
        if (
          leave.status === 'Approved' &&
          leave.leaveType === 'Unpaid Leave' &&
          (leave.startDate.startsWith(yearMonthPrefix) || leave.endDate.startsWith(yearMonthPrefix))
        ) {
          unpaidDays += Number(leave.totalDays) || 0;
        }
      }

      // Compute Live Payroll
      const payrollCalc = computeLivePayroll(salary, totalWorkingDays, unpaidDays, 0);

      // Breakdown components
      const basicSalary =
        salary.components?.find((c) => c.name === 'Basic Salary')?.calculatedAmount ||
        Math.round(monthlyWage * 0.5);

      const hra =
        salary.components?.find((c) => c.name === 'House Rent Allowance (HRA)')?.calculatedAmount ||
        Math.round(basicSalary * 0.5);

      const standardAllowance =
        salary.components?.find((c) => c.name === 'Standard Allowance')?.calculatedAmount || 4000;

      const performanceBonus =
        salary.components?.find((c) => c.name === 'Performance Bonus')?.calculatedAmount || 3000;

      const lta =
        salary.components?.find((c) => c.name === 'Leave Travel Allowance (LTA)')?.calculatedAmount ||
        2000;

      const fixedAllowance =
        salary.components?.find((c) => c.name?.includes('Fixed Allowance'))?.calculatedAmount ||
        Math.max(0, monthlyWage - (basicSalary + hra + standardAllowance + performanceBonus + lta));

      const runId = `pay-${year}-${monthNum}-${emp.id}`;

      const runData = {
        id: runId,
        employeeId: emp.id,
        month,
        year,
        monthIndex,
        totalWorkingDays,
        paidDays: payrollCalc.payableDays,
        unpaidDays,
        payableDays: payrollCalc.payableDays,
        grossMonthlyWage: monthlyWage,
        basicSalary,
        hra,
        standardAllowance,
        performanceBonus,
        lta,
        fixedAllowance,
        employeePFDeduction: payrollCalc.deductions.employeePF,
        employerPFContribution: payrollCalc.deductions.employerPF,
        professionalTax: payrollCalc.deductions.professionalTax,
        totalDeductions: payrollCalc.deductions.totalDeductions,
        netPayableAmount: payrollCalc.netPayable,
        status: 'Paid',
        processedDate: new Date().toISOString().split('T')[0],
      };

      const saved = await this.repo.upsertPayrollRun(runData);
      processedRuns.push(saved);
    }

    return {
      message: `Processed payroll batch for ${month} (${processedRuns.length} employees).`,
      count: processedRuns.length,
      records: processedRuns,
    };
  }

  async getMyPayroll(user) {
    if (!user.employeeId) {
      throw new ValidationError('No employee profile associated with this account');
    }
    return this.repo.findByEmployee(user.employeeId);
  }

  async getAllPayroll(filters = {}) {
    return this.repo.findAll(filters);
  }

  async generatePayslipPdfStream(payrollId) {
    const payroll = await this.repo.findById(payrollId);
    if (!payroll) {
      throw new NotFoundError(`Payroll record ${payrollId} not found`);
    }

    const employee = await employeeRepository.findById(payroll.employeeId);
    return generatePayslipPdf(payroll, employee);
  }
}

export const payrollService = new PayrollService();
export default payrollService;
