import React from 'react';
import { useKPIsQuery, useAttendanceAnalyticsQuery, useLeaveAnalyticsQuery, usePayrollAnalyticsQuery } from '../hooks/useAnalyticsQuery.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton.jsx';

const COLORS = ['#0D9488', '#0284C7', '#F59E0B', '#E11D48', '#8B5CF6', '#10B981'];

export const AnalyticsPage = () => {
  const { data: kpis, isLoading: isKPIsLoading } = useKPIsQuery();
  const { data: deptAttendance, isLoading: isDeptLoading } = useAttendanceAnalyticsQuery();
  const { data: leaveAnalytics, isLoading: isLeavesLoading } = useLeaveAnalyticsQuery();
  const { data: payrollAnalytics, isLoading: isPayrollLoading } = usePayrollAnalyticsQuery();

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-teal-300">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive PostgreSQL Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans">Workforce & Operational Reports</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
            Real-time aggregations of workforce headcount, department attendance ratios, and payroll allocations.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Total Workforce</span>
          <div className="text-3xl font-black text-slate-900">{kpis?.totalHeadcount || 0}</div>
          <div className="text-xs text-teal-600 font-semibold">100% Retained</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Present Today</span>
          <div className="text-3xl font-black text-slate-900">{kpis?.presentToday || 0}</div>
          <div className="text-xs text-emerald-600 font-semibold">On-site & Remote</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">On Leave</span>
          <div className="text-3xl font-black text-slate-900">{kpis?.onLeaveToday || 0}</div>
          <div className="text-xs text-sky-600 font-semibold">Approved Leaves</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Payroll Runs</span>
          <div className="text-3xl font-black text-slate-900">{(payrollAnalytics || []).length}</div>
          <div className="text-xs text-purple-600 font-semibold">Monthly Cycles</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Attendance Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Department Workforce Distribution</h3>
              <p className="text-xs text-slate-500">Live headcounts grouped by department</p>
            </div>
            <Users className="w-5 h-5 text-teal-600" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAttendance || []}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="present" fill="#0D9488" name="Active Members" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Categories Pie Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Leave Type Utilization</h3>
              <p className="text-xs text-slate-500">Categorical distribution of time-off requests</p>
            </div>
            <Calendar className="w-5 h-5 text-sky-600" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveAnalytics?.byType || []}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {(leaveAnalytics?.byType || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
