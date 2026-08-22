import React from 'react';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { Bell, CheckCheck, Trash2, X, Calendar, Clock, DollarSign, UserCheck, Shield } from 'lucide-react';

export const NotificationsDrawer = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } =
    useNotifications();

  if (!isOpen) return null;

  const iconForType = (type) => {
    switch (type) {
      case 'leave':
        return <Calendar className="w-4 h-4 text-sky-500" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-emerald-500" />;
      case 'payroll':
        return <DollarSign className="w-4 h-4 text-teal-500" />;
      case 'account':
        return <UserCheck className="w-4 h-4 text-purple-500" />;
      default:
        return <Shield className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-slate-200/80 animate-fade-in">
          {/* Header */}
          <div className="p-4.5 border-b border-slate-100/80 flex items-center justify-between bg-slate-50/70 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-700 border border-teal-500/20 shadow-xs">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Notifications</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-2 py-1 text-xs text-teal-700 hover:bg-teal-50 rounded-lg flex items-center gap-1 font-bold transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-1 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-200/60">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No Notifications</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  You're all caught up with employee workflows and system updates.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-4 transition-all cursor-pointer flex gap-3.5 items-start ${
                    !n.read ? 'bg-teal-50/40 hover:bg-teal-50/60' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs shrink-0">
                    {iconForType(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'} truncate`}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 shadow-xs shadow-teal-500/50 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">
                      {n.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
