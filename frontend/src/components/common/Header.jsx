import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { NotificationsDrawer } from './NotificationsDrawer.jsx';

export const Header = ({ onSearch, searchQuery, onSelectEmployee, onNavigate, activeTab }) => {
  const { currentUser, role, logout } = useAuth();
  const { employees } = useHRMS();
  const { notifications, unreadCount } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef(null);
  const isAdmin = role === 'ADMIN';

  // Look up the employee record for the logged-in user (for photo + name)
  const currentEmployee = employees.find(
    (e) => e.id === currentUser?.employeeId
  ) || null;

  // Display name: employee record name > user name > fallback
  const displayName = currentEmployee?.name || (isAdmin ? 'Sarah Williams' : (currentUser?.name || 'Employee'));
  const displayEmail = currentEmployee?.email || currentUser?.email || 'admin@dayflow.internal';
  const displayPhoto = currentEmployee?.profilePicture ||
    (isAdmin
      ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');
  const displayRole = isAdmin ? 'Admin / HR Officer' : (currentEmployee?.jobPosition || 'Employee');
  const ownEmployeeId = currentEmployee?.id || currentUser?.employeeId || (isAdmin ? 'emp-4' : 'emp-1');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageHeading = () => {
    if (activeTab === 'DASHBOARD') return isAdmin ? 'Dashboard' : `Welcome, ${displayName.split(' ')[0]}`;
    if (activeTab === 'EMPLOYEES') return 'Employees';
    if (activeTab === 'ATTENDANCE') return 'Attendance Management';
    if (activeTab === 'LEAVE') return 'Time Off & Leave';
    if (activeTab === 'PAYROLL') return 'Payroll & Compensation';
    if (activeTab === 'ANALYTICS') return 'Reports & Analytics';
    if (activeTab === 'SETTINGS') return 'System Settings';
    if (activeTab === 'PROFILE') return isAdmin ? 'Employee Profile' : 'My Profile';
    return displayName;
  };

  const handleOpenProfile = () => {
    setShowUserMenu(false);
    if (onSelectEmployee) {
      onSelectEmployee(ownEmployeeId);
    } else if (onNavigate) {
      onNavigate('PROFILE', ownEmployeeId);
    }
  };

  const handleOpenSettings = () => {
    setShowUserMenu(false);
    if (onNavigate) {
      onNavigate('SETTINGS');
    }
  };

  return (
    <header className="h-20 bg-transparent px-8 flex items-center justify-between gap-6 z-20">
      {/* Page Title / User Name */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          {getPageHeading()}
        </h1>
      </div>

      {/* Right Controls: Search, Notifications, User Menu */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
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

        {/* User Profile Avatar & Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-2.5 p-1.5 pl-3 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all cursor-pointer ${
              showUserMenu ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200/80'
            }`}
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {displayName}
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {displayRole}
              </div>
            </div>
            <img
              src={displayPhoto}
              alt={displayName}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs shrink-0"
            />
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Clean User Account Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-2 z-50 animate-fade-in divide-y divide-slate-100">
              {/* Header: User Info Card */}
              <div className="px-3.5 py-3 flex items-center gap-3">
                <img
                  src={displayPhoto}
                  alt={displayName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-teal-50 text-[10px] font-bold text-teal-700 border border-teal-200/60">
                    {isAdmin ? <ShieldCheck className="w-3 h-3 text-teal-600" /> : <Briefcase className="w-3 h-3 text-teal-600" />}
                    {isAdmin ? 'Administrator' : 'Employee'}
                  </span>
                </div>
              </div>

              {/* Action Links */}
              <div className="py-1.5 space-y-0.5">
                <button
                  onClick={handleOpenProfile}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{isAdmin ? 'Admin Profile' : 'My Profile'}</span>
                </button>

                <button
                  onClick={handleOpenSettings}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>System Settings</span>
                </button>
              </div>

              {/* Logout Action */}
              <div className="pt-1.5">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
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

