import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Sliders, ToggleLeft, ToggleRight, Info, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export const ConfigBar = () => {
  const { flags, toggleSelfRegistration, toggleSalaryVisibility, resetFlags } = useConfig();
  const { role } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside aria-label="Section 13 Spec Configuration Banner" className="bg-white/90 backdrop-blur-md text-slate-800 border-b border-slate-200/80 text-xs px-6 py-2 relative z-30 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Flag Status Overview */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-teal-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Section 13 Spec Flags:</span>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            {/* Flag 1: Self Registration */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium text-[11px]">Self-Registration:</span>
              <button
                onClick={toggleSelfRegistration}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all cursor-pointer ${
                  flags.EMPLOYEE_SELF_REGISTRATION_ENABLED
                    ? 'bg-teal-100 text-teal-800 border border-teal-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                }`}
                title="Toggle Employee Self-Registration form availability"
              >
                {flags.EMPLOYEE_SELF_REGISTRATION_ENABLED ? (
                  <>
                    <ToggleRight className="w-3.5 h-3.5 text-teal-600" />
                    <span>ENABLED</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                    <span>DISABLED (Default)</span>
                  </>
                )}
              </button>
            </div>

            {/* Flag 2: Salary Info Visible to Employee */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium text-[11px]">Salary Tab for Employee:</span>
              <button
                onClick={toggleSalaryVisibility}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all cursor-pointer ${
                  flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE
                    ? 'bg-teal-100 text-teal-800 border border-teal-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                }`}
                title="Toggle Salary Info Tab visibility for logged in employees"
              >
                {flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE ? (
                  <>
                    <ToggleRight className="w-3.5 h-3.5 text-teal-600" />
                    <span>VISIBLE (Read-Only)</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                    <span>HIDDEN (Default)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
          >
            <span>Spec Conflict Notes</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={resetFlags}
            className="text-[10px] text-teal-700 hover:text-teal-900 font-medium underline px-1 transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Expanded Spec Conflict Documentation Panel */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 pb-1 text-slate-700 animate-fade-in">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-teal-800 flex items-center gap-1.5 mb-1 text-xs">
              <Info className="w-3.5 h-3.5" />
              1. EMPLOYEE_SELF_REGISTRATION_ENABLED
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
              <strong className="text-slate-900">Wireframe Spec (False / Default):</strong> Only Admin/HR can create accounts via "Add Employee" workflow. No public signup form.
              <br />
              <strong className="text-slate-900">Written Spec (True):</strong> Exposes a public/self-registration modal on the login screen.
            </p>
            <button
              onClick={toggleSelfRegistration}
              className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
            >
              Toggle Currently: {flags.EMPLOYEE_SELF_REGISTRATION_ENABLED ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-teal-800 flex items-center gap-1.5 mb-1 text-xs">
              <Info className="w-3.5 h-3.5" />
              2. SALARY_INFO_VISIBLE_TO_EMPLOYEE
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
              <strong className="text-slate-900">Wireframe Spec (False / Default):</strong> Salary Info tab is completely hidden from Employee accounts.
              <br />
              <strong className="text-slate-900">Written Spec (True):</strong> Employees can view (read-only) their own Salary Info tab and breakdown.
            </p>
            <button
              onClick={toggleSalaryVisibility}
              className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
            >
              Toggle Currently: {flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE ? 'VISIBLE' : 'HIDDEN'}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
