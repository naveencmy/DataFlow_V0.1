import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useConfig } from '../../../context/ConfigContext.jsx';
import { useHRMS } from '../../../context/HRMSContext.jsx';
import { recalculateComponents, calculateDeductions } from '../../../utils/salaryEngine.js';
import { formatCurrency, formatWagePair } from '../../../utils/formatters.js';
import {
  DollarSign,
  Calculator,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Lock,
  Save,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const SalaryInfoTab = ({ employee, isEditing, onChange }) => {
  const { role } = useAuth();
  const { flags, toggleSalaryVisibility } = useConfig();
  const { updateSalaryStructure } = useHRMS();

  const isAdmin = role === 'ADMIN';

  // If role is Employee and SALARY_INFO_VISIBLE_TO_EMPLOYEE is false, respect Section 13 wireframe rule
  if (!isAdmin && !flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center shadow-subtle border border-white/80">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-200/80">
          <Lock className="w-6 h-6" />
        </div>
        <h4 className="text-base font-black text-slate-900 tracking-tight">Salary Info Restricted (Wireframe Mode)</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed font-medium">
          Under the default wireframe specification (Section 13), Salary Information is restricted to Admin/HR view only.
        </p>
        <div className="mt-5 p-4 bg-teal-50/80 border border-teal-200/80 rounded-2xl max-w-md mx-auto text-xs text-teal-950 backdrop-blur-sm shadow-xs">
          <span className="font-bold">Test Section 13 Unresolved Conflict:</span>
          <p className="text-teal-800 mt-0.5 leading-relaxed">
            Click below to toggle <code>SALARY_INFO_VISIBLE_TO_EMPLOYEE</code> to <code>true</code> and view the read-only salary breakdown.
          </p>
          <button
            onClick={toggleSalaryVisibility}
            className="mt-3 px-4 py-2 rounded-xl btn-accent text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Enable Employee Salary Visibility (Spec Mode)
          </button>
        </div>
      </div>
    );
  }

  // Local state for interactive calculation engine
  const [wage, setWage] = useState(employee.salary?.monthlyWage || 50000);
  const [components, setComponents] = useState(employee.salary?.components || []);
  const [empPF, setEmpPF] = useState(employee.salary?.employeePFPercentage || 12);
  const [employerPF, setEmployerPF] = useState(employee.salary?.employerPFPercentage || 12);
  const [profTax, setProfTax] = useState(employee.salary?.professionalTax || 200);
  const [workingDays, setWorkingDays] = useState(employee.salary?.workingDaysPerWeek || 5);
  const [breakTime, setBreakTime] = useState(employee.salary?.breakTimeMinutes || 60);

  // Validation & Calculation results
  const [calculationResult, setCalculationResult] = useState(() =>
    recalculateComponents(wage, components)
  );

  useEffect(() => {
    if (employee.salary) {
      setWage(employee.salary.monthlyWage);
      setComponents(employee.salary.components);
      setEmpPF(employee.salary.employeePFPercentage);
      setEmployerPF(employee.salary.employerPFPercentage);
      setProfTax(employee.salary.professionalTax);
    }
  }, [employee]);

  // Reactive recalculation whenever wage or components change
  useEffect(() => {
    const res = recalculateComponents(Number(wage) || 0, components);
    setCalculationResult(res);
  }, [wage, components]);

  const handleWageChange = (newWageVal) => {
    const val = Number(newWageVal) || 0;
    setWage(val);
  };

  const handleComponentValueChange = (compId, newValue) => {
    const val = Number(newValue) || 0;
    const updated = components.map((c) => (c.id === compId ? { ...c, value: val } : c));
    setComponents(updated);
  };

  const handleSaveSalary = () => {
    if (!calculationResult.isValid) {
      alert('Cannot save: Salary components exceed the monthly wage.');
      return;
    }

    const updatedStructure = {
      wageType: 'Fixed Wage',
      monthlyWage: Number(wage),
      annualWage: Number(wage) * 12,
      components: calculationResult.components,
      employeePFPercentage: Number(empPF),
      employerPFPercentage: Number(employerPF),
      professionalTax: Number(profTax),
      workingDaysPerWeek: Number(workingDays),
      breakTimeMinutes: Number(breakTime),
    };

    updateSalaryStructure(employee.id, updatedStructure);
  };

  // Find Basic for deduction computing
  const currentBasicComp = calculationResult.components.find((c) => c.name === 'Basic Salary');
  const currentBasic = currentBasicComp ? currentBasicComp.calculatedAmount : wage * 0.5;

  const deductions = calculateDeductions(currentBasic, empPF, employerPF, profTax);
  const wagePair = formatWagePair(wage);
  const netMonthly = Math.max(0, wage - deductions.totalDeductions);

  return (
    <div className="space-y-6">
      {/* Role Banner */}
      {!isAdmin && (
        <div className="p-3.5 bg-sky-50/80 border border-sky-200/80 rounded-2xl text-xs text-sky-950 flex items-center justify-between backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Employee View Mode:</strong> Read-only breakdown of your compensation structure.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-md border border-sky-200/60">
            Read Only
          </span>
        </div>
      )}

      {/* 1. Monthly & Annual Wage Header (Glass Dark Card) */}
      <div className="glass-panel-dark rounded-3xl p-6 sm:p-7 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-teal-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              Live Salary Calculation Engine
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-3xl font-black font-mono tracking-tight text-white tabular-nums">
                {formatCurrency(wage)}
              </div>
              <span className="text-sm text-slate-300 font-medium">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Annualized Fixed CTC: <strong className="text-teal-300">{wagePair.annual} / year</strong>
            </p>
          </div>

          {/* Admin Live Wage Editor */}
          {isAdmin && (
            <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Adjust Monthly Wage (₹)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={wage}
                  onChange={(e) => handleWageChange(e.target.value)}
                  className="w-40 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-mono font-bold text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleSaveSalary}
                disabled={!calculationResult.isValid}
                className="mt-4 px-4 py-2 btn-accent disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        {/* Inline Overrun Warning */}
        {!calculationResult.isValid && (
          <div className="mt-4 p-3.5 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-xs text-rose-200 flex items-center gap-2 backdrop-blur-sm animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Component Overrun:</strong> The sum of assigned components exceeds the monthly wage by{' '}
              <strong className="text-white font-mono">{formatCurrency(calculationResult.overflowAmount)}</strong>.
              Fixed Allowance cannot be negative.
            </span>
          </div>
        )}
      </div>

      {/* 2. Salary Components Table */}
      <div className="glass-panel rounded-3xl border border-white/80 overflow-hidden shadow-subtle">
        <div className="px-6 py-4 border-b border-slate-100/80 flex items-center justify-between bg-slate-50/60 backdrop-blur-xs">
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">Salary Components Breakdown</h4>
            <p className="text-xs text-slate-500 font-medium">Live cascaded percentage & fixed allowances</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Wage Type: <strong>Fixed Wage</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Component Name</th>
                <th className="py-3 px-5">Calculation Type</th>
                <th className="py-3 px-5">Formula / Rate</th>
                <th className="py-3 px-5 text-right">Calculated Monthly Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {calculationResult.components.map((comp) => {
                const isBalancing = comp.isBalancing;

                return (
                  <tr
                    key={comp.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isBalancing ? 'bg-teal-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{comp.name}</span>
                        {isBalancing && (
                          <span className="text-[10px] text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md font-mono font-bold border border-teal-200/60">
                            Balancing
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 capitalize text-slate-600 font-medium">
                      {comp.calculationType === 'percentage'
                        ? `% of ${comp.percentageBase}`
                        : 'Fixed Amount'}
                    </td>

                    <td className="py-3.5 px-5">
                      {isAdmin && !isBalancing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={comp.value}
                            onChange={(e) => handleComponentValueChange(comp.id, e.target.value)}
                            className="w-20 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                          <span className="text-slate-400 text-xs font-bold">
                            {comp.calculationType === 'percentage' ? '%' : '₹'}
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-slate-700 font-medium">
                          {comp.calculationType === 'percentage'
                            ? `${comp.value}% of ${comp.percentageBase}`
                            : isBalancing
                            ? 'Wage − Other Components'
                            : formatCurrency(comp.value)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(comp.calculatedAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200/80 bg-slate-50/70 font-bold text-xs text-slate-900">
                <td colSpan={3} className="py-3.5 px-5 text-right uppercase tracking-wider text-slate-600 font-bold">
                  Total Gross Monthly Salary:
                </td>
                <td className="py-3.5 px-5 text-right font-mono text-sm text-teal-800 tabular-nums font-black">
                  {formatCurrency(wage)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3. Deductions & Net Pay Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Deductions Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
          <h4 className="text-sm font-black text-slate-900 mb-3.5 flex items-center gap-1.5 tracking-tight">
            <DollarSign className="w-4 h-4 text-rose-500" />
            <span>Statutory Deductions (Configurable)</span>
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
              <div>
                <span className="font-bold text-slate-800">Employee PF (12% of Basic)</span>
                <p className="text-[11px] text-slate-500 font-medium">Provident Fund deduction</p>
              </div>
              <span className="font-mono font-bold text-rose-600">
                -{formatCurrency(deductions.employeePF)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
              <div>
                <span className="font-bold text-slate-800">Professional Tax (PT)</span>
                <p className="text-[11px] text-slate-500 font-medium">Monthly municipal tax</p>
              </div>
              <span className="font-mono font-bold text-rose-600">
                -{formatCurrency(deductions.professionalTax)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
              <div>
                <span className="font-bold text-slate-700">Employer PF Contribution</span>
                <p className="text-[11px] text-slate-400 font-medium">Paid by company (not deducted from wage)</p>
              </div>
              <span className="font-mono font-medium text-slate-600">
                {formatCurrency(deductions.employerPF)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between font-bold">
              <span className="text-slate-700">Total Monthly Deductions:</span>
              <span className="font-mono text-rose-700 font-black">-{formatCurrency(deductions.totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Take Home & Settings Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-900 mb-3.5 flex items-center gap-1.5 tracking-tight">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Standard Take-Home & Schedule Settings</span>
            </h4>

            <div className="p-4.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 mb-4 backdrop-blur-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                Estimated Net Pay (Full Attendance)
              </span>
              <div className="text-2xl font-black font-mono text-teal-950 mt-1 tabular-nums">
                {formatCurrency(netMonthly)}
                <span className="text-xs text-teal-700 font-semibold font-sans ml-1">/ month</span>
              </div>
              <p className="text-[11px] text-teal-700 mt-1 font-medium">
                *Subject to attendance & unpaid leave payable days multiplier.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Working Days / Week</span>
                <span className="font-black text-slate-800 text-sm mt-0.5 block">{workingDays} Days</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Daily Break Time</span>
                <span className="font-black text-slate-800 text-sm mt-0.5 block">{breakTime} Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Visual Calculation Chain Diagram per Section 11 */}
      <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 backdrop-blur-xs">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-teal-600" />
          <span>Section 11 Calculation Chain:</span>
        </h4>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 font-bold text-slate-800 shadow-2xs">
            Fixed Wage ({formatCurrency(wage)})
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 font-bold text-slate-800 shadow-2xs">
            Components (Basic 50% + HRA + Allowances + Balancing)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 font-bold text-slate-800 shadow-2xs">
            Gross Salary
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 font-bold text-rose-700 shadow-2xs">
            Deductions (PF + PT)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3.5 py-1.5 rounded-xl btn-accent text-white font-bold shadow-xs">
            Final Net Payroll
          </span>
        </div>
      </div>
    </div>
  );
};
