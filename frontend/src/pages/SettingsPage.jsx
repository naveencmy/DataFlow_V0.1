import React from 'react';
import { useConfig } from '../context/ConfigContext.jsx';
import { useHRMS } from '../context/HRMSContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Sliders,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SettingsPage = () => {
  const { flags, toggleSelfRegistration, toggleSalaryVisibility, resetFlags } = useConfig();
  const { resetHRMSData, employees, attendance, leaves, payroll } = useHRMS();
  const { role, currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 shadow-xs">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Dayflow System Configuration & Spec Flags
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Manage Section 13 unresolved product conflict flags and runtime data controls.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Section 13 Unresolved Spec Conflict Cards */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Section 13 — Unresolved Spec Conflicts</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              The product specification explicitly preserves both behaviors behind toggleable feature flags.
            </p>
          </div>
          <button
            onClick={resetFlags}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer"
          >
            Reset Flags to Spec Defaults
          </button>
        </div>

        {/* Flag 1: Employee Self-Registration */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xs">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                1. EMPLOYEE_SELF_REGISTRATION_ENABLED
              </span>
              <span
                className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full ${
                  flags.EMPLOYEE_SELF_REGISTRATION_ENABLED
                    ? 'bg-teal-500/10 text-teal-800 border border-teal-500/20'
                    : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {flags.EMPLOYEE_SELF_REGISTRATION_ENABLED ? 'ENABLED' : 'DISABLED (Default)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
              <strong>False (Default / Wireframe):</strong> Normal employees cannot register themselves. Only Admin/HR can create employee accounts via Section 4 workflow.
              <br />
              <strong>True (Written Spec):</strong> Exposes a self-registration form on the public login page.
            </p>
          </div>

          <button
            onClick={toggleSelfRegistration}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer active:scale-95 ${
              flags.EMPLOYEE_SELF_REGISTRATION_ENABLED
                ? 'btn-accent text-white shadow-md'
                : 'btn-glass text-slate-700 hover:bg-white'
            }`}
          >
            {flags.EMPLOYEE_SELF_REGISTRATION_ENABLED ? (
              <>
                <ToggleRight className="w-4 h-4" />
                <span>Enabled (True)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>Disabled (False)</span>
              </>
            )}
          </button>
        </div>

        {/* Flag 2: Salary Info Visible to Employee */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xs">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                2. SALARY_INFO_VISIBLE_TO_EMPLOYEE
              </span>
              <span
                className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full ${
                  flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE
                    ? 'bg-teal-500/10 text-teal-800 border border-teal-500/20'
                    : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE ? 'VISIBLE' : 'HIDDEN (Default)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
              <strong>False (Default / Wireframe):</strong> Salary Info tab is Admin-only; employees cannot see it on their profile or navigation.
              <br />
              <strong>True (Written Spec):</strong> Employees can view (read-only) their own Salary Info tab and compensation breakdown.
            </p>
          </div>

          <button
            onClick={toggleSalaryVisibility}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer active:scale-95 ${
              flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE
                ? 'btn-accent text-white shadow-md'
                : 'btn-glass text-slate-700 hover:bg-white'
            }`}
          >
            {flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE ? (
              <>
                <ToggleRight className="w-4 h-4" />
                <span>Visible (True)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>Hidden (False)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Data Store Status & Reset Controls */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle">
        <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2 tracking-tight">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <span>Mock Data Store & Diagnostics</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-4">
          Current local database metrics and full system reset utility.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5 text-xs">
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Employees</span>
            <span className="font-mono font-black text-slate-900 text-lg">{employees.length}</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance Records</span>
            <span className="font-mono font-black text-slate-900 text-lg">{attendance.length}</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Leave Requests</span>
            <span className="font-mono font-black text-slate-900 text-lg">{leaves.length}</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Payroll Runs</span>
            <span className="font-mono font-black text-slate-900 text-lg">{payroll.length}</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all mock HRMS data to factory seed values?')) {
              resetHRMSData();
            }
          }}
          className="px-4.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 border border-rose-500/20 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Mock Data to Seed Defaults</span>
        </button>
      </div>

      {/* 4. Section 17 Business Rules Checklist */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle">
        <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2 tracking-tight">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Section 17 Business Rules Checklist Verification</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-medium">
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Role determines visible actions & routes</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Login ID format `OITODO0220001` enforced</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Opening employee card opens in view-only mode first</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Employee profile editing locked strictly to Address, Phone, Photo</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Check-in calculates duration & overtime (&gt;8h)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Approved leave marks attendance as ✈️ Leave</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Reactive salary cascade (Basic 50%, HRA 50% of Basic)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fixed Allowance auto-balances to remainder of Wage</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Payable days from attendance & unpaid leave affects payroll</span>
          </div>
        </div>
      </div>
    </div>
  );
};
