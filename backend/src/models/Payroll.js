import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    employeeName: { type: String },
    department: { type: String },

    // Period
    month: { type: String, required: true }, // e.g. "July 2026"
    year: { type: Number, required: true },
    monthIndex: { type: Number, required: true }, // 0 = Jan, 11 = Dec

    // Days
    totalWorkingDays: { type: Number, default: 22 },
    paidDays: { type: Number },
    unpaidDays: { type: Number, default: 0 },
    payableDays: { type: Number },

    // Gross Components
    grossMonthlyWage: { type: Number },
    basicSalary: { type: Number },
    hra: { type: Number },
    standardAllowance: { type: Number },
    performanceBonus: { type: Number },
    lta: { type: Number },
    fixedAllowance: { type: Number },

    // Deductions
    employeePFDeduction: { type: Number },
    employerPFContribution: { type: Number },
    professionalTax: { type: Number },
    totalDeductions: { type: Number },

    // Net
    netPayableAmount: { type: Number },

    // Status
    status: {
      type: String,
      enum: ['Draft', 'Processed', 'Paid', 'On Hold'],
      default: 'Processed',
    },
    processedDate: { type: String },
    processedBy: { type: String },
  },
  { timestamps: true }
);

// Unique: one payroll record per employee per month/year
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
