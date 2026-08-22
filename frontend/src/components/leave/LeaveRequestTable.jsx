import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { LeaveStatusBadge } from '../common/StatusBadge.jsx';
import { LeaveApprovalStepper } from './LeaveApprovalStepper.jsx';
import { LeaveReviewModal } from './LeaveReviewModal.jsx';
import { ApplyLeaveModal } from './ApplyLeaveModal.jsx';
import { LeaveBalanceCards } from './LeaveBalanceCards.jsx';
import { formatDate } from '../../utils/formatters.js';
import {
  Calendar,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Paperclip,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';

export const LeaveRequestTable = ({ currentEmployeeId }) => {
  const { role } = useAuth();
  const { leaves, employees } = useHRMS();
  const isAdmin = role === 'ADMIN';

  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [reviewModalData, setReviewModalData] = useState(null); // { request, action }
  const [expandedRequestId, setExpandedRequestId] = useState(null);

  const currentEmployee = employees.find((e) => e.id === currentEmployeeId) || employees[0];

  // Base list depending on role:
  // Admin sees all leaves; Employee sees own leaves
  const baseLeaves = isAdmin ? leaves : leaves.filter((l) => l.employeeId === currentEmployee.id);

  // Apply filters
  const filteredLeaves = baseLeaves.filter((l) => {
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesType =
      typeFilter === 'All' ||
      l.leaveType === typeFilter ||
      (typeFilter === 'Paid Leave' && (l.leaveType === 'Paid Time Off' || l.leaveType === 'Paid Leave')) ||
      (typeFilter === 'Paid Time Off' && (l.leaveType === 'Paid Time Off' || l.leaveType === 'Paid Leave'));
    const matchesSearch =
      l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const pendingCount = baseLeaves.filter((l) => l.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* 1. Leave Balances Overview (Shown for Employee or specific context) */}
      {!isAdmin && <LeaveBalanceCards leaves={leaves} employeeId={currentEmployee.id} />}

      {/* 2. Top Header Action Bar */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 shadow-xs">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isAdmin ? 'Time Off Review & Approval Queue' : 'My Leave Applications'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isAdmin
                  ? 'Manage incoming leave requests, review employee reasons, and authorize time off.'
                  : 'Track your pending requests, view balance quotas, and submit new leave.'}
              </p>
            </div>
          </div>
        </div>

        {/* Apply Leave Trigger Button */}
        <div className="flex items-center gap-3">
          {pendingCount > 0 && isAdmin && (
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{pendingCount} Pending Review</span>
            </span>
          )}

          <button
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl btn-primary text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* 3. Filters & Search Bar */}
      <div className="glass-panel rounded-2xl border border-white/80 p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAdmin ? 'Search employee, department or reason...' : 'Search my requests...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200/80 rounded-xl text-xs bg-white/80 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Leave Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200/80 rounded-xl text-xs bg-white/80 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
          >
            <option value="All">All Leave Types</option>
            <option value="Paid Leave">Paid Leave (PTO)</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
        </div>
      </div>

      {/* 4. Table of Requests */}
      <div className="glass-panel rounded-3xl border border-white/80 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4 text-center">Days</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6">Reason / Attachment</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No leave requests found. Click "Apply for Leave" to submit a request.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((req) => {
                  const isExpanded = expandedRequestId === req.id;
                  const isPending = req.status === 'Pending';

                  return (
                    <React.Fragment key={req.id}>
                      <tr className={`hover:bg-slate-50/80 transition-colors ${isExpanded ? 'bg-teal-50/30' : ''}`}>
                        {/* Employee */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={req.employeeAvatar}
                              alt={req.employeeName}
                              className="w-8 h-8 rounded-full object-cover border border-white ring-1 ring-slate-200/80 shadow-xs"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{req.employeeName}</div>
                              <div className="text-[10px] text-slate-500 font-medium">{req.department}</div>
                            </div>
                          </div>
                        </td>

                        {/* Leave Type */}
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {req.leaveType}
                        </td>

                        {/* Validity Dates */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                          {formatDate(req.startDate)} &rarr; {formatDate(req.endDate)}
                        </td>

                        {/* Duration */}
                        <td className="py-3.5 px-4 text-center font-mono font-black text-slate-900 tabular-nums">
                          {req.totalDays}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <LeaveStatusBadge status={req.status} />
                        </td>

                        {/* Remarks */}
                        <td className="py-3.5 px-6 text-slate-600 max-w-xs truncate font-medium">
                          <span>{req.remarks}</span>
                          {req.attachmentFileName && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-teal-800 font-mono ml-2 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200/60 font-bold">
                              <Paperclip className="w-2.5 h-2.5" />
                              Doc
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Stepper Preview */}
                            <button
                              onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Toggle Stepper Flow"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {/* Admin Quick Actions */}
                            {isAdmin && isPending && (
                              <>
                                <button
                                  onClick={() => setReviewModalData({ request: req, action: 'Approve' })}
                                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer active:scale-95"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => setReviewModalData({ request: req, action: 'Reject' })}
                                  className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer active:scale-95"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Section 10 Stepper Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-4 bg-slate-50/80 border-y border-slate-200/80 backdrop-blur-xs">
                            <LeaveApprovalStepper
                              status={req.status}
                              appliedDate={req.appliedDate}
                              reviewedDate={req.reviewedDate}
                              reviewedBy={req.reviewedBy}
                              reviewRemarks={req.reviewRemarks}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        employee={currentEmployee}
      />

      {/* Review Modal (Admin) */}
      {reviewModalData && (
        <LeaveReviewModal
          isOpen={true}
          onClose={() => setReviewModalData(null)}
          leaveRequest={reviewModalData.request}
          actionType={reviewModalData.action}
        />
      )}
    </div>
  );
};
