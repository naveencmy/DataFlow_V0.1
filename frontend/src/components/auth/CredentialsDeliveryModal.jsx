import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Check, Copy, KeyRound, UserCheck, Shield, Sparkles } from 'lucide-react';

export const CredentialsDeliveryModal = ({ isOpen, onClose, credentials }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  if (!credentials) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="System-Generated Employee Credentials"
      subtitle="Section 4 Spec Delivery: Generated credentials for initial login"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex items-start gap-3 backdrop-blur-sm shadow-xs">
          <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-950 leading-relaxed">
            <span className="font-bold">Account Created Successfully!</span>
            <p className="mt-0.5 text-teal-800">
              Deliver these credentials to <strong>{credentials.name}</strong> ({credentials.email}). The employee will be prompted to change their password upon first login via the Security tab.
            </p>
          </div>
        </div>

        {/* Credentials Cards */}
        <div className="space-y-3">
          {/* Generated Login ID */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                Generated Login ID (Prefix+Initials+Year+Serial)
              </span>
              <button
                onClick={() => copyToClipboard(credentials.loginId, 'id')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200/60 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-slate-900 tracking-wider select-all bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
              {credentials.loginId}
            </div>
          </div>

          {/* Generated Initial Password */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                Initial Temporary Password
              </span>
              <button
                onClick={() => copyToClipboard(credentials.initialPassword, 'pass')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200/60 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {copiedPass ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-slate-900 tracking-wider select-all bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
              {credentials.initialPassword}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl btn-primary text-xs font-bold shadow-md cursor-pointer"
          >
            Done & Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
