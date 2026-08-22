import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import {
  Search,
  Bell,
  ChevronDown,
  UserCheck,
  Shield,
} from 'lucide-react';
import { NotificationsDrawer } from './NotificationsDrawer.jsx';

export const Header = ({ onSearch, searchQuery, onSelectEmployee, activeTab }) => {
  const { currentUser, role, switchPersona } = useAuth();
  const { employees } = useHRMS();
  const { notifications, unreadCount } = useNotifications();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageHeading = () => {
    if (activeTab === 'DASHBOARD') return currentUser?.name || 'Sarah Williams';
    if (activeTab === 'EMPLOYEES') return 'Employees';
    if (activeTab === 'ATTENDANCE') return 'Attendance Management';
    if (activeTab === 'LEAVE') return 'Time Off & Leave';
    if (activeTab === 'PAYROLL') return 'Payroll & Compensation';
    if (activeTab === 'ANALYTICS') return 'Reports & Analytics';
    if (activeTab === 'SETTINGS') return 'System Settings';
    if (activeTab === 'PROFILE') return 'Employee Profile';
    return currentUser?.name || 'Sarah Williams';
  };

  return (
    <header className="h-20 bg-transparent px-8 flex items-center justify-between gap-6 z-20">
      {/* Page Title / User Name (Matching Image 2) */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          {getPageHeading()}
        </h1>
      </div>

      {/* Right Controls: Search, Notifications, Persona Switcher */}
      <div className="flex items-center gap-4">
        {/* Search Bar matching Image 2 */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            placeholder="Search employee..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs transition-all"
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications(true)}
          className="relative p-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-600 hover:text-slate-900 shadow-2xs transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Persona Switcher & User Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl shadow-2xs transition-all cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name}
              </div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                {role === 'ADMIN' ? 'Admin / HR' : 'Employee'}
              </div>
            </div>
            <img
              src={
                currentUser?.profilePicture ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
              }
              alt={currentUser?.name || 'User'}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs shrink-0"
            />
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Persona Switcher Dropdown */}
          {showPersonaMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Switch Persona
                </span>
                <span className="text-xs font-medium text-slate-600">
                  Switch persona to test role-gated views
                </span>
              </div>

              {/* Admin Persona: Sarah Williams */}
              <button
                onClick={() => {
                  switchPersona('ADMIN');
                  setShowPersonaMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  role === 'ADMIN'
                    ? 'bg-teal-50 text-teal-900 font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    SW
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Sarah Williams</div>
                    <div className="text-[10px] text-slate-400">Admin / HR Officer</div>
                  </div>
                </div>
                {role === 'ADMIN' && <Shield className="w-4 h-4 text-teal-600" />}
              </button>

              {/* Employee Personas */}
              {employees.slice(0, 3).map((emp) => {
                const isCurrentEmp = currentUser?.employeeId === emp.id;
                return (
                  <button
                    key={emp.id}
                    onClick={() => {
                      switchPersona('EMPLOYEE', emp.id);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      isCurrentEmp
                        ? 'bg-teal-50 text-teal-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.profilePicture}
                        alt={emp.name}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="text-left">
                        <div className="font-bold">{emp.name}</div>
                        <div className="text-[10px] text-slate-400">{emp.jobPosition}</div>
                      </div>
                    </div>
                    {isCurrentEmp && <UserCheck className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};
