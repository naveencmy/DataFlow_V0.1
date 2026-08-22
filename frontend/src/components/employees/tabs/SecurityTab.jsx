import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useNotifications } from '../../../context/NotificationContext.jsx';
import { KeyRound, ShieldCheck, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const SecurityTab = ({ employee }) => {
  const { currentUser, changePassword } = useAuth();
  const { showToast } = useNotifications();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSuccess(false);

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      setIsSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('success', 'Password Updated', 'Your security credentials have been updated.');
    } else {
      setErrorMsg(result.error || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* First login notice if applicable */}
      {currentUser?.isFirstLogin && (
        <div className="p-4 bg-teal-50/80 border border-teal-200/80 rounded-2xl text-xs text-teal-950 flex items-start gap-3 backdrop-blur-sm shadow-xs">
          <KeyRound className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sm font-black">First Login Password Update Recommended</strong>
            <p className="mt-0.5 text-teal-800 leading-relaxed font-medium">
              You are currently using the system-generated initial credentials. Please set a personalized password to secure your account.
            </p>
          </div>
        </div>
      )}

      {/* Change Password Card */}
      <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-7 shadow-subtle">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-700">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-black text-slate-900 tracking-tight">Change Account Password</h4>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-50/90 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Password updated successfully! Next sign in will use your new password.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Current Password
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              New Password
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-bold cursor-pointer"
            >
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPass ? 'Hide' : 'Show'} passwords</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 btn-primary text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Security Sessions Info */}
      <div className="p-4.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-600 backdrop-blur-xs">
        <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Active Login Session Security</span>
        </h5>
        <p className="leading-relaxed text-slate-500 font-medium">
          Account Login ID: <strong className="font-mono text-slate-800">{employee.loginId}</strong> &bull;
          Session authenticated via Dayflow Unified Identity Engine.
        </p>
      </div>
    </div>
  );
};
