import React from 'react';
import { Modal } from '../common/Modal.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { Printer, Download, Landmark, FileText, CheckCircle2, Shield } from 'lucide-react';

export const PayslipModal = ({ isOpen, onClose, payrollRecord, employee }) => {
  if (!payrollRecord || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Salary Slip"
      subtitle={`Official Pay Statement for ${payrollRecord.month} &bull; Dayflow HRMS`}
      maxWidth="2xl"
    >
      <div className="space-y-5 text-slate-800 print:text-black">
        {/* Company Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
                DF
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Dayflow Technologies Pvt Ltd
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Bangalore Tech Hub &bull; CIN: U72200KA2022PTC123456
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/80 font-mono">
              Salary Slip: {payrollRecord.month}
            </span>
            <p className="text-[11px] text-slate-400 font-mono mt-1 font-medium">
              Ref: {payrollRecord.id}
            </p>
          </div>
        </div>

        {/* Employee Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 backdrop-blur-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Employee Name</span>
            <span className="font-black text-slate-900">{employee.name}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Login ID / Code</span>
            <span className="font-mono font-bold text-slate-800">{employee.loginId}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Department</span>
            <span className="font-bold text-slate-800">{employee.department}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Bank & Account</span>
            <span className="font-mono text-slate-800 font-medium">
              {employee.bankDetails?.bankName} (••••{employee.bankDetails?.accountNumber?.slice(-4)})
            </span>
          </div>
        </div>

        {/* Payable Days Calculation Connection (Section 11) */}
        <div className="p-3.5 bg-teal-50/80 border border-teal-200/80 rounded-2xl text-xs flex items-center justify-between backdrop-blur-xs shadow-xs">
          <div>
            <span className="font-black text-teal-950">Attendance & Payable Days Derivation:</span>
            <p className="text-teal-800 text-[11px] font-medium mt-0.5">
              Total Cycle Days: <strong>{payrollRecord.totalWorkingDays}</strong> &bull; Unpaid Leaves: <strong>{payrollRecord.unpaidDays}</strong> &bull; Payable Days:{' '}
              <strong>{payrollRecord.payableDays}</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-teal-700 uppercase font-bold block">Pay Multiplier</span>
            <span className="font-mono font-black text-teal-950">
              {payrollRecord.payableDays} / {payrollRecord.totalWorkingDays} days
            </span>
          </div>
        </div>

        {/* Itemized Earnings & Deductions Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
            <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200/80 font-black text-xs text-slate-800 uppercase tracking-wider">
              Earnings Components
            </div>
            <div className="divide-y divide-slate-100 text-xs p-1">
              <div className="flex justify-between py-1.5 px-3">
                <span className="text-slate-600 font-medium">Basic Salary (50% Base)</span>
                <span className="font-mono font-bold">{formatCurrency(payrollRecord.basicSalary)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-3">
                <span className="text-slate-600 font-medium">House Rent Allowance (HRA)</span>
                <span className="font-mono font-bold">{formatCurrency(payrollRecord.hra)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-3">
                <span className="text-slate-600 font-medium">Standard Allowance</span>
                <span className="font-mono font-bold">{formatCurrency(payrollRecord.standardAllowance)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-3">
                <span className="text-slate-600 font-medium">Performance Bonus</span>
                <span className="font-mono font-bold">{formatCurrency(payrollRecord.performanceBonus)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-3">
                <span className="text-slate-600 font-medium">Leave Travel Allowance (LTA)</span>
                <span className="font-mono font-bold">{formatCurrency(payrollRecord.lta)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-3 bg-teal-50/40 font-semibold">
                <span className="text-teal-900">Fixed Allowance (Balancing)</span>
                <span className="font-mono font-bold text-teal-900">{formatCurrency(payrollRecord.fixedAllowance)}</span>
              </div>
            </div>
            <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-200/80 flex justify-between font-bold text-xs">
              <span>Gross Earned Earnings:</span>
              <span className="font-mono text-teal-800 font-black">{formatCurrency(payrollRecord.grossMonthlyWage)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs">
            <div>
              <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200/80 font-black text-xs text-slate-800 uppercase tracking-wider">
                Deductions
              </div>
              <div className="divide-y divide-slate-100 text-xs p-1">
                <div className="flex justify-between py-1.5 px-3">
                  <span className="text-slate-600 font-medium">Employee PF (12% of Basic)</span>
                  <span className="font-mono font-bold text-rose-600">
                    -{formatCurrency(payrollRecord.employeePFDeduction)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 px-3">
                  <span className="text-slate-600 font-medium">Professional Tax (PT)</span>
                  <span className="font-mono font-bold text-rose-600">
                    -{formatCurrency(payrollRecord.professionalTax)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 px-3 text-slate-400">
                  <span className="font-medium">Employer PF (Direct Contribution)</span>
                  <span className="font-mono font-medium">
                    {formatCurrency(payrollRecord.employerPFContribution)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-200/80 flex justify-between font-bold text-xs">
              <span>Total Deductions:</span>
              <span className="font-mono text-rose-700 font-black">-{formatCurrency(payrollRecord.totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay Final Bar */}
        <div className="glass-panel-dark text-white rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-teal-400">
              Net Payable Amount
            </span>
            <div className="text-2xl font-black font-mono mt-0.5 tabular-nums text-white">
              {formatCurrency(payrollRecord.netPayableAmount)}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
              Deposited via Direct Bank Transfer &bull; Status:{' '}
              <strong className="text-emerald-400 font-bold">{payrollRecord.status}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl btn-glass text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={() => alert('Salary slip PDF downloaded successfully.')}
              className="px-4 py-2 rounded-xl btn-accent text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
