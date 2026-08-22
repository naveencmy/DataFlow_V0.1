import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { deriveEmployeeWorkStatus } from '../../utils/statusDerivation.js';
import { AttendanceStatusBadge, WorkStatusBadge } from '../common/StatusBadge.jsx';
import { formatDate, getTodayDateString } from '../../utils/formatters.js';
import {
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Plane,
} from 'lucide-react';

export const AdminAttendanceView = ({ onSelectEmployee }) => {
  const { employees, attendance, leaves } = useHRMS();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Date navigation helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(getTodayDateString());
  };

  // Compile full employee attendance map for selected date
  const employeeAttendanceRows = employees.map((emp) => {
    const record = attendance.find(
      (a) => a.employeeId === emp.id && a.date === selectedDate
    );
    const derived = deriveEmployeeWorkStatus(emp.id, selectedDate, attendance, leaves);

    return {
      employee: emp,
      record,
      derived,
    };
  });

  // Calculate day summary metrics
  const daySummary = employeeAttendanceRows.reduce(
    (acc, row) => {
      if (row.derived.status === 'PRESENT') acc.present += 1;
      else if (row.derived.status === 'ON_LEAVE') acc.onLeave += 1;
      else acc.absent += 1;
      return acc;
    },
    { present: 0, onLeave: 0, absent: 0 }
  );

  // Filter rows
  const filteredRows = employeeAttendanceRows.filter(({ employee, derived }) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.loginId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.jobPosition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || employee.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* 1. Date Navigation & Day Summary Bar */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 shadow-xs">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  All-Employee Attendance Master Log
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Admin Monitoring: Inspect daily check-ins, work duration & leave alignment across all teams.
                </p>
              </div>
            </div>
          </div>

          {/* Date Navigator per Section 9 */}
          <div className="flex items-center gap-2 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80 self-start lg:self-auto backdrop-blur-sm">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 transition-all cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2.5">
              <CalendarIcon className="w-4 h-4 text-teal-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 transition-all cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold btn-primary text-white rounded-xl shadow-xs transition-colors ml-1 cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>

        {/* Selected Date Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-slate-100/80">
          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Active Employees
            </span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-0.5 tabular-nums">
              {employees.length}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 backdrop-blur-md shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Present on {formatDate(selectedDate)}
            </span>
            <div className="text-2xl font-black font-mono text-emerald-950 mt-0.5 tabular-nums">
              {daySummary.present}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 backdrop-blur-md shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Approved Leave
            </span>
            <div className="text-2xl font-black font-mono text-sky-950 mt-0.5 tabular-nums">
              {daySummary.onLeave}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 backdrop-blur-md shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Absent (Unexcused)
            </span>
            <div className="text-2xl font-black font-mono text-amber-950 mt-0.5 tabular-nums">
              {daySummary.absent}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section 9 Attendance -> Working Days -> Payable Days -> Payroll Derivation Banner */}
      <div className="glass-panel-dark text-white rounded-3xl p-6 shadow-xl border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Section 9 Architectural Derivation Chain:
            </span>
            <p className="text-sm font-black text-white mt-1">
              Attendance Data visibly drives Payroll calculations in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-mono font-bold">
              Attendance Log
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-mono font-bold">
              Working Days
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-mono font-black">
              Payable Days
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black">
              Final Payroll
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search and Department Filter */}
      <div className="glass-panel rounded-2xl border border-white/80 p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee by name, ID or role..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200/80 rounded-xl text-xs bg-white/80 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Management">Management</option>
          </select>
        </div>
      </div>

      {/* 4. All-Employee Attendance Table per Section 9 */}
      <div className="glass-panel rounded-3xl border border-white/80 overflow-hidden shadow-subtle">
        <div className="px-6 py-4.5 border-b border-slate-100/80 flex items-center justify-between bg-slate-50/60 backdrop-blur-xs">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Attendance Records for {formatDate(selectedDate)}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Columns: Employee | Check In | Check Out | Work Hours | Extra Hours | Status
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
            {filteredRows.length} employees listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4 text-right">Work Hours</th>
                <th className="py-3 px-4 text-right">Extra Hours</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No records found matching filters for this date.
                  </td>
                </tr>
              ) : (
                filteredRows.map(({ employee, record, derived }) => (
                  <tr key={employee.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={employee.profilePicture}
                          alt={employee.name}
                          className="w-9 h-9 rounded-xl object-cover border border-white shadow-xs ring-1 ring-slate-200/80 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 hover:text-teal-700 cursor-pointer" onClick={() => onSelectEmployee(employee.id)}>
                            {employee.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {employee.loginId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 font-bold text-slate-600">
                      {employee.department}
                    </td>

                    {/* Work Status Badge */}
                    <td className="py-3.5 px-4">
                      <WorkStatusBadge status={derived.status} detailText={derived.detailText} />
                    </td>

                    {/* Check In */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {record?.checkInTime || (
                        <span className="text-slate-300 font-normal">--:--</span>
                      )}
                    </td>

                    {/* Check Out */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {record?.checkOutTime || (
                        <span className="text-slate-300 font-normal">--:--</span>
                      )}
                    </td>

                    {/* Work Hours */}
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 tabular-nums">
                      {record?.workHours ? `${record.workHours} hrs` : '-'}
                    </td>

                    {/* Extra Hours */}
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700 tabular-nums font-bold">
                      {record?.extraHours > 0 ? `+${record.extraHours} hrs` : '-'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => onSelectEmployee(employee.id)}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
