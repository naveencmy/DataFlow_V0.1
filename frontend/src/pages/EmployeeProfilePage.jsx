import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployeeDetailQuery, useUpdateEmployeeMutation } from '../hooks/useEmployeesQuery.js';
import { useAuthStore } from '../stores/authStore.js';
import { User, Mail, Phone, MapPin, Building, Briefcase, Calendar, ShieldCheck, DollarSign, Clock, ArrowLeft, Edit3, Save } from 'lucide-react';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton.jsx';

export const EmployeeProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);

  const { data: employee, isLoading } = useEmployeeDetailQuery(id);
  const updateMutation = useUpdateEmployeeMutation();

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    about: '',
  });

  React.useEffect(() => {
    if (employee) {
      setFormData({
        phone: employee.phone || '',
        location: employee.location || '',
        about: employee.about || '',
      });
    }
  }, [employee]);

  const handleSave = async () => {
    await updateMutation.mutateAsync({ id, data: formData });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
        <CardSkeleton />
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-slate-800">Employee Profile Not Found</h3>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-3 text-xs font-bold text-teal-600 hover:text-teal-800"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={employee.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces'}
            alt={employee.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-100 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black text-slate-900">{employee.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[10px] font-bold text-teal-700 border border-teal-200">
                {employee.department}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">{employee.jobPosition}</p>
            <div className="text-xs font-mono text-slate-400">ID: {employee.loginId}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'resume', label: 'Overview & Bio' },
          { id: 'private', label: 'Private & Bank Info' },
          { id: 'salary', label: 'Salary Structure' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact & Location</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border border-slate-200 px-2 py-1 rounded-lg"
                  />
                ) : (
                  <span>{employee.phone || '+91 98765 43210'}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="border border-slate-200 px-2 py-1 rounded-lg"
                  />
                ) : (
                  <span>{employee.location || 'Bangalore Tech Hub'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About & Bio</h3>
            {isEditing ? (
              <textarea
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                rows={4}
                className="w-full text-xs border border-slate-200 p-2 rounded-xl"
              />
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                {employee.about || 'Passionate team member contributing to day-to-day operations and core product features.'}
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'private' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bank & Statutory Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-slate-400 block text-[10px]">Bank Name</span>
              <span className="text-slate-900 font-bold">{employee.bankDetails?.bankName || 'HDFC Bank Ltd'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-slate-400 block text-[10px]">Account Number</span>
              <span className="text-slate-900 font-bold font-mono">{employee.bankDetails?.accountNumber || '•••• •••• 9283'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-slate-400 block text-[10px]">IFSC Code</span>
              <span className="text-slate-900 font-bold font-mono">{employee.bankDetails?.ifscCode || 'HDFC0001234'}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Compensation Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
              <span className="text-teal-700 block text-[10px] uppercase font-bold">Monthly Wage</span>
              <span className="text-2xl font-black text-teal-950">₹{(employee.salary?.monthlyWage || 85000).toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Package</span>
              <span className="text-2xl font-black text-slate-900">₹{((employee.salary?.monthlyWage || 85000) * 12).toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">PF Contribution (12%)</span>
              <span className="text-2xl font-black text-slate-900">₹{(Math.round((employee.salary?.monthlyWage || 85000) * 0.5 * 0.12)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
