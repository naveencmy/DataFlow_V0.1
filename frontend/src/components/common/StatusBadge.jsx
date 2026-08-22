import React from 'react';

export const WorkStatusBadge = ({ status, detailText, size = 'md' }) => {
  const configs = {
    PRESENT: {
      label: 'Present',
      dotColor: 'bg-emerald-500',
      bgClass: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/25',
    },
    ON_LEAVE: {
      label: 'On Leave',
      dotColor: 'bg-sky-500',
      bgClass: 'bg-sky-500/10 text-sky-800 border-sky-500/25',
    },
    ABSENT: {
      label: 'Absent',
      dotColor: 'bg-amber-500',
      bgClass: 'bg-amber-500/10 text-amber-800 border-amber-500/25',
    },
  };

  const config = configs[status] || configs.ABSENT;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bgClass} ${sizeClasses[size]} transition-all select-none backdrop-blur-xs shadow-2xs font-medium`}
      title={detailText || config.label}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
      <span className="tracking-tight">{config.label}</span>
    </span>
  );
};

export const AttendanceStatusBadge = ({ status }) => {
  const styles = {
    Present: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/25',
    Absent: 'bg-amber-500/10 text-amber-800 border-amber-500/25',
    'Half-day': 'bg-purple-500/10 text-purple-800 border-purple-500/25',
    Leave: 'bg-sky-500/10 text-sky-800 border-sky-500/25',
  };

  const dots = {
    Present: 'bg-emerald-500',
    Absent: 'bg-amber-500',
    'Half-day': 'bg-purple-500',
    Leave: 'bg-sky-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-xs ${
        styles[status] || styles.Absent
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      <span>{status}</span>
    </span>
  );
};

export const LeaveStatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-500/10 text-amber-800 border-amber-500/30',
    Approved: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30',
    Rejected: 'bg-rose-500/10 text-rose-800 border-rose-500/30',
  };

  const dots = {
    Pending: 'bg-amber-500',
    Approved: 'bg-emerald-500',
    Rejected: 'bg-rose-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-xs ${
        styles[status] || styles.Pending
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      <span>{status}</span>
    </span>
  );
};
