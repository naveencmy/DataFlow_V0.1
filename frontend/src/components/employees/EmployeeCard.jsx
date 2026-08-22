import React from 'react';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { deriveEmployeeWorkStatus } from '../../utils/statusDerivation.js';
import { getTodayDateString } from '../../utils/formatters.js';
import { MapPin, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';

export const EmployeeCard = ({ employee, onSelect }) => {
  const { attendance, leaves } = useHRMS();
  const todayStr = getTodayDateString();

  // Dynamically derive fixed 3-state status per Section 7
  const derived = deriveEmployeeWorkStatus(employee.id, todayStr, attendance, leaves);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100/90 text-emerald-700">
            Present
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100/90 text-blue-700">
            On Leave
          </span>
        );
      case 'ABSENT':
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100/90 text-amber-800">
            Absent
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(employee.id)}
      className="group bg-white rounded-3xl p-5 border border-slate-200/60 shadow-2xs hover:shadow-md hover:border-slate-300/80 transition-all cursor-pointer flex flex-col justify-between"
    >
      {/* Top Details: Avatar on left, Name/Position/Status on right (Matching Image 2) */}
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img
            src={employee.profilePicture}
            alt={employee.name}
            className="w-13 h-13 rounded-2xl object-cover bg-slate-100 ring-2 ring-slate-100/80"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
            {employee.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {employee.jobPosition}
          </p>
          <div className="mt-1.5">
            {getStatusBadge(derived.status)}
          </div>
        </div>
      </div>

      {/* Bottom Row: Location on left, Quick Actions on right (Matching Image 2) */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{employee.location || 'Bangalore Tech Hub'}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => window.open(`mailto:${employee.email}`, '_blank')}
            className="w-7 h-7 rounded-full bg-slate-50 hover:bg-teal-50 text-slate-400 hover:text-teal-700 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            title="Chat / Email"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => alert(`Calling ${employee.name} (${employee.phone})...`)}
            className="w-7 h-7 rounded-full bg-slate-50 hover:bg-teal-50 text-slate-400 hover:text-teal-700 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            title="Call Phone"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
