import React from 'react';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-500 shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-500/30 bg-emerald-50/85 text-emerald-950 shadow-emerald-500/10',
    error: 'border-rose-500/30 bg-rose-50/85 text-rose-950 shadow-rose-500/10',
    warning: 'border-amber-500/30 bg-amber-50/85 text-amber-950 shadow-amber-500/10',
    info: 'border-teal-500/30 bg-teal-50/85 text-teal-950 shadow-teal-500/10',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-xl flex items-start gap-3 transition-all transform animate-fade-in ${
            borderMap[toast.type] || borderMap.info
          }`}
        >
          {iconMap[toast.type]}
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold tracking-tight">{toast.title}</h5>
            {toast.message && (
              <p className="text-xs mt-0.5 text-slate-600 font-medium leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
