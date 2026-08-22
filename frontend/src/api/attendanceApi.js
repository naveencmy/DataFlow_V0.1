import axiosClient from './axiosClient.js';

export const attendanceApi = {
  /**
   * Get attendance records
   */
  getAttendance: async (params = {}) => {
    return axiosClient.get('/attendance', { params });
  },

  /**
   * Get today's attendance summary and records
   */
  getTodayAttendance: async () => {
    return axiosClient.get('/attendance/today');
  },

  /**
   * Get employee attendance history
   */
  getEmployeeAttendance: async (employeeId) => {
    return axiosClient.get(`/attendance/${employeeId}`);
  },

  /**
   * Check-in today
   */
  checkIn: async (data = {}) => {
    return axiosClient.post('/attendance/checkin', data);
  },

  /**
   * Check-out today
   */
  checkOut: async (data = {}) => {
    return axiosClient.put('/attendance/checkout', data);
  },
};

export default attendanceApi;
