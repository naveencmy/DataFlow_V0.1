import axiosClient from './axiosClient.js';

export const leaveApi = {
  /**
   * Get leave requests
   */
  getLeaves: async (params = {}) => {
    return axiosClient.get('/leaves', { params });
  },

  /**
   * Apply for leave
   */
  applyLeave: async (leaveData) => {
    return axiosClient.post('/leaves', leaveData);
  },

  /**
   * Review leave (Approve/Reject - Admin only)
   */
  reviewLeave: async (id, reviewData) => {
    return axiosClient.put(`/leaves/${id}/review`, reviewData);
  },

  /**
   * Cancel pending leave
   */
  cancelLeave: async (id) => {
    return axiosClient.delete(`/leaves/${id}`);
  },
};

export default leaveApi;
