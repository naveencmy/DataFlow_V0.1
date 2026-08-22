import React, { useState } from 'react';
import { usePayrollQuery, useProcessPayrollMutation, useUpdatePayrollStatusMutation } from '../hooks/usePayrollQuery.js';
import { useAuthStore } from '../stores/authStore.js';
import { FileText, DollarSign, CheckCircle2, Play, Download, Shield } from 'lucide-react';
import { TableSkeleton } from '../components/ui/Skeleton.jsx';

export const PayrollPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const { data: payroll, isLoading } = usePayrollQuery();
  const processMutation = useProcessPayrollMutation();
  const statusMutation = useUpdatePayrollStatusMutation();

  const handleRunPayroll = () => {
    const currentMonth = 'August';
    const currentYear = 2026;
    processMutation.mutate({ monthStr: currentMonth, year: currentYear });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-teal-300">
            <FileText className="w-3.5 h-3.5" />
            <span>50/50 Automated Payroll Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans">Payroll & Payslips</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
            Statutory PF deductions, basic allowances, and live net pay derivations directly stored in PostgreSQL.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleRunPayroll}
            disabled={processMutation.isPending}
            className="py-3 px-5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 shrink-0 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{processMutation.isPending ? 'Calculating...' : 'Process August 2026 Payroll'}</span>
          </button>
        )}
      </div>

      {/* Payroll Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Cycle</th>
                  <th className="py-4 px-6">Gross Salary</th>
                  <th className="py-4 px-6">PF Deduction</th>
                  <th className="py-4 px-6">Net Payable</th>
                  <th className="py-4 px-6">Status</th>
                  {isAdmin && <th className="py-4 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(payroll || []).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{row.employeeName || row.employeeId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{row.department}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">{row.month} {row.year}</td>
                    <td className="py-4 px-6 font-mono font-semibold text-slate-800">₹{(row.grossSalary || 0).toLocaleString()}</td>
                    <td className="py-4 px-6 font-mono text-rose-600">₹{(row.pfDeduction || 0).toLocaleString()}</td>
                    <td className="py-4 px-6 font-mono font-black text-emerald-600 text-sm">₹{(row.netPayableAmount || 0).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          row.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-4 px-6 text-right">
                        {row.status !== 'PAID' ? (
                          <button
                            onClick={() => statusMutation.mutate({ id: row.id, status: 'PAID' })}
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Disbursed
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
