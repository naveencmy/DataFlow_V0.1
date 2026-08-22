import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { deriveEmployeeWorkStatus } from '../../utils/statusDerivation.js';
import { getTodayDateString } from '../../utils/formatters.js';
import { EmployeeCard } from './EmployeeCard.jsx';
import { AddEmployeeModal } from './AddEmployeeModal.jsx';
import { CredentialsDeliveryModal } from '../auth/CredentialsDeliveryModal.jsx';
import {
  Users,
  Check,
  Calendar,
  Ban,
  UserPlus,
  Filter,
  Search,
} from 'lucide-react';

export const EmployeeList = ({ onSelectEmployee, globalSearchQuery = '' }) => {
  const { role, currentUser } = useAuth();
  const { employees, attendance, leaves } = useHRMS();
  const isAdmin = role === 'ADMIN';
  const isEmployee = role === 'EMPLOYEE';

  // For employee role: only show their own card in the dashboard
  const visibleEmployees = isEmployee
    ? employees.filter((e) => e.id === currentUser?.employeeId)
    : employees;

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);

  const effectiveSearch = globalSearchQuery || localSearchQuery;
  const todayStr = getTodayDateString();

  // KPI counts: Admin sees team-wide stats; Employee sees only their own
  const baseEmployees = isEmployee
    ? employees.filter((e) => e.id === currentUser?.employeeId)
    : employees;

  const statusCounts = baseEmployees.reduce(
    (acc, emp) => {
      const derived = deriveEmployeeWorkStatus(emp.id, todayStr, attendance, leaves);
      if (derived.status === 'PRESENT') acc.present += 1;
      else if (derived.status === 'ON_LEAVE') acc.onLeave += 1;
      else acc.absent += 1;
      return acc;
    },
    { present: 0, onLeave: 0, absent: 0 }
  );

  // Filter employees — employee role can only see themselves
  const filteredEmployees = visibleEmployees.filter((emp) => {
    // 1. Search
    const matchesSearch =
      emp.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      emp.loginId?.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      emp.jobPosition.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (emp.location && emp.location.toLowerCase().includes(effectiveSearch.toLowerCase()));

    // 2. Department (only relevant for Admin)
    const matchesDept = !isAdmin || departmentFilter === 'All' || emp.department === departmentFilter;

    // 3. Status
    const derived = deriveEmployeeWorkStatus(emp.id, todayStr, attendance, leaves);
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Present' && derived.status === 'PRESENT') ||
      (statusFilter === 'On Leave' && derived.status === 'ON_LEAVE') ||
      (statusFilter === 'Absent' && derived.status === 'ABSENT');

    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['All', 'Engineering', 'Human Resources', 'Product', 'Design', 'Management', 'Operations'];

  return (
    <div className="space-y-6">
      {/* 4 Neo-Pastel KPI Cards (Matching Image 2 Reference Layout Exactly) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Headcount Card (Mint Pastel) */}
        <div
          onClick={() => setStatusFilter('All')}
          className="kpi-card-mint rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer transition-all hover:scale-[1.01] shadow-2xs"
        >
          {/* Watermark Illustration on Right */}
          <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
            <Users className="w-32 h-32" />
          </div>

          <div>
            <div className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-teal-800 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-teal-900/80 block mt-3">
              {isAdmin ? 'Total Headcount' : 'My Status'}
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono text-teal-950 tabular-nums">
            {isAdmin ? baseEmployees.length : 1}
          </div>
        </div>

        {/* 2. Present Card (Green Pastel) */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Present' ? 'All' : 'Present')}
          className={`kpi-card-green rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer transition-all hover:scale-[1.01] shadow-2xs ${
            statusFilter === 'Present' ? 'ring-2 ring-emerald-600' : ''
          }`}
        >
          {/* Watermark Illustration on Right */}
          <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
            <Check className="w-32 h-32" />
          </div>

          <div>
            <div className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-emerald-800 shadow-2xs">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-900/80 block mt-3">
              Present
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono text-emerald-950 tabular-nums">
            {statusCounts.present}
          </div>
        </div>

        {/* 3. On Leave Card (Blue Pastel) */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'On Leave' ? 'All' : 'On Leave')}
          className={`kpi-card-blue rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer transition-all hover:scale-[1.01] shadow-2xs ${
            statusFilter === 'On Leave' ? 'ring-2 ring-blue-600' : ''
          }`}
        >
          {/* Watermark Illustration on Right */}
          <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
            <Calendar className="w-32 h-32" />
          </div>

          <div>
            <div className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-blue-800 shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-blue-900/80 block mt-3">
              On Leave
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono text-blue-950 tabular-nums">
            {statusCounts.onLeave}
          </div>
        </div>

        {/* 4. Absent Card (Peach / Orange Pastel) */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Absent' ? 'All' : 'Absent')}
          className={`kpi-card-peach rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer transition-all hover:scale-[1.01] shadow-2xs ${
            statusFilter === 'Absent' ? 'ring-2 ring-amber-600' : ''
          }`}
        >
          {/* Watermark Illustration on Right */}
          <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
            <Ban className="w-32 h-32" />
          </div>

          <div>
            <div className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-amber-800 shadow-2xs">
              <Ban className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-900/80 block mt-3">
              Absent
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono text-amber-950 tabular-nums">
            {statusCounts.absent}
          </div>
        </div>
      </div>

      {/* Action Header & Department Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Department Filter Pill */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-800"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Indicator */}
          {statusFilter !== 'All' && (
            <button
              onClick={() => setStatusFilter('All')}
              className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300/80 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Status: {statusFilter} &times;
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Employee Cards Grid (Matching Image 2 Layout) */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Employees Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or clear your active filters.
          </p>
          <button
            onClick={() => {
              setLocalSearchQuery('');
              setDepartmentFilter('All');
              setStatusFilter('All');
            }}
            className="mt-3 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onSelect={onSelectEmployee}
            />
          ))}
        </div>
      )}

      {/* Add Employee Modal (Admin Only) */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={(creds) => {
          setNewCredentials(creds);
        }}
      />

      {/* Credentials Delivery Modal */}
      <CredentialsDeliveryModal
        isOpen={!!newCredentials}
        onClose={() => setNewCredentials(null)}
        credentials={newCredentials}
      />
    </div>
  );
};
