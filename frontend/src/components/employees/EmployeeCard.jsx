import React from 'react';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { deriveEmployeeWorkStatus } from '../../utils/statusDerivation.js';
import { getTodayDateString } from '../../utils/formatters.js';
import { MapPin, Mail, ArrowUpRight, Building2 } from 'lucide-react';

export const EmployeeCard = ({ employee, onSelect }) => {
  const { attendance, leaves } = useHRMS();
  const todayStr = getTodayDateString();

  // Dynamically derive fixed 3-state status
  const derived = deriveEmployeeWorkStatus(employee.id, todayStr, attendance, leaves);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Present
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            On Leave
          </span>
        );
      case 'ABSENT':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Absent
          </span>
        );
    }
  };

  const getDepartmentBadge = (dept) => {
    switch (dept) {
      case 'Engineering':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'Product':
        return 'bg-sky-50 text-sky-700 border-sky-200/60';
      case 'Design':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'Human Resources':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      case 'Management':
        return 'bg-teal-50 text-teal-700 border-teal-200/60';
      case 'Operations':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      onClick={() => onSelect(employee.id)}
      className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-teal-300 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
    >
      <div>
        {/* Card Header: Department tag & ID */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getDepartmentBadge(employee.department)}`}>
            <Building2 className="w-3 h-3 opacity-60" />
            {employee.department}
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
            {employee.loginId}
          </span>
        </div>

        {/* User Info */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={employee.profilePicture}
              alt={employee.name}
              className="w-13 h-13 rounded-2xl object-cover bg-slate-100 ring-2 ring-slate-100 group-hover:ring-teal-300 transition-all shadow-2xs"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                derived.status === 'PRESENT'
                  ? 'bg-emerald-500'
                  : derived.status === 'ON_LEAVE'
                  ? 'bg-sky-500'
                  : 'bg-amber-400'
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-teal-900 transition-colors">
              {employee.name}
            </h3>
            <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
              {employee.jobPosition}
            </p>
            <div className="mt-2">
              {getStatusBadge(derived.status)}
            </div>
          </div>
        </div>

        {/* Bio Snippet if exists */}
        {employee.about && (
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-3.5 leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            "{employee.about}"
          </p>
        )}
      </div>

      {/* Card Footer: Location & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-400 font-medium truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="truncate">{employee.location ? employee.location.split(',')[0] : 'Bangalore'}</span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => window.open(`mailto:${employee.email}`, '_blank')}
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-400 hover:text-teal-700 border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer"
            title="Send Email"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelect(employee.id)}
            className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white font-bold text-xs flex items-center gap-1 border border-teal-200/80 transition-all cursor-pointer shadow-2xs"
          >
            <span>View</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

