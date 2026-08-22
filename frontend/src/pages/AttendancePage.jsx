import React, { useState } from 'react';
import { useAttendanceQuery, useTodayAttendanceQuery, useCheckInMutation, useCheckOutMutation } from '../hooks/useAttendanceQuery.js';
import { useAuthStore } from '../stores/authStore.js';
import { Clock, Calendar, CheckCircle2, UserCheck, Search, ArrowRight, Shield } from 'lucide-react';
import { TableSkeleton } from '../components/ui/Skeleton.jsx';

export const AttendancePage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const [dateFilter, setDateFilter] = useState('');
  const { data: attendance, isLoading } = useAttendanceQuery(dateFilter ? { date: dateFilter } : {});
  const { data: todayData } = useTodayAttendanceQuery();

  const checkInMutation = useCheckInMutation();
  const checkOutMutation = useCheckOutMutation();

  const myTodayRecord = todayData?.attendance?.find((a) => a.employeeId === user?.employeeId);
  const isCheckedIn = Boolean(myTodayRecord?.checkInTime);
  const isCheckedOut = Boolean(myTodayRecord?.checkOutTime);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-teal-300">
            <Clock className="w-3.5 h-3.5" />
            <span>PostgreSQL Live Attendance Logs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans">Attendance Management</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
            Real-time check-ins, working hour aggregations, and overtime derivation.
          </p>
        </div>

        {/* Self Check-in Widget */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300">My Status Today</div>
            <div className="text-sm font-bold text-white">
              {isCheckedOut ? (
                <span className="text-amber-300">Checked Out ({myTodayRecord?.checkOutTime})</span>
              ) : isCheckedIn ? (
                <span className="text-emerald-300">Checked In ({myTodayRecord?.checkInTime})</span>
              ) : (
                <span className="text-slate-300">Not Checked In</span>
              )}
            </div>
          </div>
          {!isCheckedIn ? (
            <button
              onClick={() => checkInMutation.mutate({ notes: 'Self check-in' })}
              disabled={checkInMutation.isPending}
              className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {checkInMutation.isPending ? 'Logging...' : 'Check In 🟢'}
            </button>
          ) : !isCheckedOut ? (
            <button
              onClick={() => checkOutMutation.mutate({})}
              disabled={checkOutMutation.isPending}
              className="py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {checkOutMutation.isPending ? 'Logging...' : 'Check Out 🔴'}
            </button>
          ) : null}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing {(attendance || []).length} Logged Records
        </div>
      </div>

      {/* Attendance Table */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Employee ID</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Check In</th>
                  <th className="py-4 px-6">Check Out</th>
                  <th className="py-4 px-6">Work Hours</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(attendance || []).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{row.employeeId}</td>
                    <td className="py-4 px-6 font-mono text-slate-600">{typeof row.date === 'string' ? row.date.slice(0, 10) : new Date(row.date).toISOString().slice(0, 10)}</td>
                    <td className="py-4 px-6 font-mono text-emerald-700 font-semibold">{row.checkInTime || '—'}</td>
                    <td className="py-4 px-6 font-mono text-slate-600">{row.checkOutTime || '—'}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{row.workHours > 0 ? `${row.workHours} hrs` : '—'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                          row.status === 'PRESENT' || row.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : row.status === 'ON_LEAVE' || row.status === 'Leave'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
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

export default AttendancePage;
