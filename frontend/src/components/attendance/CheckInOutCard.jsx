import React, { useState, useEffect } from 'react';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatWorkHours, getTodayDateString } from '../../utils/formatters.js';
import { Clock, LogIn, LogOut, CheckCircle2, Sparkles, AlertCircle, Timer } from 'lucide-react';

export const CheckInOutCard = ({ employeeId }) => {
  const { currentUser } = useAuth();
  const { getTodayAttendance, checkIn, checkOut } = useHRMS();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState('');

  const todayStr = getTodayDateString();
  const todayRecord = getTodayAttendance(employeeId);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isCheckedIn = !!todayRecord?.checkInTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  const handleCheckIn = () => {
    checkIn(employeeId, notes);
    setNotes('');
  };

  const handleCheckOut = () => {
    checkOut(employeeId);
  };

  // Formatted digital time
  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="glass-panel-dark rounded-3xl p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -top-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Realtime Digital Workday Clock */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-teal-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Dayflow Real-Time Timecard
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white tabular-nums">
                {timeString}
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{dateString}</p>
          </div>

          {/* Center: Work Status Timeline Pill */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full lg:w-auto min-w-[280px]">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-bold">Today's Logged Shifts</span>
              <span className="font-mono text-teal-400 font-black">
                {todayRecord?.workHours ? `${todayRecord.workHours} hrs` : '0.0 hrs'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">In Time</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {todayRecord?.checkInTime || '--:--'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Out Time</span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {todayRecord?.checkOutTime || '--:--'}
                </span>
              </div>
            </div>

            {todayRecord?.extraHours > 0 && (
              <div className="mt-2.5 text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Extra overtime logged: +{todayRecord.extraHours} hrs</span>
              </div>
            )}
          </div>

          {/* Right: Check-In / Check-Out Action Button */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch gap-3">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="px-6 py-3.5 rounded-2xl btn-accent font-black text-xs shadow-lg shadow-teal-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Check In Now (Present)</span>
              </button>
            ) : !isCheckedOut ? (
              <button
                onClick={handleCheckOut}
                className="px-6 py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.98] border border-amber-400/30"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Check Out (Log Day's Hours)</span>
              </button>
            ) : (
              <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-black">Day Completed & Logged</div>
                  <span className="text-[11px] text-emerald-200/80 font-mono">
                    Total: {todayRecord.workHours} hrs
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
