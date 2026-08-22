import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { formatDate } from '../../utils/formatters.js';
import { CheckCircle2, XCircle, User, Calendar, FileText, Paperclip, Shield } from 'lucide-react';

export const LeaveReviewModal = ({ isOpen, onClose, leaveRequest, actionType = 'Approve' }) => {
  const { reviewLeave } = useHRMS();
  const [remarks, setRemarks] = useState('');

  if (!leaveRequest) return null;

  const isApprove = actionType === 'Approve';

  const handleSubmit = (e) => {
    e.preventDefault();
    reviewLeave(
      leaveRequest.id,
      isApprove ? 'Approved' : 'Rejected',
      remarks || (isApprove ? 'Approved as requested.' : 'Rejected.')
    );
    onClose();
    setRemarks('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${actionType} Leave Request`}
      subtitle={`Applicant: ${leaveRequest.employeeName} (${leaveRequest.department})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Request Summary Card */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 text-xs space-y-2.5 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{leaveRequest.leaveType}</span>
            <span className="font-mono font-black text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/60">
              {leaveRequest.totalDays} Day{leaveRequest.totalDays > 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-slate-600 font-mono font-medium">
            Period: {formatDate(leaveRequest.startDate)} &rarr; {formatDate(leaveRequest.endDate)}
          </div>
          <div className="pt-2 border-t border-slate-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Reason</span>
            <p className="text-slate-700 italic mt-0.5 font-medium">"{leaveRequest.remarks}"</p>
          </div>
          {leaveRequest.attachmentFileName && (
            <div className="flex items-center gap-1.5 text-teal-800 font-mono pt-1 font-bold">
              <Paperclip className="w-3.5 h-3.5 text-teal-600" />
              <span>{leaveRequest.attachmentFileName}</span>
            </div>
          )}
        </div>

        {/* Reviewer Comment Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Reviewer Remarks / Decision Reason *
          </label>
          <textarea
            rows={3}
            required
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={
              isApprove
                ? 'e.g. Approved. Please ensure hand-over with the team.'
                : 'e.g. Please reschedule due to ongoing project release.'
            }
            className="w-full p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
          />
        </div>

        {/* Action Warning Note */}
        {isApprove && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 leading-relaxed backdrop-blur-xs shadow-xs">
            <strong>Cross-Module Sync:</strong> Approving this request will automatically update {leaveRequest.employeeName}'s attendance log on these dates to <strong>Leave (✈️)</strong> and adjust payable days in Payroll.
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isApprove
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
                : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600'
            }`}
          >
            {isApprove ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>Confirm {actionType}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
