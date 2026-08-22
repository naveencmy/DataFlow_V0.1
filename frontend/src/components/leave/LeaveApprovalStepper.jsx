import React from 'react';
import { CheckCircle2, Clock, XCircle, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const LeaveApprovalStepper = ({ status, appliedDate, reviewedDate, reviewedBy, reviewRemarks }) => {
  const isPending = status === 'Pending';
  const isApproved = status === 'Approved';
  const isRejected = status === 'Rejected';

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4.5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span>Approval Flow Stepper (Aligned Timeline Motif)</span>
        </span>
        <span className="text-xs font-mono font-bold text-slate-700">
          Status: <strong className={isApproved ? 'text-emerald-700' : isRejected ? 'text-rose-700' : 'text-amber-700'}>{status}</strong>
        </span>
      </div>

      {/* Stepper Rail */}
      <div className="relative flex items-center justify-between gap-2 pt-2 pb-2">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-slate-200/80 -translate-y-1/2 z-0" />

        {/* Step 1: Applied */}
        <div className="relative z-10 flex flex-col items-center bg-white/90 px-3 rounded-xl">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 mt-1">1. Applied</span>
          <span className="text-[10px] text-slate-400 font-mono font-medium">{appliedDate || 'Submitted'}</span>
        </div>

        {/* Step 2: HR Review */}
        <div className="relative z-10 flex flex-col items-center bg-white/90 px-3 rounded-xl">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${
              isPending
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-600 text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 mt-1">2. HR Review</span>
          <span className="text-[10px] text-slate-400 font-mono font-medium">
            {isPending ? 'In Review Queue' : 'Reviewed'}
          </span>
        </div>

        {/* Step 3: Decision */}
        <div className="relative z-10 flex flex-col items-center bg-white/90 px-3 rounded-xl">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${
              isApproved
                ? 'bg-emerald-600 text-white'
                : isRejected
                ? 'bg-rose-600 text-white'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : isRejected ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
          </div>
          <span
            className={`text-[11px] font-bold mt-1 ${
              isApproved ? 'text-emerald-700' : isRejected ? 'text-rose-700' : 'text-slate-500'
            }`}
          >
            3. {status}
          </span>
          <span className="text-[10px] text-slate-400 font-mono font-medium">
            {reviewedDate || 'Awaiting decision'}
          </span>
        </div>
      </div>

      {/* Review Remarks Note */}
      {reviewRemarks && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 font-medium">
          <span className="font-bold text-slate-900">
            Reviewer Remarks ({reviewedBy || 'Admin'}):
          </span>{' '}
          <span className="italic text-slate-700">"{reviewRemarks}"</span>
        </div>
      )}
    </div>
  );
};
