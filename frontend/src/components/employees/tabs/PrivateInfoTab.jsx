import React from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { User, Briefcase, MapPin, Landmark, ShieldAlert, Lock, ShieldCheck } from 'lucide-react';

export const PrivateInfoTab = ({ employee, isEditing, onChange }) => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  // Permission helper: Can current user edit this specific field?
  // Employee can only edit: residentialAddress, mobile, profilePicture, personalEmail
  const canEditField = (fieldName) => {
    if (!isEditing) return false;
    if (isAdmin) return true;
    const employeeAllowed = ['residentialAddress', 'mobile', 'personalEmail', 'profilePicture'];
    return employeeAllowed.includes(fieldName);
  };

  return (
    <div className="space-y-6">
      {/* Permission Info Callout */}
      {isEditing && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs backdrop-blur-sm shadow-xs ${
          isAdmin ? 'bg-teal-50/80 border-teal-200/80 text-teal-950' : 'bg-amber-50/80 border-amber-200/80 text-amber-950'
        }`}>
          {isAdmin ? (
            <>
              <ShieldCheck className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Admin Mode:</strong> You have full administrative editing rights across all personal, employment, and banking fields.
              </div>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Employee Editing Policy (Section 8 Spec):</strong> You are permitted to edit your <strong>Residential Address, Mobile Number, Personal Email, and Profile Picture</strong>. Employment and banking data require HR Administrator authorization.
              </div>
            </>
          )}
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-teal-600" />
          <span>Basic Details</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Legal Name</label>
            {canEditField('name') ? (
              <input
                type="text"
                value={employee.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs font-bold text-slate-900 py-1.5 flex items-center justify-between">
                <span>{employee.name}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">System Login ID</label>
            <div className="text-xs font-mono font-bold text-slate-900 py-1.5 bg-slate-50/80 px-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span>{employee.loginId}</span>
              {isEditing && <Lock className="w-3 h-3 text-slate-400" />}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Official Work Email</label>
            {canEditField('email') ? (
              <input
                type="email"
                value={employee.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono transition-all"
              />
            ) : (
              <div className="text-xs font-mono text-slate-900 py-1.5 flex items-center justify-between">
                <span>{employee.email}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile Phone (Editable by Employee)</label>
            {canEditField('mobile') ? (
              <input
                type="tel"
                value={employee.mobile || ''}
                onChange={(e) => onChange('mobile', e.target.value)}
                className="w-full px-3.5 py-2 border border-teal-300 bg-teal-50/30 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs font-mono text-slate-900 py-1.5">{employee.mobile || '-'}</div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Profile Photo URL (Editable)</label>
            {canEditField('profilePicture') ? (
              <input
                type="text"
                value={employee.profilePicture || ''}
                onChange={(e) => onChange('profilePicture', e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 border border-teal-300 bg-teal-50/30 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs text-slate-600 truncate py-1.5 font-mono">{employee.profilePicture}</div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Employment Information */}
      <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-teal-600" />
          <span>Employment Information</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Company</label>
            {canEditField('company') ? (
              <input
                type="text"
                value={employee.company || ''}
                onChange={(e) => onChange('company', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs font-bold text-slate-900 py-1.5 flex items-center justify-between">
                <span>{employee.company}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Department</label>
            {canEditField('department') ? (
              <select
                value={employee.department || ''}
                onChange={(e) => onChange('department', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              >
                <option>Engineering</option>
                <option>Human Resources</option>
                <option>Product</option>
                <option>Design</option>
                <option>Operations</option>
                <option>Management</option>
              </select>
            ) : (
              <div className="text-xs font-bold text-slate-900 py-1.5 flex items-center justify-between">
                <span>{employee.department}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Job Position / Title</label>
            {canEditField('jobPosition') ? (
              <input
                type="text"
                value={employee.jobPosition || ''}
                onChange={(e) => onChange('jobPosition', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs font-bold text-slate-900 py-1.5 flex items-center justify-between">
                <span>{employee.jobPosition}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Reporting Manager</label>
            {canEditField('manager') ? (
              <input
                type="text"
                value={employee.manager || ''}
                onChange={(e) => onChange('manager', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs text-slate-900 py-1.5 flex items-center justify-between font-semibold">
                <span>{employee.manager || 'Sarah Williams'}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Work Location</label>
            {canEditField('location') ? (
              <input
                type="text"
                value={employee.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs text-slate-900 py-1.5 flex items-center justify-between font-semibold">
                <span>{employee.location}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Joining</label>
            {canEditField('dateOfJoining') ? (
              <input
                type="date"
                value={employee.dateOfJoining || ''}
                onChange={(e) => onChange('dateOfJoining', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs font-mono font-bold text-slate-900 py-1.5 flex items-center justify-between">
                <span>{employee.dateOfJoining}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Personal Information */}
      <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>Personal & Contact Details</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Residential Address (Editable by Employee)
            </label>
            {canEditField('residentialAddress') ? (
              <input
                type="text"
                value={employee.residentialAddress || ''}
                onChange={(e) => onChange('residentialAddress', e.target.value)}
                className="w-full px-3.5 py-2 border border-teal-300 bg-teal-50/30 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs text-slate-900 py-1.5 font-medium">{employee.residentialAddress || '-'}</div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Personal Email (Editable)</label>
            {canEditField('personalEmail') ? (
              <input
                type="email"
                value={employee.personalEmail || ''}
                onChange={(e) => onChange('personalEmail', e.target.value)}
                className="w-full px-3.5 py-2 border border-teal-300 bg-teal-50/30 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono transition-all"
              />
            ) : (
              <div className="text-xs font-mono text-slate-900 py-1.5">{employee.personalEmail || '-'}</div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Birth</label>
            {canEditField('dateOfBirth') ? (
              <input
                type="date"
                value={employee.dateOfBirth || ''}
                onChange={(e) => onChange('dateOfBirth', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs font-mono text-slate-900 py-1.5 flex items-center justify-between">
                <span>{employee.dateOfBirth}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
            {canEditField('gender') ? (
              <select
                value={employee.gender || 'Female'}
                onChange={(e) => onChange('gender', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Non-Binary</option>
                <option>Prefer not to say</option>
              </select>
            ) : (
              <div className="text-xs text-slate-900 py-1.5 flex items-center justify-between font-medium">
                <span>{employee.gender}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Nationality</label>
            {canEditField('nationality') ? (
              <input
                type="text"
                value={employee.nationality || ''}
                onChange={(e) => onChange('nationality', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs text-slate-900 py-1.5 flex items-center justify-between font-medium">
                <span>{employee.nationality}</span>
                {!isAdmin && isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Banking & Financial Details */}
      <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-teal-600" />
            <span>Banking & Regulatory Identifiers</span>
          </h4>
          {!isAdmin && (
            <span className="text-[10px] text-amber-800 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1 font-bold">
              <Lock className="w-2.5 h-2.5" /> HR Restricted
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank Name</label>
            {canEditField('bankDetails.bankName') ? (
              <input
                type="text"
                value={employee.bankDetails?.bankName || ''}
                onChange={(e) =>
                  onChange('bankDetails', { ...employee.bankDetails, bankName: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs font-bold text-slate-900 py-1.5">{employee.bankDetails?.bankName || '-'}</div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Number</label>
            {canEditField('bankDetails.accountNumber') ? (
              <input
                type="text"
                value={employee.bankDetails?.accountNumber || ''}
                onChange={(e) =>
                  onChange('bankDetails', { ...employee.bankDetails, accountNumber: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-mono font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            ) : (
              <div className="text-xs font-mono text-slate-900 py-1.5">
                {isAdmin
                  ? employee.bankDetails?.accountNumber
                  : `••••••••${(employee.bankDetails?.accountNumber || '1234').slice(-4)}`}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">IFSC Code</label>
            <div className="text-xs font-mono text-slate-900 py-1.5">{employee.bankDetails?.ifscCode || '-'}</div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">PAN Number</label>
            <div className="text-xs font-mono text-slate-900 py-1.5">{employee.bankDetails?.panNumber || '-'}</div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">UAN (Universal Account Number)</label>
            <div className="text-xs font-mono text-slate-900 py-1.5">{employee.bankDetails?.uanNumber || '-'}</div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Internal Employee Code</label>
            <div className="text-xs font-mono font-bold text-teal-800 py-1.5">
              {employee.bankDetails?.employeeCode || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
