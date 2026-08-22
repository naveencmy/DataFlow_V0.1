import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { useConfig } from '../../context/ConfigContext.jsx';
import { deriveEmployeeWorkStatus } from '../../utils/statusDerivation.js';
import { getTodayDateString } from '../../utils/formatters.js';
import { WorkStatusBadge } from '../common/StatusBadge.jsx';
import { ResumeTab } from './tabs/ResumeTab.jsx';
import { PrivateInfoTab } from './tabs/PrivateInfoTab.jsx';
import { SalaryInfoTab } from './tabs/SalaryInfoTab.jsx';
import { SecurityTab } from './tabs/SecurityTab.jsx';
import { EmployeeAttendanceTab } from './tabs/EmployeeAttendanceTab.jsx';
import { EmployeeLeaveTab } from './tabs/EmployeeLeaveTab.jsx';
import {
  FileText,
  User,
  DollarSign,
  Shield,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Briefcase,
  MapPin,
  Mail,
  Building,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const EmployeeProfile = ({ employeeId, onBack }) => {
  const { role, currentUser } = useAuth();
  const { employees, updateEmployee, attendance, leaves } = useHRMS();
  const { flags } = useConfig();

  const employee = employees.find((e) => e.id === employeeId) || employees[0];

  // Hard Requirement per Section 6:
  // Profile opens STRICTLY in View-Only mode by default. Never opens directly into edit mode.
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('resume');
  const [formData, setFormData] = useState(employee);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setIsEditing(false); // reset edit mode when navigating
    }
  }, [employee]);

  const isAdmin = role === 'ADMIN';
  const isOwnProfile = currentUser?.employeeId === employee.id || (isAdmin && employee.id === 'emp-4');

  const todayStr = getTodayDateString();
  const workStatus = deriveEmployeeWorkStatus(employee.id, todayStr, attendance, leaves);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateEmployee(employee.id, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(employee);
    setIsEditing(false);
  };

  // Section 13 Salary Tab Visibility logic
  const canSeeSalaryTab = isAdmin || flags.SALARY_INFO_VISIBLE_TO_EMPLOYEE;

  const tabs = [
    { id: 'resume', label: 'Job & Resume', icon: FileText },
    { id: 'private', label: 'Personal Info', icon: User },
    {
      id: 'salary',
      label: 'Salary Info',
      icon: DollarSign,
      hidden: !canSeeSalaryTab && !isAdmin,
    },
    { id: 'attendance', label: 'Attendance Summary', icon: CheckCircle2 },
    { id: 'leave', label: 'Leave History', icon: Briefcase },
    { id: 'security', label: 'Security & Access', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl btn-glass cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Employees</span>
        </button>

        {/* View-Only vs Edit Controls */}
        <div className="flex items-center gap-2.5">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-glass text-xs font-bold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl btn-accent text-xs font-bold shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl btn-primary text-xs font-bold shadow-md cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-400" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className="glass-panel rounded-3xl border border-white/80 shadow-subtle p-6 sm:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={formData.profilePicture}
                alt={formData.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-teal-500/20"
              />
              <span className="absolute -bottom-1 -right-1">
                <WorkStatusBadge status={workStatus.status} size="sm" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  {formData.name}
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100/80 text-slate-700 border border-slate-200/80">
                  {formData.loginId}
                </span>
              </div>

              <p className="text-xs font-bold text-slate-600 flex items-center gap-2 mt-1">
                <span>{formData.jobPosition}</span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-teal-700">{formData.department}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {formData.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {formData.location}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {formData.email}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Indicator Callout */}
          <div className="w-full md:w-auto p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 text-right shadow-xs">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Access State
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5 flex items-center justify-end gap-1.5">
              {isEditing ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-700">Editing Enabled</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>View-Only Mode (Protected)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 4 Tabs Selector per Section 8 */}
        <div className="mt-6 pt-3 border-t border-slate-100/80 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            if (tab.hidden) return null;
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm shadow-slate-900/20'
                    : 'bg-white/70 text-slate-600 border-slate-200/70 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div>
        {activeTab === 'resume' && (
          <ResumeTab
            employee={formData}
            isEditing={isEditing}
            onChange={handleFieldChange}
          />
        )}

        {activeTab === 'private' && (
          <PrivateInfoTab
            employee={formData}
            isEditing={isEditing}
            onChange={handleFieldChange}
          />
        )}

        {activeTab === 'salary' && (
          <SalaryInfoTab
            employee={formData}
            isEditing={isEditing}
            onChange={handleFieldChange}
          />
        )}

        {activeTab === 'attendance' && (
          <EmployeeAttendanceTab employeeId={formData.id} />
        )}

        {activeTab === 'leave' && (
          <EmployeeLeaveTab employeeId={formData.id} />
        )}

        {activeTab === 'security' && <SecurityTab employee={formData} />}
      </div>
    </div>
  );
};
