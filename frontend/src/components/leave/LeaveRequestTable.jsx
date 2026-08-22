import React, { useState, useMemo } from 'react';
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
  Sparkles,
  CalendarDays,
  FileCheck2,
  FileX2,
  Check,
  Building2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const LeaveRequestTable = ({ currentEmployeeId, filterToEmployee = false }) => {
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
  // Admin sees all leaves (unless specifically filtered); Employee sees own leaves
  const baseLeaves = filterToEmployee
    ? leaves.filter((l) => l.employeeId === currentEmployee?.id)
    : (isAdmin ? leaves : leaves.filter((l) => l.employeeId === currentEmployee?.id));

  // Compute live leave statistics
  const leaveStats = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let totalDays = 0;

    baseLeaves.forEach((l) => {
      if (l.status === 'Pending') pending += 1;
      else if (l.status === 'Approved') approved += 1;
      else if (l.status === 'Rejected') rejected += 1;
      totalDays += (l.totalDays || 1);
    });

    return {
      total: baseLeaves.length,
      pending,
      approved,
      rejected,
      totalDays,
    };
  }, [baseLeaves]);

  // Apply filters
  const filteredLeaves = useMemo(() => {
    return baseLeaves.filter((l) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
      const matchesType =
        typeFilter === 'All' ||
        l.leaveType === typeFilter ||
        (typeFilter === 'Paid Leave' && (l.leaveType === 'Paid Time Off' || l.leaveType === 'Paid Leave')) ||
        (typeFilter === 'Paid Time Off' && (l.leaveType === 'Paid Time Off' || l.leaveType === 'Paid Leave'));

      const matchesSearch =
        !q ||
        l.employeeName?.toLowerCase().includes(q) ||
        l.department?.toLowerCase().includes(q) ||
        l.remarks?.toLowerCase().includes(q) ||
        l.leaveType?.toLowerCase().includes(q);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [baseLeaves, statusFilter, typeFilter, searchQuery]);

  const getLeaveTypeBadge = (type) => {
    if (type === 'Paid Time Off' || type === 'Paid Leave') {
      return 'bg-teal-50 text-teal-800 border-teal-200/80';
    }
    if (type === 'Sick Leave') {
      return 'bg-sky-50 text-sky-800 border-sky-200/80';
    }
    if (type === 'Unpaid Leave') {
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        );
      case 'Rejected':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Optimistic Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-7 sm:p-8 shadow-md">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-200 mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>{isAdmin ? 'Time Off & Authorizations' : 'Personal Time Off Portal'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              {isAdmin ? 'Time Off Review & Approval Queue' : 'My Leave Applications'}
            </h2>
            <p className="text-sm text-teal-100/80 font-medium mt-1 max-w-xl">
              {isAdmin
                ? 'Review team leave schedules, authorize time off, and synchronize absences with live payroll.'
                : 'Track your pending requests, view balance quotas, and submit new leave applications.'}
            </p>

            {/* Quick Metrics Bar inside Hero */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-semibold">
                <span className="text-teal-300">📋 Total Requests:</span>
                <span className="font-mono font-bold text-white text-sm">{leaveStats.total}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-semibold">
                <span className="text-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300 animate-pulse" />
                  Pending Review:
                </span>
                <span className="font-mono font-bold text-amber-200 text-sm">{leaveStats.pending}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-semibold">
                <span className="text-emerald-300">🟢 Approved:</span>
                <span className="font-mono font-bold text-white text-sm">{leaveStats.approved}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-semibold">
                <span className="text-teal-200">🗓️ Days Logged:</span>
                <span className="font-mono font-bold text-white text-sm">{leaveStats.totalDays}</span>
              </div>
            </div>
          </div>

          {/* Action: Apply for Leave Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-teal-950 font-extrabold text-sm shadow-lg hover:shadow-teal-500/25 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-teal-950 stroke-[2.5]" />
              <span>+ Apply for Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Leave Balances Overview Cards */}
      <LeaveBalanceCards leaves={leaves} employeeId={currentEmployee?.id} />

      {/* 3. Search & Category Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Search Field */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAdmin ? 'Search by employee, department or reason...' : 'Search my leave requests...'}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white focus:outline-none transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <div className="text-xs font-semibold text-slate-500 hidden xl:block">
            Showing <span className="font-bold text-slate-900">{filteredLeaves.length}</span> of {baseLeaves.length}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-700 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">🟡 Pending Review</option>
              <option value="Approved">🟢 Approved</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>

          {/* Leave Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="All">All Leave Types</option>
            <option value="Paid Leave">Paid Leave (PTO)</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
        </div>
      </div>

      {/* 4. Master Leave Approval & History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4">Employee</th>
                <th scope="col" className="px-6 py-4">Leave Category</th>
                <th scope="col" className="px-6 py-4">Schedule / Dates</th>
                <th scope="col" className="px-6 py-4 text-center">Days</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Reason / Notes</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400 font-medium">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 border border-teal-100">
                      <CalendarDays className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">No Leave Requests Found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      No records match the active filters or search terms.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((req) => {
                  const isExpanded = expandedRequestId === req.id;
                  const isPending = req.status === 'Pending';

                  return (
                    <React.Fragment key={req.id}>
                      <tr
                        className={`hover:bg-teal-50/20 transition-colors ${
                          isExpanded ? 'bg-teal-50/40' : ''
                        }`}
                      >
                        {/* 1. Employee Info */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={req.employeeAvatar}
                              alt={req.employeeName}
                              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 shadow-2xs"
                            />
                            <div>
                              <div className="font-extrabold text-slate-900 text-sm">
                                {req.employeeName}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                <Building2 className="w-3 h-3 opacity-60" />
                                <span>{req.department}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Leave Category Pill */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border ${getLeaveTypeBadge(
                              req.leaveType
                            )}`}
                          >
                            {req.leaveType}
                          </span>
                        </td>

                        {/* 3. Date Range */}
                        <td className="px-6 py-4.5 whitespace-nowrap font-mono text-xs font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60 w-fit">
                            <span>{formatDate(req.startDate)}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span>{formatDate(req.endDate)}</span>
                          </div>
                        </td>

                        {/* 4. Total Days */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-center font-mono font-extrabold text-sm text-slate-900 tabular-nums">
                          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800">
                            {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                          </span>
                        </td>

                        {/* 5. Status Badge */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          {getStatusPill(req.status)}
                        </td>

                        {/* 6. Reason / Notes */}
                        <td className="px-6 py-4.5 text-slate-600 max-w-xs truncate font-medium text-xs">
                          <div className="flex items-center gap-2">
                            <span className="truncate" title={req.remarks}>{req.remarks}</span>
                            {req.attachmentFileName && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-teal-800 font-mono bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200/60 font-bold shrink-0">
                                <Paperclip className="w-2.5 h-2.5" />
                                Doc
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 7. Quick Actions */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Stepper Preview */}
                            <button
                              onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isExpanded
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                                  : 'bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-200/80 hover:bg-slate-100'
                              }`}
                              title="Toggle Approval Timeline"
                            >
                              <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Timeline'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {/* Admin Approve / Reject Actions */}
                            {isAdmin && isPending && (
                              <>
                                <button
                                  onClick={() => setReviewModalData({ request: req, action: 'Approve' })}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => setReviewModalData({ request: req, action: 'Reject' })}
                                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-rose-600/20 transition-all cursor-pointer active:scale-95"
                                >
                                  <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Section: Stepper Timeline & Review Remarks */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-6 bg-slate-50/90 border-y border-slate-200/80">
                            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                              <LeaveApprovalStepper
                                status={req.status}
                                appliedDate={req.appliedDate}
                                reviewedDate={req.reviewedDate}
                                reviewedBy={req.reviewedBy}
                                reviewRemarks={req.reviewRemarks}
                              />
                            </div>
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

