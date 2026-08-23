import React, { useState, useEffect } from 'react';
import { getApiBaseUrl, setApiBaseUrl } from '../../api/axiosClient.js';
import { Server, CheckCircle2, AlertTriangle, RefreshCw, X, Radio } from 'lucide-react';

export const ServerConfigModal = ({ isOpen, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null); // { ok: boolean, message: string }
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentUrl(getApiBaseUrl());
      setStatus(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setStatus(null);
    try {
      if (window.desktopAPI?.checkServerConnection) {
        const res = await window.desktopAPI.checkServerConnection(currentUrl);
        if (res.ok) {
          setStatus({ ok: true, message: 'Connected successfully to DayFlow Server!' });
        } else {
          setStatus({ ok: false, message: `Cannot connect: ${res.error || 'Server returned status ' + res.status}` });
        }
      } else {
        // Web fallback ping
        const res = await fetch(`${currentUrl.replace(/\/+$/, '')}/health`, { method: 'GET' });
        if (res.ok) {
          setStatus({ ok: true, message: 'Connected successfully to DayFlow Server!' });
        } else {
          setStatus({ ok: false, message: `Server responded with status: ${res.status}` });
        }
      }
    } catch (err) {
      setStatus({ ok: false, message: `Connection failed: ${err.message || 'Make sure the backend is running.'}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setApiBaseUrl(currentUrl);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleResetDefault = () => {
    const defaultUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
    setCurrentUrl(defaultUrl);
    setApiBaseUrl(null);
    setStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden transition-all transform animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100/80">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Server Connection Settings</h3>
              <p className="text-xs text-slate-500">Configure DayFlow HRMS API backend address</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Backend API Server URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="http://localhost:5000/api"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Default local address: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">http://localhost:5000/api</code>
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Quick presets:</span>
            <button
              type="button"
              onClick={() => setCurrentUrl('http://localhost:5000/api')}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              Localhost (5000)
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              Reset Default
            </button>
          </div>

          {/* Connection Test Result */}
          {status && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-3 border ${
                status.ok
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {status.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{status.message}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl text-xs bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Settings saved! Refreshing connection...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || !currentUrl}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!currentUrl}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerConfigModal;
