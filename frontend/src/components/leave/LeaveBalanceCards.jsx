import React from 'react';
import { Plane, Stethoscope, AlertOctagon, Sparkles } from 'lucide-react';

export const LeaveBalanceCards = ({ leaves = [], employeeId }) => {
  const empLeaves = leaves.filter((l) => l.employeeId === employeeId && l.status === 'Approved');

  // Quotas
  const ptoQuota = 18;
  const sickQuota = 10;

  const ptoUsed = empLeaves
    .filter((l) => l.leaveType === 'Paid Time Off' || l.leaveType === 'Paid Leave')
    .reduce((sum, l) => sum + (l.totalDays || 1), 0);

  const sickUsed = empLeaves
    .filter((l) => l.leaveType === 'Sick Leave')
    .reduce((sum, l) => sum + (l.totalDays || 1), 0);

  const unpaidUsed = empLeaves
    .filter((l) => l.leaveType === 'Unpaid Leave')
    .reduce((sum, l) => sum + (l.totalDays || 1), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Paid Time Off Card */}
      <div className="glass-panel rounded-3xl border border-white/80 p-5.5 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-700">
                <Plane className="w-4 h-4" />
              </div>
              <span>Paid Time Off (PTO)</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
              Payable
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black font-mono text-slate-900 tabular-nums">
              {Math.max(0, ptoQuota - ptoUsed)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {ptoQuota} days remaining
            </span>
          </div>

          <div className="w-full bg-slate-100/80 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-teal-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, ((ptoQuota - ptoUsed) / ptoQuota) * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{ptoUsed} days taken this year</span>
          <span className="text-[11px] font-bold text-teal-700">100% Paid</span>
        </div>
      </div>

      {/* Sick Leave Card */}
      <div className="glass-panel rounded-3xl border border-white/80 p-5.5 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-700">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span>Sick & Medical Leave</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-sky-800 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
              Payable
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black font-mono text-slate-900 tabular-nums">
              {Math.max(0, sickQuota - sickUsed)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {sickQuota} days remaining
            </span>
          </div>

          <div className="w-full bg-slate-100/80 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-sky-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, ((sickQuota - sickUsed) / sickQuota) * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{sickUsed} days taken this year</span>
          <span className="text-[11px] font-bold text-sky-700">100% Paid</span>
        </div>
      </div>

      {/* Unpaid Leave Card */}
      <div className="glass-panel rounded-3xl border border-white/80 p-5.5 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <span>Unpaid Leave (LWP)</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              Payroll Deducted
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black font-mono text-amber-950 tabular-nums">
              {unpaidUsed}
            </span>
            <span className="text-xs text-slate-500 font-medium">days taken</span>
          </div>

          <div className="w-full bg-slate-100/80 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, unpaidUsed * 20)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Affects Payable Days</span>
          <span className="text-[11px] font-bold text-amber-800">Deducts Base Wage</span>
        </div>
      </div>
    </div>
  );
};
