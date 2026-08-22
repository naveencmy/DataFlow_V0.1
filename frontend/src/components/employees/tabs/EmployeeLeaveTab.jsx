import React from 'react';
import { useHRMS } from '../../../context/HRMSContext.jsx';
import { Calendar, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const EmployeeLeaveTab = ({ employeeId }) => {
  const { getEmployeeLeaves } = useHRMS();
  const employeeLeaves = getEmployeeLeaves(employeeId);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Approved</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Rejected</span>;
      case 'Pending':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Leave Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Paid Time Off (PTO)
          </span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
            18 / 24 <span className="text-xs text-slate-400 font-sans font-medium">Days Left</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Sick Leave
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-900 mt-1">
            10 / 12 <span className="text-xs text-slate-400 font-sans font-medium">Days Left</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Unpaid Leave Taken
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-900 mt-1">
            {employeeLeaves.filter((l) => l.leaveType === 'Unpaid Leave' && l.status === 'Approved').length}{' '}
            <span className="text-xs text-slate-400 font-sans font-medium">Days</span>
          </div>
        </div>
      </div>

      {/* Leave Request History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Leave Requests & Application History</span>
          </h3>
        </div>

        {employeeLeaves.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No leave applications recorded for this employee.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Leave Type</th>
                  <th scope="col" className="px-6 py-3.5">Start Date</th>
                  <th scope="col" className="px-6 py-3.5">End Date</th>
                  <th scope="col" className="px-6 py-3.5">Total Days</th>
                  <th scope="col" className="px-6 py-3.5">Remarks</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeeLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {req.leaveType}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      {req.startDate}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      {req.endDate}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-800">
                      {req.totalDays} day{req.totalDays > 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 truncate max-w-xs">
                      {req.remarks || '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      {getStatusBadge(req.status)}
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
