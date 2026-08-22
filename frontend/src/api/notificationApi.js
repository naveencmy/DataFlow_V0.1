import axiosClient from './axiosClient.js';

export const notificationApi = {
  /**
   * Get user notifications
   */
  getNotifications: async (params = {}) => {
    return axiosClient.get('/notifications', { params });
  },

  /**
   * Mark notification as read
   */
  markRead: async (id) => {
    return axiosClient.put(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllRead: async () => {
    return axiosClient.put('/notifications/read-all');
  },
};

export default notificationApi;
