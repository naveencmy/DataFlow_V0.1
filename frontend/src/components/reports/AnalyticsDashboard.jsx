import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { deriveEmployeeWorkStatus } from '../../utils/statusDerivation.js';
import { getTodayDateString, formatCurrency } from '../../utils/formatters.js';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { employees, attendance, leaves, payroll } = useHRMS();
  const todayStr = getTodayDateString();

  // 1. Headcount Breakdown Chart Data
  const headcountBreakdown = employees.reduce(
    (acc, emp) => {
      const derived = deriveEmployeeWorkStatus(emp.id, todayStr, attendance, leaves);
      if (derived.status === 'PRESENT') acc.present += 1;
      else if (derived.status === 'ON_LEAVE') acc.onLeave += 1;
      else acc.absent += 1;
      return acc;
    },
    { present: 0, onLeave: 0, absent: 0 }
  );

  const headcountPieData = [
    { name: '🟢 Present Today', value: headcountBreakdown.present, color: '#10B981' },
    { name: '✈️ On Leave', value: headcountBreakdown.onLeave, color: '#0284C7' },
    { name: '🟡 Absent (No Leave)', value: headcountBreakdown.absent, color: '#F59E0B' },
  ];

  // 2. 10-Day Attendance Trend Data
  const attendanceTrendData = [
    { day: '12 Aug', present: 5, onLeave: 0, absent: 0 },
    { day: '13 Aug', present: 4, onLeave: 1, absent: 0 },
    { day: '14 Aug', present: 5, onLeave: 0, absent: 0 },
    { day: '17 Aug', present: 5, onLeave: 0, absent: 0 },
    { day: '18 Aug', present: 4, onLeave: 1, absent: 0 },
    { day: '19 Aug', present: 4, onLeave: 0, absent: 1 },
    { day: '20 Aug', present: 5, onLeave: 0, absent: 0 },
    { day: '21 Aug', present: 4, onLeave: 1, absent: 0 },
    { day: 'Today', present: headcountBreakdown.present, onLeave: headcountBreakdown.onLeave, absent: headcountBreakdown.absent },
  ];

  // 3. Leave Type Distribution Data
  const leaveTypeCounts = leaves.reduce(
    (acc, l) => {
      if (l.leaveType === 'Paid Time Off') acc.pto += l.totalDays || 1;
      else if (l.leaveType === 'Sick Leave') acc.sick += l.totalDays || 1;
      else acc.unpaid += l.totalDays || 1;
      return acc;
    },
    { pto: 0, sick: 0, unpaid: 0 }
  );

  const leaveTypeData = [
    { type: 'Paid Time Off', days: leaveTypeCounts.pto, fill: '#0D9488' },
    { type: 'Sick Leave', days: leaveTypeCounts.sick, fill: '#0284C7' },
    { type: 'Unpaid Leave', days: leaveTypeCounts.unpaid, fill: '#F59E0B' },
  ];

  // 4. Department Payroll Expenditure Data
  const deptMap = {};
  employees.forEach((emp) => {
    const dept = emp.department || 'Other';
    const wage = emp.salary?.monthlyWage || 50000;
    deptMap[dept] = (deptMap[dept] || 0) + wage;
  });

  const departmentPayrollData = Object.keys(deptMap).map((dept) => ({
    department: dept,
    expenditure: deptMap[dept],
  }));

  const handleExportCSV = () => {
    alert('Exporting Dayflow HRMS Comprehensive Analytics Report to CSV...');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Export Simulation */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                HR Analytics & Reports Dashboard
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Visual metrics for headcount status, attendance trends, leave distribution, and payroll allocations.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl btn-primary text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4 text-teal-400" />
          <span>Export Analytics (CSV)</span>
        </button>
      </div>

      {/* 2. Top Analytics Row: Headcount Donut Chart + Leave Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Status Breakdown (Section 14: 🟢/✈️/🟡) */}
        <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Headcount Status Breakdown</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time daily workforce alignment</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100/80 px-3 py-1 rounded-xl border border-slate-200/60">
              Total: {employees.length}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={headcountPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {headcountPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Employees`, name]}
                  contentStyle={{ borderRadius: '16px', fontSize: '12px', borderColor: '#E2E8F0', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Type Distribution (Section 14) */}
        <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Leave Distribution by Type</h3>
              <p className="text-xs text-slate-500 font-medium">Cumulative total days taken across all employees</p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200/80">
              3 Standard Categories
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveTypeData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <Tooltip
                  formatter={(value) => [`${value} Total Days`, 'Days Taken']}
                  contentStyle={{ borderRadius: '16px', fontSize: '12px', borderColor: '#E2E8F0', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="days" radius={[10, 10, 0, 0]} barSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Bottom Analytics Row: Attendance Trends + Department Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends over Time */}
        <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Attendance Trends Over Time</h3>
              <p className="text-xs text-slate-500 font-medium">Daily present vs. leave distribution</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg">10-Day Window</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', fontSize: '12px', borderColor: '#E2E8F0', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} />
                <Line
                  type="monotone"
                  dataKey="present"
                  name="Present 🟢"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="onLeave"
                  name="On Leave ✈️"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Monthly Payroll Expenditure */}
        <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Departmental Payroll Allocation</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly gross wage distribution by department</p>
            </div>
            <span className="text-xs font-black text-teal-900 font-mono bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
              Total: {formatCurrency(Object.values(deptMap).reduce((a, b) => a + b, 0))}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPayrollData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <YAxis
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Monthly Wage']}
                  contentStyle={{ borderRadius: '16px', fontSize: '12px', borderColor: '#E2E8F0', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="expenditure" fill="#0F172A" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
