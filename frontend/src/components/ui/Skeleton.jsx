import React from 'react';

export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-pulse bg-slate-200/80 rounded-xl';
  const variantClass =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'text'
      ? 'h-4 rounded-md'
      : 'rounded-2xl';

  return <div className={`${base} ${variantClass} ${className}`} aria-hidden="true" />;
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md w-1/2" />
      </div>
    </div>
    <div className="h-16 bg-slate-100/80 rounded-xl" />
    <div className="flex justify-between items-center pt-2">
      <div className="h-6 bg-slate-200 rounded-full w-24" />
      <div className="h-8 bg-slate-200 rounded-xl w-20" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden animate-pulse">
    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded-md flex-1" />
      ))}
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-5 bg-slate-100 rounded-md flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
