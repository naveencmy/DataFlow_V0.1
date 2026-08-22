import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useHRMS } from '../context/HRMSContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { deriveEmployeeWorkStatus } from '../utils/statusDerivation.js';
import { getTodayDateString } from '../utils/formatters.js';
import { AddEmployeeModal } from '../components/employees/AddEmployeeModal.jsx';
import { CredentialsDeliveryModal } from '../components/auth/CredentialsDeliveryModal.jsx';
import { EmployeeCard } from '../components/employees/EmployeeCard.jsx';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit3,
  UserX,
  UserCheck,
  Mail,
  LayoutGrid,
  List,
  Building2,
  Sparkles,
  Copy,
  Check,
  MapPin,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Briefcase,
} from 'lucide-react';

export const EmployeesPage = ({ onSelectEmployee, onEditEmployee }) => {
  const { role } = useAuth();
  const { employees, attendance, leaves, updateEmployee } = useHRMS();
  const { showToast } = useNotifications();
  const isAdmin = role === 'ADMIN';

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const todayStr = getTodayDateString();

  // Compute live workforce statistics
  const stats = useMemo(() => {
    let present = 0;
    let onLeave = 0;
    let absent = 0;
    const depts = new Set();

    employees.forEach((emp) => {
      if (emp.department) depts.add(emp.department);
      const derived = deriveEmployeeWorkStatus(emp.id, todayStr, attendance, leaves);
      if (derived.status === 'PRESENT') present += 1;
      else if (derived.status === 'ON_LEAVE') onLeave += 1;
      else absent += 1;
    });

    return {
      total: employees.length,
      present,
      onLeave,
      absent,
      departmentCount: depts.size,
    };
  }, [employees, attendance, leaves, todayStr]);

  // Department counts for pill badges
  const departmentCounts = useMemo(() => {
    const counts = { All: employees.length };
    employees.forEach((emp) => {
      counts[emp.department] = (counts[emp.department] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const departments = [
    'All',
    'Engineering',
    'Human Resources',
    'Product',
    'Design',
    'Management',
    'Operations',
  ];

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.loginId?.toLowerCase().includes(q) ||
        emp.jobPosition?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.department?.toLowerCase().includes(q) ||
        (emp.location && emp.location.toLowerCase().includes(q));

      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;

      const derived = deriveEmployeeWorkStatus(emp.id, todayStr, attendance, leaves);
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Present' && derived.status === 'PRESENT') ||
        (statusFilter === 'On Leave' && derived.status === 'ON_LEAVE') ||
        (statusFilter === 'Absent' && derived.status === 'ABSENT');

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, departmentFilter, statusFilter, todayStr, attendance, leaves]);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    showToast('info', 'ID Copied', `${id} copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Present
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            On Leave
          </span>
        );
      case 'ABSENT':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Absent
          </span>
        );
    }
  };

  const getDepartmentBadge = (dept) => {
    switch (dept) {
      case 'Engineering':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/70';
      case 'Product':
        return 'bg-sky-50 text-sky-700 border-sky-200/70';
      case 'Design':
        return 'bg-purple-50 text-purple-700 border-purple-200/70';
      case 'Human Resources':
        return 'bg-rose-50 text-rose-700 border-rose-200/70';
      case 'Management':
        return 'bg-teal-50 text-teal-700 border-teal-200/70';
      case 'Operations':
        return 'bg-amber-50 text-amber-700 border-amber-200/70';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleToggleActive = (emp, e) => {
    e.stopPropagation();
    const newStatus = emp.isDeactivated ? false : true;
    updateEmployee(emp.id, { isDeactivated: newStatus });
    showToast(
      newStatus ? 'warning' : 'success',
      newStatus ? 'Employee Deactivated' : 'Employee Activated',
      `${emp.name}'s status has been updated.`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Optimistic Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-7 sm:p-8 shadow-md">
        {/* Ambient Decorative Orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-200 mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Dayflow People Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Employees & Teams
            </h2>
            <p className="text-sm text-teal-100/80 font-medium mt-1 max-w-xl">
              Centralized organizational directory, credentials management, job allocations, and live work status.
            </p>

            {/* Quick Metrics Bar inside Hero */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-semibold">
                <span className="text-teal-300">👥 Total Workforce:</span>
                <span className="font-mono font-bold text-white text-sm">{stats.total}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-semibold">
                <span className="text-emerald-300">🟢 Present Today:</span>
                <span className="font-mono font-bold text-white text-sm">{stats.present}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-semibold">
                <span className="text-sky-300">✈️ On Leave:</span>
                <span className="font-mono font-bold text-white text-sm">{stats.onLeave}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-semibold">
                <span className="text-amber-300">🏢 Departments:</span>
                <span className="font-mono font-bold text-white text-sm">{stats.departmentCount}</span>
              </div>
            </div>
          </div>

          {/* Action: Add New Employee */}
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-teal-950 font-extrabold text-sm shadow-lg hover:shadow-teal-500/25 transition-all cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4 text-teal-950 stroke-[2.5]" />
              <span>+ Add New Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Interactive Department Filter Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {departments.map((dept) => {
          const isSelected = departmentFilter === dept;
          const count = departmentCounts[dept] || 0;

          return (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-teal-600/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <span>{dept === 'All' ? 'All Departments' : dept}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search & View Mode Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Search Field */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, job title, email, location..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white focus:outline-none transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              &times;
            </button>
          )}
        </div>

        {/* Status Filter & View Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          {/* Result Count */}
          <div className="text-xs font-semibold text-slate-500 hidden xl:block">
            Showing <span className="font-bold text-slate-900">{filteredEmployees.length}</span> of {employees.length}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-700 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Present">🟢 Present Today</option>
              <option value="On Leave">✈️ On Leave</option>
              <option value="Absent">🟡 Absent</option>
            </select>
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Employees Content */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl p-14 text-center border border-slate-200 shadow-2xs">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-100">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No Matching Team Members</h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
            We couldn't find any employees matching your current filters or search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDepartmentFilter('All');
              setStatusFilter('All');
            }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all cursor-pointer"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* OPTIMISTIC MASTER EMPLOYEE TABLE */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-4">Employee</th>
                  <th scope="col" className="px-6 py-4">Employee ID</th>
                  <th scope="col" className="px-6 py-4">Department</th>
                  <th scope="col" className="px-6 py-4">Designation</th>
                  <th scope="col" className="px-6 py-4">Today's Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/90">
                {filteredEmployees.map((emp) => {
                  const derived = deriveEmployeeWorkStatus(emp.id, todayStr, attendance, leaves);
                  const isDeactivated = emp.isDeactivated;
                  const isCopied = copiedId === emp.loginId;

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp.id)}
                      className={`hover:bg-teal-50/30 transition-colors group cursor-pointer ${
                        isDeactivated ? 'opacity-50 bg-slate-50/40' : ''
                      }`}
                    >
                      {/* 1. Employee Identity */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className="relative">
                            <img
                              src={emp.profilePicture}
                              alt={emp.name}
                              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 shadow-2xs group-hover:ring-teal-200 transition-all"
                            />
                            {/* Live Status indicator dot on Avatar */}
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

                          <div>
                            <div className="font-extrabold text-slate-900 text-sm group-hover:text-teal-900 flex items-center gap-2">
                              <span>{emp.name}</span>
                              {isDeactivated && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-mono font-bold">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <span>{emp.email}</span>
                              {emp.location && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="flex items-center gap-0.5 text-slate-400">
                                    <MapPin className="w-3 h-3 text-slate-300" />
                                    {emp.location.split(' ')[0]}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Employee Login ID (Clickable to Copy) */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <button
                          onClick={(e) => handleCopyId(emp.loginId, e)}
                          className="inline-flex items-center gap-1.5 font-mono font-bold text-xs bg-slate-100/90 hover:bg-teal-100 hover:text-teal-900 text-slate-700 px-2.5 py-1 rounded-xl border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                          title="Click to copy Login ID"
                        >
                          <span>{emp.loginId}</span>
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                          )}
                        </button>
                      </td>

                      {/* 3. Department Tag */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border ${getDepartmentBadge(
                            emp.department
                          )}`}
                        >
                          <Building2 className="w-3 h-3 opacity-70" />
                          {emp.department}
                        </span>
                      </td>

                      {/* 4. Job Title */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {emp.jobPosition}
                        </span>
                      </td>

                      {/* 5. Status Badge */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {getStatusPill(derived.status)}
                      </td>

                      {/* 6. Quick Actions */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {/* Direct Email */}
                          <button
                            onClick={() => window.open(`mailto:${emp.email}`, '_blank')}
                            className="p-2 bg-slate-50 hover:bg-teal-50 text-slate-500 hover:text-teal-700 rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
                            title={`Email ${emp.name}`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {/* Deactivate/Activate Toggle (Admin Only) */}
                          {isAdmin && (
                            <button
                              onClick={(e) => handleToggleActive(emp, e)}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                isDeactivated
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200/80'
                              }`}
                              title={isDeactivated ? 'Activate Employee' : 'Deactivate Employee'}
                            >
                              {isDeactivated ? (
                                <UserCheck className="w-3.5 h-3.5" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* View Profile Action Pill */}
                          <button
                            onClick={() => onSelectEmployee(emp.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white font-bold text-xs rounded-xl border border-teal-200/80 transition-all cursor-pointer shadow-2xs"
                          >
                            <span>Profile</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 5. Optimistic Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onSelect={onSelectEmployee}
            />
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
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

