import React from 'react';
import { Plane, Stethoscope, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

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

  const ptoRemaining = Math.max(0, ptoQuota - ptoUsed);
  const sickRemaining = Math.max(0, sickQuota - sickUsed);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
      {/* 1. Paid Time Off Card (Mint / Teal Pastel) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100/80 shadow-2xs">
                <Plane className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Paid Leave (PTO)</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Vacation & Personal</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
              100% Paid
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-5">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
              {ptoRemaining}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {ptoQuota} days left
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (ptoRemaining / ptoQuota) * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>{ptoUsed} days utilized</span>
          <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-teal-500" />
            Active Quota
          </span>
        </div>
      </div>

      {/* 2. Sick & Medical Leave (Sky / Blue Pastel) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100/80 shadow-2xs">
                <Stethoscope className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Sick & Medical</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Health & Recovery</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
              100% Paid
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-5">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
              {sickRemaining}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {sickQuota} days left
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (sickRemaining / sickQuota) * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>{sickUsed} days utilized</span>
          <span className="text-[11px] text-sky-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-sky-500" />
            Medical Proof
          </span>
        </div>
      </div>

      {/* 3. Unpaid Leave (Amber / Peach Pastel) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100/80 shadow-2xs">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Unpaid Leave (LWP)</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Beyond Quota</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Salary Adjusted
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-5">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
              {unpaidUsed}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              days taken this year
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, unpaidUsed * 15)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Affects payable days</span>
          <span className="text-[11px] text-amber-800 font-bold">
            Auto-synced with Payroll
          </span>
        </div>
      </div>
    </div>
  );
};

