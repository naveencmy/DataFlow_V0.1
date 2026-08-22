import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore.js';
import { useKPIsQuery, useTodayAttendanceQuery, useCheckInMutation, useCheckOutMutation } from '../hooks/index.js';
import { useEmployeesQuery } from '../hooks/useEmployeesQuery.js';
import { Users, Clock, Calendar, AlertCircle, ArrowRight, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { TableSkeleton, CardSkeleton } from '../components/ui/Skeleton.jsx';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const { data: kpis, isLoading: isKPIsLoading } = useKPIsQuery();
  const { data: todayData, isLoading: isTodayLoading } = useTodayAttendanceQuery();
  const { data: employees, isLoading: isEmployeesLoading } = useEmployeesQuery();

  const checkInMutation = useCheckInMutation();
  const checkOutMutation = useCheckOutMutation();

  const todayDateStr = todayData?.date || new Date().toISOString().split('T')[0];
  const myAttendance = todayData?.attendance?.find((a) => a.employeeId === user?.employeeId);

  const isCheckedIn = Boolean(myAttendance?.checkInTime);
  const isCheckedOut = Boolean(myAttendance?.checkOutTime);

  const displayName = user?.name || (isAdmin ? 'Sarah Williams' : (user?.loginId || 'Alex Johnson'));

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Welcome & Live Check-in Hero Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-300">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
            Good day, {displayName}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-lg leading-relaxed">
            {isAdmin
              ? 'Real-time PostgreSQL workforce operations and analytics dashboard.'
              : 'Track your daily attendance, time-off requests, and payslip allocations.'}
          </p>
        </div>

        {/* Quick Check-In / Check-Out Widget */}
        <div className="z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Today's Status</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              {isCheckedOut ? (
                <span className="text-amber-300">Checked Out ({myAttendance?.checkOutTime})</span>
              ) : isCheckedIn ? (
                <span className="text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Checked In ({myAttendance?.checkInTime})
                </span>
              ) : (
                <span className="text-slate-300">Not Checked In</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {!isCheckedIn ? (
              <button
                onClick={() => checkInMutation.mutate({ notes: 'Self check-in via web portal' })}
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
      </div>

      {/* KPI Metric Cards */}
      {isKPIsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Headcount */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-3xl p-6 border border-teal-100/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Total Workforce</span>
              <div className="w-10 h-10 rounded-2xl bg-teal-600/10 text-teal-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{kpis?.totalHeadcount || 0}</div>
            <div className="text-xs text-teal-700 font-semibold">Active Team Members</div>
          </div>

          {/* Present Today */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50/50 rounded-3xl p-6 border border-emerald-100/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Present Today</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{kpis?.presentToday || 0}</div>
            <div className="text-xs text-emerald-700 font-semibold">Checked In On Schedule</div>
          </div>

          {/* On Leave */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-3xl p-6 border border-sky-100/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">On Leave</span>
              <div className="w-10 h-10 rounded-2xl bg-sky-600/10 text-sky-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{kpis?.onLeaveToday || 0}</div>
            <div className="text-xs text-sky-700 font-semibold">Approved Time Off</div>
          </div>

          {/* Absent */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-6 border border-amber-100/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Pending / Absent</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-600/10 text-amber-700 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{kpis?.absentToday || 0}</div>
            <div className="text-xs text-amber-700 font-semibold">Unrecorded Check-in</div>
          </div>
        </div>
      )}

      {/* Live Directory Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Workforce Directory</h3>
            <p className="text-xs text-slate-500">Live employee profiles synchronized with PostgreSQL</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate('/employees')}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer"
            >
              <span>View All Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isEmployeesLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(employees || []).slice(0, 6).map((emp) => (
              <div
                key={emp.id}
                onClick={() => navigate(`/employees/${emp.id}/profile`)}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer space-y-4 group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={emp.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces'}
                    alt={emp.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-teal-200 transition-all"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                      {emp.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{emp.jobPosition}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
                      {emp.department}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{emp.loginId}</span>
                  <span className="text-teal-600 font-sans font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Profile →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
