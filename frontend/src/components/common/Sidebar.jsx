import React from 'react';
import logo from '../../assets/logo.jpeg';
import { useAuth } from '../../context/AuthContext.jsx';
import { useConfig } from '../../context/ConfigContext.jsx';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const { role, logout } = useAuth();
  const { flags } = useConfig();
  const isAdmin = role === 'ADMIN';

  const navItems = [
    {
      id: 'DASHBOARD',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'EMPLOYEES',
      label: 'Employees',
      icon: Users,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'ATTENDANCE',
      label: 'Attendance',
      icon: Clock,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'LEAVE',
      label: 'Time Off',
      icon: Calendar,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'PAYROLL',
      label: 'Payroll',
      icon: FileText,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'ANALYTICS',
      label: 'Reports',
      icon: BarChart3,
      roles: ['ADMIN'], // Reports for Admin
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between shrink-0 select-none z-30 transition-all">
      {/* Brand Header */}
          {/* Brand Header */}
<div>
  <div className="p-6 pb-5 flex items-center justify-center">
    <img
      src={logo}
      alt="DayFlow Logo"
      className="w-full max-w-[210px] h-auto object-contain"
    />
  </div>

        {/* Navigation Links */}
        <nav className="px-3.5 space-y-1 mt-2">
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'sidebar-item-active shadow-2xs'
                      : 'sidebar-item-inactive'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
        </nav>
      </div>

      {/* Footer Section: Settings & User Profile */}
      <div className="p-3.5 border-t border-slate-100 space-y-2">
        {/* Settings Tab */}
        <button
          onClick={() => onTabChange('SETTINGS')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'SETTINGS'
              ? 'sidebar-item-active shadow-2xs'
              : 'sidebar-item-inactive'
          }`}
        >
          <Settings
            className={`w-5 h-5 ${
              activeTab === 'SETTINGS' ? 'text-teal-600' : 'text-slate-400'
            }`}
          />
          <span>Settings</span>
        </button>

        {/* Section 13 Quick Spec Info Pill */}
        <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Spec Flags</span>
          </span>
          <span className="font-mono font-bold text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
            Sec 13 Active
          </span>
        </div>

        {/* Sign Out Quick Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </span>
          <span className="text-[10px] font-mono uppercase text-slate-400">{role}</span>
        </button>
      </div>
    </aside>
  );
};
