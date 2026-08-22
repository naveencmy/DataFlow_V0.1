import axiosClient from './axiosClient.js';

export const analyticsApi = {
  /**
   * Get KPI metrics
   */
  getKPIs: async () => {
    return axiosClient.get('/analytics/dashboard');
  },

  /**
   * Get attendance department breakdown
   */
  getAttendanceAnalytics: async (params = {}) => {
    return axiosClient.get('/analytics/attendance', { params });
  },

  /**
   * Get leave distribution
   */
  getLeaveAnalytics: async () => {
    return axiosClient.get('/analytics/leaves');
  },

  /**
   * Get payroll distribution
   */
  getPayrollAnalytics: async (params = {}) => {
    return axiosClient.get('/analytics/payroll', { params });
  },
};

export default analyticsApi;
