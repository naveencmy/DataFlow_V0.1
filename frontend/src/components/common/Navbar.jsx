import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { useConfig } from '../../context/ConfigContext.jsx';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  BarChart3,
  Bell,
  LogOut,
  User,
  Sliders,
  ChevronDown,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const Navbar = ({ activeTab, onNavigate, onToggleNotifications }) => {
  const { currentUser, role, logout, switchPersona, users } = useAuth();
  const { employees, getTodayAttendance } = useHRMS();
  const { unreadCount } = useNotifications();
  const { flags } = useConfig();

  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find linked employee profile
  const currentEmployee = currentUser?.employeeId
    ? employees.find((e) => e.id === currentUser.employeeId)
    : employees[0];

  const todayAtt = currentEmployee ? getTodayAttendance(currentEmployee.id) : null;
  const isCheckedIn = !!todayAtt?.checkInTime;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
        setIsPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'employees', label: 'Employees', icon: Users, adminOnly: false },
    { id: 'attendance', label: 'Attendance', icon: Clock, adminOnly: false },
    { id: 'timeoff', label: 'Time Off', icon: Calendar, adminOnly: false },
    {
      id: 'payroll',
      label: 'Salary & Payroll',
      icon: DollarSign,
      adminOnly: !flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE,
    },
    { id: 'reports', label: 'Reports', icon: BarChart3, adminOnly: true },
    { id: 'settings', label: 'Config / Specs', icon: Sliders, adminOnly: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('employees')}
              className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center text-white shadow-md shadow-slate-900/20 group-hover:scale-105 group-hover:shadow-teal-900/30 transition-all border border-white/10">
                <div className="relative">
                  <div className="w-4 h-4 rounded-sm border-2 border-teal-400 rotate-45" />
                  <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full shadow-xs" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  Dayflow
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-700 border border-teal-500/20">
                    HRMS
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium block leading-tight">
                  Every workday, perfectly aligned.
                </span>
              </div>
            </button>

            {/* Main Baseline Navigation per Section 5 */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1 rounded-xl border border-slate-200/50 backdrop-blur-sm">
              {navItems.map((item) => {
                if (item.adminOnly && role !== 'ADMIN') return null;
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Live Today Status Dot */}
            {role === 'EMPLOYEE' && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-xs text-xs backdrop-blur-sm">
                <span className="text-slate-500 font-medium">Today's Status:</span>
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  {isCheckedIn ? '🟢 Present' : '🟡 Not Checked In'}
                </span>
              </div>
            )}

            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-xl text-slate-600 bg-white/70 hover:bg-white border border-slate-200/70 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar & Dropdown per Section 5 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200/70 hover:border-slate-300 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={
                      role === 'ADMIN'
                        ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces'
                        : currentEmployee?.profilePicture ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
                    }
                    alt="User profile"
                    className="w-8 h-8 rounded-lg object-cover border border-teal-500/30 ring-1 ring-slate-200"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                      role === 'ADMIN'
                        ? 'bg-purple-500'
                        : isCheckedIn
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {role === 'ADMIN' ? 'Sarah Williams' : currentEmployee?.name || 'Employee'}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 tracking-tight">
                    {currentUser?.loginId}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu per Section 5 */}
              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-900 text-white shadow-xs">
                        {role === 'ADMIN' ? 'HR Administrator' : 'Employee Portal'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {currentUser?.loginId}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {role === 'ADMIN' ? 'Sarah Williams' : currentEmployee?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                  </div>

                  <div className="py-1">
                    {/* Section 5 baseline: My Profile */}
                    <button
                      onClick={() => {
                        setIsAvatarOpen(false);
                        if (currentEmployee) {
                          onNavigate('profile', currentEmployee.id);
                        } else {
                          onNavigate('profile', 'emp-1');
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer font-semibold"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>

                    {/* Quick Persona Switcher for effortless demo evaluation */}
                    <div className="px-4 py-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-teal-600" />
                          Demo Persona Switcher
                        </span>
                        <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          Switch
                        </span>
                      </div>
                      <div className="space-y-1">
                        {users.map((u) => {
                          const isSelected = u.id === currentUser?.id;
                          return (
                            <button
                              key={u.id}
                              onClick={() => {
                                switchPersona(u.id);
                                setIsAvatarOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200 shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <span className="truncate">
                                {u.role === 'ADMIN' ? '👑 Admin (Sarah)' : `👤 ${u.loginId}`}
                              </span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 5 baseline: Log Out */}
                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setIsAvatarOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden border-t border-slate-200 bg-white/90 backdrop-blur px-4 py-2 overflow-x-auto flex items-center gap-2">
        {navItems.map((item) => {
          if (item.adminOnly && role !== 'ADMIN') return null;
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
