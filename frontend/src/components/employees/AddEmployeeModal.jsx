import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { User, Mail, Phone, Building, Briefcase, DollarSign, Calendar, Landmark } from 'lucide-react';

export const AddEmployeeModal = ({ isOpen, onClose, onCreated }) => {
  const { addEmployee } = useHRMS();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: 'Engineering',
    jobPosition: '',
    manager: 'Sarah Williams',
    location: 'Bangalore Tech Hub',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: new Date().toISOString().split('T')[0],
    dateOfBirth: '1995-04-12',
    residentialAddress: 'Indiranagar, Bangalore, Karnataka',
    nationality: 'Indian',
    personalEmail: '',
    gender: 'Female',
    maritalStatus: 'Single',
    monthlyWage: 60000,
    bankDetails: {
      accountNumber: '',
      bankName: 'HDFC Bank Ltd',
      ifscCode: 'HDFC0001234',
      panNumber: 'ABCDE1234F',
      uanNumber: '100987654321',
      employeeCode: '',
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.jobPosition) {
      alert('Please fill all required fields (Name, Email, Job Position).');
      return;
    }

    const creds = addEmployee({
      ...formData,
      personalEmail: formData.personalEmail || formData.email,
    });

    onClose();
    if (onCreated) {
      onCreated(creds);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Employee Account"
      subtitle="Admin Flow: Automatically generates Login ID (OITODO0220001) & initial credentials"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4.5">
        {/* Basic Details */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 backdrop-blur-xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span>1. Employee Identity</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maya Patel"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Work Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="maya.patel@dayflow.internal"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Non-Binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employment Info */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 backdrop-blur-xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-teal-600" />
            <span>2. Employment & Role</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              >
                <option>Engineering</option>
                <option>Human Resources</option>
                <option>Product</option>
                <option>Design</option>
                <option>Operations</option>
                <option>Management</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Position *</label>
              <input
                type="text"
                required
                value={formData.jobPosition}
                onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Joining</label>
              <input
                type="date"
                value={formData.dateOfJoining}
                onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Salary & Compensation */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 backdrop-blur-xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-teal-600" />
            <span>3. Compensation Baseline</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fixed Monthly Wage (₹)</label>
              <input
                type="number"
                step="5000"
                value={formData.monthlyWage}
                onChange={(e) => setFormData({ ...formData, monthlyWage: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account Number</label>
              <input
                type="text"
                value={formData.bankDetails.accountNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                  })
                }
                placeholder="14-digit Account #"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Create & Generate Credentials</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
