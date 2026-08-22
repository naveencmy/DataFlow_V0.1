import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLeavesQuery, useApplyLeaveMutation, useReviewLeaveMutation, useCancelLeaveMutation } from '../hooks/useLeavesQuery.js';
import { useAuthStore } from '../stores/authStore.js';
import { LeaveApplySchema } from '../validation/leave.schema.js';
import { Calendar, Plus, CheckCircle2, XCircle, Clock, Search, X } from 'lucide-react';
import { TableSkeleton } from '../components/ui/Skeleton.jsx';

export const LeavePage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const [statusFilter, setStatusFilter] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);

  const { data: leaves, isLoading } = useLeavesQuery(statusFilter !== 'All' ? { status: statusFilter } : {});
  const applyMutation = useApplyLeaveMutation();
  const reviewMutation = useReviewLeaveMutation();
  const cancelMutation = useCancelLeaveMutation();

  // Apply Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(LeaveApplySchema),
    defaultValues: {
      leaveType: 'Paid Time Off',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      remarks: '',
    },
  });

  const onApply = async (formData) => {
    await applyMutation.mutateAsync(formData);
    reset();
    setShowApplyModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-teal-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>Time Off & Leave Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans">Leave Balance & Requests</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
            Submit time-off requests, track approval workflows, and audit leave quotas.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="py-3 px-5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing {(leaves || []).length} Request{(leaves || []).length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Leaves Master Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Dates</th>
                  <th className="py-4 px-6">Days</th>
                  <th className="py-4 px-6">Reason</th>
                  <th className="py-4 px-6">Status</th>
                  {isAdmin && <th className="py-4 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(leaves || []).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.employeeAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces'}
                          alt={row.employeeName}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{row.employeeName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{row.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-800">
                        {row.leaveType}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      {typeof row.startDate === 'string' ? row.startDate.slice(0, 10) : new Date(row.startDate).toISOString().slice(0, 10)} →{' '}
                      {typeof row.endDate === 'string' ? row.endDate.slice(0, 10) : new Date(row.endDate).toISOString().slice(0, 10)}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">{row.totalDays} Day{row.totalDays > 1 ? 's' : ''}</td>
                    <td className="py-4 px-6 text-slate-600 max-w-xs truncate">{row.remarks}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          row.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : row.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-4 px-6 text-right">
                        {row.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => reviewMutation.mutate({ id: row.id, status: 'Approved', reviewRemarks: 'Approved by Admin' })}
                              disabled={reviewMutation.isPending}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => reviewMutation.mutate({ id: row.id, status: 'Rejected', reviewRemarks: 'Rejected by Admin' })}
                              disabled={reviewMutation.isPending}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Reviewed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Apply for Leave</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onApply)} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Leave Category</label>
                <select
                  {...register('leaveType')}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="Paid Time Off">Paid Time Off (PTO)</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
                {errors.leaveType && <p className="text-xs text-rose-600">{errors.leaveType.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Start Date</label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                  {errors.startDate && <p className="text-xs text-rose-600">{errors.startDate.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">End Date</label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                  {errors.endDate && <p className="text-xs text-rose-600">{errors.endDate.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Reason / Notes</label>
                <textarea
                  {...register('remarks')}
                  rows={3}
                  placeholder="Describe the reason for time off..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
                />
                {errors.remarks && <p className="text-xs text-rose-600">{errors.remarks.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;
