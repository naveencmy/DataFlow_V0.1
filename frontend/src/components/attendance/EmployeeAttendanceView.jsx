import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { CheckInOutCard } from './CheckInOutCard.jsx';
import { AttendanceStatusBadge } from '../common/StatusBadge.jsx';
import { formatDate, formatWorkHours } from '../../utils/formatters.js';
import {
  Clock,
  CalendarCheck,
  Plane,
  Briefcase,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const EmployeeAttendanceView = ({ employeeId }) => {
  const { employees, getEmployeeAttendanceHistory, leaves } = useHRMS();

  const currentEmployee = employees.find((e) => e.id === employeeId) || employees[0];
  const history = getEmployeeAttendanceHistory(currentEmployee.id);
  const employeeLeaves = leaves.filter(
    (l) => l.employeeId === currentEmployee.id && l.status === 'Approved'
  );

  // Summary metrics calculations
  const totalWorkingDays = 22;
  const daysPresent = history.filter(
    (r) => r.status === 'Present' || (r.checkInTime && r.status !== 'Leave')
  ).length;
  const leaveCount = employeeLeaves.reduce((sum, l) => sum + (l.totalDays || 1), 0);
  const attendanceRate = Math.min(100, Math.round(((daysPresent + leaveCount) / totalWorkingDays) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Interactive Check-In / Check-Out Card */}
      <CheckInOutCard employeeId={currentEmployee.id} />

      {/* 2. Attendance Summary Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-3xl border border-white/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">Days Present</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 tabular-nums mt-1">
            {daysPresent} <span className="text-xs text-slate-400 font-sans font-normal">days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Logged on-time shifts</p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">Approved Leaves</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-700">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 tabular-nums mt-1">
            {leaveCount} <span className="text-xs text-slate-400 font-sans font-normal">days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">PTO & approved time off</p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">Standard Working Days</span>
            <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 tabular-nums mt-1">
            {totalWorkingDays} <span className="text-xs text-slate-400 font-sans font-normal">days/mo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Monthly cycle baseline</p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">Attendance Rate</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-teal-950 tabular-nums mt-1">
            {attendanceRate}%
          </div>
          <div className="w-full bg-slate-100/80 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, attendanceRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Own Attendance History Table */}
      <div className="glass-panel rounded-3xl border border-white/80 overflow-hidden shadow-subtle">
        <div className="px-6 py-4.5 border-b border-slate-100/80 flex items-center justify-between bg-slate-50/60 backdrop-blur-xs">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">My Attendance History</h3>
            <p className="text-xs text-slate-500 font-medium">Chronological workday log with calculated hours</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
            {history.length} records logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Work Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Check In</th>
                <th className="py-3 px-6">Check Out</th>
                <th className="py-3 px-6 text-right">Work Hours</th>
                <th className="py-3 px-6 text-right">Extra Hours</th>
                <th className="py-3 px-6">Notes / Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No attendance records found. Click "Check In Now" above to begin your shift.
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-3.5 px-6">
                      <AttendanceStatusBadge status={record.status} />
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-700">
                      {record.checkInTime || '--:--'}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-700">
                      {record.checkOutTime || '--:--'}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-black text-slate-900 tabular-nums">
                      {record.workHours ? `${record.workHours} hrs` : '-'}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      {record.extraHours > 0 ? `+${record.extraHours} hrs` : '-'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 truncate max-w-xs font-medium">
                      {record.notes || 'Standard shift'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Section 9 Attendance -> Payroll Connection Banner */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4.5 flex items-center justify-between text-xs text-teal-950 backdrop-blur-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-600 text-white shrink-0 shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <strong className="block font-bold text-sm">Attendance & Payroll Synchronization Engine</strong>
            <span className="text-teal-800 font-medium">
              Attendance records feed directly into Monthly Payable Days (Paid Time Off counts toward payable days; unpaid time off adjusts base payout).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
