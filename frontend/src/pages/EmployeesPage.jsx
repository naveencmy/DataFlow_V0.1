import React, { useState } from 'react';
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
  Edit,
  UserX,
  UserCheck,
  Mail,
  Phone,
  LayoutGrid,
  List,
  Building,
  MoreVertical,
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

  const todayStr = getTodayDateString();

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;

    const derived = deriveEmployeeWorkStatus(emp.id, todayStr, attendance, leaves);
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Present' && derived.status === 'PRESENT') ||
      (statusFilter === 'On Leave' && derived.status === 'ON_LEAVE') ||
      (statusFilter === 'Absent' && derived.status === 'ABSENT');

    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = [
    'All',
    'Engineering',
    'Human Resources',
    'Product',
    'Design',
    'Management',
    'Operations',
  ];

  const getStatusPill = (status) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Present
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            On Leave
          </span>
        );
      case 'ABSENT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Absent
          </span>
        );
    }
  };

  const handleToggleActive = (emp) => {
    const newStatus = emp.isDeactivated ? false : true;
    updateEmployee(emp.id, { isDeactivated: newStatus });
    showToast(
      newStatus ? 'warning' : 'success',
      newStatus ? 'Employee Deactivated' : 'Employee Activated',
      `${emp.name}'s status has been updated.`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Employees</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your organization's employees, credentials & directory records
          </p>
        </div>

        {/* Action: Add New Employee */}
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl btn-primary text-xs font-bold shadow-sm cursor-pointer transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4 text-teal-400" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {/* Filter and View Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, position, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Filters & View Mode */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-700"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="On Leave">On Leave</option>
            <option value="Absent">Absent</option>
          </select>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Employee Content (Table View or Grid View) */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Employees Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or clearing active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDepartmentFilter('All');
              setStatusFilter('All');
            }}
            className="mt-3 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* MASTER EMPLOYEE MANAGEMENT TABLE (Matching Section 5 Spec) */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Employee</th>
                  <th scope="col" className="px-6 py-4">Employee ID</th>
                  <th scope="col" className="px-6 py-4">Department</th>
                  <th scope="col" className="px-6 py-4">Job Title</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const derived = deriveEmployeeWorkStatus(emp.id, todayStr, attendance, leaves);
                  const isDeactivated = emp.isDeactivated;

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isDeactivated ? 'opacity-60 bg-slate-50/40' : ''
                      }`}
                    >
                      {/* Employee Avatar + Name + Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.profilePicture}
                            alt={emp.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{emp.name}</span>
                              {isDeactivated && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-mono">
                                  Deactivated
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                          {emp.loginId}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                        {emp.department}
                      </td>

                      {/* Job Title */}
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">
                        {emp.jobPosition}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusPill(derived.status)}
                      </td>

                      {/* Actions: View, Edit, Deactivate, Contact */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => onSelectEmployee(emp.id)}
                            className="p-1.5 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Profile */}
                          {isAdmin && (
                            <button
                              onClick={() => onSelectEmployee(emp.id)}
                              className="p-1.5 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title="Edit Employee Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {/* Contact Mail */}
                          <button
                            onClick={() => window.open(`mailto:${emp.email}`, '_blank')}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                            title={`Email ${emp.name}`}
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {/* Deactivate/Activate toggle (Admin Only) */}
                          {isAdmin && (
                            <button
                              onClick={() => handleToggleActive(emp)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isDeactivated
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200'
                              }`}
                              title={isDeactivated ? 'Activate Employee' : 'Deactivate Employee'}
                            >
                              {isDeactivated ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                            </button>
                          )}
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
        /* Alternate Card Grid View */
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
