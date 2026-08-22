import React from 'react';
import { useUIStore } from '../../stores/uiStore.js';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-emerald-950 text-emerald-50 border-emerald-700/60 shadow-emerald-950/30',
    error: 'bg-rose-950 text-rose-50 border-rose-700/60 shadow-rose-950/30',
    info: 'bg-slate-900 text-slate-50 border-slate-700/60 shadow-slate-950/30',
    warning: 'bg-amber-950 text-amber-50 border-amber-700/60 shadow-amber-950/30',
  };

  const iconColors = {
    success: 'text-emerald-400',
    error: 'text-rose-400',
    info: 'text-cyan-400',
    warning: 'text-amber-400',
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        const colorClass = colors[toast.type] || colors.info;
        const iconColor = iconColors[toast.type] || iconColors.info;

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up ${colorClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <div className="text-xs font-bold tracking-tight uppercase opacity-90">
                  {toast.title}
                </div>
              )}
              <div className="text-xs font-normal mt-0.5 leading-relaxed break-words">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 rounded-lg cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
