import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeesQuery } from '../hooks/useEmployeesQuery.js';
import { useTodayAttendanceQuery } from '../hooks/useAttendanceQuery.js';
import { useLeavesQuery } from '../hooks/useLeavesQuery.js';
import { useAuthStore } from '../stores/authStore.js';
import { AddEmployeeModal } from '../components/employees/AddEmployeeModal.jsx';
import { CredentialsDeliveryModal } from '../components/auth/CredentialsDeliveryModal.jsx';
import {
  Users,
  Search,
  UserPlus,
  LayoutGrid,
  List,
  Copy,
  Check,
  Building2,
  TrendingUp,
  Briefcase,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { TableSkeleton, CardSkeleton } from '../components/ui/Skeleton.jsx';

export const EmployeesPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const { data: employees, isLoading } = useEmployeesQuery({
    department: departmentFilter !== 'All' ? departmentFilter : undefined,
    search: searchQuery || undefined,
  });

  const { data: todayData } = useTodayAttendanceQuery();
  const { data: leaves } = useLeavesQuery();

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const departments = ['All', 'Engineering', 'Human Resources', 'Product', 'Design', 'Management', 'Operations'];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Optimistic Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-teal-300">
            <Building2 className="w-3.5 h-3.5" />
            <span>PostgreSQL Workforce Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans">Employees & Teams</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
            Manage organizational hierarchy, compensation packages, and team roles.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="py-3 px-5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 shrink-0 z-10"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {/* Filter & Department Carousel Bar */}
      <div className="space-y-4">
        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                departmentFilter === dept
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search & View Switcher Toolbar */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, position, email, or ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-teal-50 border-teal-200 text-teal-700' : 'border-slate-200 text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-teal-50 border-teal-200 text-teal-700' : 'border-slate-200 text-slate-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Directory Content */}
      {isLoading ? (
        viewMode === 'table' ? <TableSkeleton rows={6} cols={5} /> : <CardSkeleton />
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">System Login ID</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Role & Title</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(employees || []).map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}/profile`)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces'}
                          alt={emp.name}
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-teal-200 shrink-0 transition-all"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={(e) => handleCopyId(emp.loginId, e)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-mono text-[11px] font-bold text-slate-700 transition-colors"
                        title="Click to copy Login ID"
                      >
                        <span>{emp.loginId}</span>
                        {copiedId === emp.loginId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-[11px] font-bold text-teal-700 border border-teal-200/60">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-semibold">{emp.jobPosition}</td>
                    <td className="py-4 px-6 text-slate-500">{emp.location || 'Bangalore Tech Hub'}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-teal-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Profile →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(employees || []).map((emp) => (
            <div
              key={emp.id}
              onClick={() => navigate(`/employees/${emp.id}/profile`)}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-center gap-4">
                <img
                  src={emp.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces'}
                  alt={emp.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-teal-200 transition-all shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                    {emp.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{emp.jobPosition}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-teal-50 text-[10px] font-bold text-teal-700 border border-teal-200/60">
                    {emp.department}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{emp.loginId}</span>
                <span className="text-teal-600 font-sans font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={(creds) => setNewCredentials(creds)}
      />

      {/* Credentials Delivery Modal */}
      {newCredentials && (
        <CredentialsDeliveryModal
          credentials={newCredentials}
          onClose={() => setNewCredentials(null)}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
