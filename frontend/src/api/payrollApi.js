import axiosClient from './axiosClient.js';

export const payrollApi = {
  /**
   * Get payroll runs
   */
  getPayroll: async (params = {}) => {
    return axiosClient.get('/payroll', { params });
  },

  /**
   * Get employee payslips
   */
  getEmployeePayroll: async (employeeId) => {
    return axiosClient.get(`/payroll/${employeeId}`);
  },

  /**
   * Process monthly payroll (Admin only)
   */
  processMonthlyPayroll: async (payrollData) => {
    return axiosClient.post('/payroll/process', payrollData);
  },

  /**
   * Update payroll status (Admin only)
   */
  updatePayrollStatus: async (id, statusData) => {
    return axiosClient.put(`/payroll/${id}/status`, statusData);
  },
};

export default payrollApi;
