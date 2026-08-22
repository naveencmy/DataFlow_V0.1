import React from 'react';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Clock,
  Calendar,
  FileText,
  BarChart3,
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const { role } = useAuth();

  const navItems = [
    {
      id: 'DASHBOARD',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      // Admin: full employee management table
      id: 'EMPLOYEES',
      label: 'Employees',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      // Employee: goes to their own profile
      id: 'PROFILE',
      label: 'My Profile',
      icon: UserCircle,
      roles: ['EMPLOYEE'],
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
      roles: ['ADMIN'], // Admin only
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between shrink-0 select-none z-30 transition-all">
      {/* Brand Header & Nav Links */}
      <div>
        <div className="p-5 pb-4 flex items-center justify-center">
          <img
            src={logo}
            alt="DayFlow Logo"
            title="Dayflow HRMS"
            className="w-full max-w-[190px] h-auto object-contain"
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
    </aside>
  );
};
