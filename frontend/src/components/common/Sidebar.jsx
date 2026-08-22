import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuthStore } from '../../stores/authStore.js';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Clock,
  Calendar,
  FileText,
  BarChart3,
} from 'lucide-react';

export const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || 'EMPLOYEE';
  const employeeId = user?.employeeId || (role === 'ADMIN' ? 'emp-4' : 'emp-1');

  const navItems = [
    {
      id: 'DASHBOARD',
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'EMPLOYEES',
      label: 'Employees',
      path: '/employees',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      id: 'PROFILE',
      label: 'My Profile',
      path: `/employees/${employeeId}/profile`,
      icon: UserCircle,
      roles: ['EMPLOYEE'],
    },
    {
      id: 'ATTENDANCE',
      label: 'Attendance',
      path: '/attendance',
      icon: Clock,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'LEAVE',
      label: 'Time Off',
      path: '/leave',
      icon: Calendar,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'PAYROLL',
      label: 'Payroll',
      path: '/payroll',
      icon: FileText,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'ANALYTICS',
      label: 'Reports',
      path: '/analytics',
      icon: BarChart3,
      roles: ['ADMIN'],
    },
  ];

  return (
    <aside
      aria-label="Main Navigation"
      className="w-60 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between shrink-0 select-none z-30 transition-all"
    >
      {/* Brand Header & Nav Links */}
      <div>
        <div className="p-5 pb-4 flex items-center justify-center">
          <Link to="/dashboard" aria-label="DayFlow HRMS Dashboard">
            <img
              src={logo}
              alt="DayFlow Logo"
              title="Dayflow HRMS"
              className="w-full max-w-[190px] h-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="px-3.5 space-y-1 mt-2" aria-label="Sidebar Menu">
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'sidebar-item-active shadow-2xs'
                        : 'sidebar-item-inactive'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-teal-600' : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
