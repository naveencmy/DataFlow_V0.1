import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authApi from '../api/authApi.js';
import { useAuthStore } from '../stores/authStore.js';
import { useUIStore } from '../stores/uiStore.js';
import { ChangePasswordSchema } from '../validation/auth.schema.js';
import { Settings, Lock, Shield, Database, CheckCircle2, Server, Save } from 'lucide-react';

export const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const addToast = useUIStore((state) => state.addToast);
  const [serverMsg, setServerMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onChangePassword = async (data) => {
    setServerMsg('');
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      addToast({
        title: 'Password Updated',
        message: 'Your account security credentials have been updated.',
        type: 'success',
      });
      setServerMsg('Password successfully changed!');
      reset();
    } catch (err) {
      addToast({
        title: 'Update failed',
        message: err.message,
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-teal-300">
            <Settings className="w-3.5 h-3.5" />
            <span>Account & System Security</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans">System Settings</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
            Manage your account credentials, security configuration, and database connection parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Password Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
              <p className="text-xs text-slate-500">Update your account login password</p>
            </div>
          </div>

          {serverMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{serverMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Current Password</label>
              <input
                type="password"
                {...register('currentPassword')}
                placeholder="••••••••"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500/20"
              />
              {errors.currentPassword && <p className="text-xs text-rose-600">{errors.currentPassword.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">New Password (Min 8 chars, 1 uppercase, 1 number)</label>
              <input
                type="password"
                {...register('newPassword')}
                placeholder="••••••••"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500/20"
              />
              {errors.newPassword && <p className="text-xs text-rose-600">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Confirm New Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500/20"
              />
              {errors.confirmPassword && <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>

        {/* Database & System Infrastructure Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Database & Architecture</h3>
              <p className="text-xs text-slate-500">Live PostgreSQL backend details</p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-medium">
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500">Database Engine</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                PostgreSQL 18.3
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500">Host & Port</span>
              <span className="font-bold font-mono text-slate-900">localhost:5432</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500">Database Name</span>
              <span className="font-bold font-mono text-slate-900">dayflow_hrms</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500">State Management</span>
              <span className="font-bold text-slate-900">Zustand + TanStack Query v5</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500">Data Architecture</span>
              <span className="font-bold text-teal-700">100% Dynamic API Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
