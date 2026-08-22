import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { User, Mail, Phone, Briefcase, Building, Lock } from 'lucide-react';

export const SelfRegisterModal = ({ isOpen, onClose, onRegistered }) => {
  const { addEmployee } = useHRMS();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: 'Engineering',
    jobPosition: 'Associate Engineer',
    gender: 'Female',
    residentialAddress: 'Indiranagar, Bangalore',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('error', 'Validation Error', 'Please fill in Name and Email.');
      return;
    }

    const creds = addEmployee({
      ...formData,
      company: 'Dayflow Technologies Pvt Ltd',
      manager: 'Sarah Williams',
      location: 'Bangalore Tech Hub',
      dateOfJoining: new Date().toISOString().split('T')[0],
      dateOfBirth: '1996-05-15',
      nationality: 'Indian',
      personalEmail: formData.email,
      maritalStatus: 'Single',
      monthlyWage: 50000,
      bankDetails: {
        accountNumber: '98765432101234',
        bankName: 'HDFC Bank Ltd',
        ifscCode: 'HDFC0001234',
        panNumber: 'ABCDE1234F',
        uanNumber: '100987654321',
        employeeCode: 'DF-REG-099',
      },
    });

    onClose();
    if (onRegistered) onRegistered(creds);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Self-Registration"
      subtitle="Section 13 Conflict Feature (Enabled via Flag)"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 leading-relaxed shadow-xs backdrop-blur-sm">
          <strong>Note:</strong> This form is exposed because <code>EMPLOYEE_SELF_REGISTRATION_ENABLED</code> is set to <code>true</code>.
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Maya Patel"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="maya.patel@dayflow.internal"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 98765 00000"
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            >
              <option>Engineering</option>
              <option>Human Resources</option>
              <option>Product</option>
              <option>Design</option>
              <option>Operations</option>
            </select>
          </div>
        </div>

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
            className="px-5 py-2.5 rounded-xl btn-accent text-xs font-bold cursor-pointer"
          >
            Register Account
          </button>
        </div>
      </form>
    </Modal>
  );
};
