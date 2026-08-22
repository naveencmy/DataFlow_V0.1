import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { useConfig } from '../../context/ConfigContext.jsx';
import { PayslipModal } from './PayslipModal.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import {
  DollarSign,
  Play,
  FileText,
  CheckCircle2,
  TrendingUp,
  Download,
  AlertCircle,
  Calendar,
  Sparkles,
  Lock,
} from 'lucide-react';

export const PayrollRunsTable = () => {
  const { role, currentUser } = useAuth();
  const { payroll, employees, processMonthlyPayroll } = useHRMS();
  const { flags } = useConfig();
  const isAdmin = role === 'ADMIN';

  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [selectedPayslip, setSelectedPayslip] = useState(null); // { payrollRecord, employee }

  // Filter records
  const currentEmployee = currentUser?.employeeId
    ? employees.find((e) => e.id === currentUser.employeeId)
    : employees[0];

  const visibleRecords = isAdmin
    ? payroll
    : payroll.filter((p) => p.employeeId === currentEmployee?.id);

  const handleRunPayroll = () => {
    processMonthlyPayroll(selectedMonth, 2026, 7);
  };

  const totalDisbursed = visibleRecords.reduce((sum, p) => sum + (p.netPayableAmount || 0), 0);
  const totalEmployeesPaid = visibleRecords.length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Payroll Processing Command Card */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isAdmin ? 'Salary & Payroll Processing Engine' : 'My Compensation & Payslips'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isAdmin
                  ? 'Execute monthly salary cycles with automatic attendance & unpaid leave payable day adjustments.'
                  : 'View historical pay statements, gross earnings, statutory deductions, and download slips.'}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Run Batch Payroll Trigger */}
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3 bg-slate-50/80 p-2 rounded-2xl border border-slate-200/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 px-2.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-bold bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
              </select>
            </div>

            <button
              onClick={handleRunPayroll}
              className="px-4.5 py-2.5 btn-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
              <span>Process Cycle for All</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Disbursal Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-3xl border border-white/80 p-5.5 shadow-subtle">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
            Total Disbursed Net Pay
          </span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(totalDisbursed)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Across processed pay periods</p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/80 p-5.5 shadow-subtle">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
            Generated Payslips
          </span>
          <div className="text-2xl font-black font-mono text-teal-950 mt-1 tabular-nums">
            {totalEmployeesPaid}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Itemized digital statements</p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/80 p-5.5 shadow-subtle">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
            Payroll Sync State
          </span>
          <div className="text-sm font-black text-emerald-800 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Attendance Connected</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Payable days derived in real-time</p>
        </div>
      </div>

      {/* 3. Payroll Table */}
      <div className="glass-panel rounded-3xl border border-white/80 overflow-hidden shadow-subtle">
        <div className="px-6 py-4.5 border-b border-slate-100/80 flex items-center justify-between bg-slate-50/60 backdrop-blur-xs">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              {isAdmin ? 'Processed Payroll Statements' : 'My Payslips'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Columns: Employee | Period | Payable Days | Gross | Deductions | Net Pay | Actions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4 text-center">Working Days</th>
                <th className="py-3 px-4 text-center">Payable Days</th>
                <th className="py-3 px-4 text-right">Gross Wage</th>
                <th className="py-3 px-4 text-right">Deductions</th>
                <th className="py-3 px-4 text-right">Net Payable</th>
                <th className="py-3 px-6 text-right">Salary Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {visibleRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No payroll runs processed yet. Admin can click "Process Cycle for All" above.
                  </td>
                </tr>
              ) : (
                visibleRecords.map((record) => {
                  const emp = employees.find((e) => e.id === record.employeeId) || employees[0];
                  const hasUnpaidReduction = record.unpaidDays > 0;

                  return (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Employee */}
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-900">{record.employeeName}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{record.department}</div>
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {record.month}
                      </td>

                      {/* Total Working Days */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600 font-medium">
                        {record.totalWorkingDays}
                      </td>

                      {/* Payable Days with Unpaid Leave highlight */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-mono font-black px-2.5 py-0.5 rounded-lg text-xs ${
                            hasUnpaidReduction
                              ? 'bg-amber-500/10 text-amber-900 border border-amber-500/30'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                          title={
                            hasUnpaidReduction
                              ? `Reduced by ${record.unpaidDays} unpaid leave day(s)`
                              : 'Full payable days'
                          }
                        >
                          {record.payableDays}
                          {hasUnpaidReduction && <span className="text-[10px] ml-1 text-amber-700">(-{record.unpaidDays})</span>}
                        </span>
                      </td>

                      {/* Gross Wage */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-800 font-medium">
                        {formatCurrency(record.grossMonthlyWage)}
                      </td>

                      {/* Deductions */}
                      <td className="py-3.5 px-4 text-right font-mono text-rose-600 font-bold">
                        -{formatCurrency(record.totalDeductions)}
                      </td>

                      {/* Net Payable */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-teal-950 text-sm tabular-nums">
                        {formatCurrency(record.netPayableAmount)}
                      </td>

                      {/* Payslip Modal trigger */}
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => setSelectedPayslip({ payrollRecord: record, employee: emp })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50/80 hover:bg-teal-100 text-teal-800 font-bold text-xs transition-all border border-teal-200/80 cursor-pointer active:scale-95 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-teal-600" />
                          <span>View Slip</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal Preview */}
      {selectedPayslip && (
        <PayslipModal
          isOpen={true}
          onClose={() => setSelectedPayslip(null)}
          payrollRecord={selectedPayslip.payrollRecord}
          employee={selectedPayslip.employee}
        />
      )}
    </div>
  );
};
