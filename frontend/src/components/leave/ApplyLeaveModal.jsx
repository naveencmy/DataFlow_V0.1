import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { getTodayDateString } from '../../utils/formatters.js';
import { Calendar, FileText, Paperclip, AlertCircle, Info, Sparkles } from 'lucide-react';

export const ApplyLeaveModal = ({ isOpen, onClose, employee }) => {
  const { applyLeave } = useHRMS();
  const todayStr = getTodayDateString();

  const [leaveType, setLeaveType] = useState('Paid Time Off');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [remarks, setRemarks] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  // Auto-calculate day count
  const calculateDays = () => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (e < s) return 0;
      const diffTime = Math.abs(e.getTime() - s.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } catch {
      return 1;
    }
  };

  const totalDays = calculateDays();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalDays <= 0) {
      alert('End date cannot be earlier than start date.');
      return;
    }

    applyLeave(
      employee.id,
      leaveType,
      startDate,
      endDate,
      remarks || 'No remarks provided',
      attachmentName || undefined
    );

    onClose();
    // Reset form
    setRemarks('');
    setAttachmentName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave / Time Off"
      subtitle={`Employee: ${employee?.name || 'Self'} (${employee?.department})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Info Header */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between text-xs backdrop-blur-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Applicant</span>
            <span className="font-black text-slate-900">{employee?.name}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Login ID</span>
            <span className="font-mono font-bold text-slate-700">{employee?.loginId}</span>
          </div>
        </div>

        {/* 1. Leave Type (Exactly 3 types per Section 10) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Leave Type (Section 10 Spec) *
          </label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200/80 rounded-xl text-xs font-bold bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all cursor-pointer"
          >
            <option value="Paid Leave">Paid Leave (PTO) - Payable</option>
            <option value="Sick Leave">Sick Leave - Payable</option>
            <option value="Unpaid Leave">Unpaid Leave (LWP) - Payroll Deducted</option>
          </select>
          {leaveType === 'Unpaid Leave' && (
            <p className="text-[11px] text-amber-800 mt-1.5 flex items-center gap-1 font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Unpaid Leave reduces monthly payable days in salary calculation.</span>
            </p>
          )}
        </div>

        {/* 2. Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">End Date *</label>
            <input
              type="date"
              required
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* 3. Duration Summary */}
        <div className="p-3.5 bg-teal-50/80 border border-teal-200/80 rounded-2xl flex items-center justify-between text-xs text-teal-950 font-medium backdrop-blur-xs shadow-xs">
          <span className="font-bold text-teal-900">Requested Duration:</span>
          <span className="font-mono font-black text-sm text-teal-950">
            {totalDays} working day{totalDays > 1 ? 's' : ''}
          </span>
        </div>

        {/* 4. Remarks */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Remarks / Reason for Leave *
          </label>
          <textarea
            rows={3}
            required
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Please detail reason for time off, hand-over arrangements, etc."
            className="w-full p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
          />
        </div>

        {/* 5. Attachment simulation */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Attachment (Optional Doctor Note, Conference Pass, etc.)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '')}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
          </div>
          {attachmentName && (
            <p className="text-[11px] font-mono text-teal-800 mt-1 flex items-center gap-1 font-bold">
              <Paperclip className="w-3 h-3 text-teal-600" />
              <span>Attached: {attachmentName}</span>
            </p>
          )}
        </div>

        {/* Footer */}
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
            className="px-5 py-2.5 rounded-xl btn-primary text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Submit Leave Request (Pending)
          </button>
        </div>
      </form>
    </Modal>
  );
};
