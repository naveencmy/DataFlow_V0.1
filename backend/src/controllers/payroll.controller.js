import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';
import Notification from '../models/Notification.js';
import { computeLivePayroll } from '../utils/salaryEngine.js';
import { getTodayDateString } from '../utils/formatters.js';

// GET /api/payroll — Admin: all, Employee: own
export const getPayroll = async (req, res, next) => {
  try {
    const { month, year, status } = req.query;
    let query = {};

    if (req.user.role === 'EMPLOYEE') {
      query.employeeId = req.user.employeeId;
    }

    if (month) query.month = { $regex: month, $options: 'i' };
    if (year) query.year = parseInt(year);
    if (status) query.status = status;

    const records = await Payroll.find(query)
      .sort({ year: -1, monthIndex: -1 })
      .populate('employeeId', 'name email department profilePicture');

    res.status(200).json({ success: true, total: records.length, payroll: records });
  } catch (error) {
    next(error);
  }
};

// GET /api/payroll/:employeeId
export const getEmployeePayroll = async (req, res, next) => {
  try {
    const records = await Payroll.find({ employeeId: req.params.employeeId }).sort({ year: -1, monthIndex: -1 });
    res.status(200).json({ success: true, payroll: records });
  } catch (error) {
    next(error);
  }
};

// POST /api/payroll/process — Admin only: generate payslips for all employees
export const processMonthlyPayroll = async (req, res, next) => {
  try {
    const { monthStr, year, monthIndex } = req.body;
    if (!monthStr || year === undefined || monthIndex === undefined) {
      return res.status(400).json({ success: false, message: 'monthStr, year, and monthIndex are required.' });
    }

    const totalWorkingDays = 22;
    const employees = await Employee.find({ status: 'Active' });

    const results = [];

    for (const emp of employees) {
      // Count unpaid leave days approved for this employee in this month
      const unpaidLeaves = await Leave.find({
        employeeId: emp._id,
        status: 'Approved',
        leaveType: 'Unpaid Leave',
      });

      const unpaidLeaveDays = unpaidLeaves.reduce((sum, l) => sum + (l.totalDays || 0), 0);

      const payCalc = computeLivePayroll(emp.salary, totalWorkingDays, unpaidLeaveDays);

      const salaryComponents = emp.salary?.components || [];
      const getComp = (name) => salaryComponents.find((c) => c.name === name)?.calculatedAmount || 0;

      const payrollData = {
        employeeId: emp._id,
        employeeName: emp.name,
        department: emp.department,
        month: monthStr,
        year: parseInt(year),
        monthIndex: parseInt(monthIndex),
        totalWorkingDays,
        paidDays: payCalc.payableDays,
        unpaidDays: unpaidLeaveDays,
        payableDays: payCalc.payableDays,
        grossMonthlyWage: payCalc.grossMonthlyWage,
        basicSalary: getComp('Basic Salary'),
        hra: getComp('House Rent Allowance (HRA)'),
        standardAllowance: getComp('Standard Allowance'),
        performanceBonus: getComp('Performance Bonus'),
        lta: getComp('Leave Travel Allowance (LTA)'),
        fixedAllowance: getComp('Fixed Allowance (Balancing)'),
        employeePFDeduction: payCalc.deductions.employeePF,
        employerPFContribution: payCalc.deductions.employerPF,
        professionalTax: payCalc.deductions.professionalTax,
        totalDeductions: payCalc.deductions.totalDeductions,
        netPayableAmount: payCalc.netPayable,
        status: 'Processed',
        processedDate: getTodayDateString(),
        processedBy: req.user.email,
      };

      // Upsert: replace existing or create new
      const record = await Payroll.findOneAndUpdate(
        { employeeId: emp._id, month: monthStr, year: parseInt(year) },
        { $set: payrollData },
        { new: true, upsert: true }
      );
      results.push(record);
    }

    await Notification.create({
      title: 'Payroll Cycle Processed',
      message: `Monthly payroll calculated for ${monthStr} (${results.length} employees).`,
      type: 'payroll',
    });

    res.status(200).json({
      success: true,
      message: `Payroll processed for ${results.length} employees.`,
      payroll: results,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/payroll/:id/status — Mark as Paid / On Hold (Admin)
export const updatePayrollStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const record = await Payroll.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Payroll record not found.' });
    res.status(200).json({ success: true, payroll: record });
  } catch (error) {
    next(error);
  }
};
