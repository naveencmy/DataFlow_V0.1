import React from 'react';
import { useHRMS } from '../../../context/HRMSContext.jsx';
import { Clock, Calendar, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const EmployeeAttendanceTab = ({ employeeId }) => {
  const { getEmployeeAttendanceHistory } = useHRMS();
  const history = getEmployeeAttendanceHistory(employeeId);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Present 🟢</span>;
      case 'Leave':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">Leave ✈️</span>;
      case 'Half-day':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Half-day 🟡</span>;
      case 'Absent':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Absent 🔴</span>;
    }
  };

  const totalPresent = history.filter((h) => h.status === 'Present').length;
  const totalHours = history.reduce((acc, h) => acc + (h.workHours || 0), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Attendance KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Recorded Days
          </span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
            {history.length}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Present Count
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-900 mt-1">
            {totalPresent}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">
            Total Hours Logged
          </span>
          <div className="text-2xl font-extrabold font-mono text-teal-900 mt-1">
            {totalHours.toFixed(1)} hrs
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Attendance Log Summary</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Sorted by Date (Recent First)</span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No attendance records found for this employee.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Date</th>
                  <th scope="col" className="px-6 py-3.5">Check In</th>
                  <th scope="col" className="px-6 py-3.5">Check Out</th>
                  <th scope="col" className="px-6 py-3.5">Work Hours</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-semibold text-slate-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-3.5 font-mono">
                      {record.checkInTime || '—'}
                    </td>
                    <td className="px-6 py-3.5 font-mono">
                      {record.checkOutTime || '—'}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-800">
                      {record.workHours ? `${record.workHours} hrs` : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 truncate max-w-xs">
                      {record.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
