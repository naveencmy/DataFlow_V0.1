import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../common/Modal.jsx';
import { useCreateEmployeeMutation } from '../../hooks/useEmployeesQuery.js';
import { EmployeeCreateSchema } from '../../validation/employee.schema.js';
import { User, Mail, Phone, Building, Briefcase, DollarSign, Calendar, X } from 'lucide-react';

export const AddEmployeeModal = ({ isOpen, onClose, onCreated }) => {
  const createMutation = useCreateEmployeeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(EmployeeCreateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: 'Engineering',
      jobPosition: '',
      joiningDate: new Date().toISOString().split('T')[0],
      location: 'Bangalore Tech Hub',
      monthlyWage: 65000,
    },
  });

  const onSubmit = async (formData) => {
    const result = await createMutation.mutateAsync(formData);
    reset();
    onClose();
    if (onCreated && result.credentials) {
      onCreated(result.credentials);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Employee Profile"
      subtitle="Adds record to PostgreSQL and provisions initial credentials"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Rachel Zane"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            {errors.name && <p className="text-xs text-rose-600 font-semibold">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Corporate Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="rachel.zane@dayflow.internal"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 font-semibold">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('phone')}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Department *</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                {...register('department')}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Management">Management</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Job Position *</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('jobPosition')}
                placeholder="Senior Full Stack Engineer"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
            {errors.jobPosition && <p className="text-xs text-rose-600 font-semibold">{errors.jobPosition.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Date of Joining</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                {...register('joiningDate')}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs font-bold text-slate-800">Monthly Fixed Wage (₹) *</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                {...register('monthlyWage')}
                placeholder="65000"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
            {errors.monthlyWage && <p className="text-xs text-rose-600 font-semibold">{errors.monthlyWage.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="px-5 py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {createMutation.isPending ? 'Provisioning...' : 'Add Employee to PostgreSQL'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEmployeeModal;
